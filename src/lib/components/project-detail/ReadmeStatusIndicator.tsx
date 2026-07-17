type ReadmeStatus = 'idle' | 'fetching' | 'rendering' | 'done' | 'error'

interface ReadmeStatusIndicatorProps {
  status: ReadmeStatus
}

const statusConfig: Record<ReadmeStatus, { label: string; className: string }> = {
  idle: { label: 'Waiting', className: 'text-custom-3' },
  fetching: { label: 'Fetching README...', className: 'text-blue-500' },
  rendering: { label: 'Rendering...', className: 'text-yellow-500' },
  done: { label: 'Ready', className: 'text-green-500' },
  error: { label: 'Failed to load', className: 'text-red-500' },
}

export default function ReadmeStatusIndicator({ status }: ReadmeStatusIndicatorProps) {
  const config = statusConfig[status]

  if (status === 'done') return null

  return (
    <div className={`flex items-center gap-2 text-sm mb-4 ${config.className}`}>
      {status === 'fetching' || status === 'rendering' ? (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <span className="inline-block w-3 h-3 rounded-full bg-current" />
      )}
      <span>{config.label}</span>
    </div>
  )
}
