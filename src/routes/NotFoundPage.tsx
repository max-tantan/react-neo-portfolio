import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="font-heading text-8xl font-bold">404</h1>
      <p className="text-lg text-custom-3">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
      >
        Back to Home
      </button>
    </div>
  )
}
