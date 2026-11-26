import { useEffect, useRef, useState } from 'react'
import { Voyage } from '../components/Voyage'
import { data } from '../lib/data'

export function Welcome() {
  const [showReports, setShowReports] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showReports) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowReports(false)
    }
    const onClick = (e: MouseEvent) => {
      if (reportRef.current && !reportRef.current.contains(e.target as Node)) {
        setShowReports(false)
      }
    }
    addEventListener('keydown', onKey)
    addEventListener('click', onClick)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('click', onClick)
    }
  }, [showReports])

  return (
    <Voyage>
      <div className="wrap hero">
        <div className="hero-top">
          <img className="logo" src="/media/logo.webp" alt="Emblem of Visakhapatnam Port Authority" width="76" height="96" />
          <div className="hero-report" ref={reportRef}>
            <button
              type="button"
              className="hero-report-btn"
              aria-expanded={showReports}
              aria-controls="hero-reports"
              onClick={() => setShowReports(v => !v)}
            >
              <span>Report</span>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={showReports ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} />
              </svg>
            </button>
            {showReports && (
              <div id="hero-reports" className="hero-reports" role="region" aria-label="Reports">
                <a
                  href="/assets/aistudio/project_report__AutoRecovered_.edited_a177e894.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowReports(false)}
                >
                  Project report 2024
                </a>
                <a
                  href="/assets/aistudio/VPA_Strategic_Financial_Diagnostic_2026_8f9103b9.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowReports(false)}
                >
                  Updated report 2026
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="hero-copy">
          <h1 id="welcome-h">Visakhapatnam Port Authority</h1>
          <p className="line">{data.copy.welcome.line}</p>
          <p className="small">Independent student project. Not the official website.</p>
        </div>
      </div>
    </Voyage>
  )
}
