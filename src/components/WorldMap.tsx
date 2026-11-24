import { useMemo } from 'react'
import { geoCentroid, geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import countriesAtlas from 'world-atlas/countries-110m.json'

type TradeRow = { country: string; mmt: number; sharePct: number }

const VIZAG: [number, number] = [83.29, 17.69]

const NAME_ALIAS: Record<string, string> = {
  'United States': 'United States of America',
  "Cote d'Ivoire": "Côte d'Ivoire",
}

const COORD_FALLBACK: Record<string, [number, number]> = {
  Singapore: [103.82, 1.35],
}

type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, { name?: string }>

const topology = countriesAtlas as unknown as Topology<{
  countries: GeometryCollection<{ name?: string }>
}>
const worldFeatures = feature(topology, topology.objects.countries).features as CountryFeature[]
const graticule = geoGraticule10()

const centroidByName = new Map<string, [number, number]>()
for (const f of worldFeatures) {
  const n = f.properties?.name
  if (n) centroidByName.set(n, geoCentroid(f))
}

function getCoord(country: string): [number, number] | null {
  const mapped = NAME_ALIAS[country] ?? country
  return centroidByName.get(mapped) ?? COORD_FALLBACK[country] ?? null
}

/** Schematic trade globe built from world-atlas and d3-geo. Country totals only, never ship tracks. */
export function WorldMap({
  side,
  rows,
  activeCountry,
}: {
  side: 'imports' | 'exports'
  rows: TradeRow[]
  activeCountry: string | null
}) {
  const activeCoord = activeCountry ? getCoord(activeCountry) : null

  const rotation: [number, number] = useMemo(() => {
    if (activeCoord) {
      // Gently turn toward selected partner while keeping Indian Ocean context
      const lon = Math.max(-25, Math.min(125, activeCoord[0] * 0.45 + VIZAG[0] * 0.55))
      const lat = Math.max(-28, Math.min(35, activeCoord[1] * 0.35 + VIZAG[1] * 0.65))
      return [-lon, -lat]
    }
    return side === 'imports' ? [-60, -22] : [-78, -16]
  }, [side, activeCoord])

  const { landPaths, vizagXY, arcs, graticuleD, activeName } = useMemo(() => {
    const size = 640
    const proj = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale(294)
      .clipAngle(90)
      .rotate(rotation)

    const path = geoPath(proj)
    const center: [number, number] = [-rotation[0], -rotation[1]]
    const maxMmt = Math.max(...rows.map(r => r.mmt), 1)
    const partnerSet = new Set(rows.map(r => NAME_ALIAS[r.country] ?? r.country))
    const resolvedActive = activeCountry ? (NAME_ALIAS[activeCountry] ?? activeCountry) : null

    const lands = worldFeatures.map((f, idx) => {
      const name = f.properties?.name ?? String(idx)
      const isIndia = name === 'India'
      const isPartner = partnerSet.has(name)
      const isActive = resolvedActive === name
      return {
        key: name + idx,
        d: path(f) || '',
        isIndia,
        isPartner,
        isActive,
      }
    }).filter(x => x.d)

    const vxy = proj(VIZAG)
    const arcList = rows.map(r => {
      const target = getCoord(r.country)
      if (!target || !vxy) return null
      // Check if target lies on visible hemisphere
      if (geoDistance(center, target) > Math.PI / 2 - 0.04) return null
      const txy = proj(target)
      if (!txy) return null
      const dx = txy[0] - vxy[0]
      const dy = txy[1] - vxy[1]
      const dist = Math.hypot(dx, dy)
      if (dist < 2) return null
      // Schematic arc curved gently above the chord
      const mx = (vxy[0] + txy[0]) / 2 - dy * 0.18
      const my = (vxy[1] + txy[1]) / 2 + dx * 0.14 - dist * 0.08
      const d = `M${vxy[0].toFixed(1)},${vxy[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${txy[0].toFixed(1)},${txy[1].toFixed(1)}`
      const weight = 1 + (r.mmt / maxMmt) * 2.4
      const isActive = activeCountry === r.country
      return { country: r.country, d, x: txy[0], y: txy[1], weight, isActive }
    }).filter((x): x is NonNullable<typeof x> => Boolean(x))

    return {
      landPaths: lands,
      vizagXY: vxy,
      arcs: arcList,
      graticuleD: path(graticule) || '',
      activeName: resolvedActive,
    }
  }, [rows, rotation, activeCountry])

  return (
    <div className="globe-wrap" data-globe>
      <svg
        className="globe"
        viewBox="0 0 640 640"
        role="img"
        aria-label={`Schematic trade globe showing Visakhapatnam ${side === 'imports' ? 'import' : 'export'} partner countries`}
        data-active-name={activeName ?? ''}
      >
        <circle className="globe-sea" cx="320" cy="320" r="294" />
        <path className="globe-grid" d={graticuleD} />
        <g className="globe-land">
          {landPaths.map(l => (
            <path
              key={l.key}
              d={l.d}
              className={[
                l.isIndia ? 'is-india' : '',
                l.isPartner ? 'is-partner' : '',
                l.isActive ? 'is-active' : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </g>
        <g className={side === 'imports' ? 'globe-arcs is-imports' : 'globe-arcs is-exports'}>
          {arcs.map(a => (
            <g key={a.country} className={a.isActive ? 'is-active' : undefined}>
              <path
                d={a.d}
                strokeWidth={a.isActive ? a.weight + 1.2 : a.weight}
                data-arc
              />
              <circle cx={a.x} cy={a.y} r={a.isActive ? 4.5 : 2.8} />
            </g>
          ))}
        </g>
        {vizagXY && (
          <g className="globe-origin">
            <circle cx={vizagXY[0]} cy={vizagXY[1]} r="5.5" />
          </g>
        )}
        <circle className="globe-rim" cx="320" cy="320" r="294" />
      </svg>
    </div>
  )
}
