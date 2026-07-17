import type { Project } from '@/lib/api/projects/types'

interface ProjectDetailErrorProps {
  project: Project
  error?: string
  onRetry?: () => void
}

export default function ProjectDetailError({ project, error, onRetry }: ProjectDetailErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 className="font-heading text-xl">{project.name}</h3>
      <p className="text-custom-3 text-center">
        {error ?? 'Failed to load project details. Data shown may be incomplete.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  )
}
