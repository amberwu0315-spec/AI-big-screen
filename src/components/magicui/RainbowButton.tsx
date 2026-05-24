import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type RainbowButtonProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
  return (
    <span
      className={cn(
        'group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-[0.875em] p-[2px] text-sm font-medium text-white shadow-[0_8px_22px_rgba(0,210,255,0.14)] transition hover:scale-[1.02] active:scale-[0.99]',
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-[linear-gradient(90deg,#4CCD99_0%,#55CFFF_100%)]" />
      <span className="relative inline-flex h-full w-full items-center justify-center rounded-[0.625em] bg-[#070B10]/92 px-5 backdrop-blur transition group-hover:bg-[#070B10]/82">
        {children}
      </span>
    </span>
  )
}
