import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: ReactNode
  className?: string
  pauseOnHover?: boolean
  reverse?: boolean
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  reverse = false,
}: MarqueeProps) {
  const animationStyle = {
    animationName: reverse ? 'marquee-reverse' : 'marquee',
    animationDuration: 'var(--duration, 20s)',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        'group flex overflow-hidden [--gap:1rem] [gap:var(--gap)]',
        className,
      )}
    >
      {[0, 1].map((copyIndex) => (
        <div
          key={copyIndex}
          className={cn(
            'flex min-w-max shrink-0 justify-around [gap:var(--gap)]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={animationStyle}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
