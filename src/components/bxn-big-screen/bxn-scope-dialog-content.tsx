'use client'

import * as React from 'react'
import { Boxes, Search, Settings2 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  CarbonScreenScopeDistributionDialogConfig,
  CarbonScreenScopeDistributionSourceRow,
} from '@/api/carbon-screen'
import type { CarbonTreeNavNode } from '@/components/carbon-accounting/shared/carbon-tree-nav'
import { CarbonTreeNav } from '@/components/carbon-accounting/shared/carbon-tree-nav'
import { useAppLocale } from '@/components/layout/app-locale-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CARBON_SCREEN_DIALOG_COLORS,
  CARBON_SCREEN_SCOPE_COLORS,
} from '@/lib/carbon-screen-chart-colors'

type DetailTab = 'category' | 'subCategory' | 'source'

interface SelectionPath {
  type: 'summary' | 'category' | 'subCategory' | 'source'
  category?: string
  subCategory?: string
  source?: string
}

interface TreeNode {
  id: string
  label: string
  type: SelectionPath['type']
  path: SelectionPath
  share: number | null
  children?: Array<TreeNode>
}

interface CategoryRow {
  category: string
  co2e: number
  share: number
}

interface SubCategoryRow {
  category: string
  subCategory: string
  co2e: number
  share: number
}

const PIE_COLORS = [...CARBON_SCREEN_SCOPE_COLORS]

const SCOPE_DIALOG_TRANSLATIONS: Record<string, string> = {
  边界视图: 'Boundary View',
  搜索节点: 'Search Node',
  模型视图设置: 'Model View Settings',
  汇总: 'Summary',
  总排放量: 'Total Emissions',
  展开全部温室气体排放量结果: 'Expand All GHG Emission Results',
  排放详情: 'Emission Details',
  类别: 'Category',
  子类别: 'Subcategory',
  排放源: 'Emission Source',
  类别占比图: 'Category Share Chart',
  '类别-子类别占比图': 'Category-Subcategory Share Chart',
  暂无可视化数据: 'No Visualization Data',
  '搜索类别、子类别或排放源...':
    'Search category, subcategory, or emission source...',
  总排放占比: 'Total Emission Share',
}

function tScope(value: string, locale: 'zh-CN' | 'en-US') {
  if (locale === 'zh-CN') return value

  return SCOPE_DIALOG_TRANSLATIONS[value] ?? value
}

const STACK_COLORS = [...CARBON_SCREEN_DIALOG_COLORS]

function normalizeShare(value: number | null): number {
  return value ?? 0
}

function formatShare(value: number | null): string {
  if (value === null) return '--%'
  return `${value.toFixed(2)}%`
}

function formatTableNumber(value: number): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

function formatSummaryNumber(value: number): string {
  const normalized = value.toFixed(7).replace(/\.?0+$/, '')
  const [integerPart, decimalPart] = normalized.split('.')
  const groupedInteger = Number(integerPart).toLocaleString('zh-CN')

  return decimalPart ? `${groupedInteger}.${decimalPart}` : groupedInteger
}

function matchSelection(
  row: CarbonScreenScopeDistributionSourceRow,
  selection: SelectionPath,
): boolean {
  if (selection.type === 'summary') return true
  if (selection.category && row.category !== selection.category) return false
  if (selection.subCategory && row.subCategory !== selection.subCategory)
    return false
  if (selection.source && row.source !== selection.source) return false
  return true
}

function aggregateCategory(
  rows: Array<CarbonScreenScopeDistributionSourceRow>,
): Array<CategoryRow> {
  const map = new Map<string, CategoryRow>()

  for (const row of rows) {
    const current = map.get(row.category) ?? {
      category: row.category,
      co2e: 0,
      share: 0,
    }

    current.co2e += row.co2e
    current.share += normalizeShare(row.share)
    map.set(row.category, current)
  }

  return [...map.values()]
}

function aggregateSubCategory(
  rows: Array<CarbonScreenScopeDistributionSourceRow>,
): Array<SubCategoryRow> {
  const map = new Map<string, SubCategoryRow>()

  for (const row of rows) {
    const key = `${row.category}__${row.subCategory}`
    const current = map.get(key) ?? {
      category: row.category,
      subCategory: row.subCategory,
      co2e: 0,
      share: 0,
    }

    current.co2e += row.co2e
    current.share += normalizeShare(row.share)
    map.set(key, current)
  }

  return [...map.values()]
}

function buildTreeData(
  rows: Array<CarbonScreenScopeDistributionSourceRow>,
): Array<TreeNode> {
  const categoryMap = new Map<
    string,
    Array<CarbonScreenScopeDistributionSourceRow>
  >()

  for (const row of rows) {
    const current = categoryMap.get(row.category) ?? []
    current.push(row)
    categoryMap.set(row.category, current)
  }

  const categories: Array<TreeNode> = []

  for (const [category, categoryRows] of categoryMap.entries()) {
    const subCategoryMap = new Map<
      string,
      Array<CarbonScreenScopeDistributionSourceRow>
    >()

    for (const row of categoryRows) {
      const current = subCategoryMap.get(row.subCategory) ?? []
      current.push(row)
      subCategoryMap.set(row.subCategory, current)
    }

    const subCategories: Array<TreeNode> = []

    for (const [subCategory, subCategoryRows] of subCategoryMap.entries()) {
      subCategories.push({
        id: `${category}-${subCategory}`,
        label: subCategory,
        type: 'subCategory',
        path: {
          type: 'subCategory',
          category,
          subCategory,
        },
        share: subCategoryRows.reduce(
          (sum, row) => sum + normalizeShare(row.share),
          0,
        ),
        children: subCategoryRows.map((row) => ({
          id: row.id,
          label: row.source,
          type: 'source',
          path: {
            type: 'source',
            category: row.category,
            subCategory: row.subCategory,
            source: row.source,
          },
          share: row.share,
        })),
      })
    }

    categories.push({
      id: category,
      label: category,
      type: 'category',
      path: {
        type: 'category',
        category,
      },
      share: categoryRows.reduce(
        (sum, row) => sum + normalizeShare(row.share),
        0,
      ),
      children: subCategories,
    })
  }

  return categories
}

function buildNavNodes(
  nodes: Array<TreeNode>,
): Array<CarbonTreeNavNode<SelectionPath>> {
  return nodes.map((node) => ({
    id: node.id,
    label: node.label,
    value: node.share ?? Number.NaN,
    path: node.path,
    children: node.children ? buildNavNodes(node.children) : undefined,
  }))
}

function isSameSelectionPath(
  left: SelectionPath,
  right: SelectionPath,
): boolean {
  return (
    left.type === right.type &&
    left.category === right.category &&
    left.subCategory === right.subCategory &&
    left.source === right.source
  )
}

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
      <p className="font-mono text-sm font-semibold">
        {payload[0].value.toFixed(2)}%
      </p>
    </div>
  )
}

function SubCategoryBarTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ name?: string; value?: number; color?: string }>
}) {
  if (!active || !payload?.length) return null

  const visibleItems = payload.filter((item) => (item.value ?? 0) > 0)

  return (
    <div className="max-w-[260px] rounded-lg border bg-popover px-3 py-2 shadow-md">
      <p className="truncate text-xs font-semibold text-foreground">{label}</p>
      <div className="mt-1 flex flex-col gap-1">
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3"
          >
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: item.color ?? 'var(--muted-foreground)',
                }}
              />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-foreground">
              {(item.value ?? 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BxnScopeDialogContent({
  data,
}: {
  data: CarbonScreenScopeDistributionDialogConfig
}) {
  const { locale } = useAppLocale()
  const [detailTab, setDetailTab] = React.useState<DetailTab>('category')
  const [searchText, setSearchText] = React.useState('')
  const [selectedPath, setSelectedPath] = React.useState<SelectionPath>({
    type: 'summary',
  })
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

  const treeData = React.useMemo(() => buildTreeData(data.rows), [data.rows])
  const treeNavNodes = React.useMemo(() => buildNavNodes(treeData), [treeData])

  React.useEffect(() => {
    const ids = new Set<string>()

    for (const category of treeData) {
      ids.add(category.id)

      for (const subCategory of category.children ?? []) {
        ids.add(subCategory.id)
      }
    }

    setExpandedIds(ids)
  }, [treeData])

  const scopedRows = React.useMemo(
    () => data.rows.filter((row) => matchSelection(row, selectedPath)),
    [data.rows, selectedPath],
  )

  const filteredRows = React.useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) return scopedRows

    return scopedRows.filter((row) =>
      [row.category, row.subCategory, row.source].some((field) =>
        field.toLowerCase().includes(keyword),
      ),
    )
  }, [scopedRows, searchText])

  const categoryRows = React.useMemo(
    () => aggregateCategory(filteredRows),
    [filteredRows],
  )

  const subCategoryRows = React.useMemo(
    () => aggregateSubCategory(filteredRows),
    [filteredRows],
  )

  const sourceRows = React.useMemo(() => filteredRows, [filteredRows])

  const pieData = React.useMemo(
    () =>
      categoryRows.map((row, index) => ({
        name: row.category,
        value: row.share,
        color: PIE_COLORS[index % PIE_COLORS.length],
      })),
    [categoryRows],
  )

  const subCategoryBarData = React.useMemo(() => {
    const categoryTotals = new Map<string, number>()
    const categoryValues = new Map<string, Map<string, number>>()
    const categoryOrder: Array<string> = []
    const subCategoryOrder: Array<string> = []

    for (const row of subCategoryRows) {
      if (!categoryTotals.has(row.category)) {
        categoryOrder.push(row.category)
      }

      if (!subCategoryOrder.includes(row.subCategory)) {
        subCategoryOrder.push(row.subCategory)
      }

      categoryTotals.set(
        row.category,
        (categoryTotals.get(row.category) ?? 0) + row.share,
      )

      const values =
        categoryValues.get(row.category) ?? new Map<string, number>()
      values.set(row.subCategory, row.share)
      categoryValues.set(row.category, values)
    }

    const colorMap = Object.fromEntries(
      subCategoryOrder.map((key, index) => [
        key,
        STACK_COLORS[index % STACK_COLORS.length],
      ]),
    ) as Record<string, string>

    const rows = categoryOrder.map((category) => {
      const totalShare = categoryTotals.get(category) ?? 0
      const values = categoryValues.get(category) ?? new Map<string, number>()
      const chartRow: Record<string, number | string> = { category }

      for (const subCategory of subCategoryOrder) {
        const share = values.get(subCategory) ?? 0
        chartRow[subCategory] = totalShare > 0 ? (share / totalShare) * 100 : 0
      }

      return chartRow
    })

    return {
      rows,
      subCategoryKeys: subCategoryOrder,
      colorMap,
    }
  }, [subCategoryRows])

  const tableColSpan =
    detailTab === 'category' ? 3 : detailTab === 'subCategory' ? 4 : 5

  const toggleExpanded = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)

      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })
  }, [])

  const handleTreeNodeClick = React.useCallback(
    (node: CarbonTreeNavNode<SelectionPath>) => {
      setSelectedPath(node.path)

      if (node.path.type === 'category') {
        setDetailTab('category')
        return
      }

      if (node.path.type === 'subCategory') {
        setDetailTab('subCategory')
        return
      }

      if (node.path.type === 'source') {
        setDetailTab('source')
      }
    },
    [],
  )

  const expandAll = React.useCallback(() => {
    const ids = new Set<string>()

    for (const category of treeData) {
      ids.add(category.id)

      for (const subCategory of category.children ?? []) {
        ids.add(subCategory.id)
      }
    }

    setExpandedIds(ids)
    setSelectedPath({ type: 'summary' })
    setDetailTab('category')
  }, [treeData])

  return (
    <div className="flex h-full min-h-0 items-stretch gap-4 p-4">
      <CarbonTreeNav
        title={tScope('边界视图', locale)}
        className="min-h-0 h-full border-0"
        defaultCollapsed
        headerStart={
          <Select defaultValue="boundary">
            <SelectTrigger className="w-[120px]">
              <SelectValue>
                {(value: string) =>
                  value === 'boundary' ? tScope('边界视图', locale) : value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="boundary" label={tScope('边界视图', locale)}>
                  {tScope('边界视图', locale)}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        }
        headerActions={
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={tScope('搜索节点', locale)}
            >
              <Search data-icon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={tScope('模型视图设置', locale)}
            >
              <Settings2 data-icon />
            </Button>
          </>
        }
        rootLabel={tScope('汇总', locale)}
        rootDescription={
          locale === 'zh-CN'
            ? `共 ${treeData.length} 个类别`
            : `${treeData.length} categories`
        }
        rootSelected={selectedPath.type === 'summary'}
        nodes={treeNavNodes}
        expandedIds={expandedIds}
        isNodeSelected={(path) => isSameSelectionPath(selectedPath, path)}
        formatValue={(value) =>
          Number.isFinite(value) ? `${value.toFixed(2)}%` : '--%'
        }
        onSelectRoot={() => {
          setSelectedPath({ type: 'summary' })
          setDetailTab('category')
        }}
        onNodeClick={handleTreeNodeClick}
        onToggleNode={toggleExpanded}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 px-px">
        <div className="shrink-0 rounded-lg bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Boxes className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {tScope('汇总', locale)}
            </h3>
          </div>
          <div className="rounded-md bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {tScope('总排放量', locale)} (GWP: {data.summary.gwpVersion})
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
              {formatSummaryNumber(data.summary.totalEmission)}{' '}
              <span className="text-base font-normal text-muted-foreground">
                {data.summary.unit}
              </span>
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0"
              onClick={expandAll}
            >
              {tScope('展开全部温室气体排放量结果', locale)}
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <h3 className="text-sm font-semibold text-foreground">
              {tScope('排放详情', locale)} (
              {locale === 'zh-CN' ? '单位' : 'Unit'}: {data.summary.unit})
            </h3>
            <Tabs
              value={detailTab}
              onValueChange={(value) => setDetailTab(value as DetailTab)}
            >
              <TabsList>
                <TabsTrigger value="category">
                  {tScope('类别', locale)}
                </TabsTrigger>
                <TabsTrigger value="subCategory">
                  {tScope('子类别', locale)}
                </TabsTrigger>
                <TabsTrigger value="source">
                  {tScope('排放源', locale)}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {detailTab === 'category' && (
            <div className="border-b p-4">
              <p className="mb-2 text-xs text-muted-foreground">
                {tScope('类别占比图', locale)}
              </p>
              <div className="rounded-md bg-muted/20 px-2 py-3">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart margin={{ top: 16, right: 8, bottom: 12, left: 8 }}>
                    <Pie
                      data={pieData}
                      cx="46%"
                      cy="56%"
                      outerRadius={76}
                      innerRadius={0}
                      dataKey="value"
                      isAnimationActive={false}
                      labelLine={false}
                      label={({ value }) => `${Number(value ?? 0).toFixed(2)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            entry.color || PIE_COLORS[index % PIE_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {detailTab === 'subCategory' && (
            <div className="border-b p-4">
              <p className="mb-2 text-xs text-muted-foreground">
                {tScope('类别-子类别占比图', locale)}
              </p>
              <div className="rounded-md bg-muted/20 px-2 py-3">
                {subCategoryBarData.rows.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={subCategoryBarData.rows}
                      margin={{ top: 8, right: 12, bottom: 12, left: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                        axisLine={false}
                        tickLine={false}
                        width={34}
                      />
                      <Tooltip content={<SubCategoryBarTooltip />} />
                      <Legend
                        iconType="square"
                        wrapperStyle={{
                          fontSize: '11px',
                          color: 'var(--muted-foreground)',
                        }}
                        formatter={(value) => (
                          <span className="text-[11px] text-muted-foreground">
                            {value}
                          </span>
                        )}
                      />
                      {subCategoryBarData.subCategoryKeys.map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          name={key}
                          stackId="subcategory"
                          fill={subCategoryBarData.colorMap[key]}
                          maxBarSize={48}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-xs text-muted-foreground">
                    {tScope('暂无可视化数据', locale)}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-b px-4 py-2.5">
            <div className="relative w-[280px]">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={tScope('搜索类别、子类别或排放源...', locale)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">
                    {tScope('类别', locale)}
                  </TableHead>
                  {(detailTab === 'subCategory' || detailTab === 'source') && (
                    <TableHead className="w-[180px]">
                      {tScope('子类别', locale)}
                    </TableHead>
                  )}
                  {detailTab === 'source' && (
                    <TableHead className="w-[220px]">
                      {tScope('排放源', locale)}
                    </TableHead>
                  )}
                  <TableHead className="w-[130px] text-right">
                    {tScope('总排放量', locale)}
                  </TableHead>
                  <TableHead className="w-[110px] text-right">
                    {tScope('总排放占比', locale)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailTab === 'category' &&
                  categoryRows.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatTableNumber(row.co2e)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {formatShare(row.share)}
                      </TableCell>
                    </TableRow>
                  ))}

                {detailTab === 'subCategory' &&
                  subCategoryRows.map((row) => (
                    <TableRow key={`${row.category}-${row.subCategory}`}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.subCategory}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatTableNumber(row.co2e)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {formatShare(row.share)}
                      </TableCell>
                    </TableRow>
                  ))}

                {detailTab === 'source' &&
                  sourceRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.subCategory}</TableCell>
                      <TableCell>{row.source}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatTableNumber(row.co2e)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {formatShare(row.share)}
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={tableColSpan}
                      className="py-10 text-center text-xs text-muted-foreground"
                    >
                      当前筛选条件下暂无排放数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            共
            {detailTab === 'category'
              ? categoryRows.length
              : detailTab === 'subCategory'
                ? subCategoryRows.length
                : sourceRows.length}
            项
          </div>
        </div>
      </div>
    </div>
  )
}
