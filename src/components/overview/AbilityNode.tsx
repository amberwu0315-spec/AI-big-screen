import { forwardRef } from 'react'
import {
  BarChart3,
  BookOpen,
  Cloud,
  FileText,
  Leaf,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

import type { Ability } from '@/data/abilities'
import { cn } from '@/lib/utils'

type AbilityNodeProps = {
  ability: Ability
  className?: string
  disabled?: boolean
  isActive?: boolean
  isDimmed?: boolean
  onSelect?: (abilityId: string) => void
}

const abilityIcons: Record<string, LucideIcon> = {
  cbam: ShieldCheck,
  energy: Cloud,
  'supply-chain': BookOpen,
  esg: BarChart3,
  'carbon-assets': Leaf,
  'carbon-accounting': FileText,
}

export const AbilityNode = forwardRef<HTMLButtonElement, AbilityNodeProps>(function AbilityNode(
  { ability, className, disabled = false, isActive = false, isDimmed = false, onSelect },
  ref,
) {
  const Icon = abilityIcons[ability.id] ?? FileText

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={() => onSelect?.(ability.id)}
      type="button"
      className={cn(
        'group absolute z-10 h-[198px] w-[180px] bg-transparent text-center transition-opacity duration-300',
        isActive ? 'opacity-100' : '',
        isDimmed ? 'opacity-0' : 'opacity-100',
        disabled ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
    >
      <span className="absolute left-1/2 top-0 block h-[140px] w-[140px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[rgba(22,29,36,0.82)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-12px_30px_rgba(0,0,0,0.10),0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-[14px] transition-[border-color,transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-[rgba(18,171,185,0.28)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-12px_30px_rgba(0,0,0,0.10),0_22px_52px_rgba(0,0,0,0.26)]">
        <span className="absolute inset-x-8 top-0 h-px bg-white/10" />
        <span className="absolute bottom-[-34px] left-1/2 h-[82px] w-[112px] -translate-x-1/2 rounded-full bg-[#D8EAF0] opacity-15 blur-[55px] group-hover:bg-[#12ABB9] group-hover:opacity-20" />
        <span
          className={cn(
            'absolute left-1/2 top-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] bg-white/[0.035] text-[#EAF2F5]/90 transition-colors duration-300',
            isActive ? 'text-[#67D6E3]' : 'group-hover:text-[#67D6E3]',
          )}
        >
          <Icon className="h-[34px] w-[34px] stroke-[1.8]" />
        </span>
      </span>
      <span className="text-control absolute bottom-0 left-1/2 flex h-[46px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-[12px] bg-[rgba(17,22,29,0.75)] px-[18px] font-medium text-[#F2F5F7] shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
        {ability.name}
      </span>
    </button>
  )
})
