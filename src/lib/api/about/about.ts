export interface AboutEntry {
  title: string
  description: string
  imageSrc?: string
  bgClass?: string
  halftone?: boolean
}

export const aboutData: AboutEntry[] = [
  {
    title: 'Full-Stack Developer',
    description: 'Building modern web applications with React, TypeScript, and Node.js.',
    halftone: true,
  },
  {
    title: 'Open Source Enthusiast',
    description: 'Contributing to open source projects and building tools for developers.',
    halftone: true,
  },
  {
    title: 'Problem Solver',
    description: 'Passionate about architecture, clean code, and elegant solutions.',
    halftone: true,
  },
]
