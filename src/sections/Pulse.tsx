import { data, rupees } from '../lib/data'
import { Photo, Section } from './shared'

export function Pulse() {
  return (
    <Section id="pulse" photo={<Photo name="night" />}>
      <ul className="voices">{data.pulse.themes.map(t => <li key={t.theme}>{t.theme}.</li>)}</ul>
      <h3>Hidden indicators</h3>
      <dl className="facts">{data.hidden.map(h => <div key={h.name}><dt>{h.name}</dt><dd>{rupees(h.value + ' ').trim()} <small>{rupees(h.change)}</small></dd></div>)}</dl>
    </Section>
  )
}
