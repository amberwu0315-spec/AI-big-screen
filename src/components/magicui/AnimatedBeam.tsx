import { useEffect, useId, useState, type RefObject } from 'react'

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  duration?: number
  pathColor?: string
  beamColor?: string
  pathStrokeWidth?: number
  beamStrokeWidth?: number
  active?: boolean
  playKey?: number
}

type Point = {
  x: number
  y: number
}

const cornerRadius = 8

function formatPoint(point: Point) {
  return `${point.x} ${point.y}`
}

function roundedPolylinePath(points: Point[], radius = cornerRadius) {
  if (points.length < 2) {
    return ''
  }

  const commands = [`M ${formatPoint(points[0])}`]

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const next = points[index + 1]
    const previousLength = Math.hypot(current.x - previous.x, current.y - previous.y)
    const nextLength = Math.hypot(next.x - current.x, next.y - current.y)
    const cornerOffset = Math.min(radius, previousLength / 2, nextLength / 2)

    if (cornerOffset <= 0) {
      commands.push(`L ${formatPoint(current)}`)
      continue
    }

    const beforeCorner = {
      x: current.x - ((current.x - previous.x) / previousLength) * cornerOffset,
      y: current.y - ((current.y - previous.y) / previousLength) * cornerOffset,
    }
    const afterCorner = {
      x: current.x + ((next.x - current.x) / nextLength) * cornerOffset,
      y: current.y + ((next.y - current.y) / nextLength) * cornerOffset,
    }

    commands.push(`L ${formatPoint(beforeCorner)}`)
    commands.push(`Q ${formatPoint(current)} ${formatPoint(afterCorner)}`)
  }

  commands.push(`L ${formatPoint(points[points.length - 1])}`)

  return commands.join(' ')
}

function getOrthogonalPoints(start: Point, end: Point, curvature: number) {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y

  if (Math.abs(deltaY) < 24) {
    return [start, end]
  }

  const elbowX = start.x + deltaX / 2 + curvature * 0.12

  return [
    start,
    { x: elbowX, y: start.y },
    { x: elbowX, y: end.y },
    end,
  ]
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3.8,
  pathColor = 'rgba(125, 211, 252, 0.18)',
  beamColor = 'rgba(103, 232, 249, 0.78)',
  pathStrokeWidth = 1.5,
  beamStrokeWidth = 2,
  active = true,
  playKey = 0,
}: AnimatedBeamProps) {
  const gradientId = useId().replace(/:/g, '')
  const [points, setPoints] = useState<{ start: Point; end: Point; elbows: Point[] }>()

  useEffect(() => {
    const updatePoints = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current

      if (!container || !from || !to) {
        return
      }

      const containerRect = container.getBoundingClientRect()
      const fromRect = from.getBoundingClientRect()
      const toRect = to.getBoundingClientRect()
      const fromCenter = {
        x: fromRect.left + fromRect.width / 2 - containerRect.left,
        y: fromRect.top + fromRect.height / 2 - containerRect.top,
      }
      const toCenter = {
        x: toRect.left + toRect.width / 2 - containerRect.left,
        y: toRect.top + toRect.height / 2 - containerRect.top,
      }
      const isFromLeftSide = fromCenter.x < toCenter.x
      const targetSlot =
        fromCenter.y < toCenter.y - 70 ? 0.28 : fromCenter.y > toCenter.y + 70 ? 0.72 : 0.5
      const start = {
        x: (isFromLeftSide ? fromRect.right : fromRect.left) - containerRect.left,
        y: fromCenter.y,
      }
      const end = {
        x: (isFromLeftSide ? toRect.left : toRect.right) - containerRect.left,
        y: toRect.top + toRect.height * targetSlot - containerRect.top,
      }
      const orthogonalPoints = getOrthogonalPoints(start, end, curvature)

      setPoints({
        start,
        end,
        elbows: orthogonalPoints.slice(1, -1),
      })
    }

    updatePoints()

    const resizeObserver = new ResizeObserver(updatePoints)
    ;[containerRef.current, fromRef.current, toRef.current].forEach((item) => {
      if (item) {
        resizeObserver.observe(item)
      }
    })
    window.addEventListener('resize', updatePoints)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePoints)
    }
  }, [containerRef, curvature, fromRef, toRef])

  if (!points) {
    return null
  }

  const path = roundedPolylinePath([points.start, ...points.elbows, points.end])
  const gradientStart = reverse ? points.end : points.start
  const gradientEnd = reverse ? points.start : points.end

  return (
    <svg className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible">
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={gradientStart.x}
          x2={gradientEnd.x}
          y1={gradientStart.y}
          y2={gradientEnd.y}
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor={beamColor} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={pathColor} strokeWidth={pathStrokeWidth} />
      {active ? (
        <path
          key={playKey}
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeDasharray="90 420"
          strokeLinecap="round"
          strokeWidth={beamStrokeWidth}
        >
          <animate
            attributeName="stroke-dashoffset"
            dur={`${duration}s`}
            from={reverse ? '-510' : '510'}
            repeatCount="1"
            to="0"
          />
        </path>
      ) : null}
    </svg>
  )
}
