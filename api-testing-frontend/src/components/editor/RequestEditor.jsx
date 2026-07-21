import React, { useState, useEffect } from 'react';
import KeyValueEditor from './KeyValueEditor';
import CodeSnippetModal from './CodeSnippetModal';
import CurlImportModal from './CurlImportModal';
import { useEnvironment } from '../../contexts/EnvironmentContext';
import { FiSave, FiCode, FiTerminal } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RequestEditor = ({ activeRequest, onSave, collections, onExecute, isExecuting }) => {
  const { resolveString } = useEnvironment();

  const [name, setName] = useState('New Request');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [activeTab, setActiveTab] = useState('Params');
  const [collectionId, setCollectionId] = useState('');
  const [bodyType, setBodyType] = useState('json');
  
  const [queryParams, setQueryParams] = useState([
    { id: '1', key: '', value: '', isActive: true }
  ]);
  
  const [headers, setHeaders] = useState([
    { id: '1', key: 'Content-Type', value: 'application/json', isActive: true }
  ]);
  
  const [body, setBody] = useState('{\n  \n}');

  // Modal controls
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCurlModalOpen, setIsCurlModalOpen] = useState(false);

  // Sync state when activeRequest changes
  useEffect(() => {
    if (activeRequest) {
      setName(activeRequest.name || 'New Request');
      setMethod(activeRequest.method || 'GET');
      setUrl(activeRequest.url || '');
      setCollectionId(activeRequest.collectionId || '');
      setBody(activeRequest.body || '');
      setBodyType(activeRequest.bodyType || 'json');

      try {
        const parsedHeaders = typeof activeRequest.headers === 'string' 
          ? JSON.parse(activeRequest.headers || '[]') 
          : activeRequest.headers || [];
        setHeaders(parsedHeaders.length ? parsedHeaders.map((h, i) => ({ id: h.id || String(i), ...h })) : [{ id: '1', key: '', value: '', isActive: true }]);
      } catch (e) {
        setHeaders([{ id: '1', key: '', value: '', isActive: true }]);
      }

      try {
        const parsedParams = typeof activeRequest.queryParams === 'string'
          ? JSON.parse(activeRequest.queryParams || '[]')
          : activeRequest.queryParams || [];
        setQueryParams(parsedParams.length ? parsedParams.map((p, i) => ({ id: p.id || String(i), ...p })) : [{ id: '1', key: '', value: '', isActive: true }]);
      } catch (e) {
        setQueryParams([{ id: '1', key: '', value: '', isActive: true }]);
      }
    }
  }, [activeRequest]);

  const tabs = ['Params', 'Headers', 'Body'];

  const convertToMap = (pairs) => {
    const map = {};
    pairs.filter(p => p.isActive !== false && p.key.trim() !== '').forEach(p => {
      map[p.key.trim()] = p.value;
    });
    return map;
  };

  const handleSend = () => {
    // FIX BUG 1: Resolve environment variables FIRST before validating URL structure
    const resolvedUrl = resolveString(url);

    if (!resolvedUrl || !resolvedUrl.trim()) {
      toast.error('URL cannot be empty');
      return;
    }

    if (!/^https?:\/\//i.test(resolvedUrl.trim())) {
      toast.error('URL must start with http:// or https:// (check active environment variables)');
      return;
    }

    // FIX BUG 2: Allow non-JSON body types (Raw Text, XML) without breaking execution
    if (bodyType === 'json' && body && body.trim() !== '') {
      try {
        JSON.parse(body);
      } catch (e) {
        toast.error('Request body is not valid JSON format');
        return;
      }
    }

    onExecute({
      id: activeRequest?.id,
      name,
      method,
      url,
      headers: convertToMap(headers),
      queryParams: convertToMap(queryParams),
      body: body.trim() === '' ? null : body,
      bodyType
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Request name is required');
      return;
    }

    const resolvedUrl = resolveString(url);
    if (resolvedUrl && !/^https?:\/\//i.test(resolvedUrl.trim())) {
      toast.error('URL must start with http:// or https://');
      return;
    }

    if (bodyType === 'json' && body && body.trim() !== '') {
      try {
        JSON.parse(body);
      } catch (e) {
        toast.error('Request body is not valid JSON format');
        return;
      }
    }

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
      bodyType,
      collectionId: collectionId ? parseInt(collectionId) : null
    });
  };

  const handleCurlImport = (parsed) => {
    setMethod(parsed.method);
    setUrl(parsed.url);
    setHeaders(parsed.headers);
    if (parsed.body) {
      setBody(parsed.body);
      setBodyType('json');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-dark-800 bg-dark-900 h-full">
      {/* Request Toolbar (Name, Collection, Actions) */}
      <div className="px-4 py-3 border-b border-dark-800 flex flex-wrap items-center gap-3 bg-dark-950 shrink-0">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Request Name"
          className="bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 font-semibold text-sm w-48"
        />

        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="bg-dark-800 border border-dark-700 text-dark-300 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 text-xs font-medium cursor-pointer"
        >
          <option value="">No Collection</option>
          {collections.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setIsCurlModalOpen(true)}
            className="flex items-center gap-1.5 bg-dark-850 hover:bg-dark-800 border border-dark-750 text-dark-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            title="Import cURL command"
          >
            <FiTerminal className="text-primary-400" />
            <span className="hidden sm:inline">Import cURL</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 bg-dark-850 hover:bg-dark-800 border border-dark-750 text-dark-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            title="Generate Code Snippet"
          >
            <FiCode className="text-emerald-400" />
            <span className="hidden sm:inline">Code Snippet</span>
          </button>

          <button 
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-glow"
          >
            <FiSave />
            Save
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="p-4 border-b border-dark-800 flex items-center gap-2 bg-dark-950 shrink-0">
        <select 
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`bg-dark-800 border border-dark-700 font-bold rounded-lg px-3 py-2 outline-none focus:border-primary-500 text-xs w-28 cursor-pointer ${
            method === 'GET' ? 'text-emerald-400' :
            method === 'POST' ? 'text-amber-400' :
            method === 'PUT' ? 'text-blue-400' :
            method === 'DELETE' ? 'text-rose-400' : 'text-purple-400'
          }`}
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        
        <input 
          type="text" 
          placeholder="Enter URL (e.g. https://api.example.com/v1 or {{baseUrl}}/users)" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2 outline-none focus:border-primary-500 font-mono text-xs"
        />

        <button 
          type="button"
          onClick={handleSend}
          disabled={isExecuting}
          className={`font-medium px-6 py-2 rounded-lg text-xs transition-colors shadow-glow ${
            isExecuting 
              ? 'bg-primary-800 text-primary-200 cursor-wait' 
              : 'bg-primary-600 hover:bg-primary-500 text-white font-semibold'
          }`}
        >
          {isExecuting ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {/* Editor Tab Headers */}
      <div className="flex border-b border-dark-800 shrink-0 px-2 pt-2 bg-dark-950">
        {tabs.map(tab => (
          <button 
            key={tab} 
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'text-primary-400 border-primary-500' 
                : 'text-dark-400 border-transparent hover:text-dark-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab Content Panes */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'Params' && (
          <div className="animate-fade-in">
            <h3 className="text-xs font-medium text-dark-300 mb-3">Query Parameters</h3>
            <KeyValueEditor pairs={queryParams} onChange={setQueryParams} />
          </div>
        )}
        
        {activeTab === 'Headers' && (
          <div className="animate-fade-in">
            <h3 className="text-xs font-medium text-dark-300 mb-3">Headers</h3>
            <KeyValueEditor pairs={headers} onChange={setHeaders} />
          </div>
        )}
        
        {activeTab === 'Body' && (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-dark-300">Request Body</h3>
              <select 
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-dark-200 rounded px-2.5 py-1 outline-none text-xs cursor-pointer"
              >
                <option value="json">JSON</option>
                <option value="text">Raw Text</option>
                <option value="xml">XML</option>
              </select>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'Enter raw payload string...'}
              className="flex-1 w-full bg-dark-950 border border-dark-800 rounded-lg p-4 font-mono text-xs text-dark-100 outline-none focus:border-primary-500 resize-none min-h-[220px]"
              spellCheck="false"
            />
          </div>
        )}
      </div>

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        requestData={{
          method,
          url: resolveString(url),
          headers: convertToMap(headers),
          body
        }}
      />

      {/* cURL Import Modal */}
      <CurlImportModal
        isOpen={isCurlModalOpen}
        onClose={() => setIsCurlModalOpen(false)}
        onImport={handleCurlImport}
      />
    </div>
  );
};

export default RequestEditor;
