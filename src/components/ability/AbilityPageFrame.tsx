import { cn } from '@/lib/utils'

export type AbilityPageScheme = 'one' | 'two'

type AbilityPageFrameProps = {
  abilityId: string
  scheme?: AbilityPageScheme
}

export function AbilityPageFrame({ scheme = 'one' }: AbilityPageFrameProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden',
        scheme === 'two' ? 'h-[237.5vw] min-h-[300vh]' : 'h-[300vh]',
      )}
      data-scheme={scheme}
    >
      <div className="absolute inset-0 bg-[#0B0B0F]" />
    </div>
  )
}
