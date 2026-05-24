import { useEffect, useRef } from 'react'

type Particle = {
  alpha: number
  radius: number
  vx: number
  vy: number
  x: number
  y: number
}

type ParticlesProps = {
  className?: string
  color?: string
  ease?: number
  quantity?: number
  refresh?: boolean
}

function hexToRgb(color: string) {
  const normalized = color.replace('#', '')

  if (normalized.length !== 6) {
    return { b: 255, g: 255, r: 255 }
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function Particles({
  className,
  color = '#ffffff',
  ease = 80,
  quantity = 100,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    let animationFrameId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    const rgb = hexToRgb(color)

    const createParticles = () => {
      particles = Array.from({ length: quantity }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.28 + 0.08,
      }))
    }

    const resize = () => {
      const parent = canvas.parentElement

      if (!parent) {
        return
      }

      width = parent.clientWidth
      height = parent.clientHeight
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles()
    }

    const render = () => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx * (ease / 80)
        particle.y += particle.vy * (ease / 80)

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.alpha})`
        context.fill()
      }

      animationFrameId = window.requestAnimationFrame(render)
    }

    resize()
    render()

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [color, ease, quantity, refresh])

  return <canvas ref={canvasRef} className={className} />
}
