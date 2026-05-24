import { useEffect, useRef } from 'react'

import { backgroundConfig } from './backgroundConfig'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

function createSeededRandom(seed: number) {
  let value = seed % 2147483647

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function createParticles(width: number, height: number): Particle[] {
  const { config, seed } = backgroundConfig.particles
  const random = createSeededRandom(seed + Math.round(width) + Math.round(height))

  return Array.from({ length: config.amount }, () => {
    const angle = random() * Math.PI * 2
    const velocity = config.speed.min + random() * (config.speed.max - config.speed.min)

    return {
      x: random() * width,
      y: random() * height,
      vx: Math.cos(angle) * velocity + config.drift.x,
      vy: Math.sin(angle) * velocity + config.drift.y,
      size: config.size.min + random() * (config.size.max - config.size.min),
      opacity: config.opacity.min + random() * (config.opacity.max - config.opacity.min),
    }
  })
}

export function WhiteParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number>(0)
  const fpsInterval = 1000 / backgroundConfig.particles.config.fps

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement

    if (!canvas || !parent) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const pixelRatio = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio))
      canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      particlesRef.current = createParticles(rect.width, rect.height)
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    const draw = (time: number) => {
      const elapsed = time - previousTimeRef.current

      if (elapsed < fpsInterval) {
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      previousTimeRef.current = time - (elapsed % fpsInterval)

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      const delta = Math.min(elapsed / 1000, 0.08)

      context.clearRect(0, 0, width, height)
      context.fillStyle = backgroundConfig.particles.config.color

      for (const particle of particlesRef.current) {
        particle.x += particle.vx * delta * 30
        particle.y += particle.vy * delta * 30

        if (particle.x < -particle.size) {
          particle.x = width + particle.size
        } else if (particle.x > width + particle.size) {
          particle.x = -particle.size
        }

        if (particle.y < -particle.size) {
          particle.y = height + particle.size
        } else if (particle.y > height + particle.size) {
          particle.y = -particle.size
        }

        context.globalAlpha = particle.opacity
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }

      context.globalAlpha = 1
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      resizeObserver.disconnect()

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [fpsInterval])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
