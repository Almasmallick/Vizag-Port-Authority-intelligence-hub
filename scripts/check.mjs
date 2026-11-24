import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runWhatIf } from '../src/lib/whatIf.ts'

const w = JSON.parse(readFileSync(new URL('../src/content/site-data.json', import.meta.url), 'utf8')).whatIf
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.1, `${a} vs ${b}`)
const base = runWhatIf(w, {}, 30)
near(base.income, 2115.27); near(base.cost, 801.73); near(base.surplus, 1313.54)
const noOil = runWhatIf(w, { POL: -50 }, 0)
near(base.income - noOil.income, 12.425 * 22.374); near(noOil.cost, base.cost)
assert.equal(runWhatIf(w, Object.fromEntries(Object.keys(w.cargoMMT).map(k => [k, -200])), 100).tonnes, 0)
console.log('what-if checks passed')
