import type { ReactNode } from 'react'

import { ShineBorder } from '@/components/ui/shine-border'
import { cn } from '@/lib/utils'

type AbilityGlowCardProps = {
  children?: ReactNode
  className?: string
  contentClassName?: string
  hideContent?: boolean
  size?: 'auto' | 'sm' | 'md' | 'lg' | 'feature'
}

const cardSizeClassNames = {
  auto: '',
  feature: 'h-[clamp(360px,36vh,460px)] w-full',
  lg: 'min-h-[clamp(320px,32vh,420px)] w-full',
  md: 'min-h-[clamp(288px,28vh,360px)] w-full',
  sm: 'h-[clamp(230px,24vh,292px)] w-[clamp(400px,23vw,520px)]',
}

export function AbilityGlowCard({ children, className, contentClassName, hideContent = false, size = 'auto' }: AbilityGlowCardProps) {
  return (
    <div className={cn('ui-card-chrome group relative', cardSizeClassNames[size], className)}>
      <ShineBorder
        borderWidth={3}
        duration={7}
        shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
      />
      <div
        aria-hidden={hideContent || undefined}
        className={cn('ui-card-content relative h-full overflow-hidden', hideContent && 'invisible', contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}
