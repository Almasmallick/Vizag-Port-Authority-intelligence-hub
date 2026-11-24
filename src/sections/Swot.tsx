import { data } from '../lib/data'
import { Section } from './shared'

export function Swot() {
  const { sources: _unused, ...q } = data.swot
  return (
    <Section id="swot">
      <div className="swot">
        {Object.entries(q).map(([k, v]) => (
          <div key={k} className="swot-screen" data-swot-screen>
            <div className="swot-head">
              <span className="swot-letter" aria-hidden="true">{k[0].toUpperCase()}</span>
              <h3>{k}</h3>
            </div>
            <ul>{v.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
