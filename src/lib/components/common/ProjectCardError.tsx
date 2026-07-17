interface ProjectCardErrorProps {
  message?: string
}

export default function ProjectCardError({ message = 'Failed to load' }: ProjectCardErrorProps) {
  return (
    <div className="p-6 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
      <div className="flex flex-col items-center gap-2 text-center">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      </div>
    </div>
  )
}
