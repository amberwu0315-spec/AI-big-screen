import { Building2 } from 'lucide-react'
import { BxnDashboardSectionCard } from '@/components/bxn-big-screen/bxn-dashboard-section-card'
import { BxnPanelEmptyState } from '@/components/bxn-big-screen/bxn-panel-empty-state'
import { cn } from '@/lib/utils'
import type { BxnKpiItem } from './bxn-types'

export interface BxnKpiOverviewPanelProps {
  metrics: Array<BxnKpiItem>
  className?: string
  density?: 'default' | 'compact'
}

export function BxnKpiOverviewPanel({
  metrics,
  className,
  density = 'default',
}: BxnKpiOverviewPanelProps) {
  const forceInlineUnitMetricIds = new Set(['total-carbon', 'carbon-target'])
  const statusMetric = metrics.find((metric) => metric.emphasis === 'status')
  const numericMetrics = metrics.filter(
    (metric) => metric.id !== statusMetric?.id,
  )
  const heroMetrics = numericMetrics.slice(0, 2)
  const supportMetrics = numericMetrics.slice(2)
  const isCompact = density === 'compact'
  const hasMetrics = heroMetrics.length > 0 || supportMetrics.length > 0

  return (
    <BxnDashboardSectionCard
      title={
        <span className="inline-flex items-center gap-1.5 leading-none">
          <Building2 className="size-5 shrink-0 text-current" />
          <span className="leading-none">组织级综合数据</span>
        </span>
      }
      description=""
      cardUnstyled
      variant="module"
      density={density}
      descriptionClassName={cn(
        'text-xs font-medium tracking-wider text-muted-foreground uppercase',
        isCompact && 'tracking-wide',
      )}
      titleClassName="!text-lg font-semibold text-foreground"
      contentClassName={cn(
        'flex min-h-0 flex-col',
        isCompact ? 'gap-2' : 'gap-3',
      )}
      className={cn('h-full', className)}
    >
      {hasMetrics ? (
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col',
            isCompact ? 'gap-2' : 'gap-3',
          )}
        >
          <div
            className={cn('grid grid-cols-2', isCompact ? 'gap-2' : 'gap-3.5')}
          >
            {heroMetrics.map((metric) => (
              <article
                key={metric.id}
                className={cn('px-0', isCompact ? 'py-0.5' : 'py-1')}
              >
                <div
                  className={cn(
                    'font-medium text-foreground/90',
                    isCompact ? 'text-xs' : 'text-sm',
                  )}
                >
                  {metric.label}
                </div>
                <div
                  className={cn(
                    'flex items-end gap-1.5',
                    forceInlineUnitMetricIds.has(metric.id)
                      ? 'flex-nowrap whitespace-nowrap'
                      : 'flex-wrap',
                    isCompact ? 'mt-1' : 'mt-2',
                  )}
                >
                  <div
                    className={cn(
                      'leading-none font-semibold tracking-tight text-primary',
                      isCompact ? 'text-2xl' : 'text-4xl',
                    )}
                  >
                    {metric.value}
                  </div>
                  {metric.unit ? (
                    <div
                      className={cn(
                        'shrink-0 self-end pb-0.5 leading-none text-muted-foreground',
                        isCompact ? 'text-xs' : 'text-sm',
                      )}
                    >
                      {metric.unit}
                    </div>
                  ) : null}
                </div>
                {!isCompact && metric.hint ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {metric.hint}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div
            className={cn(
              'grid grid-cols-2 border-t border-border/50',
              isCompact ? 'gap-x-3.5 gap-y-2 pt-2' : 'gap-x-6 gap-y-3 pt-3.5',
            )}
          >
            {supportMetrics.map((metric, index) => (
              <article
                key={metric.id}
                className={cn(
                  'min-w-0',
                  isCompact ? 'flex flex-col gap-0.5' : 'flex flex-col gap-1.5',
                  index > 1 && 'pt-1',
                )}
              >
                <div
                  className={cn(
                    'font-medium text-muted-foreground',
                    isCompact ? 'text-xs' : 'text-sm',
                  )}
                >
                  {metric.label}
                </div>
                <div className="flex flex-wrap items-end gap-1">
                  <div
                    className={cn(
                      'leading-none font-semibold tracking-tight text-foreground',
                      isCompact ? 'text-lg' : 'text-2xl',
                    )}
                  >
                    {metric.value}
                  </div>
                  {metric.unit ? (
                    <div
                      className={cn(
                        'self-end pb-0.5 leading-none text-muted-foreground',
                        isCompact ? 'text-xs' : 'text-sm',
                      )}
                    >
                      {metric.unit}
                    </div>
                  ) : null}
                </div>
                {!isCompact && metric.hint ? (
                  <div className="text-xs text-muted-foreground">
                    {metric.hint}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : (
        <BxnPanelEmptyState
          title="暂无组织级综合数据"
          description="当前筛选条件下暂无可展示指标。"
          className="my-auto"
        />
      )}

      {hasMetrics && statusMetric ? (
        <footer
          className={cn(
            'mt-auto shrink-0 border-t border-border/50',
            isCompact ? 'min-h-10 pt-2' : 'min-h-12 pt-3.5',
          )}
        >
          <div
            className={cn(
              'flex flex-wrap items-center justify-between',
              isCompact ? 'gap-2.5' : 'gap-4',
            )}
          >
            <div
              className={cn('flex flex-col', isCompact ? 'gap-0.5' : 'gap-1.5')}
            >
              <div
                className={cn(
                  'font-medium text-foreground',
                  isCompact ? 'text-xs' : 'text-sm',
                )}
              >
                {statusMetric.label}
              </div>
              {!isCompact && statusMetric.hint ? (
                <div className="text-xs text-muted-foreground">
                  {statusMetric.hint}
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                'inline-flex items-center rounded-full border border-primary/35 bg-primary/10 font-semibold tracking-wide text-primary shadow-sm backdrop-blur-md',
                isCompact ? 'px-2.5 py-1 text-sm' : 'px-4 py-1.5 text-lg',
              )}
            >
              {statusMetric.value}
            </div>
          </div>
        </footer>
      ) : null}
    </BxnDashboardSectionCard>
  )
}
