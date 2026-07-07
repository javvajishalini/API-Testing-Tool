import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppProvider } from './contexts/AppContext'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

/**
 * Root application component.
 * Sets up global context providers and client-side routing.
 */
function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/settings"       element={<Settings />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
