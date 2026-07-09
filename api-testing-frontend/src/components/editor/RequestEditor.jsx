import React, { useState, useEffect } from 'react';
import KeyValueEditor from './KeyValueEditor';
import { FiSave } from 'react-icons/fi';

const RequestEditor = ({ activeRequest, onSave, collections, onExecute, isExecuting }) => {
  const [name, setName] = useState('New Request');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [activeTab, setActiveTab] = useState('Params');
  const [collectionId, setCollectionId] = useState('');
  
  const [queryParams, setQueryParams] = useState([
    { id: 1, key: '', value: '', isActive: true }
  ]);
  
  const [headers, setHeaders] = useState([
    { id: 1, key: 'Content-Type', value: 'application/json', isActive: true }
  ]);
  
  const [body, setBody] = useState('{\n  \n}');

  // Load request from DB into editor state
  useEffect(() => {
    if (activeRequest) {
      setName(activeRequest.name || 'New Request');
      setMethod(activeRequest.method || 'GET');
      setUrl(activeRequest.url || '');
      setCollectionId(activeRequest.collectionId || '');
      setBody(activeRequest.body || '');

      // Parse JSON arrays for headers and query parameters
      try {
        const parsedHeaders = JSON.parse(activeRequest.headers || '[]');
        setHeaders(parsedHeaders.length ? parsedHeaders.map((h, i) => ({ id: i, ...h })) : [{ id: 1, key: '', value: '', isActive: true }]);
      } catch (e) {
        setHeaders([{ id: 1, key: '', value: '', isActive: true }]);
      }

      try {
        const parsedParams = JSON.parse(activeRequest.queryParams || '[]');
        setQueryParams(parsedParams.length ? parsedParams.map((p, i) => ({ id: i, ...p })) : [{ id: 1, key: '', value: '', isActive: true }]);
      } catch (e) {
        setQueryParams([{ id: 1, key: '', value: '', isActive: true }]);
      }
    }
  }, [activeRequest]);

  const tabs = ['Params', 'Headers', 'Body'];

  const handleSend = () => {
    if (!url.trim()) return;
    
    const convertToMap = (pairs) => {
      const map = {};
      pairs.filter(p => p.isActive && p.key.trim() !== '').forEach(p => {
        map[p.key.trim()] = p.value;
      });
      return map;
    };

    onExecute({
      method,
      url,
      headers: convertToMap(headers),
      queryParams: convertToMap(queryParams),
      body: body.trim() === '' ? null : body
    });
  };

  const handleSave = () => {
    // Serialize headers and queryParams to string for DB storage
    const serializedHeaders = JSON.stringify(headers.filter(h => h.key.trim() !== ''));
    const serializedParams = JSON.stringify(queryParams.filter(p => p.key.trim() !== ''));

    onSave({
      id: activeRequest?.id,
      name,
      method,
      url,
      headers: serializedHeaders,
      queryParams: serializedParams,
      body,
      collectionId: collectionId ? parseInt(collectionId) : null
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-dark-800 bg-dark-900 h-full">
      {/* Request Header Configuration (Name, Collection & Save) */}
      <div className="px-4 py-3 border-b border-dark-800 flex flex-wrap items-center gap-3 bg-dark-950 shrink-0">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Request Name"
          className="bg-dark-800 border border-dark-700 text-white rounded px-3 py-1.5 outline-none focus:border-primary-500 font-semibold text-sm w-48"
        />

        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="bg-dark-800 border border-dark-700 text-dark-300 rounded px-3 py-1.5 outline-none focus:border-primary-500 text-xs font-medium cursor-pointer"
        >
          <option value="">No Collection</option>
          {collections.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-glow ml-auto"
        >
          <FiSave />
          Save
        </button>
      </div>

      {/* URL Bar */}
      <div className="p-4 border-b border-dark-800 flex items-center gap-2 bg-dark-950 shrink-0">
        <select 
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-dark-800 border border-dark-700 text-white rounded px-3 py-2 outline-none focus:border-primary-500 font-medium w-28 cursor-pointer"
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Enter request URL" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-4 py-2 outline-none focus:border-primary-500 font-mono text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isExecuting}
          className={`font-medium px-6 py-2 rounded transition-colors shadow-glow ${isExecuting ? 'bg-primary-800 text-primary-200 cursor-wait' : 'bg-primary-600 hover:bg-primary-500 text-white'}`}
        >
          {isExecuting ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-dark-800 shrink-0 px-2 pt-2 bg-dark-950">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'text-primary-400 border-primary-500' : 'text-dark-400 border-transparent hover:text-dark-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'Params' && (
          <div>
            <h3 className="text-sm font-medium text-dark-300 mb-3">Query Parameters</h3>
            <KeyValueEditor pairs={queryParams} onChange={setQueryParams} />
          </div>
        )}
        
        {activeTab === 'Headers' && (
          <div>
            <h3 className="text-sm font-medium text-dark-300 mb-3">Headers</h3>
            <KeyValueEditor pairs={headers} onChange={setHeaders} />
          </div>
        )}
        
        {activeTab === 'Body' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-dark-300">JSON Body</h3>
              <select className="bg-dark-800 border border-dark-700 text-dark-200 rounded px-2 py-1 outline-none text-xs">
                <option>raw</option>
              </select>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 w-full bg-dark-950 border border-dark-800 rounded-lg p-4 font-mono text-sm text-dark-100 outline-none focus:border-primary-500 resize-none min-h-[200px]"
              spellCheck="false"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestEditor;
