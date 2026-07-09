import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

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

      <div className="flex items-center gap-4">
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
    </nav>
  );
};

export default Navbar;
