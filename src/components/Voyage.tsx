import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Scroll-scrubbed ship film. One small video is decoded a frame at a time, so it stays light on 8 GB laptops and phones. */
export function Voyage({ children }: { children: ReactNode }) {
  const track = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = video.current!, t = track.current!
    const saver = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    if (saver || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0, shown = 0, disposed = false
    const onReady = () => { if (!disposed) setReady(true) }
    v.addEventListener('loadeddata', onReady, { once: true })

    // Load film after the poster paints so first load stays fast.
    const loadTimer = window.setTimeout(() => {
      if (disposed) return
      v.src = `/media/voyage${matchMedia('(min-width: 768px)').matches ? '' : '-phone'}.mp4`
      v.load()
    }, 60)

    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (v.readyState < 2 || v.seeking || !Number.isFinite(v.duration) || v.duration <= 0) return
      const span = Math.max(1, t.offsetHeight - innerHeight)
      const q = Math.min(1, Math.max(0, -t.getBoundingClientRect().top / span))
      const target = q * Math.max(0, v.duration - 1 / 24)
      const next = shown + (target - shown) * 0.24
      if (Math.abs(next - v.currentTime) < 1 / 48) return
      shown = v.currentTime = next
    }

    const seen = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame)
      if (e.isIntersecting) tick()
    })
    seen.observe(t)

    return () => {
      disposed = true
      window.clearTimeout(loadTimer)
      v.removeEventListener('loadeddata', onReady)
      seen.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="welcome" ref={track} data-ground="photo" aria-labelledby="welcome-h">
      <div className="scene">
        <picture className="photo">
          <source media="(min-width: 768px)" srcSet="/media/voyage.webp" />
          <img src="/media/voyage-phone.webp" alt="Illustration of a cargo ship approaching the port at sunrise" />
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className={ready ? 'is-ready' : undefined}
          />
        </picture>
        {children}
      </div>
    </section>
  )
}
