import React, { createContext, useContext, useState, useEffect } from 'react';

const EnvironmentContext = createContext(null);

const DEFAULT_ENVIRONMENTS = [
  {
    id: 'env_local',
    name: 'Local',
    variables: [
      { key: 'baseUrl', value: 'http://localhost:8080' },
      { key: 'token', value: 'your-local-token' }
    ]
  },
  {
    id: 'env_prod',
    name: 'Production',
    variables: [
      { key: 'baseUrl', value: 'https://api.example.com' },
      { key: 'token', value: 'your-prod-token' }
    ]
  }
];

export function EnvironmentProvider({ children }) {
  const [environments, setEnvironments] = useState(() => {
    const saved = localStorage.getItem('apiflow-environments');
    return saved ? JSON.parse(saved) : DEFAULT_ENVIRONMENTS;
  });

  const [activeEnvId, setActiveEnvId] = useState(() => {
    const saved = localStorage.getItem('apiflow-active-env');
    return saved || 'env_local';
  });

  useEffect(() => {
    localStorage.setItem('apiflow-environments', JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    if (activeEnvId) {
      localStorage.setItem('apiflow-active-env', activeEnvId);
    } else {
      localStorage.removeItem('apiflow-active-env');
    }
  }, [activeEnvId]);

  const activeEnvironment = environments.find(env => env.id === activeEnvId) || null;

  const resolveString = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (!activeEnvironment) return text; // no active env, no replacement
    
    let resolved = text;
    activeEnvironment.variables.forEach(v => {
      if (v.key) {
        // Regex to replace all instances of {{key}}
        // Using string interpolation for regex pattern securely assuming simple keys
        const regex = new RegExp(`\\{\\{${v.key}\\}\\}`, 'g');
        resolved = resolved.replace(regex, v.value || '');
      }
    });
    return resolved;
  };

  return (
    <EnvironmentContext.Provider value={{
      environments,
      setEnvironments,
      activeEnvId,
      setActiveEnvId,
      activeEnvironment,
      resolveString
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export const useEnvironment = () => {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
};
