import { useEffect, useRef } from 'react'

type PixelCardActivationOverlayProps = {
  active: boolean
  gap?: number
  speed?: number
  colors?: string[]
}

class Pixel {
  private readonly width: number
  private readonly height: number
  private readonly ctx: CanvasRenderingContext2D
  private readonly x: number
  private readonly y: number
  private readonly color: string
  private readonly speed: number
  private size: number
  private readonly sizeStep: number
  private readonly minSize: number
  private readonly maxSizeInteger: number
  private readonly maxSize: number
  private readonly delay: number
  private counter: number
  private readonly counterStep: number
  private isReverse: boolean
  private isShimmer: boolean

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    this.sizeStep = Math.random() * 0.8
    this.minSize = 1
    this.maxSizeInteger = 4
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isReverse = false
    this.isShimmer = false
  }

  private getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }

    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }

  appear() {
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }

    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }

    this.draw()
  }
}

function getEffectiveSpeed(value: number) {
  const min = 0
  const max = 100
  const throttle = 0.001

  if (value <= min) {
    return min
  }

  if (value >= max) {
    return max * throttle
  }

  return value * throttle
}

export function PixelCardActivationOverlay({
  active,
  gap = 8,
  speed = 28,
  colors = ['#E2F8FF', '#BDEFFF', '#54E8FF'],
}: PixelCardActivationOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const animationRef = useRef<number | null>(null)
  const timePreviousRef = useRef(performance.now())
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const initPixels = () => {
      const parent = canvas.parentElement
      if (!parent) {
        return
      }

      const rect = parent.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)
      const ctx = canvas.getContext('2d')

      if (!ctx || width <= 0 || height <= 0) {
        return
      }

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const nextPixels: Pixel[] = []

      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)]
          const dx = x - width / 2
          const dy = y - height / 2
          const distance = Math.sqrt(dx * dx + dy * dy)

          nextPixels.push(
            new Pixel(canvas, ctx, x, y, color, getEffectiveSpeed(speed), distance),
          )
        }
      }

      pixelsRef.current = nextPixels
    }

    initPixels()

    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = new ResizeObserver(() => {
      initPixels()
    })

    if (canvas.parentElement) {
      resizeObserverRef.current.observe(canvas.parentElement)
    }

    return () => {
      resizeObserverRef.current?.disconnect()
    }
  }, [colors, gap, speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return undefined
    }

    const stop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (!active) {
      stop()
      return stop
    }

    timePreviousRef.current = performance.now()

    const tick = () => {
      animationRef.current = requestAnimationFrame(tick)

      const timeNow = performance.now()
      const timePassed = timeNow - timePreviousRef.current
      const timeInterval = 1000 / 60

      if (timePassed < timeInterval) {
        return
      }

      timePreviousRef.current = timeNow - (timePassed % timeInterval)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const pixel of pixelsRef.current) {
        pixel.appear()
      }
    }

    animationRef.current = requestAnimationFrame(tick)

    return stop
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
