import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectService } from '../service'
import { useProjectStore } from '../store'
import type { ProjectRepository } from '../repository/types'
import type { Project } from '../types'

describe('ProjectService', () => {
  let mockRepo: ProjectRepository
  let service: ProjectService

  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      loading: false,
      error: null,
      projectDetail: null,
      detailLoading: false,
      detailError: null,
    })

    mockRepo = {
      fetchProject: vi.fn().mockResolvedValue({
        id: 'test',
        name: 'Test Project',
        url: '',
        readmeBaseUrl: '',
        imageUrl: '',
        tags: [],
        starsCount: 100,
        forksCount: 50,
      }),
      fetchReadme: vi.fn().mockResolvedValue('# README'),
    }

    service = new ProjectService(mockRepo)
    service.setStore(useProjectStore.getState())
  })

  it('initialize fetches all projects and updates store', async () => {
    await service.init()

    const state = useProjectStore.getState()
    expect(state.loading).toBe(false)
    expect(state.projects.length).toBeGreaterThan(0)
    expect(mockRepo.fetchProject).toHaveBeenCalled()
  })

  it('sets error when all fetches fail', async () => {
    mockRepo.fetchProject = vi.fn().mockRejectedValue(new Error('API Error'))

    const failService = new ProjectService(mockRepo)
    failService.setStore(useProjectStore.getState())
    await failService.init()

    const state = useProjectStore.getState()
    expect(state.error).toBe('Failed to load projects')
    expect(state.projects).toEqual([])
  })

  it('opens detail and fetches project enrichment', async () => {
    const project: Project = {
      id: 'detail',
      name: 'Detail',
      url: '',
      readmeBaseUrl: '',
      imageUrl: '',
      tags: [],
    }

    await service.openDetail(project)

    const state = useProjectStore.getState()
    expect(state.detailLoading).toBe(false)
    expect(state.projectDetail).toBeTruthy()
    expect(state.projectDetail?.starsCount).toBe(100)
  })

  it('fetches readme', async () => {
    const project: Project = {
      id: 'readme',
      name: 'Readme',
      url: '',
      readmeBaseUrl: '',
      imageUrl: '',
      tags: [],
    }

    const readme = await service.getReadme(project)
    expect(readme).toBe('# README')
    expect(mockRepo.fetchReadme).toHaveBeenCalledWith(project, undefined)
  })
})
