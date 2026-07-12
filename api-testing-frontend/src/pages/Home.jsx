import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiSettings, FiFolder, FiSend, FiCode, FiMoon, FiSun, FiClock } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/50 dark:bg-dark-800/50 backdrop-blur-md border border-slate-200 dark:border-dark-700 hover:bg-white dark:hover:bg-dark-800 transition-colors shadow-sm"
          title="Toggle Theme"
        >
          {isDark ? <FiSun size={20} className="text-amber-500" /> : <FiMoon size={20} className="text-slate-700" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-6 p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg shadow-primary-500/20">
          <FiZap size={48} className="text-white" />
        </div>

        <h1 className="relative z-10 text-5xl md:text-6xl font-bold mb-4 text-center leading-tight text-slate-900 dark:text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">
            API Testing Tool
          </span>
        </h1>

        <p className="relative z-10 text-lg md:text-xl text-slate-600 dark:text-dark-300 mb-10 text-center max-w-2xl leading-relaxed">
          Create, organize and execute HTTP requests with a sleek, modern interface.
          Build collections, craft requests, and inspect responses.
        </p>

        <Link
          to="/dashboard"
          className="relative z-10 inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 mb-16"
        >
          <FiSend /> Get Started
        </Link>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link to="/dashboard" className="group flex flex-col items-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm border border-slate-200 dark:border-dark-700/50 rounded-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:bg-white dark:hover:bg-dark-800/80 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
            <div className="p-3 bg-slate-100 dark:bg-dark-700/50 rounded-lg mb-4 group-hover:bg-primary-50 dark:group-hover:bg-primary-600/20 transition-colors">
              <FiClock size={28} className="text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-lg font-semibold mb-1 text-slate-800 dark:text-white">History</span>
            <span className="text-sm text-slate-500 dark:text-dark-400 text-center">Quick access to previously executed requests.</span>
          </Link>

          <Link to="/dashboard" className="group flex flex-col items-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm border border-slate-200 dark:border-dark-700/50 rounded-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:bg-white dark:hover:bg-dark-800/80 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
            <div className="p-3 bg-slate-100 dark:bg-dark-700/50 rounded-lg mb-4 group-hover:bg-primary-50 dark:group-hover:bg-primary-600/20 transition-colors">
              <FiCode size={28} className="text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-lg font-semibold mb-1 text-slate-800 dark:text-white">Request Editor</span>
            <span className="text-sm text-slate-500 dark:text-dark-400 text-center">Build GET, POST, PUT, PATCH and DELETE</span>
          </Link>

          <Link to="/settings" className="group flex flex-col items-center p-6 bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm border border-slate-200 dark:border-dark-700/50 rounded-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:bg-white dark:hover:bg-dark-800/80 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
            <div className="p-3 bg-slate-100 dark:bg-dark-700/50 rounded-lg mb-4 group-hover:bg-primary-50 dark:group-hover:bg-primary-600/20 transition-colors">
              <FiSettings size={28} className="text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-lg font-semibold mb-1 text-slate-800 dark:text-white">Settings</span>
            <span className="text-sm text-slate-500 dark:text-dark-400 text-center">Customize your testing environment</span>
          </Link>
        </div>
      </div>

      <footer className="text-center py-4 text-slate-500 dark:text-dark-500 text-xs border-t border-slate-200 dark:border-dark-800">
        Built with React and Spring Boot
      </footer>
    </div>
  );
};

export default Home;
