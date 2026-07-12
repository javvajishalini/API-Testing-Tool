import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { FiClock, FiTrash2, FiExternalLink } from 'react-icons/fi';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('apiflow-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('apiflow-history');
    setHistory([]);
  };

  const getMethodClass = (method) => {
    const m = (method || 'GET').toUpperCase();
    return `method-${m}`;
  };

  const getStatusClass = (status) => {
    if (!status) return 'text-slate-400';
    if (status >= 200 && status < 300) return 'text-emerald-500';
    if (status >= 300 && status < 400) return 'text-blue-500';
    if (status >= 400 && status < 500) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <FiClock className="text-primary-500" /> Request History
              </h1>
              <p className="text-slate-500 dark:text-dark-400">View recently executed requests and their outcomes.</p>
            </div>
            
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <FiTrash2 /> Clear History
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
            {history.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-dark-500">
                  <FiClock size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No history yet</h3>
                <p className="text-slate-500 dark:text-dark-400 max-w-sm">
                  Requests you execute in the dashboard will appear here.
                </p>
                <Link to="/dashboard" className="mt-6 btn-primary">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-800">
                {history.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors flex items-center gap-4">
                    <div className="w-24 shrink-0">
                      <span className={`method-badge ${getMethodClass(item.method)}`}>
                        {item.method || 'GET'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {item.url}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-dark-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <div className={`font-mono font-bold text-sm ${getStatusClass(item.statusCode)}`}>
                        {item.statusCode} {item.statusText}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-dark-400">
                        {item.timeMs} ms
                      </div>
                    </div>
                    
                    {item.requestId && (
                      <Link 
                        to={`/requests/${item.requestId}`}
                        className="p-2 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700"
                        title="Open Request"
                      >
                        <FiExternalLink />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default History;
