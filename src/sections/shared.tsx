import type { ReactNode } from 'react'
import { sections, type SectionId } from '../lib/sections'

/** Phone crop first, wide crop from 768px. */
export function Photo({ name, alt = '' }: { name: string; alt?: string }) {
  return (
    <picture className="photo">
      <source media="(min-width: 768px)" srcSet={`/media/${name}.webp`} />
      <img src={`/media/${name}-phone.webp`} alt={alt} loading="lazy" decoding="async" />
    </picture>
  )
}

export function Section({ id, children, photo }: { id: SectionId; children?: ReactNode; photo?: ReactNode }) {
  const s = sections.find(x => x.id === id)!
  return (
    <section id={id} data-ground={s.ground} aria-labelledby={`${id}-h`}>
      {photo}
      <div className="wrap"><h2 id={`${id}-h`}>{s.title}</h2><p className="line">{s.line}</p>{children}</div>
    </section>
  )
}
