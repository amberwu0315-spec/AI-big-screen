import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'

import './GooeyNav.css'

interface GooeyNavItem {
  label: string
  href: string
}

export interface GooeyNavProps {
  items: GooeyNavItem[]
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: number[]
  initialActiveIndex?: number
  activeIndex?: number
  onItemSelect?: (item: GooeyNavItem, index: number) => void
}

export function GooeyNav({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  activeIndex,
  onItemSelect,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(initialActiveIndex)
  const currentActiveIndex = activeIndex ?? internalActiveIndex

  const noise = (n = 1) => n / 2 - Math.random() * n

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10)
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    }
  }

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances
    const r = particleR
    const bubbleTime = animationTime * 2 + timeVariance
    element.style.setProperty('--time', `${bubbleTime}ms`)

    for (let i = 0; i < particleCount; i += 1) {
      const t = animationTime * 2 + noise(timeVariance * 2)
      const p = createParticle(i, t, d, r)
      element.classList.remove('active')

      setTimeout(() => {
        const particle = document.createElement('span')
        const point = document.createElement('span')
        particle.classList.add('particle')
        particle.style.setProperty('--start-x', `${p.start[0]}px`)
        particle.style.setProperty('--start-y', `${p.start[1]}px`)
        particle.style.setProperty('--end-x', `${p.end[0]}px`)
        particle.style.setProperty('--end-y', `${p.end[1]}px`)
        particle.style.setProperty('--time', `${p.time}ms`)
        particle.style.setProperty('--scale', `${p.scale}`)
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`)
        particle.style.setProperty('--rotate', `${p.rotate}deg`)

        point.classList.add('point')
        particle.appendChild(point)
        element.appendChild(particle)
        requestAnimationFrame(() => {
          element.classList.add('active')
        })
        setTimeout(() => {
          try {
            element.removeChild(particle)
          } catch {
            // Do nothing
          }
        }, t)
      }, 30)
    }
  }

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const pos = element.getBoundingClientRect()

    // Calculate scale factors to handle CSS transform scaling (e.g. scale-[1.2])
    const scaleX = containerRef.current.offsetWidth > 0 
      ? containerRect.width / containerRef.current.offsetWidth 
      : 1
    const scaleY = containerRef.current.offsetHeight > 0 
      ? containerRect.height / containerRef.current.offsetHeight 
      : 1

    const styles = {
      left: `${(pos.x - containerRect.x) / scaleX}px`,
      top: `${(pos.y - containerRect.y) / scaleY}px`,
      width: `${pos.width / scaleX}px`,
      height: `${pos.height / scaleY}px`,
    }
    Object.assign(filterRef.current.style, styles)
  }

  const activateItem = (element: HTMLElement, index: number, emit = true) => {
    if (currentActiveIndex === index && emit) return

    setInternalActiveIndex(index)
    updateEffectPosition(element)

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle')
      particles.forEach((p) => filterRef.current?.removeChild(p))
    }

    if (filterRef.current) {
      makeParticles(filterRef.current)
    }

    if (emit) {
      onItemSelect?.(items[index], index)
    }
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!onItemSelect) return

    e.preventDefault()
    activateItem(e.currentTarget.parentElement ?? e.currentTarget, index)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (!onItemSelect) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activateItem(e.currentTarget.parentElement ?? e.currentTarget, index)
    }
  }

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return undefined
    const activeLi = navRef.current.querySelectorAll('li')[currentActiveIndex] as HTMLElement
    if (activeLi) {
      updateEffectPosition(activeLi)
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[currentActiveIndex] as HTMLElement
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi)
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [currentActiveIndex])

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <svg aria-hidden="true" className="gooey-nav-filter-defs" focusable="false">
        <filter id="gooey-nav-filter">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="5" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="goo"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={currentActiveIndex === index ? 'active' : ''}>
              <a href={item.href} onClick={(e) => handleClick(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
    </div>
  )
}
