import { data } from '../lib/data'
import { sections } from '../lib/sections'

export function Research() {
  const s = sections.find(x => x.id === 'research')!
  return (
    <section id="research" data-ground={s.ground} aria-labelledby="research-h">
      <div className="wrap research-layout">
        <div className="research-head">
          <h2 id="research-h">{s.title}</h2>
          <p className="line">{s.line}</p>
        </div>
        <ol className="timeline">
          {data.research.map(p => {
            const href = p.doi
              ? `https://doi.org/${p.doi}`
              : `https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}`
            return (
              <li key={p.title}>
                <b>{p.year}</b>
                <a className="research-link" href={href} target="_blank" rel="noopener noreferrer">
                  <span>{p.finding}</span>
                  <span className="small">{p.title}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
