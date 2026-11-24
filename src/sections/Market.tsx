import { BarChart, Rows } from '../charts'
import { Drawer } from '../components/Drawer'
import { data } from '../lib/data'
import { Section } from './shared'

export function Market() {
  return (
    <Section id="market">
      <div className="two">
        <div>
          <h3>Hours a ship stays</h3>
          <Rows unit="h" highlightFirst points={data.peers.rows.map(p => ({ label: p.port, value: p.turnaroundHours }))} />
        </div>
        <div>
          <h3>World Bank container score</h3>
          <BarChart points={data.peers.cppi.map(c => ({ label: String(c.year), value: c.score }))} unit="" label="Container Port Performance Index score" />
          <p>Ranked {data.peers.cppiRank2025}th in 2025.</p>
        </div>
      </div>
      <Drawer name="Listed maritime companies, FY26, ₹ crore" rows={data.marketPeers.rows.map(r => ({ Company: r.company, Revenue: r.revenue, Profit: r.pat }))} />
      <div className="night-dim" aria-hidden="true" />
    </Section>
  )
}
