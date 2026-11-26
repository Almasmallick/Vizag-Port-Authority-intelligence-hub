import { useEffect, useRef } from 'react'
import { BackToTop } from './components/BackToTop'
import { SectionBar } from './components/SectionBar'
import { Welcome, Glance, Understand, Finance, Swot, Explorer, Market, Pulse, Pipeline, Research, Next, Depart } from './sections'

export default function App() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const draw = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (bar.current) bar.current.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`
    }
    draw()
    addEventListener('scroll', draw, { passive: true })

    let active = true
    let revertMotion = () => {}
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      import('./lib/choreography').then(({ initChoreography }) => {
        if (!active) return
        revertMotion = initChoreography()
      })
    }

    return () => {
      active = false
      removeEventListener('scroll', draw)
      revertMotion()
    }
  }, [])

  return (
    <>
      <a className="skip" href="#glance">Skip to content</a>
      <div className="progress" ref={bar} aria-hidden="true" />
      <main>
        <Welcome />
        <SectionBar />
        <Glance />
        <Understand />
        <Finance />
        <Swot />
        <Explorer />
        <Market />
        <Pulse />
        <Pipeline />
        <Research />
        <Next />
      </main>
      <Depart />
      <BackToTop />
    </>
  )
}
