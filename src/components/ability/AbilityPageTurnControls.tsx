import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type AbilityPageTurnControlsProps<T extends string = string> = {
  activeSection: T
  className?: string
  onSectionSelect: (section: T) => void
  sectionOrder: readonly T[] | T[]
  iconColor?: string
  showDots?: boolean
  showDisabledButtons?: boolean
  loop?: boolean
}

export function AbilityPageTurnControls<T extends string = string>({
  activeSection,
  className,
  onSectionSelect,
  sectionOrder,
  iconColor,
  showDots = true,
  showDisabledButtons = false,
  loop = false,
}: AbilityPageTurnControlsProps<T>) {
  const activeIndex = Math.max(0, sectionOrder.indexOf(activeSection))
  const previousSection = loop && sectionOrder.length > 1
    ? (sectionOrder[activeIndex - 1] ?? sectionOrder[sectionOrder.length - 1])
    : sectionOrder[activeIndex - 1]
  const nextSection = loop && sectionOrder.length > 1
    ? (sectionOrder[activeIndex + 1] ?? sectionOrder[0])
    : sectionOrder[activeIndex + 1]

  const buttonClassName = cn(
    'pointer-events-auto fixed top-1/2 z-[90] flex size-20 -translate-y-1/2 items-center justify-center rounded-[20px]',
    'border-0 bg-white/[0.08] backdrop-blur-md',
    iconColor ? 'shadow-[0_18px_48px_rgba(0,0,0,0.14)]' : 'text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)]',
    'transition active:scale-95 disabled:pointer-events-none [&_svg]:size-10',
    showDisabledButtons ? 'disabled:opacity-35' : 'disabled:opacity-0',
  )

  return (
    <div className={className}>
      <button
        aria-label="上一页"
        className={cn(buttonClassName, 'left-8')}
        disabled={!previousSection}
        style={iconColor ? { color: iconColor } : undefined}
        type="button"
        onClick={() => previousSection && onSectionSelect(previousSection)}
      >
        <ChevronLeft aria-hidden="true" strokeWidth={2.4} />
      </button>
      <button
        aria-label="下一页"
        className={cn(buttonClassName, 'right-8')}
        disabled={!nextSection}
        style={iconColor ? { color: iconColor } : undefined}
        type="button"
        onClick={() => nextSection && onSectionSelect(nextSection)}
      >
        <ChevronRight aria-hidden="true" strokeWidth={2.4} />
      </button>
      {showDots ? (
        <div className="pointer-events-none fixed bottom-[34px] left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-3">
          {sectionOrder.map((sectionKey, index) => (
            <span
              key={sectionKey}
              className={cn(
                'block h-2.5 rounded-full transition-all',
                index === activeIndex ? 'w-9 bg-white' : 'w-2.5 bg-white/35',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
