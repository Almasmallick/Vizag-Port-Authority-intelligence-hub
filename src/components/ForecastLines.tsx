type Scenario = {
  scenario: string
  growthPct: number
  mmt: Record<string, number>
}

const YEARS = ['FY26', 'FY27', 'FY28', 'FY29', 'FY30'] as const

/** Trajectory lines from FY26 to FY30 read directly from site-data.json. */
export function ForecastLines({ scenarios }: { scenarios: Scenario[] }) {
  const all = scenarios.flatMap(s => YEARS.map(y => s.mmt[y]))
  const min = Math.floor(Math.min(...all) - 2)
  const max = Math.ceil(Math.max(...all) + 2)
  const span = max - min || 1

  const x = (i: number) => 8 + (i / (YEARS.length - 1)) * 84
  const y = (v: number) => 66 - ((v - min) / span) * 56

  return (
    <figure className="forecast-chart">
      <svg viewBox="0 0 100 76" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cargo forecast scenarios from FY26 to FY30">
        {YEARS.map((yr, i) => (
          <g key={yr}>
            <line x1={x(i)} y1="8" x2={x(i)} y2="66" className="forecast-grid" />
            <text x={x(i)} y="74" textAnchor="middle" className="forecast-axis">{yr.replace('FY', '')}</text>
          </g>
        ))}
        {scenarios.map((s, idx) => {
          const pts = YEARS.map((yr, i) => `${x(i).toFixed(1)},${y(s.mmt[yr]).toFixed(1)}`).join(' ')
          return (
            <polyline
              key={s.scenario}
              points={pts}
              className={`forecast-line forecast-line-${idx}`}
              data-forecast-line
            />
          )
        })}
      </svg>
    </figure>
  )
}
