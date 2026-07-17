import { useEffect, useRef } from 'react'
import { useProjectStore } from '@/lib/api/projects/store'
import { ProjectService } from '@/lib/api/projects/service'
import { CachedRepository } from '@/lib/api/projects/repository/cached'
import { GitHubRepository } from '@/lib/api/projects/repository/github'
import { LocalStorageCache } from '@/lib/api/projects/repository/cache'
import Navbar from '@/lib/components/sections/Navbar'
import Hero from '@/lib/components/sections/Hero'
import About from '@/lib/components/sections/About'
import Portfolio from '@/lib/components/sections/Portfolio'
import Achievements from '@/lib/components/sections/Achievements'
import Tools from '@/lib/components/sections/Tools'
import Social from '@/lib/components/sections/Social'
import Contact from '@/lib/components/sections/Contact'
import Footer from '@/lib/components/sections/Footer'

export default function HomePage() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const cacheStore = new LocalStorageCache('project:', '1')
    const repo = new CachedRepository(new GitHubRepository(), cacheStore)
    const service = new ProjectService(repo)
    service.setStore(useProjectStore.getState())
    service.init()
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Achievements />
      <Tools />
      <Social />
      <Contact />
      <Footer />
    </>
  )
}
