/**
 * Dashboard page — the main layout of the application.
 * This is a placeholder that will be fully implemented in Commit 5
 * when the full layout (Sidebar + RequestEditor + ResponseViewer) is built.
 *
 * For now, it shows a "coming soon" screen to verify routing works.
 */
function Dashboard() {
  return (
    <div className="flex h-screen items-center justify-center bg-dark-950">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gradient">APIFlow</h1>
        </div>

        <p className="text-dark-400 text-lg mb-2">Lightweight API Testing Tool</p>
        <p className="text-dark-600 text-sm">
          Backend + Frontend initialized ✓ — Full UI coming in Commit 5
        </p>

        {/* Status indicators */}
        <div className="mt-8 flex gap-4 justify-center">
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-dark-300">Frontend Running</span>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-dark-300">Backend :8080</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
