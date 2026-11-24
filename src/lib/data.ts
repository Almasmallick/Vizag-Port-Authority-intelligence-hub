import site from '../content/site-data.json'

export const data = site


// Indian digit grouping: 1,00,000
export function num(value: number | null | undefined, digits = 2): string {
  if (value == null) return 'not available'
  return value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: digits })
}

// The data file stores "Rs" so it stays plain ASCII; screens show the rupee sign.
export const rupees = (text: string) => text.replace(/\bRs /g, '₹')
