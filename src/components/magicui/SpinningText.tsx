import { useId, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SpinningTextProps = {
  children: ReactNode
  className?: string
  duration?: number
  gradientFrom?: string
  gradientTo?: string
  radius?: number
  size?: number
  style?: CSSProperties
}

export function SpinningText({
  children,
  className,
  duration = 24,
  gradientFrom = '#4CCD99',
  gradientTo = '#55CFFF',
  radius = 118,
  size = 280,
  style,
}: SpinningTextProps) {
  const id = useId().replace(/:/g, '')
  const center = size / 2

  return (
    <svg
      aria-hidden="true"
      className={cn('spinning-text select-none overflow-visible', className)}
      style={{ ...style, animationDuration: `${duration}s` }}
      viewBox={`0 0 ${size} ${size}`}
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0" x2={size} y1={center} y2={center} gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientFrom} />
          <stop offset="1" stopColor={gradientTo} />
        </linearGradient>
        <path
          id={`${id}-path`}
          d={`M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
        />
      </defs>
      <text
        fill={`url(#${id}-gradient)`}
        fontSize="16"
        fontWeight="600"
        letterSpacing="4"
        opacity="0.92"
      >
        <textPath href={`#${id}-path`} startOffset="0%">
          {children}
        </textPath>
      </text>
    </svg>
  )
}
