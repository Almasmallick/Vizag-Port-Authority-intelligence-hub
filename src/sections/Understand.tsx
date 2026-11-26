import { Rows } from '../charts'
import { Drawer } from '../components/Drawer'
import { data } from '../lib/data'
import { Photo, Section } from './shared'

export function Understand() {
  const o = data.operations
  return (
    <Section id="understand" photo={<Photo name="berth" alt="Mechanised cargo berth and shore cranes inside Visakhapatnam harbour" />}>
      <ol className="timeline">
        <span className="timeline-track" aria-hidden="true" />
        <span className="timeline-dot" aria-hidden="true" />
        {data.history.map(h => (
          <li key={h.year}>
            <b>{h.year}</b>
            <span>{h.text}</span>
          </li>
        ))}
      </ol>
      <div className="two">
        <div>
          <h3>Infrastructure</h3>
          <p>{o.berthCount}. {o.largestInner}. {o.largestOuter}.</p>
          <Drawer name="Berths" rows={o.berths.map(({ name, harbour, draftM, occupancyPct, operator }) => ({ Berth: name, Harbour: harbour, 'Draught, m': draftM, 'Occupied, %': occupancyPct, Operator: operator }))} />
        </div>
        <div>
          <h3>Days in port, by cargo</h3>
          <Rows unit="days" highlightFirst={false} points={Object.entries(o.turnaroundDaysFY25).map(([label, value]) => ({ label, value }))} />
        </div>
      </div>
    </Section>
  )
}
