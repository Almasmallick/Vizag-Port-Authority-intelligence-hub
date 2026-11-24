import { data } from './data'

// Page order. The progress scale, the page and the storyboard all follow this list.
const order = [
  ['welcome', 'photo'], ['glance', 'photo'], ['understand', 'ink'], ['finance', 'salt'], ['swot', 'primer'], ['explorer', 'ink'],
  ['market', 'salt'], ['pulse', 'ink'], ['pipeline', 'ink'], ['research', 'salt'], ['next', 'salt'],
] as const

export type SectionId = (typeof order)[number][0]
export const sections = order.map(([id, ground]) => ({ id, ground, ...data.copy[id] }))
