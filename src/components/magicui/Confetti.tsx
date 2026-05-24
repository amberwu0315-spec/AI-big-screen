import { forwardRef, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

export type ConfettiRef = {
  fire: (options?: Record<string, never>) => void
}

type ConfettiProps = {
  angle?: number
  className?: string
  onMouseEnter?: () => void
  originX?: number
  originY?: number
  particleCount?: number
  speedMultiplier?: number
  spread?: number
}

type Particle = {
  color: string
  gravity: number
  rotation: number
  rotationSpeed: number
  size: number
  tilt: number
  velocityX: number
  velocityY: number
  x: number
  y: number
}

const confettiColors = ['#54E8FF', '#4CCD99', '#8B5CF6', '#FFC414', '#FE8FB5', '#FFFFFF']

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(function Confetti(
  {
    angle = -Math.PI / 2,
    className,
    onMouseEnter,
    originX: originXRatio = 0.5,
    originY: originYRatio = 0.42,
    particleCount = 140,
    speedMultiplier = 1,
    spread = Math.PI * 1.25,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  const draw = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    context.clearRect(0, 0, width, height)
    particlesRef.current = particlesRef.current
      .map((particle) => ({
        ...particle,
        rotation: particle.rotation + particle.rotationSpeed,
        velocityY: particle.velocityY + particle.gravity,
        x: particle.x + particle.velocityX,
        y: particle.y + particle.velocityY,
      }))
      .filter((particle) => particle.y < height + 40)

    particlesRef.current.forEach((particle) => {
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.rotation)
      context.fillStyle = particle.color
      context.fillRect(
        -particle.size / 2,
        -particle.tilt / 2,
        particle.size,
        particle.tilt,
      )
      context.restore()
    })

    if (particlesRef.current.length > 0) {
      animationRef.current = window.requestAnimationFrame(draw)
    } else {
      animationRef.current = null
    }
  }

  const fire = () => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const originX = (rect.width * dpr) * originXRatio
    const originY = (rect.height * dpr) * originYRatio

    particlesRef.current = Array.from({ length: particleCount }, (_, index) => {
      const particleAngle = angle + (Math.random() - 0.5) * spread
      const speed = (8 + Math.random() * 11) * speedMultiplier

      return {
        color: confettiColors[index % confettiColors.length],
        gravity: 0.26 + Math.random() * 0.12,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.28,
        size: 8 + Math.random() * 9,
        tilt: 4 + Math.random() * 6,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        x: originX,
        y: originY,
      }
    })

    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current)
    }

    draw()
  }

  useImperativeHandle(ref, () => ({ fire }))

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none', className)}
      onMouseEnter={onMouseEnter}
    />
  )
})
