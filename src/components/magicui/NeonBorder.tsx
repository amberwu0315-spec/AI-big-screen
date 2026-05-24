import { motion } from 'framer-motion'
import { useId } from 'react'

type NeonBorderProps = {
  borderWidth?: number
  duration?: number
  drawSpeed?: number
  finalOpacity?: number
  height?: number
  radius?: number
  width?: number
  className?: string
  color1?: string
  color2?: string
  draw?: boolean
  progress?: number
}

function getRoundedRectPerimeter(width: number, height: number, radius: number) {
  return 2 * (width + height - 4 * radius) + 2 * Math.PI * radius
}

export function NeonBorder({
  borderWidth = 6,
  duration,
  drawSpeed = 407,
  finalOpacity = 1,
  height = 540,
  radius = 28,
  width = 450,
  className,
  color1 = '#54E8FF',
  color2 = '#8B5CF6',
  draw = true,
  progress,
}: NeonBorderProps) {
  const gradientId = useId().replace(/:/g, '')
  const inset = borderWidth / 2
  const safeRadius = Math.min(radius, (width - borderWidth) / 2, (height - borderWidth) / 2)
  const animationDuration = duration ?? getRoundedRectPerimeter(width, height, safeRadius) / drawSpeed

  const pathD = `
    M ${inset + safeRadius} ${inset}
    H ${width - inset - safeRadius}
    Q ${width - inset} ${inset} ${width - inset} ${inset + safeRadius}
    V ${height - inset - safeRadius}
    Q ${width - inset} ${height - inset} ${width - inset - safeRadius} ${height - inset}
    H ${inset + safeRadius}
    Q ${inset} ${height - inset} ${inset} ${height - inset - safeRadius}
    V ${inset + safeRadius}
    Q ${inset} ${inset} ${inset + safeRadius} ${inset}
    Z
  `

  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ''}`}>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>

        <motion.path
          animate={
            progress !== undefined
              ? { pathLength: progress / 100, opacity: finalOpacity }
              : { pathLength: 1, opacity: finalOpacity }
          }
          className="drop-shadow-none"
          d={pathD}
          initial={
            progress !== undefined
              ? { pathLength: 0, opacity: 1 }
              : { pathLength: draw ? 0 : 1, opacity: 1 }
          }
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={borderWidth}
          transition={
            progress !== undefined
              ? { duration: 0.08, ease: 'linear' }
              : {
                  pathLength: { duration: draw ? animationDuration : 0, ease: 'linear' },
                  opacity: { delay: draw ? animationDuration : 0, duration: draw ? 0.3 : 0, ease: 'linear' },
                }
          }
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
