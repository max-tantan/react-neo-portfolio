import 'highlight.js/styles/github-dark-dimmed.css'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/api/projects/types'
import type { ProjectService } from '@/lib/api/projects/service'
import ProjectStats from '../common/ProjectStats'
import ReadmeStatusIndicator from './ReadmeStatusIndicator'

type ReadmeStatus = 'idle' | 'fetching' | 'rendering' | 'done' | 'error'

interface ProjectDetailProps {
  project: Project
  service: ProjectService
}

export default function ProjectDetail({ project, service }: ProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ReadmeStatus>('idle')
  const [html, setHtml] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('fetching')
      setHtml('')

      const rawReadme = await service.getReadme(project)
      if (cancelled || !rawReadme) {
        if (!rawReadme) setStatus('error')
        return
      }

      setStatus('rendering')

      try {
        const { getConfiguredMarked } = await import('@/lib/api/projects/marked-init')
        const marked = await getConfiguredMarked(project.readmeBaseUrl)
        const preprocessed = rawReadme.replace(/\\\\([()\\[\]])/g, '\\$1')
        const result = await marked.parse(preprocessed)
        if (cancelled) return

        setHtml(result)
        setStatus('done')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => { cancelled = true }
  }, [project, service])

  useEffect(() => {
    if (status !== 'done' || !html) return

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => {
      const mermaid = (window as unknown as { mermaid: { initialize: (config: Record<string, unknown>) => void; run: (config: { nodes: HTMLElement[] }) => Promise<void> } }).mermaid
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })

      const observer = new MutationObserver(() => {
        const elements = containerRef.current?.querySelectorAll<HTMLElement>('.mermaid[data-processed="false"]')
        if (elements && elements.length > 0) {
          elements.forEach(el => el.setAttribute('data-processed', 'true'))
          mermaid.run({ nodes: Array.from(elements) })
        }
      })

      if (containerRef.current) {
        observer.observe(containerRef.current, { childList: true, subtree: true })
        const initialMermaid = containerRef.current.querySelectorAll<HTMLElement>('.mermaid:not([data-processed])')
        if (initialMermaid.length > 0) {
          initialMermaid.forEach(el => el.setAttribute('data-processed', 'true'))
          mermaid.run({ nodes: Array.from(initialMermaid) })
        }
      }

      return () => observer.disconnect()
    }
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src*="mermaid"]')
      if (existingScript) existingScript.remove()
    }
  }, [status, html])

  return (
    <article>
      <div className="mb-8">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        <h1 className="font-heading text-4xl mb-2">{project.name}</h1>
        <p className="text-custom-3 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-custom-4 dark:bg-custom-2 text-custom-3"
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
      </div>

      <div className="border-t border-custom-4 dark:border-custom-2 pt-8">
        <ReadmeStatusIndicator status={status} />
        <div
          ref={containerRef}
          className="prose-custom max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  )
}
