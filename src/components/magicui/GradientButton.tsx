import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  bgColor?: string
  blur?: number
  borderRadius?: number
  borderWidth?: number
  children: ReactNode
  colors?: string[]
  duration?: number
}

const defaultColors = [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#008000',
  '#0000FF',
  '#4B0082',
  '#EE82EE',
  '#FF0000',
]

export function GradientButton({
  bgColor = '#000',
  blur = 4,
  borderRadius = 8,
  borderWidth = 2,
  children,
  className,
  colors = defaultColors,
  duration = 2500,
  style,
  type = 'button',
  ...props
}: GradientButtonProps) {
  const innerBorderRadius = Math.max(borderRadius - borderWidth, 0)
  const buttonStyle = {
    '--gradient-button-blur': `${blur}px`,
    '--gradient-button-border-width': `${borderWidth}px`,
    '--gradient-button-colors': colors.join(', '),
    '--gradient-button-duration': `${duration}ms`,
    borderRadius,
    padding: borderWidth,
    ...style,
  } as CSSProperties

  return (
    <button
      className={cn(
        'gradient-button-animate relative flex min-h-10 min-w-28 items-center justify-center overflow-hidden',
        className,
      )}
      style={buttonStyle}
      type={type}
      {...props}
    >
      <span
        className="relative z-0 inline-flex size-full items-center justify-center px-[clamp(1.1rem,1.83vw,2.2rem)] py-[clamp(0.55rem,1.02vh,1.1rem)]"
        style={{
          backgroundColor: bgColor,
          borderRadius: innerBorderRadius,
        }}
      >
        {children}
      </span>
    </button>
  )
}
