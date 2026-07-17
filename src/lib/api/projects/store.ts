import { create } from 'zustand'
import type { Project } from './types'

export interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  projectDetail: Project | null
  detailLoading: boolean
  detailError: string | null
  setProjects: (projects: Project[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setProjectDetail: (project: Project | null) => void
  setDetailLoading: (loading: boolean) => void
  setDetailError: (error: string | null) => void
}

export const useProjectStore = create<ProjectStore>(set => ({
  projects: [],
  loading: false,
  error: null,
  projectDetail: null,
  detailLoading: false,
  detailError: null,
  setProjects: projects => set({ projects }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setProjectDetail: projectDetail => set({ projectDetail }),
  setDetailLoading: detailLoading => set({ detailLoading }),
  setDetailError: detailError => set({ detailError }),
}))
