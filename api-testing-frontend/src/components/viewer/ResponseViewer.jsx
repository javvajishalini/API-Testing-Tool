import React, { useState } from 'react';
import { FiCopy, FiCheck, FiDownload, FiCode } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResponseViewer = ({ response, isExecuting }) => {
  const [activeTab, setActiveTab] = useState('Body');
  const [isRaw, setIsRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs = ['Body', 'Headers', 'Cookies'];

  if (isExecuting) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-dark-950 items-center justify-center text-dark-500">
        <div className="animate-spin w-8 h-8 border-4 border-dark-700 border-t-primary-500 rounded-full mb-4"></div>
        <p className="text-xs font-medium">Executing request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-dark-950 items-center justify-center text-dark-500 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center mb-3">
          <FiCode size={20} className="text-dark-400" />
        </div>
        <p className="text-sm font-medium text-dark-300">No Response Output</p>
        <p className="text-xs text-dark-500 mt-1 max-w-xs">Send a request to inspect status codes, response headers, and body payloads.</p>
      </div>
    );
  }

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusColor = (code) => {
    if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (code >= 300 && code < 400) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (code >= 400 && code < 500) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (code >= 500) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getFormattedBody = () => {
    if (!response.body) return 'No response body returned.';
    if (isRaw) return response.body;
    try {
      if (typeof response.body === 'string' && (response.body.trim().startsWith('{') || response.body.trim().startsWith('['))) {
        return JSON.stringify(JSON.parse(response.body), null, 2);
      }
    } catch (e) { }
    return response.body;
  };

  const formattedBody = getFormattedBody();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedBody);
    setCopied(true);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedBody], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `response-${Date.now()}.${isRaw ? 'txt' : 'json'}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Response file downloaded');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-dark-950 h-full">
      {/* Response Bar Header */}
      <div className="p-4 border-b border-dark-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <h2 className="font-semibold text-dark-200 text-sm">Response</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-dark-400 flex items-center gap-1.5">
            Status: 
            <span className={`px-2 py-0.5 rounded border text-xs font-bold ${getStatusColor(response.statusCode)}`}>
              {response.statusCode || 0} {response.statusText || 'Error'}
            </span>
          </span>
          <span className="text-dark-400">Time: <span className="font-mono text-emerald-400">{response.timeMs || 0} ms</span></span>
          <span className="text-dark-400">Size: <span className="font-mono text-emerald-400">{formatSize(response.sizeBytes)}</span></span>
        </div>
      </div>
      
      {/* Tab Selector & Controls */}
      <div className="flex border-b border-dark-800 shrink-0 px-2 pt-2 items-center justify-between bg-dark-950">
        <div className="flex">
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
        
        {activeTab === 'Body' && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 bg-dark-900 rounded-lg p-1 border border-dark-800">
              <button 
                type="button"
                onClick={() => setIsRaw(false)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${!isRaw ? 'bg-dark-750 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'}`}
              >
                Pretty
              </button>
              <button 
                type="button"
                onClick={() => setIsRaw(true)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${isRaw ? 'bg-dark-750 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'}`}
              >
                Raw
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 text-dark-300 hover:text-white rounded-lg transition-colors"
              title="Copy Response"
            >
              {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 text-dark-300 hover:text-white rounded-lg transition-colors"
              title="Download Response"
            >
              <FiDownload size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* Response Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {activeTab === 'Body' && (
          <pre className="font-mono text-xs text-dark-100 whitespace-pre-wrap animate-fade-in bg-dark-900/50 p-4 rounded-lg border border-dark-850">
            {formattedBody}
          </pre>
        )}
        
        {activeTab === 'Headers' && (
          <div className="w-full text-xs border border-dark-800 rounded-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dark-900 border-b border-dark-800 text-dark-300">
                <tr>
                  <th className="px-4 py-2 font-medium w-1/3">Header Key</th>
                  <th className="px-4 py-2 font-medium">Header Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers || {}).map(([key, value], idx) => (
                  <tr key={key} className={idx !== Object.keys(response.headers).length - 1 ? 'border-b border-dark-800/50' : ''}>
                    <td className="px-4 py-2 font-semibold text-primary-400 w-1/3">{key}</td>
                    <td className="px-4 py-2 text-dark-100 font-mono break-all">{value}</td>
                  </tr>
                ))}
                {(!response.headers || Object.keys(response.headers).length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-dark-500 italic text-center">No response headers returned</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'Cookies' && (
          <div className="text-dark-500 text-xs animate-fade-in p-4 text-center border border-dark-800/50 rounded-lg">
            No cookies were returned in the response headers.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
