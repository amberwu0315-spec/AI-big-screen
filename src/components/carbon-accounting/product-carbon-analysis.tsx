'use client'

import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  TableProperties,
  TrendingUp,
} from 'lucide-react'
import type { CarbonAccountingTask } from './product-carbon.types'
import type {
  ProductCarbonAnalysisDataset,
  ProductCarbonBreakdownItem,
  ProductCarbonBreakdownView,
} from '@/lib/product-carbon-visualization'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useAppLocale } from '@/components/layout/app-locale-provider'
import {
  localizeProductCarbonNode,
  localizeProductCarbonValue,
} from './product-carbon.i18n'

interface ProductCarbonAnalysisProps {
  task: CarbonAccountingTask
  data?: ProductCarbonAnalysisDataset
  resultChartOnly?: boolean
  showKeyMetrics?: boolean
  displayMode?: 'default' | 'dialog'
}

const COLORS = {
  rawMaterial: 'var(--carbon-raw)',
  rawMaterialLight: 'var(--carbon-raw-light)',
  manufacturing: 'var(--carbon-manufacturing)',
  manufacturingLight: 'var(--carbon-manufacturing-light)',
  transport: 'var(--carbon-transport)',
  hazard: 'var(--carbon-hazard)',
  muted: 'var(--status-offline)',
  green1: 'var(--status-online)',
  green2: 'var(--chart-palette-5)',
}

const DEFAULT_BREAKDOWNS: ProductCarbonAnalysisDataset['breakdowns'] = {
  stage: [
    {
      name: '原辅料获取',
      value: 70.42,
      gwp: 6.2341,
      color: COLORS.rawMaterial,
    },
    {
      name: '生产制造',
      value: 29.58,
      gwp: 2.6214,
      color: COLORS.manufacturing,
    },
  ],
  module: [
    {
      name: '材料获取',
      value: 69.45,
      gwp: 6.1481,
      color: COLORS.rawMaterial,
    },
    {
      name: '原料运输',
      value: 0.97,
      gwp: 0.086,
      color: COLORS.rawMaterialLight,
    },
    {
      name: '能源使用',
      value: 29.59,
      gwp: 2.6196,
      color: COLORS.manufacturing,
    },
    {
      name: '危废处理',
      value: 0.02,
      gwp: 0.0018,
      color: COLORS.hazard,
    },
  ],
}

const DEFAULT_ALL_METHODS_DATA = [
  { name: '温室气体', raw: 70.42, manufacturing: 29.58, transport: 0 },
  { name: '土地利用', raw: 100, manufacturing: 0, transport: 0 },
  { name: '生物碳', raw: 87.3, manufacturing: 8.2, transport: 4.5 },
  { name: '化石（非航空）', raw: 70.42, manufacturing: 29.58, transport: 0 },
  { name: '航空', raw: 100, manufacturing: 0, transport: 0 },
]

const DEFAULT_SENSITIVITY_DATA = [
  { name: '铝粉 9→10', value: 16.36, color: COLORS.rawMaterial },
  { name: '用电', value: 7.4, color: COLORS.muted },
  { name: '无萘溶剂油', value: 0.54, color: COLORS.green1 },
  { name: '灰桶', value: 0.46, color: COLORS.transport },
  { name: '铝粉 9→10 运输', value: 0.18, color: COLORS.green2 },
]

const DEFAULT_UNCERTAINTY_DATA = [
  { name: '铝粉 9→10', value: 5.56, color: COLORS.rawMaterial },
  { name: '用电', value: 10.3, color: COLORS.muted },
  { name: '无萘溶剂油', value: 0.35, color: COLORS.green1 },
  { name: '灰桶', value: 0.31, color: COLORS.transport },
  { name: '铝粉 9→10 运输', value: 0.22, color: COLORS.green2 },
]

const DEFAULT_DATA: ProductCarbonAnalysisDataset = {
  breakdowns: DEFAULT_BREAKDOWNS,
  allMethodsData: DEFAULT_ALL_METHODS_DATA,
  sensitivityData: DEFAULT_SENSITIVITY_DATA,
  uncertaintyData: DEFAULT_UNCERTAINTY_DATA,
  monteCarlo: {
    uncertaintyRange: '-14.96% ~ 15.07%',
    nodes: [
      { name: '型材 ABC', mean: 2.8489, std: 0.3018 },
      { name: '铝粉 9→10', mean: 1.8642, std: 0.2164 },
      { name: 'UPVC 颗粒', mean: 0.2843, std: 0.0362 },
    ],
  },
  keyMetrics: {
    totalGwp: 8.8556282,
    uncertainty: '-11.43% ~ 11.98%',
    maxContributionStage: {
      name: '原辅料获取',
      pct: 70.42,
    },
    topSources: [
      { name: '铝粉 9→10', pct: 65.43 },
      { name: '用电', pct: 29.58 },
      { name: '无萘溶剂油', pct: 2.17 },
    ],
    standard: 'ISO 14067:2018',
    scope: 'GWP100 · 从摇篮到大门',
  },
}

function SankeyFlowChart({
  stages,
  product,
}: {
  stages: Array<ProductCarbonBreakdownItem>
  product: {
    name: string
    color: string
  }
}) {
  const W = 560,
    H = 160
  const nodeW = 10,
    padLeft = 148,
    padRight = 170,
    vPad = 12
  const innerH = H - vPad * 2
  const gap = 8 // 节点间距
  const totalGap = gap * Math.max(stages.length - 1, 0)

  const rightX = W - padRight

  let cursor = vPad
  const leftNodes = stages.map((stage) => {
    const safeValue = Math.max(stage.value, 0)
    const h = (safeValue / 100) * (innerH - totalGap)
    const node = {
      ...stage,
      x: padLeft,
      y: cursor,
      h,
      mid: cursor + h / 2,
    }
    cursor += h + gap
    return node
  })

  const rightH = innerH - totalGap + gap
  const rightY = vPad

  const gradients = leftNodes.map((n, i) => ({
    id: `sf${i}`,
    c0: n.color,
    c1: product.color,
  }))

  let rCursor = rightY
  const rightSegs = leftNodes.map((n) => {
    const rh = (n.h / (innerH - totalGap)) * rightH
    const seg = { y: rCursor, h: rh }
    rCursor += rh
    return seg
  })

  const band = (
    lx: number,
    ly: number,
    lh: number,
    rx: number,
    ry: number,
    rh: number,
  ) => {
    const cx = (rx - lx) * 0.5
    return [
      `M ${lx + nodeW} ${ly}`,
      `C ${lx + nodeW + cx} ${ly}, ${rx - cx} ${ry}, ${rx} ${ry}`,
      `L ${rx} ${ry + rh}`,
      `C ${rx - cx} ${ry + rh}, ${lx + nodeW + cx} ${ly + lh}, ${lx + nodeW} ${ly + lh}`,
      'Z',
    ].join(' ')
  }

  return (
    <div className="h-[160px] w-full">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {gradients.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={g.c0} stopOpacity={0.45} />
              <stop offset="100%" stopColor={g.c1} stopOpacity={0.35} />
            </linearGradient>
          ))}
        </defs>

        {/* 色带 */}
        {leftNodes.map((n, i) => (
          <path
            key={i}
            d={band(n.x, n.y, n.h, rightX, rightSegs[i].y, rightSegs[i].h)}
            fill={`url(#${gradients[i].id})`}
          />
        ))}

        {/* 左侧节点色块 */}
        {leftNodes.map((n, i) => (
          <rect
            key={i}
            x={n.x}
            y={n.y}
            width={nodeW}
            height={n.h}
            rx={3}
            fill={n.color}
          />
        ))}

        {/* 右侧节点色块 */}
        <rect
          x={rightX}
          y={rightY}
          width={nodeW}
          height={rightH}
          rx={3}
          fill={product.color}
        />

        {/* 左侧标签 */}
        {leftNodes.map((n, i) => (
          <text
            key={i}
            x={n.x - 10}
            y={n.mid + 4}
            textAnchor="end"
            fontSize={11}
            fill="var(--foreground)"
            className="select-none font-sans"
          >
            {n.name}: {n.value.toFixed(2)}%
          </text>
        ))}

        {/* 右侧标签 */}
        <text
          x={rightX + nodeW + 10}
          y={rightY + rightH / 2 + 4}
          textAnchor="start"
          fontSize={11}
          fill="var(--foreground)"
          className="select-none font-sans"
        >
          {product.name}: 100.00%
        </text>
      </svg>
    </div>
  )
}

const generateNormalDistribution = (
  mean: number,
  std: number,
  count: number,
) => {
  const bins = []
  const start = mean - 3.5 * std
  const step = (7 * std) / count
  for (let i = 0; i < count; i++) {
    const x = start + i * step
    const y =
      (1 / (std * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / std, 2))
    bins.push({ range: x.toFixed(3), frequency: +(y * 0.08).toFixed(4) })
  }
  return bins
}

// ── 切换按钮组 ──
function TabToggle({
  value,
  options,
  onValueChange,
}: {
  value: string
  options: Array<{ label: string; value: string }>
  onValueChange: (v: string) => void
}) {
  return (
    <div className="flex h-7 items-center rounded-lg border bg-muted/40 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onValueChange(opt.value)}
          className={cn(
            'h-6 rounded-[0.5em] px-2.5 text-[11px] font-medium transition-colors',
            value === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── 自定义 Tooltip ──
function ValueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover p-2.5 shadow-md">
      <p className="text-[11px] font-semibold">{label}</p>
      <p className="font-mono text-sm font-bold">
        {payload[0].value.toFixed(6)} kgCO₂e
      </p>
    </div>
  )
}

function KeyMetricsPanel({
  task,
  data,
}: {
  task: CarbonAccountingTask
  data: ProductCarbonAnalysisDataset
}) {
  const { locale } = useAppLocale()
  const totalGwp = data.keyMetrics.totalGwp ?? task.gwpResult ?? 0
  const uncertainty =
    data.keyMetrics.uncertainty ||
    (task.uncertainty === '—' ? '-11.43% ~ 11.98%' : task.uncertainty)

  return localizeProductCarbonNode(
    locale,
    <div className="flex w-64 shrink-0 flex-col gap-3 border-l bg-background p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        关键指标
      </p>

      <div className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="size-3" /> GWP 总量
        </div>
        <p className="mt-1 font-mono text-lg font-bold tabular-nums">
          {totalGwp.toFixed(4)}
        </p>
        <p className="text-xs text-muted-foreground">kgCO₂e / 功能单位</p>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="size-3" /> 不确定性区间
        </div>
        <p className="mt-1 font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
          {uncertainty}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="size-3" /> 最大贡献阶段
        </div>
        <p className="mt-1 text-sm font-semibold">
          {data.keyMetrics.maxContributionStage.name}
        </p>
        <div className="mt-1.5 overflow-hidden rounded-full bg-muted h-1.5">
          <div
            className="h-1.5 rounded-full bg-teal-500"
            style={{ width: `${data.keyMetrics.maxContributionStage.pct}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
          {data.keyMetrics.maxContributionStage.pct.toFixed(2)}%
        </p>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <p className="text-xs text-muted-foreground">主要排放源 TOP 3</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {data.keyMetrics.topSources.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 text-xs tabular-nums text-muted-foreground/60">
                {i + 1}
              </span>
              <span className="flex-1 truncate text-xs">{item.name}</span>
              <Badge
                variant="outline"
                className="px-1 py-0 font-mono text-[10px] tabular-nums"
              >
                {item.pct}%
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <p className="text-xs text-muted-foreground">核算标准</p>
        <p className="mt-1 text-xs font-medium">{data.keyMetrics.standard}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {data.keyMetrics.scope}
        </p>
      </div>
    </div>,
  )
}

function ProductCarbonAnalysisResultChartContent({
  task,
  data,
  displayMode,
}: {
  task: CarbonAccountingTask
  data: ProductCarbonAnalysisDataset
  displayMode: 'default' | 'dialog'
}) {
  const { locale } = useAppLocale()
  const isDialog = displayMode === 'dialog'
  const [allMethodView, setAllMethodView] =
    React.useState<ProductCarbonBreakdownView>('stage')
  const [singleMethodView, setSingleMethodView] = React.useState('pie')
  const [sensitivityTab, setSensitivityTab] = React.useState('fluctuation')
  const [showUncertainty, setShowUncertainty] = React.useState(false)
  const [mcExpanded, setMcExpanded] = React.useState(true)
  const [selectedNode, setSelectedNode] = React.useState(
    data.monteCarlo.nodes[0]?.name ?? task.productName,
  )

  React.useEffect(() => {
    setSelectedNode(data.monteCarlo.nodes[0]?.name ?? task.productName)
  }, [data.monteCarlo.nodes, task.productName])

  const activeBreakdown = React.useMemo(
    () => data.breakdowns[allMethodView] ?? data.breakdowns.stage,
    [allMethodView, data.breakdowns],
  )

  const breakdownBarData = React.useMemo(
    () =>
      activeBreakdown.map((item) => ({
        name: item.name,
        value: item.gwp,
        color: item.color,
      })),
    [activeBreakdown],
  )

  const activeSensitivityData = React.useMemo(() => {
    const source =
      sensitivityTab === 'fluctuation'
        ? data.sensitivityData
        : data.uncertaintyData

    return [...source].sort((left, right) => left.value - right.value)
  }, [data.sensitivityData, data.uncertaintyData, sensitivityTab])

  const sensitivityDomainMax = React.useMemo(() => {
    const max = Math.max(...activeSensitivityData.map((item) => item.value), 0)
    if (max <= 0) return 5
    return Math.ceil((max + 1) / 2) * 2
  }, [activeSensitivityData])

  const selectedMonteCarloNode = React.useMemo(
    () =>
      data.monteCarlo.nodes.find((node) => node.name === selectedNode) ??
      data.monteCarlo.nodes[0] ?? {
        name: task.productName,
        mean: data.keyMetrics.totalGwp,
        std: 1,
      },
    [
      data.keyMetrics.totalGwp,
      data.monteCarlo.nodes,
      selectedNode,
      task.productName,
    ],
  )

  const monteCarloData = React.useMemo(
    () =>
      generateNormalDistribution(
        selectedMonteCarloNode.mean,
        selectedMonteCarloNode.std,
        40,
      ),
    [selectedMonteCarloNode],
  )

  const stageLabels = data.breakdowns.stage

  return localizeProductCarbonNode(
    locale,
    <div className={cn('flex flex-col gap-4', isDialog ? 'p-4' : 'px-5')}>
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-card',
          !isDialog && 'border',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">排放贡献分析</span>
            <span className="text-xs text-muted-foreground">
              GWP100 · 温室气体
            </span>
          </div>
          <TabToggle
            value={singleMethodView}
            options={[
              { label: '占比', value: 'pie' },
              { label: '数值', value: 'bar' },
              { label: '流向', value: 'flow' },
            ]}
            onValueChange={setSingleMethodView}
          />
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <TabToggle
              value={allMethodView}
              options={[
                { label: '阶段', value: 'stage' },
                { label: '模块', value: 'module' },
              ]}
              onValueChange={(value) =>
                setAllMethodView(value as ProductCarbonBreakdownView)
              }
            />
            {singleMethodView === 'bar' && (
              <div className="ml-auto flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  展示不确定性
                </Label>
                <Switch
                  checked={showUncertainty}
                  onCheckedChange={setShowUncertainty}
                />
              </div>
            )}
          </div>

          {singleMethodView === 'pie' && (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={200} height={160}>
                <PieChart>
                  <Pie
                    data={activeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activeBreakdown.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value ?? 0).toFixed(2)}%`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-1 flex-col gap-2">
                {activeBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-xs">{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {item.value.toFixed(2)}%
                      </span>
                      <span className="w-20 text-right font-mono text-xs tabular-nums text-muted-foreground/60">
                        {item.gwp.toFixed(4)} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {singleMethodView === 'bar' && (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={breakdownBarData}
                margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
                barSize={48}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ValueTooltip />} />
                <Bar dataKey="value" name="排放量" radius={[4, 4, 0, 0]}>
                  {breakdownBarData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={showUncertainty ? `${entry.color}` : entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {singleMethodView === 'flow' && (
            <SankeyFlowChart
              stages={activeBreakdown}
              product={{
                name: task.productName,
                color: activeBreakdown[0]?.color ?? COLORS.rawMaterial,
              }}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-lg bg-card',
          !isDialog && 'border',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">多方法学对比</span>
            <Badge variant="outline" className="text-muted-foreground">
              与当前方法学无关
            </Badge>
          </div>
        </div>
        <div className="px-4 pb-3 pt-4">
          <div className="mb-1 text-xs text-muted-foreground/60">
            GWP100 方法学
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={data.allMethodsData}
              layout="vertical"
              margin={{ top: 12, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                type="number"
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value ?? 0).toFixed(2)}%`,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => (
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="raw"
                name={stageLabels[0]?.name ?? '原辅料获取'}
                stackId="a"
                fill={stageLabels[0]?.color ?? COLORS.rawMaterial}
              />
              <Bar
                dataKey="manufacturing"
                name={stageLabels[1]?.name ?? '生产制造'}
                stackId="a"
                fill={stageLabels[1]?.color ?? COLORS.manufacturing}
              />
              <Bar
                dataKey="transport"
                name="运输配送"
                stackId="a"
                fill={COLORS.transport}
                radius={[0, 3, 3, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-lg bg-card',
          !isDialog && 'border',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">敏感性分析</span>
            <Badge variant="outline" className="text-muted-foreground">
              与当前方法学无关
            </Badge>
          </div>
          <TabToggle
            value={sensitivityTab}
            options={[
              { label: '波动影响', value: 'fluctuation' },
              { label: '不确定性影响', value: 'uncertainty' },
            ]}
            onValueChange={setSensitivityTab}
          />
        </div>
        <div className="px-4 pb-4 pt-4">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={activeSensitivityData}
              layout="vertical"
              margin={{ top: 12, right: 55, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                domain={[0, sensitivityDomainMax]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value ?? 0).toFixed(2)}%`,
                  sensitivityTab === 'fluctuation' ? '波动影响' : '不确定性',
                ]}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} minPointSize={3}>
                {activeSensitivityData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)',
                  }}
                  formatter={(value: unknown) => `${Number(value).toFixed(2)}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-lg bg-card',
          !isDialog && 'border',
        )}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2.5"
          onClick={() => setMcExpanded((value) => !value)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              不确定性 · 蒙特卡洛模拟
            </span>
            <Badge variant="outline" className="text-muted-foreground">
              辅助分析
            </Badge>
          </div>
          {mcExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {mcExpanded && (
          <div className="border-t">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  均值:{' '}
                  <strong className="font-mono text-foreground">
                    {selectedMonteCarloNode.mean.toFixed(4)} kgCO₂e
                  </strong>
                </span>
                <span>
                  标准差:{' '}
                  <strong className="font-mono text-foreground">
                    {selectedMonteCarloNode.std.toFixed(4)}
                  </strong>
                </span>
                <span>
                  不确定性:{' '}
                  <strong className="font-mono text-amber-600">
                    {data.monteCarlo.uncertaintyRange}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">节点</span>
                <Select
                  value={selectedNode}
                  onValueChange={(value) => value && setSelectedNode(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>{(value: string) => value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {data.monteCarlo.nodes.map((node) => (
                      <SelectItem
                        key={node.name}
                        value={node.name}
                        label={node.name}
                      >
                        {node.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={monteCarloData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                  barSize={8}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="range"
                    tick={{
                      fontSize: 9,
                      fill: 'var(--muted-foreground)',
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={7}
                  />
                  <YAxis
                    tick={{
                      fontSize: 9,
                      fill: 'var(--muted-foreground)',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      Number(value ?? 0).toFixed(4),
                      '频率密度',
                    ]}
                    labelFormatter={(label) => `区间: ${label}`}
                  />
                  <Bar
                    dataKey="frequency"
                    fill={activeBreakdown[0]?.color ?? COLORS.rawMaterial}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>,
  )
}

export function ProductCarbonAnalysis({
  task,
  data,
  resultChartOnly = false,
  showKeyMetrics = true,
  displayMode = 'default',
}: ProductCarbonAnalysisProps) {
  const { locale } = useAppLocale()
  const analysisData = React.useMemo(
    () => localizeProductCarbonValue(locale, data ?? DEFAULT_DATA),
    [data, locale],
  )
  const isDialog = displayMode === 'dialog'

  if (resultChartOnly) {
    return localizeProductCarbonNode(
      locale,
      <div className={cn('flex min-h-0', !isDialog && 'h-full overflow-hidden')}>
        {isDialog ? (
          <div className="min-h-0 min-w-0 flex-1">
            <ProductCarbonAnalysisResultChartContent
              task={task}
              data={analysisData}
              displayMode={displayMode}
            />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <ProductCarbonAnalysisResultChartContent
              task={task}
              data={analysisData}
              displayMode={displayMode}
            />
          </ScrollArea>
        )}
        {showKeyMetrics ? (
          <KeyMetricsPanel task={task} data={analysisData} />
        ) : null}
      </div>,
    )
  }

  return localizeProductCarbonNode(
    locale,
    <div className={cn('flex min-h-0', !isDialog && 'h-full overflow-hidden')}>
      <Tabs
        defaultValue="result-chart"
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-0',
          !isDialog && 'overflow-hidden',
        )}
      >
        <div className="flex min-w-0 shrink-0 items-end border-b bg-background px-5">
          <div className="min-w-0 overflow-x-auto overflow-y-hidden">
            <TabsList variant="line" className="w-fit shrink-0">
              <TabsTrigger value="result-chart">结果图表</TabsTrigger>
              <TabsTrigger value="lci-result">LCI 结果</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent
          value="result-chart"
          className={cn('m-0 min-h-0 flex-1', !isDialog && 'overflow-hidden')}
        >
          {isDialog ? (
            <div className="pt-3">
              <ProductCarbonAnalysisResultChartContent
                task={task}
                data={analysisData}
                displayMode={displayMode}
              />
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="pt-3">
                <ProductCarbonAnalysisResultChartContent
                  task={task}
                  data={analysisData}
                  displayMode={displayMode}
                />
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent
          value="lci-result"
          className={cn('m-0 min-h-0 flex-1', !isDialog && 'overflow-hidden')}
        >
          {isDialog ? (
            <div className="px-5 pb-5 pt-3">
              <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border bg-card text-muted-foreground">
                <TableProperties className="size-12 opacity-20" />
                <p className="text-sm font-medium">LCI 结果</p>
                <p className="text-xs">生命周期清单数据，功能开发中</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="px-5 pb-5 pt-3">
                <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border bg-card text-muted-foreground">
                  <TableProperties className="size-12 opacity-20" />
                  <p className="text-sm font-medium">LCI 结果</p>
                  <p className="text-xs">生命周期清单数据，功能开发中</p>
                </div>
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {showKeyMetrics ? (
        <KeyMetricsPanel task={task} data={analysisData} />
      ) : null}
    </div>,
  )
}
