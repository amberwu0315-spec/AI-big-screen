import type { ReactNode } from 'react'
import { BxnDashboardSectionCard } from '@/components/bxn-big-screen/bxn-dashboard-section-card'
import { BxnPanelEmptyState } from '@/components/bxn-big-screen/bxn-panel-empty-state'
import { cn } from '@/lib/utils'
import type { BxnRankingItem } from './bxn-types'

export interface BxnFactoryRankingPanelProps {
  data: Array<BxnRankingItem>
  title?: ReactNode
  description?: string
  headerAside?: ReactNode
  summary?: {
    label: string
    value: string
  } | null
  tone?: 'dark' | 'light'
  valueFormatter?: (value: number) => string
  className?: string
  contentClassName?: string
  barGradient?: string
  showCollapsedSummary?: boolean
  showSummary?: boolean
  listStyle?: 'card' | 'plain'
  showRankBadge?: boolean
  progressScale?: 'max' | 'fixed'
  progressMax?: number
  density?: 'default' | 'compact'
}

const toneClassMap = {
  dark: {
    card: undefined,
    summary: 'border-border/50 bg-card/35 text-muted-foreground',
    summaryValue: 'text-foreground',
    item: 'border-border/35 bg-card/30',
    rankBadge: 'border-border/60 bg-background/60 text-foreground',
    itemLabel: 'text-foreground',
    itemValue: 'text-muted-foreground',
    collapsed:
      'border-dashed border-border/50 bg-card/30 text-muted-foreground',
    defaultBarGradient:
      'linear-gradient(90deg, var(--chart-palette-1) 0%, var(--chart-palette-5) 100%)',
  },
  light: {
    card: undefined,
    summary: 'border-border/50 bg-card/45 text-muted-foreground',
    summaryValue: 'text-foreground',
    item: 'border-border/40 bg-card/40',
    rankBadge: 'border-border/60 bg-background/70 text-foreground',
    itemLabel: 'text-foreground',
    itemValue: 'text-muted-foreground',
    collapsed:
      'border-dashed border-border/50 bg-card/45 text-muted-foreground',
    defaultBarGradient:
      'linear-gradient(90deg, var(--chart-palette-1) 0%, var(--chart-palette-5) 100%)',
  },
} as const

export function BxnFactoryRankingPanel({
  data,
  title = '工厂排行',
  description = '',
  headerAside,
  summary,
  tone = 'dark',
  valueFormatter = formatNumber,
  className,
  contentClassName,
  barGradient,
  showCollapsedSummary = true,
  showSummary = true,
  listStyle = 'card',
  showRankBadge = true,
  progressScale = 'max',
  progressMax = 100,
  density = 'default',
}: BxnFactoryRankingPanelProps) {
  const resolvedSummary =
    summary === undefined
      ? {
          label: '按产品碳足迹由高到低',
          value: '单位 kgCO₂e',
        }
      : summary

  const sortedData = [...data].sort((a, b) => b.value - a.value)
  const topItems = sortedData.slice(0, 5)
  const moreCount = Math.max(sortedData.length - topItems.length, 0)
  const maxValue = Math.max(...topItems.map((item) => item.value), 1)
  const progressDenominator =
    progressScale === 'fixed' ? Math.max(progressMax, 1) : Math.max(maxValue, 1)
  const toneClasses = toneClassMap[tone]
  const isPlainList = listStyle === 'plain'
  const isCompact = density === 'compact'
  const hasItems = topItems.length > 0

  return (
    <BxnDashboardSectionCard
      title={title}
      description={description}
      cardUnstyled={tone === 'light'}
      variant="module"
      density={density}
      headerAside={headerAside}
      descriptionClassName="text-xs leading-4"
      titleClassName="!text-lg font-semibold text-foreground"
      className={cn(toneClasses.card, className)}
      contentClassName={cn('flex min-h-0 flex-1 flex-col', contentClassName)}
    >
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          isCompact ? 'gap-2' : 'gap-2.5',
        )}
      >
        {showSummary && resolvedSummary ? (
          <div
            className={cn(
              'shrink-0 rounded-md border px-2.5 py-1.5 text-xs leading-4',
              toneClasses.summary,
            )}
          >
            <div className="flex items-center justify-between gap-2.5">
              <span>{resolvedSummary.label}</span>
              <span className={cn('font-medium', toneClasses.summaryValue)}>
                {resolvedSummary.value}
              </span>
            </div>
          </div>
        ) : null}

        {hasItems ? (
          <div
            className={cn(
              'min-h-0 flex-1',
              isPlainList && (isCompact ? 'pt-0.5' : 'pt-1'),
            )}
          >
            <div
              className={cn(
                'flex min-h-0 flex-col',
                isPlainList ? (isCompact ? 'gap-0.5' : 'gap-1') : 'gap-1.5',
              )}
            >
              {topItems.map((item, index) => {
                const width = `${Math.min((item.value / progressDenominator) * 100, 100)}%`

                return (
                  <article
                    key={item.name}
                    className={cn(
                      isPlainList
                        ? cn(
                            'border-0 bg-transparent px-0',
                            isCompact ? 'pb-2 pt-1.5' : 'pb-2.5 pt-2',
                          )
                        : 'rounded-lg border px-2.5 py-2',
                      !isPlainList && toneClasses.item,
                    )}
                  >
                    <div
                      className={cn(
                        'gap-2.5',
                        showRankBadge ? 'flex items-start' : 'block',
                      )}
                    >
                      {showRankBadge ? (
                        <span
                          className={cn(
                            'mt-0.5 inline-flex size-5 items-center justify-center rounded-full border text-xs font-medium',
                            toneClasses.rankBadge,
                          )}
                        >
                          {index + 1}
                        </span>
                      ) : null}

                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={cn(
                              'truncate text-sm font-medium leading-tight',
                              toneClasses.itemLabel,
                            )}
                          >
                            {item.name}
                          </div>

                          <div
                            className={cn(
                              'shrink-0 font-medium tracking-tight',
                              isPlainList
                                ? isCompact
                                  ? 'text-sm'
                                  : 'text-sm'
                                : 'text-xs',
                              toneClasses.itemValue,
                            )}
                          >
                            {valueFormatter(item.value)}
                          </div>
                        </div>

                        <div
                          className={cn(
                            'h-1.5 overflow-hidden rounded-full',
                            isPlainList
                              ? isCompact
                                ? 'mt-1'
                                : 'mt-1.5'
                              : 'mt-1.5',
                            'bg-muted/50',
                          )}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width,
                              background:
                                barGradient ?? toneClasses.defaultBarGradient,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ) : (
          <BxnPanelEmptyState
            title="暂无产品碳足迹排行数据"
            description="当前筛选条件下暂无可展示产品。"
            className="my-auto"
          />
        )}

        {hasItems && showCollapsedSummary && moreCount > 0 ? (
          <div
            className={cn(
              'shrink-0 rounded-lg border px-2.5 py-1.5 text-xs leading-4',
              toneClasses.collapsed,
            )}
          >
            其他 {moreCount} 项收起展示
          </div>
        ) : hasItems ? (
          <div
            className={cn(
              'shrink-0 rounded-full',
              isCompact ? 'h-1.5' : 'h-2',
              'bg-transparent',
            )}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </BxnDashboardSectionCard>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4,
  }).format(value)
}
