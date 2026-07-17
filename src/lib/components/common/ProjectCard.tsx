import type { Project } from '@/lib/api/projects/types'
import ProjectStats from './ProjectStats'

interface ProjectCardProps {
  project: Project
  index: number
}

const cardColors = ['default', 'blue', 'yellow', 'red', 'purple', 'green'] as const

const hoverBorderStyles: Record<string, string> = {
  default: 'hover:border-primary',
  blue: 'hover:border-blue-500',
  yellow: 'hover:border-yellow-500',
  red: 'hover:border-red-500',
  purple: 'hover:border-purple-500',
  green: 'hover:border-green-500',
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const color = cardColors[index % cardColors.length]
  const hoverBorder = hoverBorderStyles[color]

  return (
    <a
      href={`/${project.id}`}
      className={[
        'block p-6 rounded-xl border border-custom-4 dark:border-custom-2 bg-white dark:bg-custom-1',
        'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
        hoverBorder,
      ].join(' ')}
    >
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-36 object-cover rounded-lg mb-4"
          loading="lazy"
        />
      )}
      <h3 className="font-heading text-lg mb-1">{project.name}</h3>
      <p className="text-sm text-custom-3 mb-3 line-clamp-2">{project.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-custom-4 dark:bg-custom-2 text-custom-3"
          >
            {tag}
          </span>
        ))}
      </div>
      <ProjectStats
        stars={project.starsCount}
        forks={project.forksCount}
        downloads={project.downloadsCount}
      />
    </a>
  )
}
