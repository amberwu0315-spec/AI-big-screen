import { AbilityGlowCard } from '@/components/ability/AbilityGlowCard'
import type { Ability, AbilityContentItem } from '@/data/abilities'

function DetailList({ items }: { items: AbilityContentItem[] }) {
  const getTitle = (item: AbilityContentItem) => (typeof item === 'string' ? item : item.title)
  const getDescription = (item: AbilityContentItem) => (typeof item === 'string' ? undefined : item.description)

  return (
    <ul className="text-body space-y-3 text-left text-slate-600">
      {items.map((item) => (
        <li key={getTitle(item)}>
          {getTitle(item)}
          {getDescription(item) ? <p className="mt-1 text-sm leading-6 text-slate-500">{getDescription(item)}</p> : null}
        </li>
      ))}
    </ul>
  )
}

function ContentCard({
  title,
  children,
  className = '',
}: {
  title?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <AbilityGlowCard
      className={className}
      contentClassName="flex flex-col p-6"
      hideContent
      size="sm"
    >
      {title ? <h2 className="text-card-title font-semibold">{title}</h2> : null}
      {children}
    </AbilityGlowCard>
  )
}

export function AbilityUnderstandLayout({ ability }: { ability: Ability }) {
  return (
    <div className="relative z-20 flex min-h-[calc(100vh-60px)] items-center justify-center pt-[70px]">
      <div className="flex w-[calc(100vw-80px)] items-center justify-center gap-0">
        <div className="flex flex-col gap-0">
          <div className="relative z-10 translate-x-[40px] -translate-y-[60px]">
            <ContentCard title={ability.understand.whatTitle}>
              <div className="mt-6">
                <DetailList items={ability.understand.what} />
              </div>
            </ContentCard>
          </div>
          <div className="relative z-30 translate-x-[40px] translate-y-[60px]">
            <ContentCard title={ability.understand.scenarioTitle}>
              <div className="mt-6">
                <DetailList items={ability.understand.scenarios} />
              </div>
            </ContentCard>
          </div>
        </div>

        <div className="mx-0 flex flex-[1_1_38vw] flex-col items-center">
          <div className="ui-visual-panel relative z-20 aspect-[4/3] w-full" />
          <div className="text-label-lg mt-5 text-center font-medium text-slate-900">
            {ability.name}
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="relative z-30 -translate-x-[40px] -translate-y-[60px]">
            <ContentCard title="B. 解决什么问题">
              <div className="mt-6">
                <DetailList items={ability.understand.problems} />
              </div>
            </ContentCard>
          </div>
          <div className="relative z-10 -translate-x-[40px] translate-y-[60px]">
            <AbilityGlowCard
              className="ui-placeholder-panel"
              contentClassName="bg-transparent"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
