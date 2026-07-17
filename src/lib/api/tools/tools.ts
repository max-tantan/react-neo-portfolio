export interface Tool {
  name: string
  icon: string
  category: string
}

export interface ToolCategory {
  name: string
  tools: Tool[]
}

export const toolsData: ToolCategory[] = [
  {
    name: 'Frontend',
    tools: [
      { name: 'React', icon: 'logos:react', category: 'frontend' },
      { name: 'TypeScript', icon: 'logos:typescript-icon', category: 'frontend' },
      { name: 'Tailwind', icon: 'logos:tailwindcss-icon', category: 'frontend' },
    ],
  },
  {
    name: 'Backend',
    tools: [
      { name: 'Node.js', icon: 'logos:nodejs-icon', category: 'backend' },
      { name: 'PostgreSQL', icon: 'logos:postgresql', category: 'backend' },
    ],
  },
  {
    name: 'Tools',
    tools: [
      { name: 'Git', icon: 'logos:git-icon', category: 'tools' },
      { name: 'VS Code', icon: 'logos:visual-studio-code', category: 'tools' },
      { name: 'Figma', icon: 'logos:figma', category: 'tools' },
    ],
  },
]
