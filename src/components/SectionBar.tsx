import { useEffect, useState } from 'react'

const SECTIONS: Array<{ id: string; short: string; title: string }> = [
  { id: 'glance', short: 'Glance', title: 'Port at a glance' },
  { id: 'understand', short: 'Built', title: 'How it was built' },
  { id: 'finance', short: 'Finance', title: 'Financial intelligence' },
  { id: 'swot', short: 'SWOT', title: 'SWOT' },
  { id: 'explorer', short: 'Cargo', title: 'Cargo and connections' },
  { id: 'market', short: 'Rivals', title: 'Against its rivals' },
  { id: 'pulse', short: 'Pulse', title: 'What people say' },
  { id: 'pipeline', short: 'Coming', title: 'What is coming' },
  { id: 'research', short: 'Research', title: 'The research' },
  { id: 'next', short: 'Change', title: 'What to change' },
]

export function SectionBar() {
  const [active, setActive] = useState('')
  const [heroVisible, setHeroVisible] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('welcome')
    const heroIo = hero
      ? new IntersectionObserver(
          ([entry]) => setHeroVisible(entry.isIntersecting),
          { threshold: 0.15 },
        )
      : null
    if (hero && heroIo) heroIo.observe(hero)

    const secIo = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) secIo.observe(el)
    })

    return () => {
      heroIo?.disconnect()
      secIo.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  const shown = !heroVisible && Boolean(active)
  const currentIdx = Math.max(0, SECTIONS.findIndex(s => s.id === active))
  const current = SECTIONS[currentIdx]

  if (!shown) return null

  return (
    <div className="sec-nav">
      <button
        type="button"
        className="sec-index-btn"
        aria-expanded={open}
        aria-controls="section-index-sheet"
        aria-label={`Current section: ${current.title}. Open section index`}
        onClick={() => setOpen(v => !v)}
      >
        <span className="sec-index-num" aria-hidden="true">
          {String(currentIdx + 1).padStart(2, '0')}
        </span>
        <span className="sec-index-label">{current.short}</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d={open ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} />
        </svg>
      </button>

      {open && (
        <>
          <div className="sec-sheet-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav
            id="section-index-sheet"
            className="sec-sheet"
            aria-label="Sections"
          >
            <div className="sec-sheet-head">
              <span>Index</span>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
            <ol className="sec-sheet-list">
              {SECTIONS.map((s, idx) => {
                const isCurrent = s.id === active
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className="sec-sheet-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="sec-sheet-title">{s.title}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>
        </>
      )}
    </div>
  )
}
