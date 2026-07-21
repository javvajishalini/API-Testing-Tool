import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useEnvironment } from '../../contexts/EnvironmentContext';
import { useTabs } from '../../contexts/TabContext';
import CurlImportModal from '../editor/CurlImportModal';
import { FiMoon, FiSun, FiSettings, FiTerminal } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { environments, activeEnvId, setActiveEnvId } = useEnvironment();
  const { openTab } = useTabs();
  const [isCurlOpen, setIsCurlOpen] = useState(false);

  const handleCurlImport = (parsed) => {
    openTab({
      name: 'Imported Request',
      method: parsed.method,
      url: parsed.url,
      headers: parsed.headers,
      body: parsed.body
    });
  };

  return (
    <nav className="h-14 border-b border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 flex items-center justify-between px-4 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow animate-pulse-slow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gradient">APIFlow</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsCurlOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-750 text-slate-700 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
        >
          <FiTerminal size={14} className="text-primary-500" />
          <span>Import cURL</span>
        </button>

        {environments && environments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-dark-400 font-medium hidden sm:inline">Env:</span>
            <select
              value={activeEnvId || ''}
              onChange={(e) => setActiveEnvId(e.target.value)}
              className="bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-750 text-slate-700 dark:text-dark-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-primary-500 cursor-pointer font-medium"
            >
              <option value="">No Environment</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
          </div>
        )}
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Settings"
        >
          <FiSettings size={18} />
        </Link>
      </div>

      <CurlImportModal
        isOpen={isCurlOpen}
        onClose={() => setIsCurlOpen(false)}
        onImport={handleCurlImport}
      />
    </nav>
  );
};

export default Navbar;
