import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RequestEditor from '../components/editor/RequestEditor';
import ResponseViewer from '../components/viewer/ResponseViewer';
import { requestService, collectionService } from '../services/api';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { useTabs } from '../contexts/TabContext';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Dashboard() {
  const { collectionId, requestId } = useParams();
  const navigate = useNavigate();
  
  const [collections, setCollections] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const { resolveString } = useEnvironment();
  const { tabs, activeTab, activeTabId, setActiveTabId, openTab, updateActiveTab, closeTab, createNewTab } = useTabs();

  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch request details if requestId URL parameter changes
  useEffect(() => {
    if (requestId) {
      fetchRequestDetails(requestId);
    }
  }, [requestId]);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (error) {
      toast.error('Failed to load collections');
    }
  };

  const fetchRequestDetails = async (id) => {
    try {
      const reqData = await requestService.getById(id);
      openTab({
        requestId: reqData.id,
        name: reqData.name,
        method: reqData.method,
        url: reqData.url,
        headers: reqData.headers,
        queryParams: reqData.queryParams,
        body: reqData.body,
        collectionId: reqData.collectionId
      });
    } catch (error) {
      toast.error('Failed to load request details');
    }
  };

  const handleSaveRequest = async (requestData) => {
    try {
      if (requestData.id) {
        // Update existing request
        const updated = await requestService.update(requestData.id, requestData);
        updateActiveTab({
          ...updated,
          isUnsaved: false
        });
        toast.success('Request updated');
      } else {
        // Create new request
        const created = await requestService.create(requestData);
        updateActiveTab({
          requestId: created.id,
          name: created.name,
          method: created.method,
          url: created.url,
          collectionId: created.collectionId,
          isUnsaved: false
        });
        navigate(`/requests/${created.id}`);
        toast.success('Request saved');
      }
      fetchCollections();
    } catch (error) {
      toast.error('Failed to save request');
    }
  };

  const handleExecute = async (requestData) => {
    setIsExecuting(true);
    let finalResponse = null;

    const evaluatedRequest = {
      ...requestData,
      url: resolveString(requestData.url),
      headers: typeof requestData.headers === 'object' ? requestData.headers : JSON.parse(requestData.headers || '{}'),
      queryParams: typeof requestData.queryParams === 'object' ? requestData.queryParams : JSON.parse(requestData.queryParams || '{}'),
      body: resolveString(requestData.body)
    };

    try {
      const result = await requestService.execute(evaluatedRequest);
      finalResponse = result;
      updateActiveTab({ response: result });
    } catch (error) {
      toast.error('Execution failed: ' + (error.response?.data?.message || error.message));
      finalResponse = {
        statusCode: error.response?.status || 0,
        statusText: error.response?.statusText || 'Execution Error',
        body: error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'Failed to reach API endpoint. Please verify server URL and CORS headers.',
        timeMs: 0,
        sizeBytes: 0,
        headers: {}
      };
      updateActiveTab({ response: finalResponse });
    } finally {
      setIsExecuting(false);
      
      // Save history log
      try {
        const historyItem = {
          requestId: requestData.id,
          method: requestData.method,
          url: requestData.url,
          timestamp: new Date().toISOString(),
          statusCode: finalResponse.statusCode,
          statusText: finalResponse.statusText,
          timeMs: finalResponse.timeMs
        };
        const saved = localStorage.getItem('apiflow-history');
        const history = saved ? JSON.parse(saved) : [];
        const newHistory = [historyItem, ...history].slice(0, 50);
        localStorage.setItem('apiflow-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }
  };

  const getMethodBadgeColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-amber-400';
      case 'PUT': return 'text-blue-400';
      case 'DELETE': return 'text-rose-400';
      case 'PATCH': return 'text-purple-400';
      default: return 'text-dark-400';
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {/* Workspace Multi-Tab Header Bar */}
        <div className="flex items-center bg-dark-950 border-b border-dark-800 px-2 shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group relative flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer border-t-2 transition-all rounded-t-md max-w-[200px] select-none ${
                  activeTabId === tab.id
                    ? 'bg-dark-900 text-white border-primary-500 shadow-sm'
                    : 'bg-dark-950 text-dark-400 hover:text-dark-200 hover:bg-dark-900/50 border-transparent'
                }`}
              >
                <span className={`font-mono font-bold text-[10px] shrink-0 ${getMethodBadgeColor(tab.method)}`}>
                  {tab.method}
                </span>

                <span className="truncate flex-1 font-sans">{tab.name || 'New Request'}</span>

                {tab.isUnsaved && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" title="Unsaved changes" />
                )}

                <button
                  type="button"
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-white p-0.5 rounded transition-opacity ml-1"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={createNewTab}
            className="p-1.5 ml-2 text-dark-400 hover:text-white hover:bg-dark-850 rounded-md transition-colors"
            title="New Request Tab"
          >
            <FiPlus size={16} />
          </button>
        </div>

        {/* Tab Editor & Response Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col">
            <RequestEditor 
              activeRequest={activeTab}
              onSave={handleSaveRequest}
              collections={collections}
              onExecute={handleExecute} 
              isExecuting={isExecuting} 
            />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col border-l border-dark-800">
            <ResponseViewer response={activeTab?.response} isExecuting={isExecuting} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
