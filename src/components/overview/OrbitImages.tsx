import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type OrbitImage = {
  alt?: string
  src: string
}

type OrbitImagesProps = {
  baseWidth?: number
  className?: string
  duration?: number
  images: OrbitImage[]
  itemSize?: number
  radiusX?: number
  radiusY?: number
  rotation?: number
  showTrack?: boolean
  trackClassName?: string
}

export function OrbitImages({
  baseWidth = 1400,
  className,
  duration = 30,
  images,
  itemSize = 104,
  radiusX = 600,
  radiusY = 110,
  rotation = 0,
  showTrack = false,
  trackClassName,
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [scale, setScale] = useState(1)
  const center = baseWidth / 2

  useEffect(() => {
    const updateScale = () => {
      const width = containerRef.current?.clientWidth ?? baseWidth
      setScale(width / baseWidth)
    }

    updateScale()
    const resizeObserver = new ResizeObserver(updateScale)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [baseWidth])

  useEffect(() => {
    let animationFrameId = 0
    let startTime: number | null = null

    const tick = (currentTime: number) => {
      startTime ??= currentTime
      const elapsed = (currentTime - startTime) / 1000
      setProgress((elapsed % duration) / duration)
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrameId)
  }, [duration])

  const itemPositions = useMemo(() => {
    const rotationRadians = (rotation * Math.PI) / 180

    return images.map((image, index) => {
      const angle = ((progress + index / images.length) % 1) * Math.PI * 2
      const rawX = Math.cos(angle) * radiusX
      const rawY = Math.sin(angle) * radiusY
      const rotatedX = rawX * Math.cos(rotationRadians) - rawY * Math.sin(rotationRadians)
      const rotatedY = rawX * Math.sin(rotationRadians) + rawY * Math.cos(rotationRadians)

      return {
        image,
        left: center + rotatedX - itemSize / 2,
        top: center + rotatedY - itemSize / 2,
      }
    })
  }, [baseWidth, images, itemSize, progress, radiusX, radiusY, rotation])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute left-1/2 top-1/2 z-[3] aspect-square w-[min(100vw,100vh)] -translate-x-1/2 -translate-y-1/2 select-none', className)}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          height: baseWidth,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          width: baseWidth,
        }}
      >
        {showTrack ? (
          <div
            className={cn(
              'absolute rounded-full border border-white/15 shadow-[0_0_34px_rgba(85,207,255,0.14),inset_0_0_22px_rgba(76,205,153,0.08)]',
              trackClassName,
            )}
            style={{
              height: radiusY * 2,
              left: center - radiusX,
              top: center - radiusY,
              width: radiusX * 2,
            }}
          />
        ) : null}
        {itemPositions.map(({ image, left, top }, index) => (
          <img
            key={`${image.src}-${index}`}
            alt={image.alt ?? ''}
            className="absolute object-contain will-change-transform"
            draggable={false}
            src={image.src}
            style={{
              height: itemSize,
              left,
              top,
              width: itemSize,
            }}
          />
        ))}
      </div>
    </div>
  )
}
