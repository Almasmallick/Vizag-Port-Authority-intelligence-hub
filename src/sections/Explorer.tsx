import { lazy, Suspense, useState } from 'react'
import { Rows } from '../charts'
import { data, num } from '../lib/data'
import { sections } from '../lib/sections'

const WorldMap = lazy(() => import('../components/WorldMap').then(m => ({ default: m.WorldMap })))

export function Explorer() {
  const s = sections.find(x => x.id === 'explorer')!
  const [side, setSide] = useState<'imports' | 'exports'>('imports')
  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  const partnerRows = data.trade[side].slice(0, 8)
  const maxPartner = Math.max(...partnerRows.map(t => t.mmt), 1)

  return (
    <section id="explorer" data-ground={s.ground} aria-labelledby="explorer-h">
      <div className="explorer-stage">
        <Suspense fallback={<div className="globe-wrap" data-globe aria-hidden="true" />}>
          <WorldMap side={side} rows={partnerRows} activeCountry={activeCountry} />
        </Suspense>
        <div className="swot-iris" aria-hidden="true" />
      </div>
      <div className="wrap">
        <h2 id="explorer-h">{s.title}</h2>
        <p className="line">{s.line}</p>
        <div className="two">
          <div>
            <h3>What moves</h3>
            <Rows
              unit="MMT"
              points={[...data.commodities.FY25]
                .sort((x, y) => y.mmt - x.mmt)
                .filter(c => c.mmt > 0)
                .map(c => ({ label: c.name, value: c.mmt }))}
            />
          </div>
          <div>
            <div className="switch" role="group" aria-label="Direction">
              {(['imports', 'exports'] as const).map(dir => (
                <button
                  key={dir}
                  type="button"
                  aria-pressed={side === dir}
                  onClick={() => { setSide(dir); setActiveCountry(null) }}
                >
                  {dir === 'imports' ? 'From' : 'To'}
                </button>
              ))}
            </div>
            <ul className="rows rows-interactive">
              {partnerRows.map(t => {
                const isSelected = activeCountry === t.country
                return (
                  <li
                    key={t.country}
                    className={isSelected ? 'is-active' : undefined}
                    onMouseEnter={() => setActiveCountry(t.country)}
                    onMouseLeave={() => setActiveCountry(null)}
                  >
                    <button
                      type="button"
                      className="row-pick"
                      aria-pressed={isSelected}
                      onClick={() => setActiveCountry(isSelected ? null : t.country)}
                    >
                      <span>{t.country}</span>
                      <b>{num(t.mmt, 1)} MMT</b>
                    </button>
                    <i style={{ width: `${(t.mmt / maxPartner) * 100}%` }} data-row-bar />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
