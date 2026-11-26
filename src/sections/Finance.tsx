import { useEffect, useState, type ReactNode } from 'react'
import { BarChart, Rows, Stack } from '../charts'
import { Drawer } from '../components/Drawer'
import { data, num, rupees } from '../lib/data'
import { sections } from '../lib/sections'

const a = data.analysis
const F = data.financials
const reading = (id: string) => data.readings.find(r => r.id === id)!

const PANEL_ORDER = [
  'income',
  'revenue',
  'cost',
  'balance',
  'cash',
  'capex',
  'growth',
  'ratios',
  'appraisal',
] as const

function Panel({ id, children }: { id: string; children: ReactNode }) {
  const r = reading(id)
  return (
    <article className="panel" id={`finance-${id}`} data-finance-panel>
      <div className="panel-copy">
        <h3>{r.title}</h3>
        <p>{rupees(r.text)}</p>
      </div>
      <div className="panel-viz">
        {children}
      </div>
    </article>
  )
}

export function Finance() {
  const s = sections.find(x => x.id === 'finance')!
  const fy = (k: keyof (typeof F)[number]) => F.map(y => ({ label: y.fy, value: y[k] as number | null }))
  const A = a.appraisal
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>('[data-finance-panel]')]
    if (!panels.length) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const idx = panels.indexOf(entry.target as HTMLElement)
          if (idx >= 0) setActiveIdx(idx)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    panels.forEach(p => io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <section id="finance" data-ground={s.ground} aria-labelledby="finance-h">
      <div className="wrap finance-layout">
        <div className="finance-rail">
          <h2 id="finance-h">{s.title}</h2>
          <p className="line">{s.line}</p>
          <p className="finance-counter" aria-hidden="true">
            {String(activeIdx + 1).padStart(2, '0')} / {String(PANEL_ORDER.length).padStart(2, '0')}
          </p>
          <nav className="finance-index" aria-label="Financial chapters">
            <ol>
              {PANEL_ORDER.map((id, i) => {
                const r = reading(id)
                const isCurrent = i === activeIdx
                return (
                  <li key={id}>
                    <a
                      href={`#finance-${id}`}
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => setActiveIdx(i)}
                    >
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <span>{r.title}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
        <div className="finance-panels">
          <Panel id="income">
            <BarChart points={fy('operatingSurplus')} unit="crore" label="Operating surplus by year" />
            <Drawer name="Income and expenditure, ₹ crore" rows={F.map(y => ({ Year: y.fy, Income: y.operatingIncome, Expenditure: y.operatingExpenditure, Surplus: y.operatingSurplus, 'Other income': y.financeMiscIncome, 'Other expense': y.financeMiscExpenditure, 'Before tax': y.pbt, 'After tax': y.pat }))} />
          </Panel>
          <Panel id="revenue"><Stack rows={F.filter((_, i) => i % 3 === 0)} keys={[{ key: 'cargoHandling', name: 'Cargo' }, { key: 'portDock', name: 'Port and dock' }, { key: 'railway', name: 'Rail' }, { key: 'estate', name: 'Land' }]} /></Panel>
          <Panel id="cost"><Stack rows={a.expenditure.filter((_, i) => i % 3 === 0)} keys={[{ key: 'cargoHandling', name: 'Cargo' }, { key: 'portDock', name: 'Port and dock' }, { key: 'railway', name: 'Rail' }, { key: 'landBuildings', name: 'Land' }, { key: 'management', name: 'Management' }]} /></Panel>
          <Panel id="balance">
            <BarChart points={data.balanceSheet.map(b => ({ label: b.fy, value: b.netWorth }))} unit="crore" label="Net worth by year" />
            <Drawer name="Balance sheet, ₹ crore" rows={data.balanceSheet.map(b => ({ Year: b.fy, 'Fixed assets': b.netFixedAssets, 'Work in progress': b.capitalWIP, Investments: b.investments, 'Current assets and loans': b.currentAssetsAndLoans, 'Total assets': b.totalAssets, 'Net worth': b.netWorth, 'Current liabilities': b.currentLiabilitiesAndProvisionsDerived }))} />
          </Panel>
          <Panel id="cash">
            <BarChart points={a.cashFlow.map(c => ({ label: c.fy, value: c.operating }))} unit="crore" label="Operating cash flow by year, derived" />
            <Drawer name="Cash flow, derived, ₹ crore" rows={a.cashFlow.map(c => ({ Year: c.fy, Operating: c.operating, Investing: c.investing, Financing: c.financing, Change: c.netChange, 'Closing cash': c.closingCash }))} />
          </Panel>
          <Panel id="capex"><BarChart points={fy('capex').slice(1)} unit="crore" label="Capital expenditure by year" /></Panel>
          <Panel id="growth"><BarChart points={a.ratios.slice(1).map(r => ({ label: r.fy, value: r.incomeGrowthPct }))} unit="%" label="Income growth by year" /></Panel>
          <Panel id="ratios">
            <BarChart points={a.ratios.map(r => ({ label: r.fy, value: r.operatingRatioPct }))} unit="%" label="Operating ratio by year" />
            <Drawer name="Ratios" rows={a.ratios.map(r => ({ Year: r.fy, 'Operating ratio %': r.operatingRatioPct, 'Profit margin %': r.patMarginPct, 'ROCE %': r.rocePct, 'Return on net worth %': r.returnOnNetWorthPct, 'Current ratio': r.currentRatio, 'Asset turnover': r.assetTurnover, 'Debtor days': r.debtorDays, 'Capex / surplus %': r.capexToSurplusPct }))} />
          </Panel>
          <Panel id="appraisal">
            <div className="scroll">
              <table className="compare"><thead><tr><th scope="col">Growth credited</th>{A.programme.map(p => <th key={p.attributionPct} scope="col">{p.attributionPct}%</th>)}</tr></thead>
                <tbody>
                  <tr><th scope="row">NPV at 10%</th>{A.programme.map(p => <td key={p.attributionPct}>{p.npvAt10 < 0 ? '−' : ''}₹{num(Math.abs(p.npvAt10), 0)} cr</td>)}</tr>
                  <tr><th scope="row">IRR</th>{A.programme.map(p => <td key={p.attributionPct}>{p.irrPct == null ? 'none' : p.irrPct + '%'}</td>)}</tr>
                  <tr><th scope="row">ARR</th>{A.programme.map(p => <td key={p.attributionPct}>{p.arrPct}%</td>)}</tr>
                  <tr><th scope="row">Payback</th>{A.programme.map(p => <td key={p.attributionPct}>{p.paybackYears == null ? 'not yet' : p.paybackYears + ' yr'}</td>)}</tr>
                  <tr><th scope="row">Discounted</th>{A.programme.map(p => <td key={p.attributionPct}>{p.discountedPaybackYears == null ? 'not yet' : p.discountedPaybackYears + ' yr'}</td>)}</tr>
                </tbody></table>
            </div>
            <h4>What each project must earn a year, at 10% over 30 years</h4>
            <Rows unit="cr" points={A.breakeven.map(b => ({ label: b.project, value: b.needsPerYearCr }))} />
            <Drawer name="WQ-7 and WQ-8: NPV by yearly cash, ₹ crore" rows={A.sensitivityWQ78.map(s => ({ 'Discount rate %': s.ratePct, '₹25 cr': s.npv30y['25'], '₹30 cr': s.npv30y['30'], '₹35 cr': s.npv30y['35'], '₹40 cr': s.npv30y['40'], '₹50 cr': s.npv30y['50'] }))} />
          </Panel>
        </div>
      </div>
      <div className="red-wipe" aria-hidden="true" />
    </section>
  )
}
