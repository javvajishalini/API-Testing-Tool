import React, { createContext, useContext, useState, useEffect } from 'react';

const TabContext = createContext(null);

const DEFAULT_TAB = {
  id: 'tab-default',
  requestId: null,
  name: 'New Request',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  headers: [{ id: '1', key: 'Content-Type', value: 'application/json', isActive: true }],
  queryParams: [{ id: '1', key: '', value: '', isActive: true }],
  body: '{\n  \n}',
  bodyType: 'json',
  isUnsaved: false,
  response: null
};

export function TabProvider({ children }) {
  const [tabs, setTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('apiflow-tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [DEFAULT_TAB];
  });

  const [activeTabId, setActiveTabId] = useState(() => {
    try {
      const saved = localStorage.getItem('apiflow-active-tab-id');
      if (saved && tabs.some(t => t.id === saved)) return saved;
    } catch (e) { }
    return tabs[0]?.id || DEFAULT_TAB.id;
  });

  useEffect(() => {
    try {
      localStorage.setItem('apiflow-tabs', JSON.stringify(tabs));
    } catch (e) { }
  }, [tabs]);

  useEffect(() => {
    try {
      if (activeTabId) localStorage.setItem('apiflow-active-tab-id', activeTabId);
    } catch (e) { }
  }, [activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || DEFAULT_TAB;

  const openTab = (requestData) => {
    // Check if tab for this request is already open
    if (requestData.requestId) {
      const existing = tabs.find(t => t.requestId === requestData.requestId);
      if (existing) {
        setActiveTabId(existing.id);
        return;
      }
    }

    const newTabId = `tab-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
    const newTab = {
      id: newTabId,
      requestId: requestData.requestId || null,
      name: requestData.name || 'New Request',
      method: requestData.method || 'GET',
      url: requestData.url || '',
      collectionId: requestData.collectionId || null,
      headers: requestData.headers || [{ id: '1', key: '', value: '', isActive: true }],
      queryParams: requestData.queryParams || [{ id: '1', key: '', value: '', isActive: true }],
      body: requestData.body || '',
      bodyType: requestData.bodyType || 'json',
      isUnsaved: false,
      response: null
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const updateActiveTab = (updates) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          ...updates,
          isUnsaved: updates.isUnsaved !== undefined ? updates.isUnsaved : true
        };
      }
      return tab;
    }));
  };

  const closeTab = (tabIdToClose, e) => {
    if (e) e.stopPropagation();
    
    if (tabs.length === 1) {
      // Re-initialize to clean default tab if closing last tab
      const freshTab = { ...DEFAULT_TAB, id: `tab-${Date.now()}` };
      setTabs([freshTab]);
      setActiveTabId(freshTab.id);
      return;
    }

    const targetIdx = tabs.findIndex(t => t.id === tabIdToClose);
    const newTabs = tabs.filter(t => t.id !== tabIdToClose);
    setTabs(newTabs);

    if (activeTabId === tabIdToClose) {
      const nextTab = newTabs[Math.max(0, targetIdx - 1)];
      setActiveTabId(nextTab.id);
    }
  };

  const createNewTab = () => {
    const newTab = {
      ...DEFAULT_TAB,
      id: `tab-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      name: 'Untitled Request',
      isUnsaved: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  return (
    <TabContext.Provider value={{
      tabs,
      activeTab,
      activeTabId,
      setActiveTabId,
      openTab,
      updateActiveTab,
      closeTab,
      createNewTab
    }}>
      {children}
    </TabContext.Provider>
  );
}

export const useTabs = () => {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabs must be used within TabProvider');
  return ctx;
};
