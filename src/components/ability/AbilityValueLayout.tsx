import { AbilityGlowCard } from '@/components/ability/AbilityGlowCard'
import type { Ability, AbilityContentItem } from '@/data/abilities'

const getTitle = (item: AbilityContentItem) => (typeof item === 'string' ? item : item.title)
const getDescription = (item: AbilityContentItem) => (typeof item === 'string' ? undefined : item.description)

function GainsList({ items }: { items: AbilityContentItem[] }) {
  return (
    <ul className="text-body mt-6 space-y-3 text-left text-slate-600">
      {items.map((item) => (
        <li key={getTitle(item)}>
          {getTitle(item)}
          {getDescription(item) ? <p className="mt-1 text-sm leading-6 text-slate-500">{getDescription(item)}</p> : null}
        </li>
      ))}
    </ul>
  )
}

export function AbilityValueLayout({ ability }: { ability: Ability }) {
  return (
    <div className="relative z-20 flex min-h-[calc(100vh-60px)] flex-col items-center pt-[70px]">
      <div className="relative flex w-[calc(100vw-80px)] flex-1 flex-col">
        <div className="ui-visual-panel absolute left-[100px] top-[24px] z-30 h-[300px] w-[300px]" />

        <AbilityGlowCard className="relative z-20 mt-[96px]" contentClassName="min-h-[clamp(320px,32vh,420px)] p-10" hideContent size="lg">
          <div className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-10">
            <div />
            <div>
              <p className="text-micro font-medium text-emerald-700">{ability.name}</p>
              <h1 className="text-page-title mt-3 font-semibold">得到什么？</h1>
              <GainsList items={ability.value.gains} />
            </div>
          </div>
        </AbilityGlowCard>

        <div className="mt-10 grid flex-1 grid-cols-3 gap-6">
          {ability.value.values.map((value, index) => (
            <AbilityGlowCard
              key={getTitle(value)}
              className="h-full"
              contentClassName="flex flex-col p-8"
              hideContent
              size="md"
            >
              <h2 className="text-card-title font-semibold">价值{index + 1} · {getTitle(value)}</h2>
              <p className="text-body mt-6 text-slate-600">{getDescription(value) ?? getTitle(value)}</p>
            </AbilityGlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}
