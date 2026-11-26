import { num } from './data'
import { gsap, ScrollTrigger } from './motion'

export function initChoreography(): () => void {
  const mm = gsap.matchMedia()

  mm.add(
    {
      desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    },
    ctx => {
      const isDesktop = Boolean(ctx.conditions?.desktop)
      let disposed = false

      // --- DESKTOP-ONLY SCRUBBED & HORIZONTAL CHOREOGRAPHY ---
      if (isDesktop) {
        // 1. Welcome: title slides off behind the ship; last frame zooms into harbour
        gsap.to('#welcome .hero-copy', {
          y: 64,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#welcome',
            start: '12% top',
            end: '55% top',
            scrub: 0.4,
          },
        })

        gsap.to('#welcome .hero-top', {
          opacity: 0,
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: '#welcome',
            start: '18% top',
            end: '52% top',
            scrub: 0.4,
          },
        })

        gsap.to('#welcome .scene > .photo', {
          scale: 1.18,
          transformOrigin: '52% 44%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#welcome',
            start: '48% top',
            end: 'bottom top',
            scrub: 0.4,
          },
        })

        // 2. Port at a glance: harbour settles from zoom, photo pushes down to berth
        gsap.fromTo(
          '#glance > .photo img',
          { scale: 1.1, yPercent: 0 },
          {
            scale: 1,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#glance',
              start: 'top bottom',
              end: 'top top',
              scrub: 0.4,
            },
          },
        )

        gsap.to('#glance > .photo img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#understand',
            start: 'top bottom',
            end: 'top top',
            scrub: 0.4,
          },
        })

        // 3. Understand: berth parallax, timeline line draws and amber dot rolls with scroll
        gsap.fromTo(
          '#understand > .photo img',
          { yPercent: -14, scale: 1.07 },
          {
            yPercent: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#understand > .photo',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        )

        const timelineEl = document.querySelector<HTMLElement>('#understand .timeline')
        if (timelineEl) {
          gsap.fromTo(
            '#understand .timeline-track',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineEl,
                start: 'top 74%',
                end: 'bottom 68%',
                scrub: 0.4,
              },
            },
          )

          gsap.fromTo(
            '#understand .timeline-dot',
            { y: 0 },
            {
              y: () => Math.max(0, timelineEl.offsetHeight - 14),
              ease: 'none',
              scrollTrigger: {
                trigger: timelineEl,
                start: 'top 74%',
                end: 'bottom 68%',
                scrub: 0.4,
              },
            },
          )
        }

        // Handover 3 -> 4: Dark wipes up to paper
        gsap.fromTo(
          '#finance',
          { clipPath: 'inset(6% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: '#finance',
              start: 'top 94%',
              end: 'top 38%',
              scrub: 0.4,
            },
          },
        )

        // Handover 4 -> 5: Red bar grows until it fills the screen
        gsap.fromTo(
          '#finance .red-wipe',
          { scaleX: 0.14, scaleY: 0.08, transformOrigin: 'right bottom' },
          {
            scaleX: 1,
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#finance .red-wipe',
              start: 'top 95%',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        )

        // Handover 5 -> 6: Red shrinks to a point on the night globe
        gsap.fromTo(
          '#explorer .swot-iris',
          { clipPath: 'circle(85% at 50% 44%)' },
          {
            clipPath: 'circle(0% at 50% 44%)',
            ease: 'none',
            scrollTrigger: {
              trigger: '#explorer',
              start: 'top 88%',
              end: 'top 18%',
              scrub: 0.4,
            },
          },
        )

        gsap.fromTo(
          '#explorer [data-globe]',
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#explorer',
              start: 'top 88%',
              end: 'top 15%',
              scrub: 0.4,
            },
          },
        )

        gsap.to('#explorer .explorer-stage', {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: '#market',
            start: 'top bottom',
            end: 'top top',
            scrub: 0.4,
          },
        })

        // 7 -> 8: Market dims to night
        gsap.fromTo(
          '#market .night-dim',
          { opacity: 0 },
          {
            opacity: 0.92,
            ease: 'none',
            scrollTrigger: {
              trigger: '#market',
              start: 'bottom 88%',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        )

        // 8 -> 9: Night cross-dissolves to hydrogen dawn
        gsap.to('#pulse > .photo img', {
          opacity: 0.22,
          ease: 'none',
          scrollTrigger: {
            trigger: '#pipeline',
            start: 'top bottom',
            end: 'top top',
            scrub: 0.4,
          },
        })

        gsap.fromTo(
          '#pipeline .pipeline-stage img',
          { opacity: 0.22 },
          {
            opacity: 0.52,
            ease: 'none',
            scrollTrigger: {
              trigger: '#pipeline',
              start: 'top 95%',
              end: 'top 25%',
              scrub: 0.4,
            },
          },
        )

        // 9. Pipeline desktop choreography (stepped index, counter-drift grid, MoU slide-in)
        const portItems = gsap.utils.toArray<HTMLElement>('#pipeline [data-pipe-port]')
        const portIndexEl = document.querySelector<HTMLElement>('#pipeline .pipe-index')
        portItems.forEach((item, idx) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 64%',
            end: 'bottom 36%',
            onToggle: self => {
              if (!self.isActive) return
              portItems.forEach((p, j) => p.classList.toggle('is-active', j === idx))
              if (portIndexEl) {
                portIndexEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(portItems.length).padStart(2, '0')}`
              }
            },
          })
        })

        const col0 = gsap.utils.toArray<HTMLElement>('#pipeline [data-pipe-region][data-col="0"]')
        const col1 = gsap.utils.toArray<HTMLElement>('#pipeline [data-pipe-region][data-col="1"]')
        if (col0.length && col1.length) {
          gsap.fromTo(
            col0,
            { y: 18 },
            {
              y: -14,
              ease: 'none',
              scrollTrigger: {
                trigger: '#pipeline .pipe-region-grid',
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 0.4,
              },
            },
          )
          gsap.fromTo(
            col1,
            { y: -12 },
            {
              y: 16,
              ease: 'none',
              scrollTrigger: {
                trigger: '#pipeline .pipe-region-grid',
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 0.4,
              },
            },
          )
        }

        const mouItems = gsap.utils.toArray<HTMLElement>('#pipeline [data-pipe-mou]')
        if (mouItems.length) {
          gsap.from(mouItems, {
            x: -16,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#pipeline .pipe-mous',
              start: 'top 84%',
              toggleActions: 'play none none none',
            },
          })
        }

        // Handover 9 -> 10: Paper rises
        gsap.fromTo(
          '#research',
          { clipPath: 'inset(7% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: '#research',
              start: 'top 94%',
              end: 'top 38%',
              scrub: 0.4,
            },
          },
        )

        // 11 -> 12. Ship returns, Depart slow scale 1.08 to 1
        gsap.fromTo(
          '#depart > .photo img',
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#depart',
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.4,
            },
          },
        )
      }

      // --- SHARED ONE-SHOT REVEALS (lightweight on phones: <= 0.5s, no scrub, no x translation, opacity >= 0.6) ---
      const countNodes = gsap.utils.toArray<HTMLElement>('#glance [data-count-val]')
      if (countNodes.length) {
        let counted = false
        ScrollTrigger.create({
          trigger: '#glance .facts',
          start: 'top 82%',
          onEnter: () => {
            if (counted) return
            counted = true
            countNodes.forEach((el, idx) => {
              const target = Number(el.dataset.countVal ?? '0')
              const digits = Number(el.dataset.countDigits ?? '0')
              const prefix = el.dataset.countPrefix ?? ''
              const proxy = { v: 0 }
              gsap.to(proxy, {
                v: target,
                duration: isDesktop ? 0.78 : 0.48,
                delay: idx * 0.05,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = prefix + num(digits === 0 ? Math.round(proxy.v) : proxy.v, digits)
                },
                onComplete: () => {
                  el.textContent = prefix + num(target, digits)
                },
              })
            })
          },
        })
      }

      const tlItems = gsap.utils.toArray<HTMLElement>('#understand .timeline li')
      tlItems.forEach((item, idx) => {
        if (isDesktop) {
          gsap.from(item, {
            x: idx % 2 === 0 ? -16 : 16,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          })
        }
        ScrollTrigger.create({
          trigger: item,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: self => {
            if (self.isActive) {
              tlItems.forEach((el, j) => el.classList.toggle('is-active', j === idx))
            }
          },
        })
      })

      gsap.from('#understand [data-row-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.45,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#understand .rows',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // 4. Financial intelligence panels & charts
      const panels = gsap.utils.toArray<HTMLElement>('[data-finance-panel]')
      panels.forEach((panel, index) => {
        if (index === 0) panel.classList.add('is-active')
        ScrollTrigger.create({
          trigger: panel,
          start: isDesktop ? 'top 74%' : 'top 64%',
          end: isDesktop ? 'bottom 26%' : 'bottom 36%',
          onToggle: self => {
            if (self.isActive) {
              panels.forEach(p => p.classList.remove('is-active'))
              panel.classList.add('is-active')
            }
          },
        })

        const bars = panel.querySelectorAll<SVGElement>('[data-bar]')
        if (bars.length) {
          gsap.from(bars, {
            scaleY: 0,
            transformOrigin: (_i, el) => ((el as Element).classList.contains('neg') ? 'center top' : 'center bottom'),
            duration: 0.45,
            stagger: { each: 0.04, from: 'end' },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }

        const stackBars = panel.querySelectorAll('[data-stack-bar]')
        if (stackBars.length) {
          gsap.from(stackBars, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.45,
            stagger: 0.025,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }

        const rowBars = panel.querySelectorAll('[data-row-bar]')
        if (rowBars.length) {
          gsap.from(rowBars, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }
      })

      // 5. SWOT screens (no opacity < 0.6)
      gsap.utils.toArray<HTMLElement>('[data-swot-screen]').forEach(screen => {
        const letter = screen.querySelector('.swot-letter')
        const items = screen.querySelectorAll('li')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: screen,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
        if (letter) {
          tl.from(letter, { y: 18, scale: 0.94, duration: 0.42, ease: 'power2.out' })
        }
        if (items.length) {
          tl.from(items, { y: 12, opacity: 0.65, duration: 0.38, stagger: 0.06, ease: 'power2.out' }, '<0.08')
        }
      })

      // 6. Explorer rows
      gsap.from('#explorer [data-row-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#explorer .two',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // 7. Market rows & CPPI bars
      gsap.from('#market [data-row-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.45,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#market .rows',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      const marketBars = gsap.utils.toArray<SVGElement>('#market [data-bar]')
      if (marketBars.length) {
        gsap.from(marketBars, {
          scaleY: 0,
          transformOrigin: 'center bottom',
          duration: 0.45,
          stagger: { each: 0.04, from: 'end' },
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#market .chart',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }

      // 8. Pulse voices & facts (opacity >= 0.6, no x slide on phones)
      const pulseTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#pulse .voices',
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })
      pulseTl
        .from('#pulse .voices li', {
          y: 12,
          opacity: 0.65,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        })
        .from(
          '#pulse .facts > div',
          {
            y: 12,
            opacity: 0.65,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.1',
        )

      // 9. Pipeline forecast lines & rows (lightweight on both desktop & phone)
      const forecastLines = gsap.utils.toArray<SVGPolylineElement>('#pipeline [data-forecast-line]')
      if (forecastLines.length) {
        forecastLines.forEach(line => {
          const len = line.getTotalLength()
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.to(forecastLines, {
          strokeDashoffset: 0,
          duration: 0.48,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#pipeline .forecast-chart',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }

      gsap.from('#pipeline [data-row-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#pipeline .rows',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // 10. Research
      gsap.from('#research .timeline li', {
        y: 10,
        duration: 0.36,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#research .timeline',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })

      // 11. Next (What to change & Work opportunities)
      const fixItems = gsap.utils.toArray<HTMLElement>('#next [data-fix-item]')
      fixItems.forEach((item, idx) => {
        const rule = item.querySelector('.fix-rule')
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.42,
            delay: idx * 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        }
        ScrollTrigger.create({
          trigger: item,
          start: 'top 64%',
          end: 'bottom 36%',
          onToggle: self => {
            if (self.isActive) {
              fixItems.forEach((el, j) => el.classList.toggle('is-focus', j === idx))
            }
          },
        })
      })

      if (isDesktop) {
        const workRows = gsap.utils.toArray<HTMLElement>('#next [data-work-row]')
        if (workRows.length) {
          gsap.from(workRows, {
            x: -14,
            duration: 0.42,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#next .work-list',
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          })
        }
      }

      const raf = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh()
      })
      document.fonts?.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh()
      })

      return () => {
        disposed = true
        cancelAnimationFrame(raf)
      }
    },
  )

  return () => mm.revert()
}
