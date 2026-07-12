import React, { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../contexts/ThemeContext'
import { useEnvironment } from '../contexts/EnvironmentContext'
import { FiSun, FiMoon, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi'

function Settings() {
  const { isDark, toggleTheme, colorTheme, setColorTheme, THEMES } = useTheme()
  const { environments, setEnvironments, activeEnvId, setActiveEnvId } = useEnvironment()

  const [editingEnvId, setEditingEnvId] = useState(null)
  
  const handleAddEnv = () => {
    const newEnv = {
      id: 'env_' + Date.now(),
      name: 'New Environment',
      variables: []
    }
    setEnvironments([...environments, newEnv])
    setEditingEnvId(newEnv.id)
  }

  const handleDeleteEnv = (id) => {
    setEnvironments(environments.filter(e => e.id !== id))
    if (activeEnvId === id) setActiveEnvId('')
    if (editingEnvId === id) setEditingEnvId(null)
  }

  const handleUpdateEnv = (id, updates) => {
    setEnvironments(environments.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const handleAddVar = (envId) => {
    const env = environments.find(e => e.id === envId)
    if (env) {
      handleUpdateEnv(envId, { variables: [...env.variables, { key: '', value: '' }] })
    }
  }

  const handleUpdateVar = (envId, index, key, value) => {
    const env = environments.find(e => e.id === envId)
    if (env) {
      const newVars = [...env.variables]
      newVars[index] = { key, value }
      handleUpdateEnv(envId, { variables: newVars })
    }
  }

  const handleDeleteVar = (envId, index) => {
    const env = environments.find(e => e.id === envId)
    if (env) {
      const newVars = env.variables.filter((_, i) => i !== index)
      handleUpdateEnv(envId, { variables: newVars })
    }
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-500 dark:text-dark-400">Customize your API Testing Tool experience.</p>
          </div>

          {/* Appearance Section */}
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

          {/* Environments Section */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Environments</h2>
                <p className="text-sm text-slate-500 dark:text-dark-400 mt-1">Manage variables like {'{{baseUrl}}'} to reuse across requests.</p>
              </div>
              <button onClick={handleAddEnv} className="btn-primary flex items-center gap-2 text-sm py-1.5 px-3">
                <FiPlus /> New Env
              </button>
            </div>

            <div className="flex gap-4">
              {/* Env List */}
              <div className="w-1/3 border border-slate-200 dark:border-dark-800 rounded-lg overflow-hidden flex flex-col">
                {environments.map(env => (
                  <div 
                    key={env.id}
                    onClick={() => setEditingEnvId(env.id)}
                    className={`p-3 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-dark-800 last:border-b-0 ${
                      editingEnvId === env.id 
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' 
                        : 'hover:bg-slate-50 dark:hover:bg-dark-800 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="font-medium text-sm text-slate-700 dark:text-dark-200 truncate pr-2">
                      {env.name}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteEnv(env.id); }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
                {environments.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-dark-500">
                    No environments
                  </div>
                )}
              </div>

              {/* Env Editor */}
              <div className="w-2/3 border border-slate-200 dark:border-dark-800 rounded-lg p-4 bg-slate-50 dark:bg-dark-950">
                {editingEnvId ? (
                  (() => {
                    const env = environments.find(e => e.id === editingEnvId);
                    if (!env) return null;
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 dark:text-dark-400 mb-1">Environment Name</label>
                          <input
                            type="text"
                            value={env.name}
                            onChange={(e) => handleUpdateEnv(env.id, { name: e.target.value })}
                            className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-slate-500 dark:text-dark-400">Variables</label>
                            <button onClick={() => handleAddVar(env.id)} className="text-xs text-primary-500 hover:text-primary-600 font-medium">
                              + Add Variable
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {env.variables.map((v, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Key (e.g. baseUrl)"
                                  value={v.key}
                                  onChange={(e) => handleUpdateVar(env.id, idx, e.target.value, v.value)}
                                  className="w-1/3 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-primary-500 font-mono"
                                />
                                <span className="text-slate-400">=</span>
                                <input
                                  type="text"
                                  placeholder="Value"
                                  value={v.value}
                                  onChange={(e) => handleUpdateVar(env.id, idx, v.key, e.target.value)}
                                  className="flex-1 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-primary-500 font-mono"
                                />
                                <button 
                                  onClick={() => handleDeleteVar(env.id, idx)}
                                  className="text-slate-400 hover:text-red-500 p-1"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            ))}
                            {env.variables.length === 0 && (
                              <div className="text-xs text-slate-500 dark:text-dark-500 italic py-2 text-center border border-dashed border-slate-300 dark:border-dark-700 rounded">
                                No variables defined.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400 dark:text-dark-500">
                    Select an environment to edit
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
