import React from 'react';

const ResponseViewer = ({ response, isExecuting }) => {
  const [activeTab, setActiveTab] = React.useState('Body');
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
        <div className="flex gap-4 text-sm">
          <span className="text-dark-400">Status: <span className={`font-mono font-medium ${isError ? 'text-red-400' : 'text-emerald-400'}`}>{response.statusCode} {response.statusText}</span></span>
          <span className="text-dark-400">Time: <span className="font-mono text-emerald-400">{response.timeMs} ms</span></span>
          <span className="text-dark-400">Size: <span className="font-mono text-emerald-400">{formatSize(response.sizeBytes)}</span></span>
        </div>
      </div>
      
      <div className="flex border-b border-dark-800 shrink-0 px-2 pt-2">
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
      
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {activeTab === 'Body' && (
          <pre className="font-mono text-sm text-dark-100 whitespace-pre-wrap">
            {(() => {
              try {
                // Try to format JSON beautifully
                if (response.body && response.body.trim().startsWith('{') || response.body.trim().startsWith('[')) {
                   return JSON.stringify(JSON.parse(response.body), null, 2);
                }
              } catch(e) { }
              return response.body || 'No response body.';
            })()}
          </pre>
        )}
        
        {activeTab === 'Headers' && (
          <div className="flex flex-col gap-1">
            {Object.entries(response.headers || {}).map(([key, value]) => (
              <div key={key} className="flex text-sm">
                <span className="font-medium text-dark-300 w-48 shrink-0">{key}:</span>
                <span className="text-dark-100 font-mono break-all">{value}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'Cookies' && (
          <div className="text-dark-500 text-sm">No cookies parsed.</div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
