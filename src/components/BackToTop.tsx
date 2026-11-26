import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let welcomeSeen = true
    let departSeen = false

    const update = () => {
      const finance = document.getElementById('finance')
      const pastFinance = finance ? finance.getBoundingClientRect().bottom < window.innerHeight * 0.6 : false
      setVisible(!welcomeSeen && !departSeen && pastFinance)
    }

    const welcomeEl = document.getElementById('welcome')
    const departEl = document.getElementById('depart')
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.target.id === 'welcome') welcomeSeen = e.isIntersecting
          if (e.target.id === 'depart') departSeen = e.isIntersecting
        }
        update()
      },
      { threshold: 0.05 },
    )
    if (welcomeEl) io.observe(welcomeEl)
    if (departEl) io.observe(departEl)

    addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      io.disconnect()
      removeEventListener('scroll', update)
    }
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
