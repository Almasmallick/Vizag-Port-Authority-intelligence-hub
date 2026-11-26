import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type Row = Record<string, string | number | null>

export function toCsv(rows: Row[]) {
  const keys = Object.keys(rows[0] ?? {})
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [keys, ...rows.map(r => keys.map(k => r[k]))].map(line => line.map(cell).join(',')).join('\r\n')
}

function download(name: string, rows: Row[]) {
  const url = URL.createObjectURL(new Blob(['\ufeff' + toCsv(rows)], { type: 'text/csv' }))
  Object.assign(document.createElement('a'), { href: url, download: `${name}.csv` }).click()
  setTimeout(() => URL.revokeObjectURL(url))
}

function formatCell(v: string | number | null | undefined) {
  if (v == null) return 'not available'
  if (typeof v === 'number') return v.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  return v
}

/** The Analyse layer. Native details, so it works without animation. */
export function Drawer({ name, rows, children }: { name: string; rows: Row[]; children?: ReactNode }) {
  const keys = Object.keys(rows[0] ?? {})
  const scrollRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [canSwipe, setCanSwipe] = useState(false)

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const overflow = el.scrollWidth > el.clientWidth + 2
    setCanSwipe(overflow)
    const atEnd = !overflow || el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    el.classList.toggle('at-end', atEnd)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !open) return
    syncScrollState()
    const raf = requestAnimationFrame(syncScrollState)
    el.addEventListener('scroll', syncScrollState, { passive: true })
    addEventListener('resize', syncScrollState)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', syncScrollState)
      removeEventListener('resize', syncScrollState)
    }
  }, [open, syncScrollState])

  return (
    <details
      className="drawer"
      onToggle={e => setOpen(e.currentTarget.open)}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.currentTarget.open = false
          e.currentTarget.querySelector('summary')?.focus()
        }
      }}
    >
      <summary>Full table</summary>
      {children}
      {canSwipe && <p className="small swipe-hint" aria-hidden="true">Swipe for more →</p>}
      <div className="scroll" ref={scrollRef} tabIndex={0} role="region" aria-label={`${name} table`}>
        <table>
          <thead><tr>{keys.map(k => <th key={k} scope="col">{k}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{keys.map(k => <td key={k}>{formatCell(r[k])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={() => download(name, rows)}>Download CSV</button>
    </details>
  )
}
