import { cn } from '@/lib/utils'
import type { BxnSceneMarker } from './bxn-types'

export interface BxnSceneStatusItem {
  label: string
  value: string
}

export interface BxnSceneVisualPanelProps {
  markers: Array<BxnSceneMarker>
  statusItems: Array<BxnSceneStatusItem>
  className?: string
}

export function BxnSceneVisualPanel({
  markers,
  statusItems,
  className,
}: BxnSceneVisualPanelProps) {
  return (
    <section
      aria-label="报喜鸟静态园区主视觉"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-lg',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[url('/carbon-screen/baoxiniao-campus-bg.png')] bg-cover bg-[center_52%] bg-no-repeat" />

      <div className="absolute inset-0 z-10" aria-hidden="true">
        {markers.map((marker, index) => (
          <div
            key={`${marker.label}-${index}`}
            className={cn(
              'absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-[0.72rem]',
              index % 2 === 1 && 'flex-row-reverse',
            )}
            style={{
              top: marker.top,
              left: marker.left,
            }}
          >
            <span className="relative inline-flex size-4 items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-[color-mix(in_oklch,var(--primary)_20%,transparent)] before:shadow-[0_0_0_8px_color-mix(in_oklch,var(--primary)_8%,transparent)] before:content-['']">
              <span className="relative size-2 rounded-full border-2 border-[color-mix(in_oklch,var(--background)_86%,transparent)] bg-[color-mix(in_oklch,var(--primary)_86%,var(--accent))] shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_14%,transparent),0_0_18px_color-mix(in_oklch,var(--primary)_30%,transparent)]" />
            </span>
            <span
              className={cn(
                'h-px w-[2.15rem] bg-[linear-gradient(90deg,color-mix(in_oklch,var(--primary)_56%,transparent),transparent_100%)]',
                index % 2 === 1 &&
                  'bg-[linear-gradient(270deg,color-mix(in_oklch,var(--primary)_56%,transparent),transparent_100%)]',
              )}
            />
            <span className="min-w-[7.25rem] rounded-full border border-[color-mix(in_oklch,var(--border)_66%,transparent)] bg-[color-mix(in_oklch,var(--card)_42%,transparent)] px-[0.92rem] py-[0.45rem] text-[0.72rem] leading-4 text-[color-mix(in_oklch,var(--foreground)_84%,transparent)] shadow-[0_14px_32px_-30px_color-mix(in_oklch,var(--foreground)_22%,transparent)] backdrop-blur-[16px]">
              {marker.label}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-7 bottom-6 z-10">
        <div className="grid grid-cols-3 gap-3 rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--border)_64%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_42%,transparent)_0%,color-mix(in_oklch,var(--background)_28%,transparent)_100%),linear-gradient(90deg,color-mix(in_oklch,var(--border)_16%,transparent)_0%,transparent_16%,transparent_84%,color-mix(in_oklch,var(--border)_16%,transparent)_100%)] px-[1.1rem] pt-[0.95rem] pb-[0.9rem] shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_42%,transparent),0_18px_40px_-38px_color-mix(in_oklch,var(--foreground)_22%,transparent)] backdrop-blur-[18px]">
          {statusItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'min-w-0 border-l border-[color-mix(in_oklch,var(--border)_44%,transparent)] pl-4',
                index === 0 && 'border-l-0 pl-0',
              )}
            >
              <div className="text-[0.64rem] leading-4 font-semibold tracking-[0.18em] text-[color-mix(in_oklch,var(--foreground)_74%,transparent)] uppercase">
                {item.label}
              </div>
              <div className="mt-[0.3rem] truncate text-[1.02rem] leading-[1.4rem] font-medium text-[color-mix(in_oklch,var(--foreground)_90%,transparent)]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
