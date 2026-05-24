import { forwardRef } from 'react'
import { motion } from 'framer-motion'

import { Ripple } from '@/components/magicui/Ripple'
import logoUrl from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

type AICenterNodeProps = {
  showRipple?: boolean
  rippleKey?: number
  isActive?: boolean
}

export const AICenterNode = forwardRef<HTMLElement, AICenterNodeProps>(function AICenterNode(
  { showRipple = false, rippleKey = 0, isActive = false },
  ref,
) {
  return (
    <>
      {showRipple ? <Ripple key={rippleKey} circleCount={3} /> : null}
      <motion.section
        ref={ref}
        animate={
          isActive
            ? {
                filter: 'brightness(1.03)',
                scale: 1.02,
              }
            : {
                filter: 'brightness(1)',
                scale: 1,
              }
        }
        className={cn(
          'absolute left-1/2 top-1/2 z-30 flex h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center',
        )}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 rounded-full bg-[#12ABB9] opacity-10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(158,223,231,0.12)]" />
        <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[radial-gradient(circle_at_50%_45%,#EEF2F4_0%,#EAEFF2_100%)] shadow-[0_12px_30px_rgba(0,0,0,0.18),inset_0_2px_8px_rgba(0,0,0,0.10)]">
          <div className="absolute left-1/2 top-1/2 h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(207,231,234,0.12)]" />
          <img alt="AI Core" className="relative z-10 h-[104px] w-[116px] object-contain" src={logoUrl} />
        </div>
      </motion.section>
    </>
  )
})
