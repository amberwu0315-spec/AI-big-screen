import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { getAbilityPageFrameLayoutId } from '@/components/ability/abilityTransition'

type Rect = {
  left: number
  top: number
  width: number
  height: number
}

type OverviewToAbilityTransitionProps = {
  active: boolean
  abilityId: string
  cardRect: Rect
  centerRect: Rect
  containerWidth: number
  containerHeight: number
  curvature: number
  onComplete: () => void
}

const totalDurationMs = 400

export function OverviewToAbilityTransition({
  active,
  abilityId,
  centerRect,
  containerWidth,
  containerHeight,
  onComplete,
}: OverviewToAbilityTransitionProps) {
  useEffect(() => {
    if (!active) {
      return undefined
    }

    const timer = window.setTimeout(onComplete, totalDurationMs)

    return () => window.clearTimeout(timer)
  }, [active, onComplete])

  const frameRect = useMemo(
    () => ({
      left: 0,
      top: 0,
      width: containerWidth,
      height: containerHeight,
    }),
    [containerHeight, containerWidth],
  )

  const revealRadius = useMemo(() => {
    const centerX = centerRect.left + centerRect.width / 2
    const centerY = centerRect.top + centerRect.height / 2
    const corners = [
      { x: 0, y: 0 },
      { x: containerWidth, y: 0 },
      { x: 0, y: containerHeight },
      { x: containerWidth, y: containerHeight },
    ]

    return Math.max(
      ...corners.map((corner) => Math.hypot(corner.x - centerX, corner.y - centerY)),
    )
  }, [centerRect, containerHeight, containerWidth])

  const revealCenter = useMemo(
    () => ({
      x: centerRect.left + centerRect.width / 2,
      y: centerRect.top + centerRect.height / 2,
    }),
    [centerRect],
  )

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 0.3 }}
            className="absolute inset-0 bg-[#05070A]"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
          />

          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 rgba(148,210,255,0)',
                '0 0 60px rgba(148,210,255,0.36)',
                '0 0 24px rgba(148,210,255,0.18)',
              ],
              scale: [1, 1.08, 1.03],
            }}
            className="absolute rounded-full"
            initial={{
              left: centerRect.left,
              top: centerRect.top,
              width: centerRect.width,
              height: centerRect.height,
              scale: 1,
            }}
            transition={{ delay: 0.2, duration: 0.08, ease: 'easeOut' }}
          />

          <motion.div
            animate={{
              backgroundColor: 'rgba(255,255,255,0.94)',
              borderRadius: 0,
              left: frameRect.left,
              top: frameRect.top,
              width: frameRect.width,
              height: frameRect.height,
              opacity: 1,
            }}
            className="absolute bg-white"
            initial={{
              opacity: 0.9,
              backgroundColor: 'rgba(255,255,255,0.22)',
              borderRadius: centerRect.width / 2,
              left: centerRect.left,
              top: centerRect.top,
              width: centerRect.width,
              height: centerRect.height,
            }}
            layoutId={getAbilityPageFrameLayoutId(abilityId)}
            transition={{ delay: 0.28, duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          />

          <motion.div
            animate={{
              clipPath: `circle(${revealRadius}px at ${revealCenter.x}px ${revealCenter.y}px)`,
              opacity: 0.42,
            }}
            className="absolute bg-white"
            initial={{
              clipPath: `circle(${Math.max(centerRect.width * 0.34, 18)}px at ${revealCenter.x}px ${revealCenter.y}px)`,
              opacity: 0,
            }}
            style={{
              left: frameRect.left,
              top: frameRect.top,
              width: frameRect.width,
              height: frameRect.height,
            }}
            transition={{ delay: 0.26, duration: 0.12, ease: [0.22, 0.8, 0.22, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
