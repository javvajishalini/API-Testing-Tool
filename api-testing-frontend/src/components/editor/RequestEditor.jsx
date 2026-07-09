import React from 'react';

const RequestEditor = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-dark-800 bg-dark-900">
      <div className="p-4 border-b border-dark-800 flex items-center gap-2">
        <select className="bg-dark-800 border border-dark-700 text-white rounded px-3 py-2 outline-none focus:border-primary-500 font-medium w-28">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
        <input 
          type="text" 
          placeholder="Enter request URL" 
          className="flex-1 bg-dark-800 border border-dark-700 text-white rounded px-4 py-2 outline-none focus:border-primary-500"
        />
        <button className="bg-primary-600 hover:bg-primary-500 text-white font-medium px-6 py-2 rounded transition-colors">
          Send
        </button>
      </div>
      
      <div className="flex border-b border-dark-800">
        {['Params', 'Headers', 'Body', 'Auth'].map(tab => (
          <button key={tab} className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white border-b-2 border-transparent hover:border-dark-500">
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-dark-500 text-sm text-center mt-10">
          Request details configuration will be implemented here.
        </div>
      </div>
    </div>
  );
};

export default RequestEditor;
