import { cn } from '@/lib/utils'

import type { AbilityPageScheme } from './AbilityPageFrame'

type AbilitySchemeSwitcherProps = {
  activeScheme: AbilityPageScheme
  onChange: (scheme: AbilityPageScheme) => void
}

const schemeOptions: Array<{ id: AbilityPageScheme; label: string }> = [
  { id: 'one', label: '方案一' },
  { id: 'two', label: '方案二' },
]

export function AbilitySchemeSwitcher({ activeScheme, onChange }: AbilitySchemeSwitcherProps) {
  return (
    <div className="fixed bottom-10 right-10 z-50 flex items-center gap-4">
      {schemeOptions.map((scheme) => (
        <button
          key={scheme.id}
          className={cn(
            'text-control font-medium text-white/60 transition-colors hover:text-white',
            activeScheme === scheme.id ? 'text-white' : '',
          )}
          type="button"
          onClick={() => onChange(scheme.id)}
        >
          {scheme.label}
        </button>
      ))}
    </div>
  )
}
