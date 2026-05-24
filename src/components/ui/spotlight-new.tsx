import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
  variant?: 'cyan' | 'white'
}

const spotlightStyles = {
  cyan: {
    center:
      'bg-[radial-gradient(ellipse_at_center,rgba(120,218,228,0.22)_0%,rgba(120,218,228,0.10)_28%,rgba(120,218,228,0.04)_52%,transparent_72%)]',
    left:
      'bg-[linear-gradient(180deg,rgba(234,242,245,0.18)_0%,rgba(103,214,227,0.08)_44%,transparent_80%)]',
    right:
      'bg-[linear-gradient(180deg,rgba(234,242,245,0.14)_0%,rgba(18,171,185,0.07)_48%,transparent_82%)]',
  },
  white: {
    center:
      'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.09)_28%,rgba(255,255,255,0.035)_52%,transparent_72%)]',
    left:
      'bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_44%,transparent_80%)]',
    right:
      'bg-[linear-gradient(180deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.055)_48%,transparent_82%)]',
  },
}

export function Spotlight({ className, variant = 'cyan' }: SpotlightProps) {
  const styles = spotlightStyles[variant]

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full overflow-hidden',
        className,
      )}
      initial={{ opacity: 0.58 }}
      animate={{ opacity: [0.46, 0.66, 0.46] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className={cn(
          'absolute left-1/2 top-[-36%] h-[78%] w-[54%] -translate-x-1/2 rounded-full blur-[70px]',
          styles.center,
        )}
        animate={{ x: ['-7%', '7%', '-7%'], y: ['0%', '4%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={cn(
          'absolute left-[18%] top-[-18%] h-[58%] w-[36%] rotate-[-18deg] rounded-full blur-[42px]',
          styles.left,
        )}
        animate={{ x: ['0%', '12%', '0%'], opacity: [0.42, 0.62, 0.42] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={cn(
          'absolute right-[14%] top-[-22%] h-[62%] w-[34%] rotate-[17deg] rounded-full blur-[48px]',
          styles.right,
        )}
        animate={{ x: ['0%', '-10%', '0%'], opacity: [0.34, 0.54, 0.34] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
