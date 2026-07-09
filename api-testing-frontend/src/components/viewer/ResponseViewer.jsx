import React from 'react';

const ResponseViewer = ({ response, isExecuting }) => {
  const [activeTab, setActiveTab] = React.useState('Body');
  const [isRaw, setIsRaw] = React.useState(false);
  const tabs = ['Body', 'Headers', 'Cookies'];

  if (isExecuting) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-dark-950 items-center justify-center text-dark-500">
        <div className="animate-spin w-8 h-8 border-4 border-dark-700 border-t-primary-500 rounded-full mb-4"></div>
        <p>Executing request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-dark-950 items-center justify-center text-dark-500">
        <p>Response output will be displayed here.</p>
      </div>
    );
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isError = response.statusCode >= 400 || response.statusCode === 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-dark-950 h-full">
      <div className="p-4 border-b border-dark-800 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-dark-200">Response</h2>
        <div className="flex gap-4 text-sm items-center">
          <span className="text-dark-400 flex items-center gap-2">
            Status: 
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${isError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {response.statusCode} {response.statusText}
            </span>
          </span>
          <span className="text-dark-400">Time: <span className="font-mono text-emerald-400">{response.timeMs} ms</span></span>
          <span className="text-dark-400">Size: <span className="font-mono text-emerald-400">{formatSize(response.sizeBytes)}</span></span>
        </div>
      </div>
      
      <div className="flex border-b border-dark-800 shrink-0 px-2 pt-2 items-center justify-between">
        <div className="flex">
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
        
        {activeTab === 'Body' && (
          <div className="flex items-center gap-1 bg-dark-900 rounded p-1 mb-1 border border-dark-800">
            <button 
              onClick={() => setIsRaw(false)}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${!isRaw ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-dark-200'}`}
            >
              Pretty
            </button>
            <button 
              onClick={() => setIsRaw(true)}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${isRaw ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-dark-200'}`}
            >
              Raw
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {activeTab === 'Body' && (
          <pre className="font-mono text-sm text-dark-100 whitespace-pre-wrap animate-fade-in">
            {(() => {
              if (isRaw) return response.body || 'No response body.';
              try {
                // Try to format JSON beautifully
                if (response.body && (response.body.trim().startsWith('{') || response.body.trim().startsWith('['))) {
                   return JSON.stringify(JSON.parse(response.body), null, 2);
                }
              } catch(e) { }
              return response.body || 'No response body.';
            })()}
          </pre>
        )}
        
        {activeTab === 'Headers' && (
          <div className="w-full text-sm border border-dark-800 rounded-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dark-900 border-b border-dark-800 text-dark-300">
                <tr>
                  <th className="px-4 py-2 font-medium w-1/3">Key</th>
                  <th className="px-4 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers || {}).map(([key, value], idx) => (
                  <tr key={key} className={idx !== Object.keys(response.headers).length - 1 ? 'border-b border-dark-800/50' : ''}>
                    <td className="px-4 py-2 font-medium text-dark-200 w-1/3">{key}</td>
                    <td className="px-4 py-2 text-dark-100 font-mono break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'Cookies' && (
          <div className="text-dark-500 text-sm animate-fade-in">No cookies parsed.</div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
