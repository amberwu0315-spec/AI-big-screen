import { Link } from 'react-router-dom'

import { GooeyNav } from '@/components/ability/GooeyNav'
import {
  getAbilitySectionLabel,
  getAbilitySectionOrder,
  type Ability,
  type AbilitySectionKey,
} from '@/data/abilities'
import { cn } from '@/lib/utils'

type AbilitySectionTabsProps = {
  ability: Ability
  activeSection: AbilitySectionKey
  appearance?: 'filled' | 'plain'
  className?: string
  inline?: boolean
  onSectionSelect?: (section: AbilitySectionKey) => void
}

export function AbilitySectionTabs({
  ability,
  activeSection,
  appearance: _appearance,
  className,
  inline = false,
  onSectionSelect,
}: AbilitySectionTabsProps) {
  void _appearance
  const sectionOrder = getAbilitySectionOrder(ability)
  const activeIndex = Math.max(0, sectionOrder.findIndex((item) => item === activeSection))
  const navItems = sectionOrder.map((item) => ({
    label: getAbilitySectionLabel(ability, item),
    href: `/ability/${ability.id}/${item}`,
  }))

  return (
    <div className={cn(inline ? 'flex h-[clamp(48px,5.19vh,56px)] -translate-y-[3px] items-center justify-center' : 'fixed left-1/2 top-[calc((clamp(64px,9.26vh,100px)-clamp(48px,5.19vh,56px))/2)] z-50 flex h-[clamp(48px,5.19vh,56px)] -translate-x-1/2 scale-[1.2] origin-top items-center justify-center', className)}>
      <GooeyNav
        items={navItems}
        animationTime={600}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        initialActiveIndex={0}
        activeIndex={activeIndex}
        onItemSelect={(_, index) => {
          const nextSection = sectionOrder[index]

          if (nextSection && onSectionSelect) {
            // 延迟跳转，给粒子爆炸特效留出展示时间
            setTimeout(() => {
              onSectionSelect(nextSection)
            }, 400)
          }
        }}
      />
      {!onSectionSelect ? (
        <div className="sr-only">
          {sectionOrder.map((item) => (
            <Link key={item} to={`/ability/${ability.id}/${item}`}>
              {getAbilitySectionLabel(ability, item)}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
