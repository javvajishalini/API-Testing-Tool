import React, { useState } from 'react';
import KeyValueEditor from './KeyValueEditor';

const RequestEditor = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('Params');
  
  const [queryParams, setQueryParams] = useState([
    { id: 1, key: '', value: '', isActive: true }
  ]);
  
  const [headers, setHeaders] = useState([
    { id: 1, key: 'Content-Type', value: 'application/json', isActive: true }
  ]);
  
  const [body, setBody] = useState('{\n  \n}');

  const tabs = ['Params', 'Headers', 'Body'];

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-dark-800 bg-dark-900 h-full">
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
          className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-4 py-2 outline-none focus:border-primary-500 font-mono text-sm"
        />
        <button className="bg-primary-600 hover:bg-primary-500 text-white font-medium px-6 py-2 rounded transition-colors shadow-glow">
          Send
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
              className="flex-1 w-full bg-dark-950 border border-dark-800 rounded-lg p-4 font-mono text-sm text-dark-100 outline-none focus:border-primary-500 resize-none"
              spellCheck="false"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestEditor;
