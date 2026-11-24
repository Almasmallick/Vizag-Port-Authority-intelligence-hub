import { useState } from 'react'
import { data, rupees } from '../lib/data'
import { Section } from './shared'

const FIX_DATA: Record<string, { fact: string; fix: string }> = {
  'Ships stay longer than at peer ports': {
    fact: '69.2 h turnaround vs 46.2 h Paradip and 26.4 h JNPA (5.01 h wait, 0.71 h port).',
    fix: 'Mechanise dry bulk first (~₹800 cr PPP) to recover 20 h+.',
  },
  'Old unpaid dues': {
    fact: '₹237.97 crore overdue over 5 years — 57% of all debtors (72 debtor days).',
    fix: 'Publish debtor-class ageing; recover or provide.',
  },
  'Growing dependence on oil': {
    fact: '24.85 MMT oil (30.1% of cargo, up from 21.8%); 18.6% via the Gulf.',
    fix: 'Disclose customer share; stress-test a Hormuz disruption.',
  },
  'Dust and the city': {
    fact: '26.5 MMT coal and ore; 19 Aug 2026 APPCB check (consent to 31 Dec 2026).',
    fix: '4,75,000 sq m misting and live boundary PM10 feeds.',
  },
}

const EMERGING_ROLES = [
  {
    area: 'Port operations',
    roles: 'Remote RTG/QC crane control, TOS automation architects, PPP berth concession leads',
  },
  {
    area: 'Shipping',
    roles: 'Voyage decarbonisation analysts (CII/EU ETS), ammonia & methanol chartering',
  },
  {
    area: 'Supply chain',
    roles: 'Sea–air corridor planners (Bhogapuram), captive green-hydrogen pipe logistics',
  },
  {
    area: 'Finance',
    roles: 'Carbon & green-bunkering traders, PPP project finance, green bond structuring',
  },
  {
    area: 'Data',
    roles: 'Subsea cable route & bathymetric engineers, port digital-twin & SCADA leads',
  },
  {
    area: 'Energy and shipbuilding',
    roles: 'Cryogenic bunkering safety (Pudimadaka), green-hull design (Dugarajapatnam)',
  },
]

export function Next() {
  const [focusFix, setFocusFix] = useState(0)
  const [focusRole, setFocusRole] = useState(0)

  return (
    <Section id="next">
      <ol className="fixes">
        {data.recommendations.map((r, i) => {
          const entry = FIX_DATA[r.problem] ?? { fact: rupees(r.evidence), fix: `${r.action}.` }
          return (
            <li
              key={r.problem}
              data-fix-item
              data-col={i % 2}
              className={focusFix === i ? 'is-focus' : undefined}
              onMouseEnter={() => setFocusFix(i)}
              onClick={() => setFocusFix(i)}
            >
              <span className="fix-rule" aria-hidden="true" />
              <span className="fix-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{r.problem}</h3>
              <p className="fix-metric">{entry.fact}</p>
              <p className="fix-action">{entry.fix}</p>
            </li>
          )
        })}
      </ol>
      <h3>Work opportunities</h3>
      <ul className="status work-list">
        {EMERGING_ROLES.map((r, i) => (
          <li
            key={r.area}
            data-work-row
            className={focusRole === i ? 'is-focus' : undefined}
            onMouseEnter={() => setFocusRole(i)}
            onClick={() => setFocusRole(i)}
          >
            <b>{r.area}</b>
            <span>{r.roles}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
