import { Link } from 'react-router-dom'

/**
 * Settings page — will contain theme, preferences, and proxy config.
 * Placeholder for now; full implementation comes after Commit 12 (Dark Mode).
 */
function Settings() {
  return (
    <div className="flex h-screen items-center justify-center bg-dark-950">
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-dark-100 mb-2">Settings</h1>
        <p className="text-dark-400 text-sm mb-6">Coming soon in a future commit</p>
        <Link to="/" className="btn-primary inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Settings
