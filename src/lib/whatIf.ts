export type WhatIfInput = {
  cargoMMT: Record<string, number>
  totalMMT: number
  estateIncome: number
  operatingExpenditure: number
  variableIncomePerTonneRs: number
}

/** change: percent per cargo, -50 to 50. variableCostPct: 0 to 100. Amounts in rupees crore. */
export function runWhatIf(base: WhatIfInput, change: Record<string, number>, variableCostPct: number) {
  const tonnes = Object.entries(base.cargoMMT).reduce(
    (sum, [name, mmt]) => sum + Math.max(0, mmt * (1 + (change[name] ?? 0) / 100)), 0)
  const v = variableCostPct / 100
  const income = base.estateIncome + (tonnes * base.variableIncomePerTonneRs) / 10
  const cost = base.operatingExpenditure * (1 - v + (v * tonnes) / base.totalMMT)
  return { tonnes, income, cost, surplus: income - cost }
}
