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
  return (
    <figure className="bars">
      <Bars {...props} />
      <div className="ticks">{props.points.map(p => <span key={p.label}><b>{num(p.value, 0)}</b>{p.label.replace('FY', '')}</span>)}</div>
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

/** Share of a total per year, stacked to 100%. */
export function Stack({ rows, keys }: { rows: Record<string, string | number | null>[]; keys: { key: string; name: string }[] }) {
  return (
    <div className="stack">
      {rows.map(r => {
        const total = keys.reduce((s, k) => s + Number(r[k.key] ?? 0), 0)
        return (
          <div key={String(r.fy)}>
            <span>{r.fy}</span>
            {keys.map((k, i) => {
              const pct = Number(r[k.key] ?? 0) / total * 100
              const pctLabel = `${Math.round(pct)}%`
              return (
                <i key={k.key} data-n={i} data-stack-bar style={{ width: `${pct}%` }} title={`${k.name}: ${pctLabel}`}>
                  {pct >= 4 ? pctLabel : ''}
                </i>
              )
            })}
          </div>
        )
      })}
      <p>{keys.map((k, i) => <span key={k.key} data-n={i}>{k.name}</span>)}</p>
    </div>
  )
}
