import { motion, useReducedMotion } from 'framer-motion'
import { createContext, useContext, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type BlurRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  inView?: boolean
  revealKey?: string | number
  viewportAmount?: number
}

type BlurRevealScopeProps = {
  children: ReactNode
  revealKey?: string | number
}

const BlurRevealKeyContext = createContext<string | number | undefined>(undefined)

export function BlurRevealScope({ children, revealKey }: BlurRevealScopeProps) {
  return <BlurRevealKeyContext.Provider value={revealKey}>{children}</BlurRevealKeyContext.Provider>
}

const hiddenState = {
  opacity: 0,
  transform: 'translateY(18px) scale(0.985)',
}

const visibleState = {
  opacity: 1,
  transform: 'translateY(0px) scale(1)',
}

export function BlurReveal({ children, className, delay = 0, duration = 0.75, inView = false, revealKey, viewportAmount = 0.35 }: BlurRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const scopedRevealKey = useContext(BlurRevealKeyContext)
  const resolvedRevealKey = revealKey ?? scopedRevealKey

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      key={resolvedRevealKey}
      className={cn('will-change-[opacity,transform]', className)}
      initial={hiddenState}
      animate={inView ? undefined : visibleState}
      whileInView={inView ? visibleState : undefined}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={inView ? { amount: viewportAmount, once: true } : undefined}
    >
      {children}
    </motion.div>
  )
}
