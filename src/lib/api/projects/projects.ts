import type { Project } from './types'

export const initialProjects: Project[] = [
  {
    id: 'ruwet-meter',
    name: 'Ruwet Meter',
    url: 'https://api.github.com/repos/fatanala/ruwet-meter',
    description: 'Ruwet codebase analyzer and complexity meter',
    readmeBaseUrl: 'https://raw.githubusercontent.com/fatanala/ruwet-meter/main',
    imageUrl: '/images/projects/ruwet-meter.png',
    readmeUrl: 'https://raw.githubusercontent.com/fatanala/ruwet-meter/main/README.md',
    tags: ['TypeScript', 'Node.js', 'CLI'],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    url: 'https://api.github.com/repos/fatanala/opencode',
    description: 'AI-powered CLI tool for software engineering',
    readmeBaseUrl: 'https://raw.githubusercontent.com/fatanala/opencode/main',
    imageUrl: '/images/projects/opencode.png',
    readmeUrl: 'https://raw.githubusercontent.com/fatanala/opencode/main/README.md',
    tags: ['TypeScript', 'CLI', 'AI'],
  },
  {
    id: 'react-neo-portfolio',
    name: 'React Neo Portfolio',
    url: 'https://api.github.com/repos/fatanala/react-neo-portfolio',
    description: 'Personal portfolio built with React',
    readmeBaseUrl: 'https://raw.githubusercontent.com/fatanala/react-neo-portfolio/main',
    imageUrl: '/images/projects/portfolio.png',
    readmeUrl: 'https://raw.githubusercontent.com/fatanala/react-neo-portfolio/main/README.md',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
]
