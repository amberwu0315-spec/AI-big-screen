import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { useState } from 'react'
import type { ReactNode } from 'react'

import type { BxnEmissionStructureItem } from '@/components/bxn-big-screen/bxn-types'
import { BxnDashboardSectionCard } from '@/components/bxn-big-screen/bxn-dashboard-section-card'
import { BxnPanelEmptyState } from '@/components/bxn-big-screen/bxn-panel-empty-state'
import { cn } from '@/lib/utils'

export interface BxnEmissionStructurePanelProps {
  data: Array<BxnEmissionStructureItem>
  title?: string
  description?: string
  chartType?: 'bar' | 'pie'
  headerAside?: ReactNode
  headerClassName?: string
  tone?: 'dark' | 'light'
  className?: string
  contentClassName?: string
  palette?: Array<string>
  totalUnit?: string
  showTotalInHeader?: boolean
  summaryLabel?: string
  legendValueFormatter?: (item: BxnEmissionStructureItem) => string
  centerLabel?: string
  showSummaryShell?: boolean
  legendStyle?: 'card' | 'plain'
  showLegendValue?: boolean
  density?: 'default' | 'compact'
}

const defaultPalette = [
  'var(--chart-palette-1)',
  'var(--chart-palette-2)',
  'var(--chart-palette-5)',
  'var(--chart-palette-7)',
  'var(--chart-palette-3)',
  'var(--chart-palette-6)',
]

const toneClassMap = {
  dark: {
    card: undefined,
    headerBadge: 'border-border/60 bg-background/24 text-foreground/88',
    shell: 'border-border/50 bg-card/30',
    shellMuted: 'text-muted-foreground',
    legendItem: 'border-border/30 bg-card/25',
    valueText: 'text-foreground',
    valueSubtext: 'text-muted-foreground',
  },
  light: {
    card: undefined,
    headerBadge: 'border-border/55 bg-card/55 text-muted-foreground shadow-sm',
    shell: 'border-border/40 bg-card/35',
    shellMuted: 'text-muted-foreground',
    legendItem: 'border-border/35 bg-card/30',
    valueText: 'text-foreground',
    valueSubtext: 'text-muted-foreground',
  },
} as const

const ringLayoutByDensity = {
  default: {
    contentGridClassName: 'grid-rows-[minmax(0,72fr)_minmax(0,28fr)]',
    frameClassName: 'h-[12.6rem] max-w-[17.4rem]',
    legendInnerClassName: 'mx-auto h-full w-full max-w-[18.2rem] pt-1.5',
    chartWidth: 270,
    chartHeight: 208,
    chartCenterX: 135,
    chartCenterY: 101,
    innerRadius: 54,
    outerRadius: 80,
    cornerRadius: 2,
    paddingAngle: 1,
  },
  compact: {
    contentGridClassName: 'grid-rows-[minmax(0,72fr)_minmax(0,28fr)]',
    frameClassName: 'h-[10.8rem] max-w-[15.2rem]',
    legendInnerClassName: 'mx-auto h-full w-full max-w-[16rem] pt-1',
    chartWidth: 236,
    chartHeight: 184,
    chartCenterX: 118,
    chartCenterY: 90,
    innerRadius: 44,
    outerRadius: 64,
    cornerRadius: 2,
    paddingAngle: 1,
  },
} as const

export function BxnEmissionStructurePanel({
  data,
  title = '组织碳足迹范围占比',
  description = '4 类排放来源占比',
  chartType = 'bar',
  headerAside,
  headerClassName,
  tone = 'dark',
  className,
  contentClassName,
  palette = defaultPalette,
  totalUnit = 'tCO₂e',
  showTotalInHeader = true,
  summaryLabel = '排放构成总览',
  legendValueFormatter,
  centerLabel,
  showSummaryShell = true,
  legendStyle = 'card',
  showLegendValue = true,
  density = 'default',
}: BxnEmissionStructurePanelProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const toneClasses = toneClassMap[tone]
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null)
  const resolvedLegendValueFormatter =
    legendValueFormatter ?? defaultLegendValueFormatter
  const hasData = data.length > 0
  const ringLayout = ringLayoutByDensity[density]
  const pieLegendClassName = resolvePieLegendClassName(data.length, density)
  const pieChartData = data.map((item, index) => ({
    ...item,
    chartValue: item.value,
    fill: palette[index % palette.length],
    sliceIndex: index,
  }))

  return (
    <BxnDashboardSectionCard
      title={title}
      description={description}
      cardUnstyled={tone === 'light'}
      variant="module"
      density={density}
      headerAside={
        headerAside ??
        (showTotalInHeader ? (
          <div
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs leading-4',
              toneClasses.headerBadge,
            )}
          >
            {new Intl.NumberFormat('zh-CN', {
              maximumFractionDigits: 0,
            }).format(total)}
            <span className="ml-1 opacity-70">{totalUnit}</span>
          </div>
        ) : undefined)
      }
      descriptionClassName="text-xs leading-4"
      titleClassName="!text-lg font-semibold text-foreground"
      headerClassName={headerClassName}
      className={cn(toneClasses.card, className)}
      contentClassName={cn(
        'flex min-h-0 flex-col gap-2 px-3 py-2',
        contentClassName,
      )}
    >
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          showSummaryShell
            ? 'rounded-lg border px-3 py-2.5'
            : 'border-0 bg-transparent px-0 py-0',
          showSummaryShell && toneClasses.shell,
        )}
      >
        {showSummaryShell ? (
          <div
            className={cn(
              'flex items-center justify-between gap-3 text-xs leading-4',
              toneClasses.shellMuted,
            )}
          >
            <span>{summaryLabel}</span>
            <span>{data.length} 类来源</span>
          </div>
        ) : null}

        {!hasData ? (
          <BxnPanelEmptyState
            title="暂无占比数据"
            description="当前筛选条件下暂无可展示占比信息。"
            className="my-auto"
          />
        ) : chartType === 'pie' ? (
          <div
            className={cn(
              'grid min-h-0 flex-1',
              ringLayout.contentGridClassName,
              showSummaryShell ? 'mt-2.5' : 'py-0.5',
            )}
          >
            <div className="flex h-full min-h-0 items-center justify-center">
              <div
                className={cn(
                  'relative mx-auto w-full overflow-visible',
                  ringLayout.frameClassName,
                )}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <PieChart
                    width={ringLayout.chartWidth}
                    height={ringLayout.chartHeight}
                  >
                    <Tooltip
                      cursor={false}
                      content={<PieHoverTooltip tone={tone} />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="chartValue"
                      nameKey="category"
                      labelLine={false}
                      label={(props) =>
                        renderPieOuterLabel(props, {
                          tone,
                          density,
                          activeSliceIndex,
                          chartWidth: ringLayout.chartWidth,
                          chartHeight: ringLayout.chartHeight,
                        })
                      }
                      cx={ringLayout.chartCenterX}
                      cy={ringLayout.chartCenterY}
                      innerRadius={ringLayout.innerRadius}
                      outerRadius={(slice: { sliceIndex?: number }) =>
                        activeSliceIndex !== null &&
                        slice.sliceIndex === activeSliceIndex
                          ? ringLayout.outerRadius + 4
                          : ringLayout.outerRadius
                      }
                      paddingAngle={ringLayout.paddingAngle}
                      cornerRadius={ringLayout.cornerRadius}
                      stroke="none"
                      isAnimationActive={false}
                      onMouseEnter={(_, index) => {
                        setActiveSliceIndex(index)
                      }}
                      onMouseLeave={() => {
                        setActiveSliceIndex(null)
                      }}
                    >
                      {pieChartData.map((item, index) => (
                        <Cell
                          key={item.category}
                          fill={item.fill}
                          fillOpacity={
                            activeSliceIndex === null ||
                            activeSliceIndex === index
                              ? 1
                              : 0.45
                          }
                          stroke={
                            activeSliceIndex === index
                              ? 'color-mix(in oklch, var(--background) 78%, transparent)'
                              : 'transparent'
                          }
                          strokeWidth={activeSliceIndex === index ? 1.1 : 0}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </div>

                {centerLabel ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        'max-w-24 text-center text-xs font-medium tracking-wide uppercase',
                        toneClasses.shellMuted,
                      )}
                    >
                      {centerLabel}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex h-full min-h-0 items-start">
              <div className={ringLayout.legendInnerClassName}>
                <div className={pieLegendClassName}>
                  {data.map((item, index) => (
                    <StructureLegendItem
                      key={item.category}
                      item={item}
                      color={palette[index % palette.length]}
                      tone={tone}
                      valueFormatter={resolvedLegendValueFormatter}
                      legendStyle={legendStyle}
                      showValue={showLegendValue}
                      density={density}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2.5 flex h-3.5 overflow-hidden rounded-full border border-border/50 bg-muted/40">
              {data.map((item, index) => (
                <div
                  key={item.category}
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: palette[index % palette.length],
                  }}
                  title={`${item.category} ${item.percent}%`}
                />
              ))}
            </div>

            <div className="mt-2.5 flex flex-col gap-1.5">
              {data.map((item, index) => (
                <div
                  key={item.category}
                  className={cn(
                    'grid grid-cols-[minmax(0,1fr)_minmax(72px,0.75fr)_auto] items-center gap-2.5 rounded-lg border px-2.5 py-1.5',
                    toneClasses.legendItem,
                  )}
                >
                  <div className="inline-flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: palette[index % palette.length],
                      }}
                    />
                    <span
                      className={cn(
                        'truncate text-sm font-medium',
                        'text-foreground',
                      )}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'h-1.5 overflow-hidden rounded-full',
                      'bg-muted/50',
                    )}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: palette[index % palette.length],
                      }}
                    />
                  </div>

                  <div className="text-right">
                    <div
                      className={cn(
                        'text-sm font-medium',
                        toneClasses.valueText,
                      )}
                    >
                      {item.percent.toFixed(1)}%
                    </div>
                    <div className={cn('text-xs', toneClasses.valueSubtext)}>
                      {resolvedLegendValueFormatter(item)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </BxnDashboardSectionCard>
  )
}

function StructureLegendItem({
  item,
  color,
  tone,
  valueFormatter,
  legendStyle,
  showValue,
  density,
}: {
  item: BxnEmissionStructureItem
  color: string
  tone: 'dark' | 'light'
  valueFormatter: (item: BxnEmissionStructureItem) => string
  legendStyle: 'card' | 'plain'
  showValue: boolean
  density: 'default' | 'compact'
}) {
  const isCompact = density === 'compact'
  const isPlainLegend = legendStyle === 'plain'

  return (
    <div
      className={cn(
        isPlainLegend
          ? 'inline-flex min-w-0 items-center'
          : 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border',
        isCompact ? 'gap-2' : 'gap-2.5',
        legendStyle === 'card' && (isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'),
        legendStyle === 'card' && toneClassMap[tone].legendItem,
      )}
    >
      <span
        className={cn(
          isPlainLegend
            ? isCompact
              ? 'size-2 rounded-full'
              : 'size-2.5 rounded-full'
            : isCompact
              ? 'size-2.5 rounded-sm'
              : 'size-3 rounded-sm',
        )}
        style={{ backgroundColor: color }}
      />
      <span
        className={cn(
          'truncate font-medium leading-tight',
          isPlainLegend
            ? isCompact
              ? 'text-xs'
              : 'text-sm'
            : isCompact
              ? 'text-sm'
              : 'text-sm',
          tone === 'light' ? 'text-foreground' : 'text-foreground/92',
        )}
      >
        {item.category}
      </span>
      {showValue ? (
        <span
          className={cn(
            'font-medium',
            isCompact ? 'text-xs' : 'text-sm',
            toneClassMap[tone].valueText,
          )}
        >
          {valueFormatter(item)}
        </span>
      ) : null}
    </div>
  )
}

function resolvePieLegendClassName(
  itemCount: number,
  density: 'default' | 'compact',
) {
  if (itemCount <= 3) {
    return cn(
      'flex flex-wrap items-center justify-center',
      density === 'compact' ? 'gap-x-3 gap-y-1' : 'gap-x-4 gap-y-1.5',
    )
  }

  return cn(
    'grid grid-cols-2',
    density === 'compact' ? 'gap-x-3 gap-y-1' : 'gap-x-4 gap-y-1.5',
  )
}

function PieHoverTooltip({
  active,
  payload,
  tone,
}: {
  active?: boolean
  payload?: Array<{ payload?: BxnEmissionStructureItem }>
  tone: 'dark' | 'light'
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const hoveredItem = payload[0]?.payload

  if (!hoveredItem) {
    return null
  }

  return (
    <div
      className={cn(
        'rounded-lg border px-2.5 py-1.5 shadow-sm backdrop-blur-xl',
        tone === 'light'
          ? 'border-border/55 bg-card/85 text-foreground'
          : 'border-border/55 bg-background/86 text-foreground',
      )}
    >
      <div className="text-xs leading-4 opacity-80">{hoveredItem.category}</div>
      <div className="mt-0.5 text-sm leading-5 font-semibold tracking-tight">
        {hoveredItem.percent.toFixed(1)}%
      </div>
    </div>
  )
}

type PieOuterLabelProps = {
  cx?: number | string
  cy?: number | string
  midAngle?: number
  outerRadius?: number | string
  percent?: number
  payload?: {
    sliceIndex?: number
    percent?: number
  }
}

function renderPieOuterLabel(
  props: PieOuterLabelProps,
  options: {
    tone: 'dark' | 'light'
    density: 'default' | 'compact'
    activeSliceIndex: number | null
    chartWidth: number
    chartHeight: number
  },
) {
  const cx =
    typeof props.cx === 'number' ? props.cx : Number.parseFloat(props.cx ?? '0')
  const cy =
    typeof props.cy === 'number' ? props.cy : Number.parseFloat(props.cy ?? '0')
  const outerRadius =
    typeof props.outerRadius === 'number'
      ? props.outerRadius
      : Number.parseFloat(props.outerRadius ?? '0')
  const midAngle = props.midAngle ?? 0
  const displayPercent =
    typeof props.payload?.percent === 'number'
      ? props.payload.percent
      : (props.percent ?? 0) * 100

  const radian = Math.PI / 180
  const angleRadian = -midAngle * radian
  const segment1Length = options.density === 'compact' ? 11 : 13
  const segment2Length = options.density === 'compact' ? 11 : 14
  const fontSize = options.density === 'compact' ? 11 : 12
  const displayValue = `${displayPercent.toFixed(1)}%`
  const textWidthEstimate = displayValue.length * fontSize * 0.58
  const safeX = 4
  const safeY = 4

  const x1 = cx + (outerRadius + 2) * Math.cos(angleRadian)
  const y1 = cy + (outerRadius + 2) * Math.sin(angleRadian)
  const x2 = cx + (outerRadius + segment1Length) * Math.cos(angleRadian)
  const y2 = cy + (outerRadius + segment1Length) * Math.sin(angleRadian)
  const isRightSide = x2 >= cx
  const x3Raw = x2 + (isRightSide ? segment2Length : -segment2Length)
  const textXRaw = x3Raw + (isRightSide ? 3 : -3)

  const textX = isRightSide
    ? Math.min(textXRaw, options.chartWidth - safeX - textWidthEstimate)
    : Math.max(textXRaw, safeX + textWidthEstimate)
  const x3 = textX + (isRightSide ? -3 : 3)
  const y3 = Math.max(Math.min(y2, options.chartHeight - safeY), safeY)

  const isInactive =
    options.activeSliceIndex !== null &&
    props.payload?.sliceIndex !== options.activeSliceIndex

  return (
    <g className="pointer-events-none" opacity={isInactive ? 0.42 : 0.96}>
      <path
        d={`M${x1},${y1}L${x2},${y2}L${x3},${y3}`}
        fill="none"
        stroke={
          options.tone === 'light'
            ? 'color-mix(in oklch, var(--muted-foreground) 66%, transparent)'
            : 'color-mix(in oklch, var(--foreground) 52%, transparent)'
        }
        strokeWidth={1.05}
        strokeLinecap="round"
      />
      <text
        x={textX}
        y={y3}
        fill={
          options.tone === 'light'
            ? 'color-mix(in oklch, var(--foreground) 88%, transparent)'
            : 'color-mix(in oklch, var(--foreground) 92%, transparent)'
        }
        textAnchor={isRightSide ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={600}
      >
        {displayValue}
      </text>
    </g>
  )
}

function defaultLegendValueFormatter(item: BxnEmissionStructureItem) {
  return `${new Intl.NumberFormat('zh-CN').format(item.value)} tCO₂e`
}
