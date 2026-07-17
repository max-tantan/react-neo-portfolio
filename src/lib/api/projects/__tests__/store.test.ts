import { describe, it, expect } from 'vitest'
import { useProjectStore } from '../store'

describe('ProjectStore', () => {
  it('starts with default state', () => {
    const state = useProjectStore.getState()
    expect(state.projects).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.projectDetail).toBeNull()
    expect(state.detailLoading).toBe(false)
    expect(state.detailError).toBeNull()
  })

  it('sets projects', () => {
    const mockProject = { id: 'test', name: 'Test', url: '', readmeBaseUrl: '', imageUrl: '', tags: [] }
    useProjectStore.getState().setProjects([mockProject])
    expect(useProjectStore.getState().projects).toEqual([mockProject])
  })

  it('sets loading state', () => {
    useProjectStore.getState().setLoading(true)
    expect(useProjectStore.getState().loading).toBe(true)
    useProjectStore.getState().setLoading(false)
    expect(useProjectStore.getState().loading).toBe(false)
  })

  it('sets error', () => {
    useProjectStore.getState().setError('Something went wrong')
    expect(useProjectStore.getState().error).toBe('Something went wrong')
    useProjectStore.getState().setError(null)
    expect(useProjectStore.getState().error).toBeNull()
  })

  it('sets project detail', () => {
    const detail = { id: 'detail', name: 'Detail', url: '', readmeBaseUrl: '', imageUrl: '', tags: [] }
    useProjectStore.getState().setProjectDetail(detail)
    expect(useProjectStore.getState().projectDetail).toEqual(detail)
  })

  it('resets project detail to null', () => {
    useProjectStore.getState().setProjectDetail(null)
    expect(useProjectStore.getState().projectDetail).toBeNull()
  })
})
