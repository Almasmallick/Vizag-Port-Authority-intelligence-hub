import { useState } from 'react'
import { Rows } from '../charts'
import { ForecastLines } from '../components/ForecastLines'
import { data, num, rupees } from '../lib/data'
import { sections } from '../lib/sections'
import { runWhatIf } from '../lib/whatIf'
import { Photo } from './shared'

export function Pipeline() {
  const s = sections.find(x => x.id === 'pipeline')!
  const f = data.analysis.forecast
  const w = data.whatIf
  const [change, setChange] = useState<Record<string, number>>({})
  const [activePort, setActivePort] = useState(0)
  const [activeRegion, setActiveRegion] = useState<number | null>(null)
  const [activeMou, setActiveMou] = useState(0)
  const now = runWhatIf(w, change, w.defaultVariableCostPct)

  return (
    <section id="pipeline" data-ground={s.ground} aria-labelledby="pipeline-h">
      <div className="pipeline-stage" aria-hidden="true">
        <Photo name="hydrogen" alt="Illustration of a future hydrogen terminal" />
      </div>
      <div className="wrap pipeline-body">
        <div className="pipeline-hero">
          <h2 id="pipeline-h">{s.title}</h2>
          <p className="line">{s.line}</p>
        </div>

        {/* 1. At the port: sticky index rail + properly spaced 4-column project ledger */}
        <div className="pipe-band pipe-split">
          <div className="pipe-rail">
            <h3>At the port</h3>
            <p className="pipe-index" aria-hidden="true">
              {String(activePort + 1).padStart(2, '0')} / {String(data.projects.length).padStart(2, '0')}
            </p>
          </div>
          <ul className="status pipe-port-list">
            {data.projects.map((p, i) => (
              <li
                key={p.name}
                data-pipe-port
                className={activePort === i ? 'is-active' : undefined}
                onMouseEnter={() => setActivePort(i)}
                onClick={() => setActivePort(i)}
              >
                <span className="pipe-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <b>{p.name}</b>
                <em>{p.status}</em>
                <span>{rupees(p.summary)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Around the port: 2-column staggered counter-drift layout (alternating offset on mobile) */}
        <div className="pipe-band">
          <h3>Around the port</h3>
          <ul className="pipe-region-grid">
            {data.region.map((p, i) => {
              const selected = activeRegion === i
              return (
                <li
                  key={p.name}
                  data-pipe-region
                  data-col={i % 2}
                  className={selected ? 'is-active' : undefined}
                  onMouseEnter={() => setActiveRegion(i)}
                  onClick={() => setActiveRegion(selected ? null : i)}
                >
                  <div className="pipe-region-top">
                    <b>{p.name}</b>
                    <em>{p.status}</em>
                  </div>
                  <p>{rupees(p.what)}. {p.when}.</p>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 3. Signed: cleanly aligned ledger matching column grid */}
        <div className="pipe-band">
          <h3>Signed</h3>
          <ul className="status pipe-mous">
            {data.mous.map((m, i) => {
              const selected = activeMou === i
              return (
                <li
                  key={m.date + m.parties}
                  data-pipe-mou
                  className={selected ? 'is-active' : undefined}
                >
                  <button
                    type="button"
                    className="pipe-mou-btn"
                    aria-expanded={selected}
                    onClick={() => setActiveMou(i)}
                  >
                    <b>{m.parties}</b>
                    <em>{m.date}</em>
                    <span>{m.what}{m.value ? `, ${rupees(m.value)}` : ''}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 4. Forecast trajectories + interactive What if */}
        <div className="two pipe-band">
          <div>
            <h3>Cargo by FY30</h3>
            <ForecastLines scenarios={f.scenarios} />
            <Rows unit="MMT" highlightFirst={false} points={f.scenarios.map(sc => ({ label: `${sc.scenario} (${sc.growthPct}% a year)`, value: sc.mmt.FY30 }))} />
          </div>
          <div>
            <h3>What if</h3>
            {Object.keys(w.cargoMMT).map(k => (
              <label key={k}>
                <span>{k} <b>{change[k] ?? 0}%</b></span>
                <input type="range" min={-50} max={50} value={change[k] ?? 0} onChange={e => setChange({ ...change, [k]: Number(e.target.value) })} />
              </label>
            ))}
            <output aria-live="polite">Surplus ₹{num(now.surplus, 0)} crore</output>
            <p className="small">Illustrative: one average income per tonne for all cargo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
