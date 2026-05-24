'use client'

import * as React from 'react'
import {
  AlertCircle,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CarbonAccountingTask } from './product-carbon.types'
import type {
  ProductCarbonDetailView,
  ProductCarbonMethodResult,
  ProductCarbonProcessUnit,
  ProductCarbonResultDataset,
  ProductCarbonVisualizationPalette,
} from '@/lib/product-carbon-visualization'
import type { CarbonTreeNavNode } from '@/components/carbon-accounting/shared/carbon-tree-nav'
import { CarbonTreeNav } from '@/components/carbon-accounting/shared/carbon-tree-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { STATUS_BADGE, STATUS_TEXT } from '@/lib/status-colors'
import { useAppLocale } from '@/components/layout/app-locale-provider'
import {
  isProductCarbonHazardLabel,
  isProductCarbonManufacturingStageLabel,
  isProductCarbonRawStageLabel,
  isProductCarbonTransportLabel,
  localizeProductCarbonNode,
  localizeProductCarbonValue,
} from './product-carbon.i18n'

interface ProductCarbonResultProps {
  task: CarbonAccountingTask
  data?: ProductCarbonResultDataset
  displayMode?: 'default' | 'dialog'
}

const DEFAULT_PALETTE: ProductCarbonVisualizationPalette = {
  raw: 'var(--carbon-raw)',
  rawLight: 'var(--carbon-raw-light)',
  manufacturing: 'var(--carbon-manufacturing)',
  manufacturingLight: 'var(--carbon-manufacturing-light)',
  transport: 'var(--carbon-transport)',
  hazard: 'var(--carbon-hazard)',
}

const DEFAULT_PROCESS_UNITS: Array<ProductCarbonProcessUnit> = [
  {
    id: 'u1',
    name: '铝粉 9→10',
    stage: '原辅料获取',
    module: '材料获取',
    percentage: 65.43,
    gwp: 5.7921,
  },
  {
    id: 'u2',
    name: '无萘溶剂油',
    stage: '原辅料获取',
    module: '材料获取',
    percentage: 2.17,
    gwp: 0.1921,
  },
  {
    id: 'u3',
    name: '油酸 AT',
    stage: '原辅料获取',
    module: '材料获取',
    percentage: 0.03,
    gwp: 0.0027,
  },
  {
    id: 'u4',
    name: '灰桶',
    stage: '原辅料获取',
    module: '材料获取',
    percentage: 1.82,
    gwp: 0.1612,
  },
  {
    id: 'u5',
    name: '铝粉 9→10 运输',
    stage: '原辅料获取',
    module: '原料运输',
    percentage: 0.71,
    gwp: 0.0629,
  },
  {
    id: 'u6',
    name: '无萘溶剂油运输',
    stage: '原辅料获取',
    module: '原料运输',
    percentage: 0.22,
    gwp: 0.0195,
  },
  {
    id: 'u7',
    name: '油酸 AT 运输',
    stage: '原辅料获取',
    module: '原料运输',
    percentage: 0.03,
    gwp: 0.0027,
  },
  {
    id: 'u8',
    name: '灰桶运输',
    stage: '原辅料获取',
    module: '原料运输',
    percentage: 0.01,
    gwp: 0.0009,
  },
  {
    id: 'u9',
    name: '用电',
    stage: '生产制造',
    module: '能源使用',
    percentage: 29.58,
    gwp: 2.6187,
  },
  {
    id: 'u10',
    name: '柴油-厂内运输',
    stage: '生产制造',
    module: '能源使用',
    percentage: 0.0,
    gwp: 0.0,
  },
  {
    id: 'u11',
    name: '柴油的燃烧',
    stage: '生产制造',
    module: '能源使用',
    percentage: 0.01,
    gwp: 0.0009,
  },
  {
    id: 'u12',
    name: '废弃物处理',
    stage: '生产制造',
    module: '危废处理',
    percentage: 0.02,
    gwp: 0.0018,
  },
]

const UNIT_PIE_COLORS = [
  'var(--chart-palette-1)',
  'var(--chart-palette-2)',
  'var(--chart-palette-3)',
  'var(--chart-palette-4)',
  'var(--chart-palette-5)',
  'var(--chart-palette-6)',
  'var(--chart-palette-7)',
  'var(--chart-palette-8)',
  'var(--chart-palette-9)',
  'var(--chart-palette-10)',
  'var(--chart-palette-11)',
  'var(--chart-palette-12)',
]

const DEFAULT_METHOD_RESULTS: Array<ProductCarbonMethodResult> = [
  {
    label: 'GWP100 - 温室气体',
    full: 'IPCC 2021 - climate change: total (excl. biogenic CO…',
    value: 8.8556282,
  },
  {
    label: 'GWP100 - 化石（除航空）',
    full: 'IPCC 2021 - climate change: fossil emissions (excl. ai…',
    value: 8.8556282,
  },
  {
    label: 'GWP100 - 生物',
    full: 'IPCC 2021 - climate change: biogenic (excl. CO2) - g…',
    value: 0,
  },
  {
    label: 'GWP100 - 土地',
    full: 'IPCC 2021 - climate change: direct land use change …',
    value: 0,
  },
  {
    label: 'GWP100 - 航空',
    full: 'IPCC 2021 - climate change: aircraft emissions - glo…',
    value: 0,
  },
]

const DEFAULT_DATA: ProductCarbonResultDataset = {
  processUnits: DEFAULT_PROCESS_UNITS,
  methodResults: DEFAULT_METHOD_RESULTS,
  defaultDetailView: 'stage',
}

interface SummaryRow {
  name: string
  value: number
  gwp: number
  color: string
  stage?: string
}

interface TreeNodeData {
  id: string
  name: string
  percentage: number
  children?: Array<TreeNodeData>
}

function resolveStageColor(
  stage: string,
  index: number,
  palette: ProductCarbonVisualizationPalette,
): string {
  if (isProductCarbonRawStageLabel(stage)) {
    return index === 0 ? palette.raw : palette.rawLight
  }

  if (isProductCarbonManufacturingStageLabel(stage)) {
    return index === 0 ? palette.manufacturing : palette.manufacturingLight
  }

  if (isProductCarbonTransportLabel(stage)) return palette.transport

  return UNIT_PIE_COLORS[index % UNIT_PIE_COLORS.length]
}

function resolveModuleColor(
  stage: string,
  module: string,
  indexWithinStage: number,
  palette: ProductCarbonVisualizationPalette,
): string {
  if (isProductCarbonTransportLabel(module)) return palette.transport
  if (isProductCarbonHazardLabel(module)) return palette.hazard

  if (isProductCarbonRawStageLabel(stage)) {
    return indexWithinStage === 0 ? palette.raw : palette.rawLight
  }

  if (isProductCarbonManufacturingStageLabel(stage)) {
    return indexWithinStage === 0
      ? palette.manufacturing
      : palette.manufacturingLight
  }

  return UNIT_PIE_COLORS[indexWithinStage % UNIT_PIE_COLORS.length]
}

function buildStageSummary(
  units: Array<ProductCarbonProcessUnit>,
  palette: ProductCarbonVisualizationPalette,
): Array<SummaryRow> {
  const stageMap = new Map<string, { value: number; gwp: number }>()

  for (const unit of units) {
    const current = stageMap.get(unit.stage) ?? { value: 0, gwp: 0 }
    current.value += unit.percentage
    current.gwp += unit.gwp
    stageMap.set(unit.stage, current)
  }

  return [...stageMap.entries()].map(([name, summary], index) => ({
    name,
    value: summary.value,
    gwp: summary.gwp,
    color: resolveStageColor(name, index, palette),
  }))
}

function buildModuleSummary(
  units: Array<ProductCarbonProcessUnit>,
  palette: ProductCarbonVisualizationPalette,
): Array<SummaryRow> {
  const moduleMap = new Map<
    string,
    { stage: string; value: number; gwp: number }
  >()
  const stageModuleIndexMap = new Map<string, number>()

  for (const unit of units) {
    const key = `${unit.stage}__${unit.module}`
    const current = moduleMap.get(key) ?? {
      stage: unit.stage,
      value: 0,
      gwp: 0,
    }
    current.value += unit.percentage
    current.gwp += unit.gwp
    moduleMap.set(key, current)

    if (!stageModuleIndexMap.has(key)) {
      const siblingCount = [...moduleMap.values()].filter(
        (item) => item.stage === unit.stage,
      ).length
      stageModuleIndexMap.set(key, siblingCount - 1)
    }
  }

  return [...moduleMap.entries()].map(([key, summary]) => {
    const moduleIndex = stageModuleIndexMap.get(key) ?? 0
    const [, module] = key.split('__')
    return {
      name: module,
      value: summary.value,
      gwp: summary.gwp,
      stage: summary.stage,
      color: resolveModuleColor(summary.stage, module, moduleIndex, palette),
    }
  })
}

function buildTreeData(
  units: Array<ProductCarbonProcessUnit>,
): Array<TreeNodeData> {
  const stageMap = new Map<string, Array<ProductCarbonProcessUnit>>()

  for (const unit of units) {
    const current = stageMap.get(unit.stage) ?? []
    current.push(unit)
    stageMap.set(unit.stage, current)
  }

  return [...stageMap.entries()].map(([stageName, stageUnits], stageIndex) => {
    const moduleMap = new Map<string, Array<ProductCarbonProcessUnit>>()

    for (const unit of stageUnits) {
      const current = moduleMap.get(unit.module) ?? []
      current.push(unit)
      moduleMap.set(unit.module, current)
    }

    return {
      id: `stage-${stageIndex}`,
      name: stageName,
      percentage: stageUnits.reduce((sum, unit) => sum + unit.percentage, 0),
      children: [...moduleMap.entries()].map(
        ([moduleName, moduleUnits], moduleIndex) => ({
          id: `stage-${stageIndex}-module-${moduleIndex}`,
          name: moduleName,
          percentage: moduleUnits.reduce(
            (sum, unit) => sum + unit.percentage,
            0,
          ),
          children: moduleUnits.map((unit) => ({
            id: unit.id,
            name: unit.name,
            percentage: unit.percentage,
          })),
        }),
      ),
    }
  })
}

/** 视图切换按钮组 */
function ViewToggle({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (v: string) => void
}) {
  return (
    <div className="flex h-7 items-center rounded-lg border bg-muted/40 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
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

/** 自定义 Tooltip */
function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
      <p className="text-xs font-medium">{payload[0].name}</p>
      <p className="font-mono text-sm font-bold">
        {payload[0].value.toFixed(2)}%
      </p>
    </div>
  )
}

function buildProductTreeNodes(
  nodes: Array<TreeNodeData>,
): Array<CarbonTreeNavNode<string>> {
  return nodes.map((node) => ({
    id: node.id,
    label: node.name,
    value: node.percentage,
    path: node.id,
    children: node.children ? buildProductTreeNodes(node.children) : undefined,
  }))
}

function collectExpandedIds(
  nodes: Array<CarbonTreeNavNode<string>>,
): Set<string> {
  const ids = new Set<string>()
  const visit = (items: Array<CarbonTreeNavNode<string>>, depth: number) => {
    for (const item of items) {
      if (item.children?.length && depth < 2) {
        ids.add(item.id)
      }
      if (item.children?.length) {
        visit(item.children, depth + 1)
      }
    }
  }
  visit(nodes, 0)
  return ids
}

// ─────────────────────────────────────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────────────────────────────────────
export function ProductCarbonResult({
  task,
  data,
  displayMode = 'default',
}: ProductCarbonResultProps) {
  const { locale } = useAppLocale()
  const resultData = React.useMemo(
    () => localizeProductCarbonValue(locale, data ?? DEFAULT_DATA),
    [data, locale],
  )
  const processUnits = resultData.processUnits
  const methodResults = resultData.methodResults
  const palette = resultData.palette ?? DEFAULT_PALETTE
  const isDialog = displayMode === 'dialog'
  const [detailView, setDetailView] = React.useState<ProductCarbonDetailView>(
    resultData.defaultDetailView ?? 'stage',
  )
  const [tableSearch, setTableSearch] = React.useState('')
  const [expandResult, setExpandResult] = React.useState(false)
  const [selectedTreePath, setSelectedTreePath] = React.useState('root')
  const stageSummary = React.useMemo(
    () => buildStageSummary(processUnits, palette),
    [palette, processUnits],
  )
  const moduleSummary = React.useMemo(
    () => buildModuleSummary(processUnits, palette),
    [palette, processUnits],
  )
  const treeNavNodes = React.useMemo(
    () => buildProductTreeNodes(buildTreeData(processUnits)),
    [processUnits],
  )
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() =>
    collectExpandedIds(treeNavNodes),
  )

  React.useEffect(() => {
    setDetailView(resultData.defaultDetailView ?? 'stage')
  }, [resultData.defaultDetailView, processUnits])

  React.useEffect(() => {
    setExpandedIds(collectExpandedIds(treeNavNodes))
    setSelectedTreePath('root')
  }, [treeNavNodes, task.productCode, task.productName])

  const toggleTreeNode = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // ── 根据视图模式选择图表数据 ──
  const pieData = React.useMemo(() => {
    if (detailView === 'stage') return stageSummary
    if (detailView === 'module') return moduleSummary
    return processUnits
      .filter((u) => u.percentage > 0)
      .map((u, i) => ({
        name: u.name,
        value: u.percentage,
        color: UNIT_PIE_COLORS[i % UNIT_PIE_COLORS.length],
      }))
  }, [detailView, moduleSummary, processUnits, stageSummary])

  // ── 表格过滤 ──
  const filteredUnits = React.useMemo(() => {
    if (!tableSearch.trim()) return processUnits
    const kw = tableSearch.toLowerCase()
    return processUnits.filter(
      (u) =>
        u.name.toLowerCase().includes(kw) ||
        u.stage.toLowerCase().includes(kw) ||
        u.module.toLowerCase().includes(kw),
    )
  }, [processUnits, tableSearch])

  const resultContent = (
    <div className="flex flex-col gap-4">
      <div className={cn('rounded-lg bg-card p-4', !isDialog && 'border')}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-md border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <TrendingUp className={cn('size-3.5 shrink-0', STATUS_TEXT.teal)} />
              <span className="text-foreground">单位评估结果</span>
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">
                {task.gwpResult?.toFixed(7) ?? '8.8556282'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                kgCO₂e / 功能单位
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-md border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <AlertCircle
                className={cn('size-3.5 shrink-0', STATUS_TEXT.warning)}
              />
              <span className="text-foreground">不确定性</span>
            </div>
            <div className="mt-4">
              <p
                className={cn(
                  'font-mono text-2xl font-bold tracking-tight tabular-nums sm:text-3xl',
                  STATUS_TEXT.warning,
                )}
              >
                {task.uncertainty === '—' ? '-11.43% ~ 11.98%' : task.uncertainty}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">评估结果波动范围</p>
            </div>
          </div>
        </div>

        <Button
          variant="link"
          size="sm"
          className="mt-3 h-auto p-0"
          onClick={() => setExpandResult((v) => !v)}
        >
          {expandResult ? '折叠全部评估结果 ▲' : '展开全部评估结果 ▼'}
        </Button>

        {expandResult && (
          <div className="mt-4 border-t pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>方法学简称</TableHead>
                  <TableHead className="text-right w-[130px]">数值</TableHead>
                  <TableHead className="w-[70px]">单位</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methodResults.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {row.value > 0 ? (
                        row.value.toFixed(7)
                      ) : (
                        <span className="text-muted-foreground/40">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">kgCO₂e</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-lg bg-card',
          !isDialog && 'border',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">排放详情</span>
            <span className="text-xs text-muted-foreground">单位：kgCO₂e</span>
          </div>
          <ViewToggle
            value={detailView}
            options={[
              { label: '阶段', value: 'stage' },
              { label: '模块', value: 'module' },
              { label: '单元过程', value: 'unit' },
            ]}
            onChange={(v) => setDetailView(v as 'stage' | 'module' | 'unit')}
          />
        </div>

        <div className="border-b p-4">
          <ResponsiveContainer
            width="100%"
            height={detailView === 'unit' ? 260 : 320}
          >
            <PieChart
              margin={
                detailView === 'unit'
                  ? undefined
                  : {
                      top: 20,
                      right: 28,
                      bottom: 12,
                      left: 28,
                    }
              }
            >
              <Pie
                data={pieData}
                cx="50%"
                cy={detailView === 'unit' ? '50%' : '46%'}
                innerRadius={detailView === 'unit' ? 65 : 60}
                outerRadius={detailView === 'unit' ? 100 : 92}
                paddingAngle={detailView === 'unit' ? 1 : 3}
                dataKey="value"
                label={
                  detailView !== 'unit'
                    ? ({ value }: { value: number }) => `${value.toFixed(2)}%`
                    : ({ value }: { value: number }) =>
                        value > 5 ? `${value.toFixed(2)}%` : undefined
                }
                labelLine={detailView !== 'unit'}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              {detailView !== 'unit' && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: 8 }}
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="border-b px-4 py-2.5">
          <div className="mb-2 flex items-center gap-2">
            <ArrowUpDown className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              排放结构概览
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {(detailView === 'stage' ? stageSummary : moduleSummary).map(
              (row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[90px] shrink-0 text-xs text-muted-foreground truncate">
                    {row.name}
                  </div>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${row.value}%`,
                        backgroundColor: row.color,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {row.value.toFixed(2)}%
                  </span>
                  <span className="w-16 text-right font-mono text-xs tabular-nums text-muted-foreground/60 hidden xl:block">
                    {row.gwp.toFixed(4)}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 border-b px-4 py-2.5">
            <Badge variant="outline" className={cn(STATUS_BADGE.teal, 'gap-1')}>
              GWP100 - 温室气体·单位评估…
            </Badge>
            <div className="flex-1" />
            <div className="relative w-[180px]">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="ghost" size="icon-sm">
              <SlidersHorizontal data-icon />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">阶段</TableHead>
                <TableHead className="w-[80px]">模块</TableHead>
                <TableHead>单元过程</TableHead>
                <TableHead className="w-[120px]">占产品排放比</TableHead>
                <TableHead className="w-[110px] text-right">GWP 数值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="text-muted-foreground">{unit.stage}</TableCell>
                  <TableCell className="text-muted-foreground">{unit.module}</TableCell>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>
                    {unit.percentage > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-1.5 py-0 font-mono tabular-nums',
                            unit.percentage >= 10
                              ? STATUS_BADGE.teal
                              : unit.percentage >= 1
                                ? STATUS_BADGE.info
                                : STATUS_BADGE.neutral,
                          )}
                        >
                          {unit.percentage.toFixed(2)}%
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">0.00%</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {unit.gwp > 0 ? (
                      unit.gwp.toFixed(4)
                    ) : (
                      <span className="text-muted-foreground/40">0.0000</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t px-4 py-2.5">
            <span className="text-xs text-muted-foreground">
              共 {filteredUnits.length} 项
              {tableSearch && ` · 过滤自 ${processUnits.length} 项`}
            </span>
          </div>
        </div>
      </div>

      <div className={cn('rounded-lg bg-card p-4', !isDialog && 'border')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs font-semibold text-muted-foreground">
              全阶段合计
            </span>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="font-mono text-xl font-bold tabular-nums">
                {task.gwpResult?.toFixed(7) ?? '8.8556282'}
              </p>
              <p className="text-xs text-muted-foreground">kgCO₂e / 功能单位</p>
            </div>
            <Badge variant="outline" className={STATUS_BADGE.warning}>
              {task.uncertainty === '—' ? '-11.43% ~ 11.98%' : task.uncertainty}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )

  return localizeProductCarbonNode(
    locale,
    <div
      className={cn(
        'flex h-full min-h-0 gap-4 overflow-hidden',
        isDialog ? 'pl-5 pr-4 pb-4' : 'pr-4',
      )}
    >
      <CarbonTreeNav
        title="阶段视图"
        className={cn('h-full min-h-0', isDialog && 'border-0')}
        headerActions={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="搜索节点">
              <Search data-icon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="筛选节点">
              <SlidersHorizontal data-icon />
            </Button>
          </>
        }
        rootLabel={task.productName}
        rootDescription={task.productCode}
        rootSelected={selectedTreePath === 'root'}
        nodes={treeNavNodes}
        expandedIds={expandedIds}
        isNodeSelected={(path) => selectedTreePath === path}
        formatValue={(value) => `${value.toFixed(2)}%`}
        onSelectRoot={() => setSelectedTreePath('root')}
        onNodeClick={(node) => setSelectedTreePath(node.path)}
        onToggleNode={toggleTreeNode}
      />

      {isDialog ? (
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-px">
          {resultContent}
        </div>
      ) : (
        <ScrollArea className="min-h-0 min-w-0 flex-1">{resultContent}</ScrollArea>
      )}
    </div>,
  )
}
