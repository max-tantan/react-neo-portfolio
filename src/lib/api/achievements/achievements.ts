export interface Achievement {
  title: string
  description: string
  date?: string
  url?: string
}

export const achievementsData: Achievement[] = [
  {
    title: 'Competitive Programming',
    description: 'Finalist in national programming competition',
    date: '2024',
  },
  {
    title: 'Open Source Contributor',
    description: 'Contributed to multiple open source projects',
    date: '2023 - Present',
  },
  {
    title: 'Full-Stack Certification',
    description: 'Completed advanced full-stack development program',
    date: '2023',
  },
]
