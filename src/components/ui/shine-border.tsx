import { cn } from '@/lib/utils'

type ShineBorderProps = {
  borderWidth?: number
  className?: string
  duration?: number
  shineColor?: string | string[]
}

export function ShineBorder({
  borderWidth = 3,
  className,
  duration = 7,
  shineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) ? shineColor : [shineColor]
  const gradientStops = colors.length > 1
    ? colors.join(', ')
    : `${colors[0]}, ${colors[0]}`

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-[-3px] rounded-[inherit] opacity-0 blur-[8px] transition-opacity duration-300 group-hover:opacity-70',
          className,
        )}
        style={{
          animation: `shine-border-spin ${duration}s linear infinite`,
          background: `conic-gradient(from var(--shine-border-angle), transparent 0deg, ${gradientStops}, transparent 360deg)`,
          padding: borderWidth + 2,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-90',
          className,
        )}
        style={{
          animation: `shine-border-spin ${duration}s linear infinite`,
          background: `conic-gradient(from var(--shine-border-angle), transparent 0deg, ${gradientStops}, transparent 360deg)`,
          padding: borderWidth,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </>
  )
}
