import { data, num } from '../lib/data'
import { Photo, Section } from './shared'

export function Glance() {
  const o = data.operations
  const last = data.financials[data.financials.length - 1]
  const facts: Array<{ label: string; raw: number; digits: number; prefix?: string; unit: string }> = [
    { label: 'Cargo, FY26', raw: data.headline[0].value, digits: 2, unit: 'million tonnes' },
    { label: 'Operating income, FY25', raw: Math.round(last.operatingIncome), digits: 0, prefix: '₹', unit: 'crore' },
    { label: 'Capacity', raw: o.capacityMTPA, digits: 2, unit: 'million tonnes a year' },
    { label: 'Deepest berth', raw: 18.1, digits: 1, unit: 'metres' },
    { label: 'Ships, FY25', raw: o.vesselsFY25, digits: 0, unit: 'arrivals' },
    { label: 'Rail', raw: o.trackKm, digits: 0, unit: 'km of port track' },
  ]
  return (
    <Section id="glance" photo={<Photo name="harbour" />}>
      <dl className="facts">
        {facts.map(f => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>
              <span
                data-count-val={f.raw}
                data-count-digits={f.digits}
                data-count-prefix={f.prefix ?? ''}
              >
                {(f.prefix ?? '') + num(f.raw, f.digits)}
              </span>{' '}
              <small>{f.unit}</small>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
