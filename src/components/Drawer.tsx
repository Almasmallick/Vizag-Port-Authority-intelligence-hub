import type { ReactNode } from 'react'

export type Row = Record<string, string | number | null>

export function toCsv(rows: Row[]) {
  const keys = Object.keys(rows[0] ?? {})
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [keys, ...rows.map(r => keys.map(k => r[k]))].map(line => line.map(cell).join(',')).join('\r\n')
}

function download(name: string, rows: Row[]) {
  const url = URL.createObjectURL(new Blob(['\ufeff' + toCsv(rows)], { type: 'text/csv' }))
  Object.assign(document.createElement('a'), { href: url, download: `${name}.csv` }).click()
  setTimeout(() => URL.revokeObjectURL(url))
}

/** The Analyse layer. Native details, so it works without animation. */
export function Drawer({ name, rows, children }: { name: string; rows: Row[]; children?: ReactNode }) {
  const keys = Object.keys(rows[0] ?? {})
  return (
    <details className="drawer" onKeyDown={e => {
      if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary')?.focus() }
    }}>
      <summary>Full table</summary>
      {children}
      <div className="scroll" tabIndex={0} role="region" aria-label={`${name} table`}>
        <table>
          <thead><tr>{keys.map(k => <th key={k} scope="col">{k}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{keys.map(k => <td key={k}>{r[k] ?? 'not available'}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <button type="button" onClick={() => download(name, rows)}>Download CSV</button>
    </details>
  )
}
