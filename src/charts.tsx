import { Fragment, useState } from 'react'
import { num } from './lib/data'

type Point = { label: string; value: number | null }

/** Vertical bars from zero. Negative values hang below the baseline. */
export function Bars({ points, unit, label }: { points: Point[]; unit: string; label: string }) {
  const values = points.map(p => p.value ?? 0)
  const max = Math.max(0, ...values), min = Math.min(0, ...values), span = max - min || 1
  const y = (v: number) => 12 + ((max - v) / span) * 74
  return (
    <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={label}>
      {points.map((p, i) => p.value == null ? null : (
        <rect
          key={p.label}
          className={[i === points.length - 1 ? 'now' : '', p.value < 0 ? 'neg' : 'pos'].filter(Boolean).join(' ')}
          x={(i + .14) * 100 / points.length}
          width={72 / points.length}
          y={Math.min(y(p.value), y(0))}
          height={Math.abs(y(p.value) - y(0))}
          data-bar
        />
      ))}
      <title>{points.map(p => `${p.label} ${num(p.value)} ${unit}`).join(', ')}</title>
    </svg>
  )
}

/** Bars plus readable HTML labels, so type never stretches with the drawing. */
export function BarChart(props: { points: Point[]; unit: string; label: string }) {
  const mid = Math.floor((props.points.length - 1) / 2)
  return (
    <figure className="bars">
      <Bars {...props} />
      <div className="ticks">
        {props.points.map((p, i) => (
          <span key={p.label} data-show-val={i === 0 || i === mid || i === props.points.length - 1 ? 'true' : 'false'}>
            <b>{num(p.value, 0)}</b>
            {p.label.replace('FY', '')}
          </span>
        ))}
      </div>
    </figure>
  )
}

export function Rows({ points, unit, highlightFirst = true }: { points: Point[]; unit: string; highlightFirst?: boolean }) {
  const max = Math.max(...points.map(p => p.value ?? 0), 1)
  return (
    <ul className={highlightFirst ? 'rows rows-lead' : 'rows'}>
      {points.map(p => (
        <li key={p.label}>
          <span>{p.label}</span>
          <i style={{ width: `${((p.value ?? 0) / max) * 100}%` }} data-row-bar />
          <b>{num(p.value, 1)} {unit}</b>
        </li>
      ))}
    </ul>
  )
}

/** Share of a total per year, stacked to 100%. Tapping a row expands all shares. */
export function Stack({ rows, keys }: { rows: Record<string, string | number | null>[]; keys: { key: string; name: string }[] }) {
  const [openFy, setOpenFy] = useState<string | null>(null)

  return (
    <div className="stack">
      <p className="stack-legend">{keys.map((k, i) => <span key={k.key} data-n={i}>{k.name}</span>)}</p>
      {rows.map(r => {
        const fy = String(r.fy)
        const total = keys.reduce((s, k) => s + Number(r[k.key] ?? 0), 0) || 1
        const isOpen = openFy === fy
        const parts = keys.map(k => ({
          key: k.key,
          name: k.name,
          pct: (Number(r[k.key] ?? 0) / total) * 100,
        }))

        return (
          <Fragment key={fy}>
            <button
              type="button"
              className="stack-row"
              aria-expanded={isOpen}
              onClick={() => setOpenFy(isOpen ? null : fy)}
            >
              <span>{fy}</span>
              <span className="stack-track">
                {parts.map((seg, i) => {
                  const pctLabel = `${Math.round(seg.pct)}%`
                  return (
                    <span
                      key={seg.key}
                      className="stack-seg"
                      data-n={i}
                      data-stack-bar
                      style={{ width: `${seg.pct}%` }}
                      title={`${seg.name}: ${pctLabel}`}
                    >
                      {seg.pct >= 12 ? <i>{pctLabel}</i> : null}
                    </span>
                  )
                })}
              </span>
            </button>
            {isOpen && (
              <p className="stack-detail small">
                {parts.map(seg => `${seg.name} ${Math.round(seg.pct)}%`).join(' · ')}
              </p>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
