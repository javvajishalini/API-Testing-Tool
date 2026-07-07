import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

/**
 * AppContext is the global state manager for the application.
 * It tracks which collection/request is currently selected
 * and manages the active tab state in the request editor.
 *
 * This will grow in future commits as more state is added.
 */
export function AppProvider({ children }) {
  const [activeCollectionId, setActiveCollectionId] = useState(null)
  const [activeRequestId, setActiveRequestId]       = useState(null)
  const [isExecuting, setIsExecuting]               = useState(false)

  const value = {
    activeCollectionId, setActiveCollectionId,
    activeRequestId,    setActiveRequestId,
    isExecuting,        setIsExecuting,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
