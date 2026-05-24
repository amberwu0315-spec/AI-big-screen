import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
  Bar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import {
  BatteryCharging,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  Factory,
  Gauge,
  Keyboard,
  Leaf,
  LineChart,
  Maximize2,
  PackageCheck,
  PieChart,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Waves,
  Zap,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react'

import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'
import { ScreenShell } from '@/components/common/ScreenShell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type WidgetSize = 'small' | 'medium' | 'large'
type SlotColumn = 'left' | 'center' | 'right'
type WidgetCategory = 'carbon' | 'energy' | 'risk' | 'accounting'
type DashboardLayoutMode = 'nine' | 'six'
type DashboardTab = 'carbon_accounting' | 'esg' | 'energy_carbon'

type WidgetTemplate = {
  id: string
  name: string
  description: string
  category: WidgetCategory
  icon: LucideIcon
}

type DashboardSlot = {
  id: string
  column: SlotColumn
  size: WidgetSize
  moduleId: string
}

type PlacedWidget = WidgetTemplate & {
  displayTitle?: string
  instanceId: string
  slotId: string
  size: WidgetSize
}

const titleQuickPhrases = ['点击输入驾驶舱标题', '运营管理仪表盘', '综合分析仪表盘', '企业数据驾驶舱']
const productFlowNeutralBackground = '#F7F8FA'
const productFlowDefaultGridColor = '#24406E'

function ProductFlowSurfaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor: productFlowNeutralBackground }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `linear-gradient(${productFlowDefaultGridColor} 1px, transparent 1px), linear-gradient(90deg, ${productFlowDefaultGridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.05,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-[2] h-[208px] w-[208px]"
        style={{
          backgroundImage: 'radial-gradient(circle at 3.714px 3.714px, rgba(255,255,255,0.2) 0 3.714px, transparent 3.8px)',
          backgroundSize: '22.2857px 22.2857px',
        }}
      />
    </div>
  )
}


const widgetTemplates: WidgetTemplate[] = [
  { id: 'total-emission', name: '总量概览', description: '核心指标总览', category: 'carbon', icon: Factory },
  { id: 'monthly-trend', name: '趋势分析', description: '追踪指标变化趋势', category: 'carbon', icon: LineChart },
  { id: 'emission-source', name: '来源分析', description: '识别主要来源占比', category: 'carbon', icon: PieChart },
  { id: 'product-footprint-top', name: '重点排行', description: '排行关键贡献项', category: 'carbon', icon: Boxes },
  { id: 'lifecycle-segment-emission', name: '生命周期分析', description: '按阶段分析表现', category: 'carbon', icon: Gauge },
  { id: 'total-energy', name: '核算质量', description: '监控核算数据健康', category: 'carbon', icon: ShieldCheck },
  { id: 'energy-overview', name: '能源结构', description: '展示结构占位关系', category: 'energy', icon: BatteryCharging },
  { id: 'energy-structure', name: '来源分布', description: '展示来源分布关系', category: 'energy', icon: PieChart },
  { id: 'green-power', name: '绿电占比', description: '监控清洁能源占比', category: 'energy', icon: ShieldCheck },
  { id: 'energy-loss', name: '能耗趋势', description: '追踪能源消耗变化', category: 'energy', icon: LineChart },
  { id: 'risk-alert', name: '风险概览', description: '展示风险占位概览', category: 'risk', icon: ShieldCheck },
  { id: 'abnormal-energy-alert', name: '异常来源', description: '识别异常来源占比', category: 'risk', icon: PieChart },
  { id: 'over-budget-alert', name: '超额排行', description: '排行预算偏离项目', category: 'risk', icon: Gauge },
  { id: 'quota-gap', name: '缺口趋势', description: '追踪配额缺口变化', category: 'risk', icon: LineChart },
  { id: 'compliance-days-left', name: '履约健康', description: '监控履约风险状态', category: 'risk', icon: ShieldCheck },
  { id: 'accounting-progress', name: '审核进度', description: '展示流程完成状态', category: 'accounting', icon: Gauge },
  { id: 'inventory-report-status', name: '报告状态', description: '监控盘查报告流转', category: 'accounting', icon: Boxes },
  { id: 'supplier-data-recovery', name: '回收趋势', description: '追踪供应商数据回收', category: 'accounting', icon: LineChart },
  { id: 'verification-material', name: '资料完备率', description: '检查核查资料完整性', category: 'accounting', icon: ShieldCheck },
  { id: 'pending-vouchers', name: '凭证排行', description: '排行待补凭证项目', category: 'accounting', icon: Boxes },
]

const dashboardSlots: DashboardSlot[] = [
  { id: 'left-total', column: 'left', size: 'small', moduleId: 'total-emission' },
  { id: 'left-energy', column: 'left', size: 'small', moduleId: 'energy-overview' },
  { id: 'left-green', column: 'left', size: 'small', moduleId: 'emission-source' },
  { id: 'left-lifecycle', column: 'left', size: 'small', moduleId: 'lifecycle-segment-emission' },
  { id: 'center-trend', column: 'center', size: 'large', moduleId: 'monthly-trend' },
  { id: 'center-top', column: 'center', size: 'large', moduleId: 'product-footprint-top' },
  { id: 'right-risk', column: 'right', size: 'medium', moduleId: 'risk-alert' },
  { id: 'right-source', column: 'right', size: 'medium', moduleId: 'energy-structure' },
  { id: 'right-accounting', column: 'right', size: 'medium', moduleId: 'accounting-progress' },
]

const dashboardLayoutSlotIds: Record<DashboardLayoutMode, string[]> = {
  nine: dashboardSlots.map((slot) => slot.id),
  six: ['center-trend', 'center-top', 'right-risk', 'right-source', 'left-total', 'left-energy'],
}

const dashboardLayoutLabels: Record<DashboardLayoutMode, string> = {
  nine: '9格布局',
  six: '6格布局',
}

const dragTemplatePrefix = 'template:'
const dragPlacedPrefix = 'placed:'

function templatePayload(template: WidgetTemplate) {
  return `${dragTemplatePrefix}${template.id}`
}

function placedPayload(widget: PlacedWidget) {
  return `${dragPlacedPrefix}${widget.instanceId}`
}

function getSlotsByColumn(column: SlotColumn, layoutMode: DashboardLayoutMode) {
  const activeSlotIds = new Set(dashboardLayoutSlotIds[layoutMode])

  return dashboardSlots.filter((slot) => slot.column === column && activeSlotIds.has(slot.id))
}

function getSlotsByLayout(layoutMode: DashboardLayoutMode) {
  const activeSlotIds = dashboardLayoutSlotIds[layoutMode]

  return activeSlotIds
    .map((slotId) => dashboardSlots.find((slot) => slot.id === slotId))
    .filter((slot): slot is DashboardSlot => Boolean(slot))
}

function getSixLayoutSlotClassName(slotId: string) {
  if (slotId === 'center-trend') return 'col-[1/7] row-[1/7]'
  if (slotId === 'center-top') return 'col-[7/13] row-[1/7]'
  if (slotId === 'right-risk') return 'col-[1/5] row-[7/13]'
  if (slotId === 'right-source') return 'col-[5/9] row-[7/13]'
  if (slotId === 'left-total') return 'col-[9/13] row-[7/10]'
  if (slotId === 'left-energy') return 'col-[9/13] row-[10/13]'

  return ''
}

type ChartVisualKind =
  | 'coreRing'
  | 'rosePie'
  | 'trendArea'
  | 'donut'
  | 'barRank'
  | 'lifecycleStages'
  | 'energyGauge'
  | 'energyBars'
  | 'layeredDonut'
  | 'semiRing'
  | 'lossPath'
  | 'riskRadar'
  | 'alarmRipple'
  | 'warningBar'
  | 'gapTrend'
  | 'countdownCalendar'
  | 'processNodes'
  | 'documentCheck'
  | 'supplierReturn'
  | 'materialComplete'
  | 'voucherChecklist'
  | 'assetGauge'
  | 'compareTrend'
  | 'reverseBarRank'
  | 'taskFlow'



function getDashboardCardTitle(widget: PlacedWidget) {
  return widget.displayTitle ?? widget.name
}

function getCardTitleClassName(size: WidgetSize, previewMode: boolean) {
  if (previewMode) {
    if (size === 'large') return 'text-[clamp(22px,1.35vw,30px)]'
    if (size === 'medium') return 'text-[clamp(18px,1.05vw,24px)]'
    return 'text-[clamp(16px,0.88vw,20px)]'
  }

  if (size === 'large') return 'text-[20px]'
  if (size === 'medium') return 'text-[17px]'
  return 'text-[16px]'
}

function getCardIconClassName(size: WidgetSize, previewMode: boolean) {
  if (previewMode) {
    if (size === 'large') return 'size-[clamp(20px,1.2vw,26px)]'
    if (size === 'medium') return 'size-[clamp(17px,0.95vw,22px)]'
    return 'size-[clamp(15px,0.78vw,18px)]'
  }

  return size === 'large' ? 'size-5' : 'size-4'
}

function getCardHeaderClassName(size: WidgetSize, previewMode: boolean) {
  if (previewMode) {
    if (size === 'large') return 'px-5 pt-4 pb-2 pr-12'
    return 'px-4 pt-3 pb-1.5 pr-11'
  }

  if (size === 'large') return 'px-5 pt-4 pb-2 pr-12'
  if (size === 'medium') return 'px-4 pt-3 pb-1.5 pr-11'
  return 'px-3.5 pt-3 pb-1 pr-10'
}

function getCardIconWrapClassName(size: WidgetSize, previewMode: boolean) {
  if (previewMode) {
    if (size === 'large') return 'size-10 rounded-[10px]'
    if (size === 'medium') return 'size-9 rounded-[9px]'
    return 'size-8 rounded-[8px]'
  }

  if (size === 'large') return 'size-10 rounded-[10px]'
  if (size === 'medium') return 'size-9 rounded-[9px]'
  return 'size-8 rounded-[8px]'
}


function getChartVisualKind(widget: Pick<WidgetTemplate, 'id' | 'name'>): ChartVisualKind {
  if (widget.id === 'total-emission') return 'rosePie'
  if (widget.id === 'monthly-trend') return 'trendArea'
  if (widget.id === 'emission-source') return 'rosePie'
  if (widget.id === 'product-footprint-top') return 'barRank'
  if (widget.id === 'lifecycle-segment-emission') return 'processNodes'
  if (widget.id === 'total-energy') return 'riskRadar'
  if (widget.id === 'energy-overview') return 'barRank'
  if (widget.id === 'energy-structure') return 'coreRing'
  if (widget.id === 'green-power') return 'riskRadar'
  if (widget.id === 'energy-loss') return 'lossPath'
  if (widget.id === 'risk-alert') return 'riskRadar'
  if (widget.id === 'abnormal-energy-alert') return 'lossPath'
  if (widget.id === 'over-budget-alert') return 'barRank'
  if (widget.id === 'quota-gap') return 'trendArea'
  if (widget.id === 'compliance-days-left') return 'riskRadar'
  if (widget.id === 'accounting-progress') return 'processNodes'
  if (widget.id === 'inventory-report-status') return 'processNodes'
  if (widget.id === 'supplier-data-recovery') return 'trendArea'
  if (widget.id === 'verification-material') return 'processNodes'
  if (widget.id === 'pending-vouchers') return 'barRank'

  return 'trendArea'
}

function isChartComponent(template: WidgetTemplate) {
  const kind = getChartVisualKind(template)
  return kind !== 'processNodes' && kind !== 'lifecycleStages'
}


// ==========================================
// 1. Shadcn / Recharts Custom Chart Components
// ==========================================

const rosePieDataMap: Record<string, { name: string; value: number; fill: string }[]> = {
  'total-emission': [
    { name: '电力消耗', value: 450, fill: '#1677FF' },
    { name: '燃气使用', value: 310, fill: '#22D3EE' },
    { name: '物料采购', value: 240, fill: '#3b82f6' }
  ],
  'emission-source': [
    { name: '范围一(直接)', value: 120, fill: '#1677FF' },
    { name: '范围二(间接)', value: 580, fill: '#22D3EE' },
    { name: '范围三(其他)', value: 300, fill: '#3b82f6' }
  ]
}

function ShadcnRosePie({ moduleId, size }: { moduleId: string; size: WidgetSize }) {
  const data = rosePieDataMap[moduleId] || rosePieDataMap['total-emission']
  const innerRadius = size === 'small' ? 28 : size === 'medium' ? 34 : 42
  const outerRadius = size === 'small' ? 52 : size === 'medium' ? 66 : 82
  const chartConfig = {
    value: { label: '碳排放量 (tCO2e)' },
  }
  return (
    <ChartContainer config={chartConfig} className="mx-auto h-full max-h-full aspect-square">
      <RechartsPieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  )
}

const trendAreaDataMap: Record<string, { name: string; value: number }[]> = {
  'monthly-trend': [
    { name: '1月', value: 120 },
    { name: '2月', value: 132 },
    { name: '3月', value: 101 },
    { name: '4月', value: 134 },
    { name: '5月', value: 90 },
    { name: '6月', value: 130 }
  ],
  'quota-gap': [
    { name: '2020', value: 80 },
    { name: '2021', value: 72 },
    { name: '2022', value: 65 },
    { name: '2023', value: 45 },
    { name: '2024', value: 30 },
    { name: '2025', value: 15 }
  ],
  'supplier-data-recovery': [
    { name: '第一周', value: 25 },
    { name: '第二周', value: 48 },
    { name: '第三周', value: 67 },
    { name: '第四周', value: 89 }
  ]
}

function ShadcnTrendArea({ moduleId, size }: { moduleId: string; size: WidgetSize }) {
  const data = trendAreaDataMap[moduleId] || trendAreaDataMap['monthly-trend']
  const isCompact = size === 'small'
  const chartConfig = {
    value: { label: '数值', color: '#1677FF' },
  }
  return (
    <ChartContainer config={chartConfig} className="h-full min-h-0 w-full">
      <AreaChart data={data} margin={isCompact ? { left: 0, right: 8, top: 8, bottom: 0 } : { left: -8, right: 10, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorValue-${moduleId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1677FF" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#1677FF" stopOpacity={0.01}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: isCompact ? 9 : 10, fill: '#64748b' }} />
        {isCompact ? null : <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#64748b' }} />}
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="value" stroke="#1677FF" strokeWidth={2} fill={`url(#colorValue-${moduleId})`} />
      </AreaChart>
    </ChartContainer>
  )
}

const barRankDataMap: Record<string, { name: string; value: number }[]> = {
  'product-footprint-top': [
    { name: '背包A', value: 15.4 },
    { name: '背包B', value: 12.8 },
    { name: '外套A', value: 9.6 },
    { name: '鞋子B', value: 7.2 }
  ],
  'energy-overview': [
    { name: '外购电力', value: 48 },
    { name: '天然气', value: 28 },
    { name: '柴油消耗', value: 15 },
    { name: '自发绿电', value: 9 }
  ],
  'over-budget-alert': [
    { name: 'A线', value: 120 },
    { name: 'B线', value: 95 },
    { name: 'C仓', value: 60 }
  ],
  'pending-vouchers': [
    { name: '发票', value: 12 },
    { name: '电费', value: 8 },
    { name: '物流', value: 5 }
  ]
}

function ShadcnBarRank({ moduleId, size }: { moduleId: string; size: WidgetSize }) {
  const data = barRankDataMap[moduleId] || barRankDataMap['product-footprint-top']
  const isCompact = size === 'small'
  const chartConfig = {
    value: { label: '指标数值', color: '#1677FF' },
  }
  return (
    <ChartContainer config={chartConfig} className="h-full min-h-0 w-full">
      <RechartsBarChart data={data} margin={isCompact ? { left: 0, right: 8, top: 8, bottom: 0 } : { left: -8, right: 10, top: 10, bottom: 0 }}>
        <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: isCompact ? 9 : 10, fill: '#64748b' }} />
        {isCompact ? null : <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#64748b' }} />}
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="#1677FF" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ChartContainer>
  )
}

const riskRadarDataMap: Record<string, { subject: string; value: number }[]> = {
  'total-energy': [
    { subject: '数据精度', value: 90 },
    { subject: '覆盖度', value: 85 },
    { subject: '时效性', value: 95 },
    { subject: '凭证率', value: 80 },
    { subject: '可溯源', value: 88 }
  ],
  'green-power': [
    { subject: '光伏', value: 60 },
    { subject: '风电', value: 75 },
    { subject: '水电', value: 90 },
    { subject: '核电', value: 40 },
    { subject: '生物质', value: 30 }
  ],
  'risk-alert': [
    { subject: '指标偏差', value: 35 },
    { subject: '合规性', value: 20 },
    { subject: '限额超标', value: 15 },
    { subject: '履约缺口', value: 45 },
    { subject: '凭证缺失', value: 25 }
  ],
  'compliance-days-left': [
    { subject: '结余', value: 80 },
    { subject: '资金', value: 90 },
    { subject: '清缴就绪', value: 95 },
    { subject: '报告质量', value: 85 }
  ]
}

function ShadcnRiskRadar({ moduleId, size }: { moduleId: string; size: WidgetSize }) {
  const data = riskRadarDataMap[moduleId] || riskRadarDataMap['risk-alert']
  const angleFontSize = size === 'small' ? 8 : 9
  const chartConfig = {
    value: { label: '评分值', color: '#1677FF' },
  }
  return (
    <ChartContainer config={chartConfig} className="mx-auto h-full max-h-full aspect-square">
      <RechartsRadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="subject" style={{ fontSize: angleFontSize, fill: '#64748b' }} />
        <PolarGrid gridType="circle" />
        <Radar dataKey="value" stroke="#1677FF" fill="#1677FF" fillOpacity={0.25} />
      </RechartsRadarChart>
    </ChartContainer>
  )
}

function ShadcnCoreRing({ size }: { moduleId: string; size: WidgetSize }) {
  const data = [
    { name: '自发绿电', value: 45, fill: '#1677FF' },
    { name: '外购火电', value: 35, fill: '#22D3EE' },
    { name: '其它能耗', value: 20, fill: '#3b82f6' }
  ]
  const chartConfig = {
    value: { label: '占比 (%)' },
  }
  const innerRadius = size === 'small' ? 28 : size === 'medium' ? 34 : 42
  const outerRadius = size === 'small' ? 52 : size === 'medium' ? 66 : 82
  return (
    <ChartContainer config={chartConfig} className="mx-auto h-full max-h-full aspect-square">
      <RechartsPieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  )
}

function ShadcnLossPath({ size }: { moduleId: string; size: WidgetSize }) {
  const contentPadding = size === 'small' ? 'p-1' : 'p-2'

  return (
    <div className={cn('flex h-full w-full flex-col justify-center items-center', contentPadding)}>
      <div className="flex justify-between items-center w-full max-w-[240px] relative">
        <div className="flex flex-col items-center z-10">
          <span className="size-8 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 text-[10px] flex items-center justify-center font-semibold bg-white shadow-sm">输入</span>
          <span className="text-[10px] text-slate-400 mt-1">主电网</span>
        </div>
        
        <div className="absolute left-7 right-7 top-4 h-0.5 bg-slate-100 overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-r from-blue-500 to-[#1677FF] animate-pulse w-full" />
        </div>
        
        <div className="flex flex-col items-center z-10">
          <span className="size-10 rounded-full bg-[#1677FF] text-white text-xs flex items-center justify-center font-bold shadow-md shadow-blue-500/20">核心</span>
          <span className="text-[10px] text-slate-700 font-semibold mt-1">变电设备</span>
        </div>
        
        <div className="absolute right-7 left-1/2 top-4 h-0.5 bg-slate-100 overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-r from-[#1677FF] to-emerald-400 animate-pulse w-full" />
        </div>

        <div className="flex flex-col items-center z-10">
          <span className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] flex items-center justify-center font-semibold bg-white shadow-sm">输出</span>
          <span className="text-[10px] text-slate-400 mt-1">负载区</span>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. Main Slot & Wrapper Resolvers
// ==========================================

function ChartThumbnail({ kind, size, moduleId }: { kind: ChartVisualKind; size: WidgetSize; moduleId: string }) {
  if (kind === 'processNodes' || kind === 'lifecycleStages') {
    return <ProcessNodeChart moduleId={moduleId} size={size} />
  }

  if (kind === 'coreRing') {
    return <ShadcnCoreRing moduleId={moduleId} size={size} />
  }

  if (kind === 'rosePie') {
    return <ShadcnRosePie moduleId={moduleId} size={size} />
  }

  if (kind === 'trendArea') {
    return <ShadcnTrendArea moduleId={moduleId} size={size} />
  }

  if (kind === 'barRank') {
    return <ShadcnBarRank moduleId={moduleId} size={size} />
  }

  if (kind === 'riskRadar') {
    return <ShadcnRiskRadar moduleId={moduleId} size={size} />
  }

  if (kind === 'lossPath') {
    return <ShadcnLossPath moduleId={moduleId} size={size} />
  }

  return <ShadcnTrendArea moduleId={moduleId} size={size} />
}

function ProcessNodeChart({ moduleId, size }: { moduleId: string; size: WidgetSize }) {
  const nodes = getProcessNodeIcons(moduleId)
  const nodeClassName = size === 'small' ? 'size-7' : size === 'medium' ? 'size-10' : 'size-[62px]'
  const iconClassName = size === 'small' ? 'size-3.5' : size === 'medium' ? 'size-5' : 'size-8'
  const lineHeightClassName = size === 'small' ? 'h-0.5' : size === 'medium' ? 'h-1' : 'h-[5px]'

  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="flex w-full items-center justify-between">
        {nodes.map((Icon, index) => (
          <div key={index} className="flex flex-1 items-center last:flex-none">
            <div
              className={cn(
                'process-node relative z-10 flex shrink-0 items-center justify-center rounded-full bg-[#1677FF] text-sky-100',
                index === nodes.length - 1 ? 'process-node-active' : '',
                nodeClassName,
              )}
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <Icon className={iconClassName} strokeWidth={1.9} />
            </div>
            {index < nodes.length - 1 ? (
              <div className={cn(size === 'large' ? 'mx-3' : 'mx-2', 'process-line flex-1 rounded-full bg-[linear-gradient(90deg,rgba(22,119,255,0.62),rgba(34,211,238,0.28))]', lineHeightClassName)} style={{ animationDelay: `${index * 110 + 90}ms` }} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function getProcessNodeIcons(moduleId: string): LucideIcon[] {
  if (moduleId === 'lifecycle-segment-emission') {
    return [Leaf, Factory, Truck, Zap, PackageCheck]
  }

  if (moduleId === 'accounting-progress' || moduleId === 'verification-material') {
    return [ClipboardCheck, Database, ShieldCheck, CheckCircle2, Check]
  }

  return [Database, Waves, Gauge, ShieldCheck, CheckCircle2]
}

export function CompanyCarbonDashboardPage() {
  const previewRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>('carbon_accounting')
  const [dashboardTitle, setDashboardTitle] = useState('')
  const [titleDraft, setTitleDraft] = useState('')
  const [titleEditorOpen, setTitleEditorOpen] = useState(false)
  const [widgets, setWidgets] = useState<PlacedWidget[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const [dashboardLayoutMode, setDashboardLayoutMode] = useState<DashboardLayoutMode>('nine')
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false)

  const filteredTemplates = useMemo(() => {
    return widgetTemplates.filter((template) => {
      // 1. Only show chart components in the left sidebar
      if (!isChartComponent(template)) {
        return false
      }

      // 2. Filter by active tab
      if (activeTab === 'carbon_accounting') {
        return template.category === 'accounting'
      } else if (activeTab === 'esg') {
        return template.category === 'risk'
      } else if (activeTab === 'energy_carbon') {
        return template.category === 'carbon' || template.category === 'energy'
      }
      return true
    })
  }, [activeTab])
  const leftSlots = getSlotsByColumn('left', dashboardLayoutMode)
  const centerSlots = getSlotsByColumn('center', dashboardLayoutMode)
  const rightSlots = getSlotsByColumn('right', dashboardLayoutMode)
  const layoutSlots = getSlotsByLayout(dashboardLayoutMode)

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [])

  const getWidgetInSlot = (slotId: string) =>
    widgets.find((widget) => widget.slotId === slotId)

  const handleSlotDrop = (event: DragEvent<HTMLElement>, slot: DashboardSlot) => {
    event.preventDefault()
    event.stopPropagation()

    const payload = event.dataTransfer.getData('text/plain')

    if (payload.startsWith(dragTemplatePrefix)) {
      const templateId = payload.replace(dragTemplatePrefix, '')
      const template = widgetTemplates.find((item) => item.id === templateId)
      const occupiedWidget = getWidgetInSlot(slot.id)

      if (!template || occupiedWidget) {
        return
      }

      setWidgets((currentWidgets) => [
        ...currentWidgets,
        {
          ...template,
          displayTitle: template.name,
          instanceId: `${template.id}-${Date.now()}`,
          slotId: slot.id,
          size: slot.size,
        },
      ])
      return
    }

    if (payload.startsWith(dragPlacedPrefix)) {
      const instanceId = payload.replace(dragPlacedPrefix, '')

      setWidgets((currentWidgets) => {
        const movingWidget = currentWidgets.find((widget) => widget.instanceId === instanceId)
        const occupiedWidget = currentWidgets.find((widget) => widget.slotId === slot.id)

        if (!movingWidget || movingWidget.size !== slot.size) {
          return currentWidgets
        }

        if (occupiedWidget && occupiedWidget.instanceId !== instanceId && occupiedWidget.size !== movingWidget.size) {
          return currentWidgets
        }

        return currentWidgets.map((widget) => {
          if (widget.instanceId === instanceId) {
            return {
              ...widget,
              slotId: slot.id,
            }
          }

          if (occupiedWidget && widget.instanceId === occupiedWidget.instanceId) {
            return {
              ...widget,
              slotId: movingWidget.slotId,
            }
          }

          return widget
        })
      })
    }
  }

  const removeWidget = (instanceId: string) => {
    setWidgets((currentWidgets) => currentWidgets.filter((widget) => widget.instanceId !== instanceId))
  }

  const openTitleEditor = () => {
    setTitleDraft(dashboardTitle)
    setTitleEditorOpen(true)
  }

  useEffect(() => {
    if (!titleEditorOpen) {
      return
    }

    const focusTimer = window.setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 80)

    return () => window.clearTimeout(focusTimer)
  }, [titleEditorOpen])

  const confirmTitle = () => {
    setDashboardTitle(titleDraft.trim())
    setTitleEditorOpen(false)
  }

  const enterPreview = async () => {
    setPreviewMode(true)

    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // Browser fullscreen can be blocked; the in-page preview mode still works.
    }
  }

  const exitPreview = async () => {
    setPreviewMode(false)

    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }

  const selectLayoutMode = (layoutMode: DashboardLayoutMode) => {
    setDashboardLayoutMode(layoutMode)
    setLayoutMenuOpen(false)
  }

  const renderSlot = (slot: DashboardSlot, className?: string) => {
    const widget = getWidgetInSlot(slot.id)
    const isHero = slot.id === 'center-trend'
    const cardTitle = widget ? getDashboardCardTitle(widget) : ''
    const CardIcon = widget?.icon
    return (
      <div
        key={slot.id}
        className={cn(
          'group/slot relative min-h-0 overflow-hidden rounded-[18px] transition duration-300',
          widget ? 'bg-transparent' : 'border border-dashed border-slate-300 bg-slate-50/82',
          !widget && isHero ? 'border-blue-300/70 bg-blue-50/45' : '',
          className,
        )}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={(event) => handleSlotDrop(event, slot)}
      >
        {widget ? (
          <Card
            draggable={!previewMode}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', placedPayload(widget))
              event.dataTransfer.effectAllowed = 'move'
            }}
            onDrop={(event) => handleSlotDrop(event, slot)}
            className={cn(
              'group relative z-10 flex h-full cursor-grab flex-col border border-slate-200 bg-white text-slate-950 transition duration-300 hover:border-blue-200 rounded-[18px] shadow-sm select-none',
              isHero ? 'bg-[linear-gradient(180deg,#FFFFFF,#F8FBFF)]' : '',
              !previewMode ? 'active:cursor-grabbing' : 'cursor-default',
            )}
          >
            <CardHeader className={cn('relative shrink-0', getCardHeaderClassName(slot.size, previewMode))}>
              <div className="flex min-w-0 items-center gap-2">
                {CardIcon ? (
                  <span className={cn('inline-flex shrink-0 items-center justify-center bg-blue-50 text-[#1677FF]', getCardIconWrapClassName(slot.size, previewMode))}>
                    <CardIcon className={getCardIconClassName(slot.size, previewMode)} strokeWidth={1.8} />
                  </span>
                ) : null}
                <CardTitle className={cn('truncate font-semibold tracking-wide text-slate-950', getCardTitleClassName(slot.size, previewMode))}>
                  {cardTitle}
                </CardTitle>
              </div>
              {!previewMode ? (
                <button
                  className={cn(
                    'absolute z-30 flex items-center justify-center rounded-[0.5em] bg-slate-100 text-slate-400 transition hover:bg-blue-50 hover:text-[#1677FF] cursor-pointer',
                    slot.size === 'large' ? 'right-4 top-4 size-8' : 'right-3 top-3 size-7',
                  )}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    removeWidget(widget.instanceId)
                  }}
                  title="移除组件"
                  type="button"
                >
                  <Trash2 className={slot.size === 'large' ? 'size-4' : 'size-3.5'} />
                </button>
              ) : null}
            </CardHeader>

            <CardContent className="flex flex-1 items-center justify-center min-h-0 px-3 pb-3 pt-1 sm:px-4">
              <div className="flex h-full min-h-0 w-full items-center justify-center">
                <ChartThumbnail kind={getChartVisualKind(widget)} size={slot.size} moduleId={widget.id} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-[16.2px] text-center text-slate-500">
            <div className="flex size-11 items-center justify-center rounded-[14px] bg-blue-50 text-blue-500/80">
              <Plus className="size-5" />
            </div>
            <p className="mt-4 whitespace-pre-line text-center text-[14.4px] leading-snug text-black">{`可将左侧任意组件\n拖拽至此处`}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <PageTransition variant="slide-up">
      <ScreenShell
        className="text-slate-950"
        contentClassName={cn(
          'relative h-screen max-h-screen min-h-0 gap-4 overflow-hidden px-6 py-5 xl:px-8 xl:py-7 supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh',
          previewMode ? 'p-0' : '',
        )}
        variant="light"
      >
        <ProductFlowSurfaceBackground />
        {!previewMode ? (
          <NavControl
            actionsClassName="gap-[clamp(10px,0.93vh,12px)]"
            brandClassName="!h-[clamp(48px,5.19vh,56px)] [&_img]:!h-[clamp(28px,3.33vh,36px)]"
            brandVariant="light"
            actionButtonClassName="!size-[clamp(48px,5.19vh,56px)] [&_svg]:!size-[clamp(24px,2.78vh,30px)]"
            className="absolute z-[100] !h-[clamp(64px,9.26vh,100px)] !px-[clamp(16px,2.08vw,40px)] !py-[clamp(18px,2.78vh,30px)] w-full"
            ghostActions
            showBack={true}
            showHome={false}
          />
        ) : null}
        <section
          className={cn(
            'relative z-10 grid h-full min-h-0 gap-4 overflow-hidden xl:gap-5',
            previewMode ? 'grid-cols-1 p-0' : 'grid-cols-[330px_1fr] pt-[clamp(64px,9.26vh,100px)]',
          )}
        >
          {!previewMode ? (
            <aside className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-white/70 bg-white/70 p-4 shadow-[0_18px_46px_rgba(15,23,42,0.10)] backdrop-blur-xl xl:p-5">
              <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-slate-950">配置组件（页面开发中）</h1>
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1 relative z-20 mt-4 xl:mt-5">
                {(
                  [
                    { id: 'carbon_accounting', label: '碳核算' },
                    { id: 'esg', label: 'ESG' },
                    { id: 'energy_carbon', label: '能碳' },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 relative cursor-pointer',
                        isActive
                          ? 'bg-white text-[#1677FF] shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                      )}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
                {filteredTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {filteredTemplates.map((template) => {
                      const Icon = template.icon

                      return (
                        <div
                          key={template.id}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData('text/plain', templatePayload(template))
                            event.dataTransfer.effectAllowed = 'copy'
                          }}
                          className="group flex min-h-[62px] cursor-grab items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:cursor-grabbing xl:min-h-[70px] xl:p-2.5 hover:border-blue-200 transition duration-200"
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-slate-950 text-cyan-200 xl:size-10">
                            <Icon className="size-4.5 xl:size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-start justify-between gap-2">
                              <div className="truncate font-medium text-slate-950">{template.name}</div>
                            </div>
                            <div className="mt-0.5 text-xs leading-snug text-slate-500 xl:mt-1">{template.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="text-slate-400 text-xs font-medium">暂无图表组件</div>
                    <div className="text-[10.8px] text-slate-400/80 mt-1.5 leading-normal whitespace-pre-line">{`非图表组件已被过滤\n拖拽图表至右侧可生成标准看板卡片`}</div>
                  </div>
                )}
              </div>
            </aside>
          ) : null}

          <section
            ref={previewRef}
            className={cn(
              'relative flex min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,252,0.98))]',
              previewMode ? 'h-screen p-[30px] supports-[height:100dvh]:h-dvh' : 'h-full rounded-[22px] border border-slate-200 p-5 xl:p-[30px]',
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-white/35" />
            <div className={cn('relative z-[70] mb-4 flex shrink-0 items-center justify-between gap-4', previewMode ? 'mb-5' : '')}>
              <div>
                {previewMode ? (
                  <h2 className="relative z-10 text-[26px] font-semibold tracking-wide text-slate-950">
                    {dashboardTitle || '点击输入驾驶舱标题'}
                  </h2>
                ) : (
                  <button
                    className="relative z-10 flex min-h-10 min-w-[280px] items-center gap-2 text-left text-[26px] font-semibold tracking-wide text-slate-950 transition hover:text-[#1677FF]"
                    onClick={openTitleEditor}
                    type="button"
                  >
                    <span className={dashboardTitle ? 'text-slate-950' : 'text-slate-500'}>
                      {dashboardTitle || '点击输入驾驶舱标题'}
                    </span>
                    <Keyboard className="size-4 text-slate-400" />
                  </button>
                )}
              </div>
              {previewMode ? (
                <Button
                  className="relative z-10 h-10 rounded-[0.6875em] border border-slate-200 bg-white px-4 text-slate-700 hover:bg-blue-50 hover:text-[#1677FF]"
                  size="sm"
                  variant="outline"
                  onClick={exitPreview}
                >
                  退出
                </Button>
              ) : (
                <div className="relative z-10 flex items-center gap-2">
                  <div className="relative">
                    <Button
                      className="h-10 rounded-[0.6875em] border border-slate-200 bg-white px-4 text-slate-700 transition hover:bg-blue-50 hover:text-[#1677FF]"
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setLayoutMenuOpen((open) => !open)}
                    >
                      {dashboardLayoutLabels[dashboardLayoutMode]}
                      <ChevronDown className={cn('size-4 transition-transform', layoutMenuOpen ? 'rotate-180' : '')} />
                    </Button>
                    {layoutMenuOpen ? (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-[90] w-[132px] overflow-hidden rounded-[12px] border border-slate-200 bg-white p-1">
                        {(['nine', 'six'] as DashboardLayoutMode[]).map((layoutMode) => (
                          <button
                            key={layoutMode}
                            className={cn(
                              'flex h-9 w-full items-center justify-center rounded-[0.5625em] text-sm transition',
                              dashboardLayoutMode === layoutMode ? 'bg-blue-50 text-[#1677FF]' : 'text-slate-700 hover:bg-slate-50',
                            )}
                            onClick={() => selectLayoutMode(layoutMode)}
                            type="button"
                          >
                            {dashboardLayoutLabels[layoutMode]}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Button
                    className="h-10 rounded-[0.6875em] border border-slate-200 bg-white px-4 text-slate-700 transition hover:bg-blue-50 hover:text-[#1677FF]"
                    size="sm"
                    variant="outline"
                    onClick={() => setWidgets([])}
                  >
                    <RefreshCcw className="size-4" />
                    清空
                  </Button>
                  <Button
                    className="h-10 rounded-[0.6875em] border border-slate-200 bg-white px-4 text-slate-700 transition hover:bg-blue-50 hover:text-[#1677FF]"
                    size="sm"
                    variant="outline"
                    onClick={enterPreview}
                  >
                    <Maximize2 className="size-4" />
                    全屏
                  </Button>
                </div>
              )}
            </div>

            {titleEditorOpen && !previewMode ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/20 p-[30px] backdrop-blur-sm">
                <div className="w-full max-w-[820px] rounded-[18px] border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <input
                      ref={titleInputRef}
                      className="min-w-0 flex-1 rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                      inputMode="text"
                      maxLength={24}
                      onChange={(event) => setTitleDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          confirmTitle()
                        }

                        if (event.key === 'Escape') {
                          setTitleEditorOpen(false)
                        }
                      }}
                      placeholder="点击输入驾驶舱标题"
                      type="text"
                      value={titleDraft}
                    />
                    <button
                      className="flex size-11 items-center justify-center rounded-[0.625em] bg-slate-100 text-slate-500 hover:bg-slate-200"
                      onClick={() => setTitleEditorOpen(false)}
                      type="button"
                    >
                      <X className="size-5" />
                    </button>
                    <button
                      className="flex size-11 items-center justify-center rounded-[0.625em] bg-[#1677FF] text-white"
                      onClick={confirmTitle}
                      type="button"
                    >
                      <Check className="size-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-[0.625em] bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
                      onClick={() => {
                        setTitleDraft('')
                        titleInputRef.current?.focus()
                      }}
                      type="button"
                    >
                      清空标题
                    </button>
                    {titleQuickPhrases.map((phrase) => (
                      <button
                        key={phrase}
                        className="rounded-[0.625em] bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-[#1677FF]"
                        onClick={() => {
                          setTitleDraft(phrase)
                          titleInputRef.current?.focus()
                        }}
                        type="button"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                'relative min-h-0 flex-1 overflow-hidden',
              )}
            >
              {dashboardLayoutMode === 'six' ? (
                <div className="relative z-10 grid h-full w-full grid-cols-12 grid-rows-12 gap-4 xl:gap-5">
                  {layoutSlots.map((slot) => renderSlot(slot, getSixLayoutSlotClassName(slot.id)))}
                </div>
              ) : (
                <div className="relative z-10 grid h-full w-full grid-cols-[0.9fr_1.7fr_1.15fr] gap-4 xl:gap-5">
                  <div className="grid min-h-0 gap-4 xl:gap-5" style={{ gridTemplateRows: `repeat(${leftSlots.length}, minmax(0, 1fr))` }}>
                    {leftSlots.map((slot) => renderSlot(slot))}
                  </div>
                  <div className="grid min-h-0 gap-4 xl:gap-5" style={{ gridTemplateRows: `repeat(${centerSlots.length}, minmax(0, 1fr))` }}>
                    {centerSlots.map((slot) => renderSlot(slot))}
                  </div>
                  <div className="grid min-h-0 gap-4 xl:gap-5" style={{ gridTemplateRows: `repeat(${rightSlots.length}, minmax(0, 1fr))` }}>
                    {rightSlots.map((slot) => renderSlot(slot))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>
      </ScreenShell>
    </PageTransition>
  )
}
