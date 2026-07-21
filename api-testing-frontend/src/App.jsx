import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppProvider } from './contexts/AppContext'
import { EnvironmentProvider } from './contexts/EnvironmentContext'
import { TabProvider } from './contexts/TabContext'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Home from './pages/Home'
import History from './pages/History'
import NotFound from './pages/NotFound'

/**
 * Root application component.
 * Sets up global context providers and client-side routing.
 */
function App() {
  return (
    <ThemeProvider>
      <EnvironmentProvider>
        <AppProvider>
          <TabProvider>
            <Routes>
              <Route path="/"                          element={<Home />} />
              <Route path="/dashboard"                 element={<Dashboard />} />
              <Route path="/collections"               element={<Dashboard />} />
              <Route path="/collections/:collectionId" element={<Dashboard />} />
              <Route path="/requests/:requestId"       element={<Dashboard />} />
              <Route path="/history"                   element={<History />} />
              <Route path="/settings"                  element={<Settings />} />
              <Route path="*"                          element={<NotFound />} />
            </Routes>
          </TabProvider>
        </AppProvider>
      </EnvironmentProvider>
    </ThemeProvider>
  )
}

export default App
