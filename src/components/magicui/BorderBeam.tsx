import { motion } from 'framer-motion'
import { useMemo } from 'react'

type BorderBeamProps = {
  size?: number
  duration?: number
  delay?: number
  borderWidth?: number
  className?: string
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  glowBlur?: number
  startOffset?: number
}

export function BorderBeam({
  size = 250,
  duration = 12,
  delay = 0,
  borderWidth = 2,
  className,
  colorFrom = '#54E8FF',
  colorTo = '#BDEFFF',
  reverse = false,
  glowBlur = 8,
  startOffset = 0,
}: BorderBeamProps) {
  const beamStyle = useMemo(
    () =>
      ({
        width: size,
        aspectRatio: '1 / 1',
        offsetPath: 'rect(0 auto auto 0 round 28px)',
        offsetRotate: '0deg',
      }) as React.CSSProperties,
    [size],
  )

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className ?? ''}`}
      style={{
        padding: borderWidth,
        maskImage:
          'linear-gradient(transparent, transparent), linear-gradient(white, white)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
        WebkitMaskImage:
          'linear-gradient(transparent, transparent), linear-gradient(white, white)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'xor',
      }}
    >
      <motion.div
        animate={{
          offsetDistance: reverse ? [`${startOffset}%`, `${startOffset - 100}%`] : [`${startOffset}%`, `${startOffset + 100}%`],
        }}
        className="absolute left-0 top-0 rounded-full opacity-95"
        style={{
          ...beamStyle,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent 70%)`,
          filter: `blur(${glowBlur}px)`,
        }}
        transition={{
          duration,
          delay,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <motion.div
        animate={{
          offsetDistance: reverse ? [`${startOffset}%`, `${startOffset - 100}%`] : [`${startOffset}%`, `${startOffset + 100}%`],
        }}
        className="absolute left-0 top-0 rounded-full"
        style={{
          ...beamStyle,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent 72%)`,
        }}
        transition={{
          duration,
          delay,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
    </div>
  )
}
