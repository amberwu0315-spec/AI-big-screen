import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type PageTransitionProps = {
  children: ReactNode
  className?: string
  disableOpacity?: boolean
  exitVariant?: 'fade' | 'slide-up'
  variant?: 'fade' | 'slide-up'
}

export function PageTransition({
  children,
  className,
  disableOpacity = false,
  exitVariant,
  variant = 'fade',
}: PageTransitionProps) {
  const isSlideUp = variant === 'slide-up'
  const shouldExitUp = exitVariant === 'slide-up'

  if (disableOpacity) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={isSlideUp ? { opacity: 1, y: '100%' } : { opacity: 0 }}
      animate={isSlideUp ? { opacity: 1, y: 0 } : { opacity: 1 }}
      exit={shouldExitUp ? { opacity: 1, y: '-100%' } : { opacity: 0, y: 0 }}
      transition={isSlideUp ? { duration: 0.46, ease: [0.22, 1, 0.36, 1] } : { duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

