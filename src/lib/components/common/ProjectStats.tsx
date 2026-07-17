interface ProjectStatsProps {
  stars?: number
  forks?: number
  downloads?: number
}

export default function ProjectStats({ stars, forks, downloads }: ProjectStatsProps) {
  const items = [
    { label: 'Stars', value: stars },
    { label: 'Forks', value: forks },
    { label: 'Downloads', value: downloads },
  ]

  return (
    <div className="flex gap-4 text-xs">
      {items.map(
        item =>
          item.value !== undefined && (
            <span key={item.label} className="text-custom-3">
              {item.label}: <strong className="text-text">{item.value}</strong>
            </span>
          ),
      )}
    </div>
  )
}
