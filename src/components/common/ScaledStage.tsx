import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const TOUCH_SCREEN_DESIGN_WIDTH = 1920
export const TOUCH_SCREEN_DESIGN_HEIGHT = 1080

type FitScaleOptions = {
  baseHeight?: number
  baseWidth?: number
  maxScale?: number
  minScale?: number
  safeInsetX?: number
  safeInsetY?: number
}

type FitScaleResult = {
  height: number
  isMeasured: boolean
  scale: number
  width: number
}

const DEFAULT_MIN_SCALE = 0.1

export function getFitScale({
  baseHeight = TOUCH_SCREEN_DESIGN_HEIGHT,
  baseWidth = TOUCH_SCREEN_DESIGN_WIDTH,
  height,
  maxScale = Number.POSITIVE_INFINITY,
  minScale = DEFAULT_MIN_SCALE,
  safeInsetX = 0,
  safeInsetY = 0,
  width,
}: FitScaleOptions & { height: number; width: number }) {
  const availableWidth = Math.max(1, width - safeInsetX * 2)
  const availableHeight = Math.max(1, height - safeInsetY * 2)

  return Math.min(
    maxScale,
    Math.max(
      minScale,
      Math.min(availableWidth / baseWidth, availableHeight / baseHeight),
    ),
  )
}

export function useViewportFitScale(options: FitScaleOptions = {}): FitScaleResult {
  const {
    baseHeight = TOUCH_SCREEN_DESIGN_HEIGHT,
    baseWidth = TOUCH_SCREEN_DESIGN_WIDTH,
    maxScale = Number.POSITIVE_INFINITY,
    minScale = DEFAULT_MIN_SCALE,
    safeInsetX = 0,
    safeInsetY = 0,
  } = options
  const [result, setResult] = useState<FitScaleResult>(() => {
    if (typeof window === 'undefined') {
      return { height: baseHeight, isMeasured: false, scale: 1, width: baseWidth }
    }

    return {
      height: window.innerHeight,
      isMeasured: true,
      scale: getFitScale({ baseHeight, baseWidth, height: window.innerHeight, maxScale, minScale, safeInsetX, safeInsetY, width: window.innerWidth }),
      width: window.innerWidth,
    }
  })

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const scale = getFitScale({ baseHeight, baseWidth, height, maxScale, minScale, safeInsetX, safeInsetY, width })

      setResult((current) => {
        if (
          current.isMeasured &&
          current.width === width &&
          current.height === height &&
          Math.abs(current.scale - scale) <= 0.005
        ) {
          return current
        }

        return { height, isMeasured: true, scale, width }
      })
    }

    const updateScaleAfterFullscreen = () => window.requestAnimationFrame(updateScale)

    updateScale()
    window.addEventListener('resize', updateScale)
    document.addEventListener('fullscreenchange', updateScaleAfterFullscreen)
    document.addEventListener('webkitfullscreenchange', updateScaleAfterFullscreen)
    document.addEventListener('appfullscreenchange', updateScaleAfterFullscreen)

    return () => {
      window.removeEventListener('resize', updateScale)
      document.removeEventListener('fullscreenchange', updateScaleAfterFullscreen)
      document.removeEventListener('webkitfullscreenchange', updateScaleAfterFullscreen)
      document.removeEventListener('appfullscreenchange', updateScaleAfterFullscreen)
    }
  }, [baseHeight, baseWidth, maxScale, minScale, safeInsetX, safeInsetY])

  return result
}

export function useElementFitScale(options: FitScaleOptions = {}) {
  const {
    baseHeight = TOUCH_SCREEN_DESIGN_HEIGHT,
    baseWidth = TOUCH_SCREEN_DESIGN_WIDTH,
    maxScale = Number.POSITIVE_INFINITY,
    minScale = DEFAULT_MIN_SCALE,
    safeInsetX = 0,
    safeInsetY = 0,
  } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState<FitScaleResult>({ height: baseHeight, isMeasured: false, scale: 1, width: baseWidth })

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const updateScale = () => {
      const { height, width } = container.getBoundingClientRect()
      const scale = getFitScale({ baseHeight, baseWidth, height, maxScale, minScale, safeInsetX, safeInsetY, width })

      setResult((current) => {
        if (
          current.isMeasured &&
          current.width === width &&
          current.height === height &&
          Math.abs(current.scale - scale) <= 0.005
        ) {
          return current
        }

        return { height, isMeasured: true, scale, width }
      })
    }

    updateScale()
    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [baseHeight, baseWidth, maxScale, minScale, safeInsetX, safeInsetY])

  return { containerRef, ...result }
}

type ScaledStageProps = FitScaleOptions & {
  children: ReactNode
  className?: string
  contentClassName?: string
  origin?: 'center' | 'top-left'
}

export function ScaledStage({
  baseHeight = TOUCH_SCREEN_DESIGN_HEIGHT,
  baseWidth = TOUCH_SCREEN_DESIGN_WIDTH,
  children,
  className,
  contentClassName,
  maxScale,
  minScale,
  origin = 'center',
  safeInsetX,
  safeInsetY,
}: ScaledStageProps) {
  const { containerRef, isMeasured, scale } = useElementFitScale({ baseHeight, baseWidth, maxScale, minScale, safeInsetX, safeInsetY })
  const isTopLeft = origin === 'top-left'

  return (
    <div ref={containerRef} className={cn('relative h-full min-h-0 w-full overflow-hidden', className)}>
      <div
        className={cn('absolute', isTopLeft ? 'left-0 top-0' : 'left-1/2 top-1/2', contentClassName)}
        style={{
          height: baseHeight,
          opacity: isMeasured ? 1 : 0,
          transform: isTopLeft ? `scale(${scale})` : `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: isTopLeft ? 'left top' : 'center center',
          width: baseWidth,
        }}
      >
        {children}
      </div>
    </div>
  )
}
