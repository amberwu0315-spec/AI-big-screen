import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ScreenShellProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
  variant?: 'dark' | 'light'
}

export function ScreenShell({
  children,
  className,
  contentClassName,
  variant = 'light',
}: ScreenShellProps) {
  return (
    <main
      data-app-screen="true"
      className={cn(
        'min-h-screen w-screen overflow-hidden',
        variant === 'dark'
          ? 'bg-[#07111f] text-white'
          : 'bg-white text-slate-950',
        className,
      )}
    >
      <div
        className={cn(
          'relative flex min-h-screen w-screen flex-col overflow-hidden px-10 py-[30px]',
          'supports-[height:100dvh]:min-h-dvh',
          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  )
}
