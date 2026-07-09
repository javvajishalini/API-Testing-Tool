import React from 'react';

const ResponseViewer = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-dark-950">
      <div className="p-4 border-b border-dark-800 flex items-center justify-between">
        <h2 className="font-semibold text-dark-200">Response</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-dark-400">Status: <span className="font-mono text-emerald-400">200 OK</span></span>
          <span className="text-dark-400">Time: <span className="font-mono text-emerald-400">124 ms</span></span>
          <span className="text-dark-400">Size: <span className="font-mono text-emerald-400">1.2 KB</span></span>
        </div>
      </div>
      
      <div className="flex border-b border-dark-800">
        {['Body', 'Headers', 'Cookies'].map(tab => (
          <button key={tab} className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white border-b-2 border-transparent hover:border-dark-500">
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-dark-500 text-sm text-center mt-10">
          Response output will be displayed here.
        </div>
      </div>
    </div>
  );
};

export default ResponseViewer;
