import { Link } from 'react-router-dom'

/**
 * 404 Not Found page — shown when a user navigates to an unknown route.
 */
function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-dark-950">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-dark-100 mb-2">Page Not Found</h1>
        <p className="text-dark-400 text-sm mb-8">
          The route you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary inline-block">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
