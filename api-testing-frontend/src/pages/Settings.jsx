import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../contexts/ThemeContext'
import { FiSun, FiMoon, FiCheck } from 'react-icons/fi'

function Settings() {
  const { isDark, toggleTheme, colorTheme, setColorTheme, THEMES } = useTheme()

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-500 dark:text-dark-300">Customize your API Testing Tool experience.</p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Appearance</h2>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-dark-800">
              <div>
                <h3 className="font-medium text-slate-700 dark:text-dark-100">Dark Mode</h3>
                <p className="text-sm text-slate-500 dark:text-dark-400">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isDark ? 'bg-primary-500' : 'bg-slate-300 dark:bg-dark-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                  <FiMoon size={12} className="text-white" />
                  <FiSun size={12} className="text-amber-500" />
                </span>
              </button>
            </div>

            {/* Accent Color Selection */}
            <div className="py-6">
              <h3 className="font-medium text-slate-700 dark:text-dark-100 mb-2">Accent Color</h3>
              <p className="text-sm text-slate-500 dark:text-dark-400 mb-4">Choose your primary theme color</p>
              
              <div className="flex flex-wrap gap-4">
                {Object.entries(THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setColorTheme(key)}
                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      colorTheme === key 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `rgb(${theme.colors[500]})` }}
                    >
                      {colorTheme === key && <FiCheck className="text-white" size={20} />}
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-dark-300">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
