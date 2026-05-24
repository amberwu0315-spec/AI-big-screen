import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type Transition } from 'framer-motion'
import { PieChart as EChartsPieChart, SankeyChart } from 'echarts/charts'
import { init, use as useECharts, type EChartsCoreOption, type EChartsType } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, ChevronDown, ChevronRight, FileText, GitBranch, LogOut, MousePointerClick, PieChart } from 'lucide-react'

import backpackCardImage from '@/assets/product-cards/backpack.png'
import backpackMainImage from '@/assets/product-cards/backpack-main.png'
import formaldehydeCardImage from '@/assets/product-cards/formaldehyde.png'
import formaldehydeDetailImage from '@/assets/product-cards/formaldehyde-detail.png'
import lithiumBatteryCardImage from '@/assets/product-cards/lithium-battery.png'
import lithiumBatteryDetailImage from '@/assets/product-cards/lithium-battery-detail.png'
import transformerCardImage from '@/assets/product-cards/transformer.png'
import transformerDetailImage from '@/assets/product-cards/transformer-detail.png'
import { FullscreenButton } from '@/components/common/FullscreenButton'
import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'
import { useElementFitScale } from '@/components/common/ScaledStage'
import { ScreenShell } from '@/components/common/ScreenShell'
import { AbilityPageTurnControls } from '@/components/ability/AbilityPageTurnControls'
import { Confetti, type ConfettiRef } from '@/components/magicui/Confetti'
import { NeonBorder } from '@/components/magicui/NeonBorder'
import { CardScanOverlay } from '@/components/product/CardScanOverlay'
import { ProductPuzzleProgress, puzzlePieces } from '@/components/product/ProductPuzzleProgress'
import { TargetCursor } from '@/components/product/TargetCursor'
import { Button } from '@/components/ui/button'
import { NoiseTexture } from '@/components/ui/noise-texture'
import { getProductCarbonStep, productCarbonSteps } from '@/data/productCarbonSteps'
import { cn } from '@/lib/utils'
import brandLogoDark from '@/assets/brand-logo-dark.svg'

useECharts([
  EChartsPieChart,
  SankeyChart,
  SVGRenderer,
])

type ProductCarbonFlowPageProps = {
  step: string
}

type ProductCard = {
  id: string
  label: string
  imageSrc: string
  detailImageSrc: string
  reportImageSrc: string
}

type StepFourLCI = {
  activityValue: string
  activityUnit: string
  activityRef: string
  activityDQI: number
  activityUncert: string
  secondaryActivityValue?: string
  secondaryActivityUnit?: string
  secondaryActivityRef?: string
  secondaryActivityDQI?: number
  secondaryActivityUncert?: string
  recEfValue: string
  efUnit: string
  recEfSource: string
  recEfRef?: string
  efRef: string
  efDQI: number
  efUncert: string
  recTotal: string
  recUncertLower: string
  recUncertUpper: string
  cusEfValue: string
  cusEfSource: string
  cusEfRef?: string
  cusTotal: string
  cusUncertLower: string
  cusUncertUpper: string
  autoSelectCustomFactor?: boolean
}

type StepSixReportSection = {
  title: string
  body: string[]
}

type StepSixReportConfig = {
  stepFiveSurfaceColor: string
  stepFiveGridOpacity?: number
  leftDeepColor: string
  leftBackground: string
  leftSurfaceColor: string
  rightBackground: string
  rightDeepColor?: string
  recommendedSections: StepSixReportSection[]
  customSections?: StepSixReportSection[]
  rightInfoText?: string
  /** Which scheme to display: 'recommended' (推荐方案) or 'custom' (自选方案). Defaults to undefined = no label. */
  reportSchemeType?: 'recommended' | 'custom'
}

type StepFiveDrilldownCard = {
  id: 'stage-share' | 'process-top5' | 'process-share'
  Icon: typeof PieChart
  cardText: string
  titleLine: string
  highlight: string
  path: string
  pathCurrent: string
}

type StepFivePageTurnDirection = 'forward' | 'backward'

const stepFivePageTurnTransition: Transition = {
  duration: 0.72,
  ease: [0.22, 1, 0.36, 1],
}

const stepFivePageTurnVariants = {
  initial: (direction: StepFivePageTurnDirection) => ({
    opacity: 0,
    x: direction === 'forward' ? '100%' : '-100%',
    zIndex: 2,
  }),
  animate: {
    opacity: 1,
    x: '0%',
    zIndex: 2,
  },
  exit: (direction: StepFivePageTurnDirection) => ({
    opacity: 0,
    x: direction === 'forward' ? '-100%' : '100%',
    zIndex: 1,
  }),
}

const stepSixReportPageOrder = ['report', 'preview-page-1', 'preview-page-2'] as const

type CardAnnotation = {
  id: string
  dotX: number
  dotY: number
  line1X: number
  line1Y: number
  line1Width: number
  line1Height: number
  line1Origin: string
  line2X: number
  line2Y: number
  line2Width: number
  line2Height: number
  line2Origin: string
  line3X: number
  line3Y: number
  line3Width: number
  line3Height: number
  line3Origin: string
  cardX: number
  cardY: number
}

type AnnotationConnectorProps = {
  annotation: CardAnnotation
  delay: number
  stroke?: string
  strokeWidth?: number
}

function createReportPlaceholder(label: string) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1528" viewBox="0 0 1080 1528">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F7FBFF" />
          <stop offset="1" stop-color="#E7F0F8" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1528" fill="url(#bg)" />
      <rect x="84" y="92" width="912" height="1344" rx="42" fill="#FFFFFF" stroke="#D8E4EF" stroke-width="4" />
      <text x="140" y="196" fill="#123047" font-family="Arial, sans-serif" font-size="48" font-weight="700">产品碳足迹报告</text>
      <text x="140" y="274" fill="#4A657A" font-family="Arial, sans-serif" font-size="30">${label} · 示例占位图</text>
      <rect x="140" y="354" width="800" height="14" rx="7" fill="#40C99A" />
      <rect x="140" y="438" width="360" height="180" rx="24" fill="#ECF8F3" />
      <rect x="548" y="438" width="392" height="180" rx="24" fill="#EEF6FF" />
      <text x="178" y="516" fill="#123047" font-family="Arial, sans-serif" font-size="28" font-weight="700">单位评估结果</text>
      <text x="178" y="570" fill="#40A77E" font-family="Arial, sans-serif" font-size="44" font-weight="700">6.53 kgCO₂e</text>
      <text x="586" y="516" fill="#123047" font-family="Arial, sans-serif" font-size="28" font-weight="700">核算边界</text>
      <text x="586" y="570" fill="#426C95" font-family="Arial, sans-serif" font-size="34" font-weight="700">从摇篮到坟墓</text>
      ${Array.from({ length: 7 }, (_, index) => `<rect x="140" y="${706 + index * 78}" width="${800 - index * 36}" height="28" rx="14" fill="${index % 2 === 0 ? '#DCEAEF' : '#EAF2F5'}" />`).join('')}
      <rect x="140" y="1284" width="800" height="1" fill="#D8E4EF" />
      <text x="140" y="1352" fill="#7A8C9B" font-family="Arial, sans-serif" font-size="26">当前为轻量占位图，已替代原高清报告 PNG。</text>
    </svg>
  `)}`
}

const PRODUCT_FLOW_STAGE_WIDTH = 1532
const PRODUCT_FLOW_STAGE_HEIGHT = 860
function useStageScale(baseWidth: number, baseHeight: number) {
  const { containerRef, height, scale, width } = useElementFitScale({ baseHeight, baseWidth })

  return { containerRef, containerSize: { height, width }, scale }
}

function AnimatedProgressCounter({ duration, color, startDelay = 0 }: { duration: number; color: string; startDelay?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const text = useTransform<number, string>(count, (latest) => {
    if (latest < 30) return '正在整合生命周期数据...'
    if (latest < 70) return '正在进行排放因子建模与映射...'
    if (latest < 95) return '正在汇总碳足迹核算结果...'
    return '报告生成完毕！'
  })

  useEffect(() => {
    const controls = animate(count, 100, {
      duration,
      delay: startDelay,
      ease: 'easeInOut',
    })
    return controls.stop
  }, [count, duration, startDelay])

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div className="text-[182px] font-bold leading-none tracking-tighter" style={{ color }}>
        <motion.span>{rounded}</motion.span>
        <span className="ml-3 text-[104px] opacity-60">%</span>
      </motion.div>
      <motion.div
        animate={{ opacity: 0.85 }}
        className="mt-8 text-[31px] font-medium tracking-widest"
        initial={{ opacity: 0 }}
        style={{ color }}
        transition={{ delay: 0.2 }}
      >
        <motion.span>{text}</motion.span>
      </motion.div>
    </div>
  )
}

function getStepNumber(step: string) {
  return Number(step.replace('step', ''))
}

function ProductStepPuzzle({ selectedCardId, step }: { selectedCardId: string; step: string }) {
  const stepNumber = getStepNumber(step)

  if (stepNumber < 1 || stepNumber > 7) {
    return null
  }

  const activeColor = getProductReportButtonColor(selectedCardId)

  return <ProductPuzzleProgress activeColor={activeColor} activeStepNumber={stepNumber} animateOnComplete={stepNumber < 7} />
}

function getProductFlowNeutralBackground() {
  return '#F7F8FA'
}

function getActiveReportSections(reportConfig: StepSixReportConfig, selectedScheme?: 'recommended' | 'custom') {
  const scheme = selectedScheme ?? reportConfig.reportSchemeType ?? 'recommended'
  if (scheme === 'custom' && reportConfig.customSections) {
    return reportConfig.customSections
  }
  return reportConfig.recommendedSections
}

function getProductResultTheme(productId: string) {
  return {
    backpack: {
      containerBackground: '#F0F7FF',
      resultText: '#006CEC',
      resultCardBackground: '#006CEC',
      intervalText: '#003E89',
      rightCardBackground: '#E7F2FF',
      rightCardText: '#003E89',
      rightButtonBackground: '#003E89',
    },
    formaldehyde: {
      containerBackground: '#FFF9F5',
      resultText: '#FF8B00',
      resultCardBackground: '#FF8B00',
      intervalText: '#C04604',
      rightCardBackground: '#FFF3EC',
      rightCardText: '#C04604',
      rightButtonBackground: '#C04604',
    },
    'lithium-battery': {
      containerBackground: '#FAFBFE',
      resultText: '#4D3CB8',
      resultCardBackground: '#4D3CB8',
      intervalText: '#0F1782',
      rightCardBackground: '#F3F3FF',
      rightCardText: '#0F1782',
      rightButtonBackground: '#0F1782',
    },
    transformer: {
      containerBackground: '#FDF8FF',
      resultText: '#962FBD',
      resultCardBackground: '#742493',
      intervalText: '#590D76',
      rightCardBackground: '#FAEEFF',
      rightCardText: '#590D76',
      rightButtonBackground: '#590D76',
    },
  }[productId] ?? {
    containerBackground: '#F0F7FF',
    resultText: '#006CEC',
    resultCardBackground: '#006CEC',
    intervalText: '#003E89',
    rightCardBackground: '#E7F2FF',
    rightCardText: '#003E89',
    rightButtonBackground: '#003E89',
  }
}

function getProductReportButtonColor(productId: string) {
  return getProductResultTheme(productId).rightButtonBackground
}

function colorWithOpacity(hex: string, opacity: number) {
  const value = hex.replace('#', '')
  const normalizedValue = value.length === 3 ? value.split('').map((char) => char + char).join('') : value
  const color = Number.parseInt(normalizedValue, 16)

  return `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, ${opacity})`
}

function StepFiveGridBackground({
  color,
  opacity = 0.2,
}: {
  color: string
  opacity?: number
}) {
  const gridColor = colorWithOpacity(color, opacity)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      data-step-five-grid-background
      style={{
        backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: '3rem 3rem',
        maskImage: 'radial-gradient(ellipse 64% 56% at 50% 0%, #000 62%, transparent 112%)',
        WebkitMaskImage: 'radial-gradient(ellipse 64% 56% at 50% 0%, #000 62%, transparent 112%)',
      }}
    />
  )
}

function StepFiveRoseChart({
  className,
  labelScale,
  compact = false,
  style,
  theme,
  selectedCardId,
}: {
  className?: string
  compact?: boolean
  labelScale: number
  style?: CSSProperties
  theme: ReturnType<typeof getProductResultTheme>
  selectedCardId?: string
}) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart: EChartsType = init(chartRef.current, undefined, { renderer: 'svg' })
    const labelColor = '#64748B'
    const roseElementScale = Math.max(0.42, labelScale) * 1.2
    const roseOption: EChartsCoreOption = {
      animation: false,
      color: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4'],
      series: [
        {
          type: 'pie',
          radius: compact ? ['14.4%', '67.2%'] : ['14%', '72%'],
          center: compact ? ['45%', '52%'] : ['58%', '52%'],
          roseType: 'radius',
          avoidLabelOverlap: false,
          silent: true,
          itemStyle: {
            borderRadius: 8 * roseElementScale,
            borderColor: '#FFFFFF',
            borderWidth: 5 * roseElementScale,
          },
          label: {
            show: true,
            color: labelColor,
            fontFamily: 'PingFang SC, sans-serif',
            fontSize: 18 * roseElementScale,
            fontWeight: 600,
            formatter: '{b}：{d}%',
          },
          labelLine: {
            show: true,
            length: 24 * roseElementScale,
            length2: 18 * roseElementScale,
            lineStyle: {
              color: '#94A3B8',
              width: 2 * roseElementScale,
            },
          },
          data: [
            { value: 40, name: '原材料获取' },
            { value: 38, name: '生产制造' },
            { value: 32, name: '运输配送' },
            { value: 30, name: '包装投入' },
          ],
        },
      ],
    }

    chart.setOption(roseOption, { notMerge: true })
    const resizeChart = () => chart.resize()
    const resizeObserver = new ResizeObserver(resizeChart)

    resizeObserver.observe(chartRef.current)
    window.addEventListener('resize', resizeChart)

    return () => {
      window.removeEventListener('resize', resizeChart)
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [compact, labelScale, theme.rightCardText])

  return <div ref={chartRef} className={className} style={style} />
}

const stepFiveSankeySources = [
  { name: '原材料获取 18.6%', value: 18.6 },
  { name: '面料裁剪 15.2%', value: 15.2 },
  { name: '缝制加工 13.7%', value: 13.7 },
  { name: '五金装配 11.4%', value: 11.4 },
  { name: '包装入库 9.8%', value: 9.8 },
  { name: '运输配送 8.9%', value: 8.9 },
  { name: '染整处理 7.6%', value: 7.6 },
  { name: '质检返工 5.4%', value: 5.4 },
  { name: '仓储周转 4.9%', value: 4.9 },
  { name: '废料处置 4.5%', value: 4.5 },
]
const stepFiveSankeyNodeGap = 26.4
const stepFiveSankeyChartPaddingY = 24
const stepFiveSankeyTotalValue = stepFiveSankeySources.reduce((total, source) => total + source.value, 0)
const stepFiveSankeyTotalGap = stepFiveSankeyNodeGap * (stepFiveSankeySources.length - 1)

function StepFiveSankeyChart({
  className,
  labelSide = 'left',
  style,
  theme,
}: {
  className?: string
  labelSide?: 'left' | 'right'
  style?: CSSProperties
  theme: ReturnType<typeof getProductResultTheme>
}) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart: EChartsType = init(chartRef.current, undefined, { renderer: 'svg' })
    const sankeyColor = theme.rightButtonBackground
    const sankeyLightColor = colorWithOpacity(sankeyColor, 0.42)
    const sankeyFlowColor = colorWithOpacity(sankeyColor, 0.06)
    const option: EChartsCoreOption = {
      animation: false,
      tooltip: { show: false },
      series: [
        {
          type: 'sankey',
          top: 24,
          right: 0,
          bottom: 24,
          left: 0,
          nodeWidth: 22,
          nodeGap: stepFiveSankeyNodeGap,
          draggable: false,
          emphasis: { disabled: true },
          label: {
            show: true,
            color: '#0F172A',
            fontFamily: 'PingFang SC, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            distance: 6,
          },
          itemStyle: {
            borderWidth: 0,
            borderRadius: 0,
          },
          lineStyle: {
            color: sankeyFlowColor,
            opacity: 1,
            curveness: 0.5,
          },
          levels: [
            {
              depth: 0,
              itemStyle: { color: sankeyLightColor },
              label: { show: false },
              lineStyle: { color: sankeyFlowColor, opacity: 1 },
            },
            {
              depth: 1,
              itemStyle: { color: sankeyColor },
              label: { show: false },
              lineStyle: { color: sankeyFlowColor, opacity: 1 },
            },
          ],
          data: [
            ...stepFiveSankeySources.map(({ name }) => ({ name })),
            { name: '单元过程汇总', label: { show: false } },
          ],
          links: stepFiveSankeySources.map(({ name, value }) => ({ source: name, target: '单元过程汇总', value })),
        },
      ],
    }

    chart.setOption(option, { notMerge: true })
    const resizeChart = () => chart.resize()
    const resizeObserver = new ResizeObserver(resizeChart)

    resizeObserver.observe(chartRef.current)
    window.addEventListener('resize', resizeChart)

    return () => {
      window.removeEventListener('resize', resizeChart)
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [theme.rightButtonBackground])

  return (
    <div className={cn('relative overflow-visible', className)} style={style}>
      <div ref={chartRef} className="absolute inset-0" />
      <div
        className={cn(
          'pointer-events-none absolute w-[150px] text-[18px] font-semibold leading-[1.35]',
          labelSide === 'left' ? 'right-[calc(100%+6px)] text-right' : 'left-[calc(100%+6px)] text-left',
        )}
        style={{ top: stepFiveSankeyChartPaddingY, bottom: stepFiveSankeyChartPaddingY, color: theme.rightButtonBackground }}
      >
        {stepFiveSankeySources.map((source, index) => {
          const previousValue = stepFiveSankeySources.slice(0, index).reduce((total, item) => total + item.value, 0)
          return (
          <div
            key={source.name}
            className={cn(
              'absolute flex items-center',
              labelSide === 'left' ? 'right-0 justify-end' : 'left-0 justify-start',
            )}
            style={{
              top: `calc((100% - ${stepFiveSankeyTotalGap}px) * ${previousValue / stepFiveSankeyTotalValue} + ${index * stepFiveSankeyNodeGap}px)`,
              height: `calc((100% - ${stepFiveSankeyTotalGap}px) * ${source.value / stepFiveSankeyTotalValue})`,
            }}
          >
            {source.name}
          </div>
          )
        })}
      </div>
    </div>
  )
}



function getAnnotationConnectorPoints(annotation: CardAnnotation) {
  const horizontalEndX = annotation.line1X + (annotation.line1Origin === 'left center' ? annotation.line1Width : 0)
  const verticalEndY = annotation.line2Y + (annotation.line2Origin === 'center top' ? annotation.line2Height : 0)
  const finalEndX = annotation.line3X + (annotation.line3Origin === 'left center' ? annotation.line3Width : 0)

  return { horizontalEndX, verticalEndY, finalEndX }
}

function getAnnotationConnectorPath(annotation: CardAnnotation) {
  const { horizontalEndX, verticalEndY, finalEndX } = getAnnotationConnectorPoints(annotation)
  return `M ${annotation.dotX} ${annotation.dotY} H ${horizontalEndX} V ${verticalEndY} H ${finalEndX}`
}

function AnnotationConnector({ annotation, delay, stroke = '#54E8FF', strokeWidth = 6 }: AnnotationConnectorProps) {
  const { verticalEndY, finalEndX } = getAnnotationConnectorPoints(annotation)

  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-[1] overflow-visible"
      initial={{ opacity: 1 }}
      style={{ width: 1, height: 1 }}
    >
      <motion.path
        animate={{ pathLength: 1 }}
        d={getAnnotationConnectorPath(annotation)}
        fill="none"
        initial={{ pathLength: 0 }}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        transition={{ delay: delay + 0.2, duration: 0.54, ease: 'linear' }}
      />
      <motion.circle
        cx={finalEndX}
        cy={verticalEndY}
        r={strokeWidth * 1.5}
        fill={stroke}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.74, duration: 0.24, ease: 'backOut' }}
      />
    </motion.svg>
  )
}


const stepOneCards: ProductCard[] = [
  {
    id: 'backpack',
    label: '双肩包',
    imageSrc: backpackCardImage,
    detailImageSrc: backpackMainImage,
    reportImageSrc: createReportPlaceholder('双肩包'),
  },
  {
    id: 'lithium-battery',
    label: '锂电池',
    imageSrc: lithiumBatteryCardImage,
    detailImageSrc: lithiumBatteryDetailImage,
    reportImageSrc: createReportPlaceholder('锂电池'),
  },
  {
    id: 'formaldehyde',
    label: '甲醛',
    imageSrc: formaldehydeCardImage,
    detailImageSrc: formaldehydeDetailImage,
    reportImageSrc: createReportPlaceholder('甲醛'),
  },
  {
    id: 'transformer',
    label: '变压器',
    imageSrc: transformerCardImage,
    detailImageSrc: transformerDetailImage,
    reportImageSrc: createReportPlaceholder('变压器'),
  },
]

const stepSixReportConfigs: Record<string, StepSixReportConfig> = {
  backpack: {
    stepFiveSurfaceColor: '#C4E2F5',
    stepFiveGridOpacity: 0.05,
    leftDeepColor: '#2C5EAD',
    leftBackground: 'linear-gradient(173.19deg,#2C5EAD 3.75%,#1591DC 94.67%)',
    leftSurfaceColor: '#1591DC',
    rightBackground: 'linear-gradient(149.1deg,#4BB8FA 0%,#2C5EAD 100%)',
    rightDeepColor: '#1591DC',
    recommendedSections: [
      {
        title: '01 核算结果概览',
        body: ['单位评估结果：12.49 kgCO₂e/件', '最高贡献阶段：原材料获取阶段（89.68%）', '关键来源：涤纶面料', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '02 排放来源分布',
        body: ['原材料获取阶段 89.68%', '生产制造阶段 9.99%', '分销阶段 1.11%', '最终处置阶段 -0.78%'],
      },
      {
        title: '03 关键因素影响',
        body: ['涤纶面料的用量较高（0.22kg）', '普通涤纶的排放系数高（25.7 kgCO₂e/kg）', '制造阶段电力与成品运输占比较低'],
      },
      {
        title: '04 优化建议',
        body: ['高排放环节：普通涤纶面料的生产', '优化方向：使用再生涤纶面料替代普通涤纶', '替代方案：提高低碳原材料比例', '优先级建议：材料-能源-工艺'],
      },
    ],
    customSections: [
      {
        title: '01 核算结果概览',
        body: ['单位评估结果：7.78 kgCO₂e/件（自选方案核算结果）', '最高贡献阶段：原材料获取阶段（83.56%）', '关键来源：再生涤纶', '一句结论：采用再生涤纶使面料碳足迹降低 83.2%'],
      },
      {
        title: '02 排放来源分布',
        body: ['原材料获取阶段 83.56%', '生产制造阶段 12.05%', '分销阶段 1.54%', '最终处置阶段 -1.15%'],
      },
      {
        title: '03 关键因素影响',
        body: ['再生涤纶相比普通涤纶碳足迹更低（4.31 kgCO₂e/kg）', '涤纶面料的排放从 5.65kg 骤降至 0.95kg', '活动数据（用量0.22kg）保持不变'],
      },
      {
        title: '04 优化建议',
        body: ['高排放环节：再生涤纶的生产与电力使用', '优化方向：采购获得绿证的再生涤纶，使用清洁能源', '替代方案：进一步降低包装材料碳排', '优先级建议：能源-材料-工艺'],
      },
    ],
  },
  formaldehyde: {
    stepFiveSurfaceColor: '#FFF9ED',
    stepFiveGridOpacity: 0.05,
    leftDeepColor: '#C04604',
    leftBackground: 'linear-gradient(173.19deg,#C04604 3.75%,#FF8B00 94.67%)',
    leftSurfaceColor: '#FF8B00',
    rightBackground: 'linear-gradient(149.1deg,#FF8B01 0%,#C34A03 100%)',
    rightDeepColor: '#C34A03',
    rightInfoText: `产品名称：甲醛\n系统边界：从摇篮到大门\n地理边界：中国-山东\n核算周期：2025年01月01日-2025年12月31日`,
    recommendedSections: [
      {
        title: '1 核算结果概览',
        body: ['单位评估结果：1.36 kgCO₂e/kg', '最高贡献阶段：原材料获取阶段（98.58%）', '关键来源：甲醇', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '2 排放来源分布',
        body: ['原材料获取阶段 98.58%', '生产制造阶段 1.42%'],
      },
      {
        title: '3 关键影响因素',
        body: ['甲醇的用量较高', '甲醇的排放占比较高', '制造阶段电力影响相对较低'],
      },
      {
        title: '4 优化建议',
        body: ['高排放环节：甲醇的生产', '优化方向：采用低碳排放的甲醇', '替代方案：工艺与设备改进、使用清洁能源', '优先级建议：材料-工艺-能源'],
      },
    ],
    customSections: [
      {
        title: '1 核算结果概览',
        body: ['单位评估结果：0.46 kgCO₂e/kg', '最高贡献阶段：原材料获取阶段（95.77%）', '关键来源：甲醇', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '2 排放来源分布',
        body: ['原材料获取阶段 95.77%', '生产制造阶段 4.23%'],
      },
      {
        title: '3 关键影响因素',
        body: ['甲醇的用量较高', '甲醇的排放占比较高', '制造阶段电力影响相对较低'],
      },
      {
        title: '4 优化建议',
        body: ['高排放环节：甲醇的生产', '优化方向：工艺与设备改进', '替代方案：使用清洁能源', '优先级建议：工艺-能源'],
      },
    ],
  },
  transformer: {
    stepFiveSurfaceColor: '#FDF2FF',
    stepFiveGridOpacity: 0.05,
    leftDeepColor: '#7D066C',
    leftBackground: 'linear-gradient(180deg,#7D066C 0%,#CD73EE 100%)',
    leftSurfaceColor: '#CD73EE',
    rightBackground: 'linear-gradient(149.1deg,#DB8DFF 0%,#830070 100%)',
    rightInfoText: `产品名称：变压器\n系统边界：从摇篮到大门\n地理边界：中国-山东\n核算周期：2024年01月01日-2024年12月31日`,
    reportSchemeType: 'recommended',
    recommendedSections: [
      {
        title: '01 核算结果概览',
        body: ['单位评估结果：8615.32kgCO₂e/台', '最高贡献阶段：原材料获取阶段（97.31%）', '关键来源：非晶带材', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '02 排放来源分布',
        body: ['原材料获取阶段 97.31%', '生产制造阶段 2.69%'],
      },
      {
        title: '03 关键影响因素',
        body: ['非晶带材的用量较高', '非晶带材的排放占比较高', '聚酯漆包铜扁线的排放占比较高', '制造阶段电力影响相对较低'],
      },
      {
        title: '04 优化建议',
        body: ['高排放环节：非晶带材的生产', '优化方向：采用低碳排放的非晶带材', '替代方案：工艺与设备改进、使用清洁能源', '优先级建议：材料-工艺-能源'],
      },
    ],
    customSections: [
      {
        title: '01 核算结果概览',
        body: ['单位评估结果：5980.96kgCO₂e/台（自选方案核算结果）', '最高贡献阶段：原材料获取阶段（96.12%）', '关键来源：非晶带材', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '02 排放来源分布',
        body: ['原材料获取阶段 96.12%', '生产制造阶段 3.88%'],
      },
      {
        title: '03 关键影响因素',
        body: ['非晶带材的用量较高', '非晶带材的排放占比较高', '聚酯漆包铜扁线的排放占比较高', '制造阶段电力影响相对较低'],
      },
      {
        title: '04 优化建议',
        body: ['高排放环节：非晶带材的生产', '优化方向：采用低碳排放的原材料', '替代方案：工艺与设备改进、使用清洁能源', '优先级建议：材料-工艺-能源'],
      },
    ],
  },
  'lithium-battery': {
    stepFiveSurfaceColor: '#FAF1FF',
    stepFiveGridOpacity: 0.05,
    leftDeepColor: '#4C0776',
    leftBackground: 'linear-gradient(180deg,#4C0776 0%,#BD74EF 100%)',
    leftSurfaceColor: '#BD74EF',
    rightBackground: 'linear-gradient(149.1deg,#CF8DFF 0%,#550083 100%)',
    recommendedSections: [
      {
        title: '1 核算结果概览',
        body: ['单位评估结果：115.67kgCO₂e/kWh', '最高贡献阶段：原材料获取阶段（84.69%）', '关键来源：阳极石墨', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '2 排放来源分布',
        body: ['原材料获取阶段 84.69%', '生产制造阶段 13.3%', '分销阶段 1.03%', '最终处置阶段 0.99%'],
      },
      {
        title: '3 关键影响因素',
        body: ['六氟磷酸钾的用量较高', '阳极石墨的排放占比较高', '制造阶段天然气的较高', '运输影响相对较低'],
      },
      {
        title: '4 优化建议',
        body: ['高排放环节：阳极石墨的生产', '优化方向：使用回收石墨替代人造石墨', '替代方案：工艺与设备改进、使用清洁能源', '优先级建议：材料-工艺-能源'],
      },
    ],
    customSections: [
      {
        title: '1 核算结果概览',
        body: ['单位评估结果：115.78kgCO₂e/kWh（自选方案核算结果）', '最高贡献阶段：原材料获取阶段（84.67%）', '关键来源：阳极石墨', '一句结论：排放主要集中在材料端'],
      },
      {
        title: '2 排放来源分布',
        body: ['原材料获取阶段 84.67%', '生产制造阶段 13.32%', '分销阶段 1.02%', '最终处置阶段 0.99%'],
      },
      {
        title: '3 关键影响因素',
        body: ['六氟磷酸钾的用量较高', '阳极石墨的排放占比较高', '制造阶段天然气的较高', '运输影响相对较低'],
      },
      {
        title: '4 优化建议',
        body: ['高排放环节：阳极石墨的生产', '优化方向：使用回收石墨替代人造石墨', '替代方案：工艺与设备改进、使用清洁能源', '优先级建议：材料-工艺-能源'],
      },
    ],
  },
}

const STEP_ONE_CARD_WIDTH = 378
const STEP_ONE_CARD_HEIGHT = 612
const STEP_ONE_CENTER_SCALE = 1
const STEP_ONE_NEAR_SCALE = 0.8
const STEP_ONE_FAR_SCALE = 0.6
const STEP_ONE_HIDDEN_SCALE = 0.6
const STEP_ONE_CARD_GAP = 120
const STEP_ONE_CARD_EASE = [0.22, 0.8, 0.22, 1] as const
const STEP_SIX_SQUARES_CONVERGE_DURATION = 3.15
const STEP_SIX_SQUARES_STAGGER = 0.06
const STEP_SIX_PROGRESS_START_DELAY = STEP_SIX_SQUARES_CONVERGE_DURATION * 0.1
const STEP_SIX_REPORT_REVEAL_DELAY = STEP_SIX_PROGRESS_START_DELAY + STEP_SIX_SQUARES_CONVERGE_DURATION + STEP_SIX_SQUARES_STAGGER * 5 + 0.18
const STEP_ONE_NEAR_X =
  (STEP_ONE_CARD_WIDTH * STEP_ONE_CENTER_SCALE) / 2 +
  (STEP_ONE_CARD_WIDTH * STEP_ONE_NEAR_SCALE) / 2 +
  STEP_ONE_CARD_GAP
const STEP_ONE_FAR_X =
  STEP_ONE_NEAR_X +
  (STEP_ONE_CARD_WIDTH * STEP_ONE_NEAR_SCALE) / 2 +
  (STEP_ONE_CARD_WIDTH * STEP_ONE_FAR_SCALE) / 2 +
  STEP_ONE_CARD_GAP
const STEP_ONE_HIDDEN_X =
  STEP_ONE_FAR_X +
  (STEP_ONE_CARD_WIDTH * STEP_ONE_FAR_SCALE) / 2 +
  (STEP_ONE_CARD_WIDTH * STEP_ONE_HIDDEN_SCALE) / 2 +
  STEP_ONE_CARD_GAP
const stepOneSlotStyles: Record<number, { x: number; scale: number; opacity: number; zIndex: number }> = {
  [-3]: { x: -STEP_ONE_HIDDEN_X, scale: STEP_ONE_HIDDEN_SCALE, opacity: 0, zIndex: 0 },
  [-2]: { x: -STEP_ONE_FAR_X, scale: STEP_ONE_FAR_SCALE, opacity: 1, zIndex: 1 },
  [-1]: { x: -STEP_ONE_NEAR_X, scale: STEP_ONE_NEAR_SCALE, opacity: 0.86, zIndex: 2 },
  0: { x: 0, scale: STEP_ONE_CENTER_SCALE, opacity: 1, zIndex: 5 },
  1: { x: STEP_ONE_NEAR_X, scale: STEP_ONE_NEAR_SCALE, opacity: 0.86, zIndex: 2 },
  2: { x: STEP_ONE_FAR_X, scale: STEP_ONE_FAR_SCALE, opacity: 1, zIndex: 1 },
  3: { x: STEP_ONE_HIDDEN_X, scale: STEP_ONE_HIDDEN_SCALE, opacity: 0, zIndex: 0 },
}

function getLoopedStepOneCard(index: number) {
  const count = stepOneCards.length
  return stepOneCards[((index % count) + count) % count]
}

const stepTwoCenterCardBackgrounds: Record<string, string> = {
  backpack: '#EAF6FF',
  formaldehyde: '#FCF7E8',
  transformer: '#FFE8FB8C',
  'lithium-battery': '#F2E7FF8C',
}

const stepTwoProductAccentColors: Record<string, { light: string; dark: string }> = {
  backpack: { light: '#4BB8FA', dark: '#2C5EAD' },
  formaldehyde: { light: '#FFE95C', dark: '#FFC400' },
  'lithium-battery': { light: '#C0A0FF', dark: '#5F0EFF' },
  transformer: { light: '#E2ACFF', dark: '#A700FF' },
}

function getStepTwoCenterCardBackground(cardId: string) {
  return stepTwoCenterCardBackgrounds[cardId] ?? '#FFFFFF8C'
}

function getStepTwoProductAccentColors(cardId: string) {
  return stepTwoProductAccentColors[cardId] ?? { light: '#54E8FF', dark: '#006BFF' }
}

function getStepTwoTargetReticleColor(cardId: string, accentColors: { light: string; dark: string }) {
  return cardId === 'formaldehyde' ? accentColors.dark : accentColors.light
}

function getStepTwoTargetReticleOpacity(cardId: string) {
  return cardId === 'formaldehyde' ? 0.2 : 0.1
}

function StepTwoTargetReticle({ color, opacity = 0.1 }: { color: string; opacity?: number }) {
  const circles = [25, 75, 137.5, 200, 262.5, 325, 387.5]

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[134%] w-[134%] max-w-none -translate-x-1/2 -translate-y-1/2"
      fill="none"
      viewBox="0 0 795 795"
    >
      {circles.map((radius, index) => (
        <circle
          key={radius}
          cx={index % 2 === 0 ? 397 : 397.5}
          cy={index % 2 === 0 ? 398 : 397.5}
          r={radius}
          stroke={color}
          strokeOpacity={opacity}
          strokeWidth={radius === 25 ? 10 : 20}
        />
      ))}
    </svg>
  )
}

function ProductCarbonCardVisual({
  className,
  scanColor,
  selectedCard,
  scanDelay = 0,
  showScan = false,
}: {
  className?: string
  scanColor?: string
  scanDelay?: number
  selectedCard: ProductCard
  showScan?: boolean
}) {
  const accentColors = getStepTwoProductAccentColors(selectedCard.id)
  const targetReticleColor = getStepTwoTargetReticleColor(selectedCard.id, accentColors)
  const targetReticleOpacity = getStepTwoTargetReticleOpacity(selectedCard.id)

  return (
    <div className={cn('absolute inset-0 overflow-hidden rounded-[28px]', className)}>
      <div className="absolute inset-0" style={{ backgroundColor: getStepTwoCenterCardBackground(selectedCard.id) }} />
      <StepTwoTargetReticle color={targetReticleColor} opacity={targetReticleOpacity} />
      <img
        alt={selectedCard.label}
        className="absolute left-1/2 top-1/2 z-10 h-[75.24%] w-[75.24%] -translate-x-1/2 -translate-y-1/2 select-none object-contain p-0"
        draggable={false}
        src={selectedCard.detailImageSrc}
      />
      {showScan ? <CardScanOverlay color={scanColor ?? accentColors.light} delay={scanDelay} duration={5} lineColor={accentColors.dark} /> : null}
    </div>
  )
}

function useStepTwoStageScale() {
  const { containerRef, isMeasured, scale } = useElementFitScale({
    baseHeight: STEP_TWO_VISUAL_HEIGHT,
    baseWidth: STEP_TWO_VISUAL_WIDTH,
    maxScale: 1,
    safeInsetX: STEP_TWO_SAFE_GUTTER_X,
    safeInsetY: STEP_TWO_SAFE_GUTTER_Y,
  })

  return { isStageMeasured: isMeasured, stageContainerRef: containerRef, stageScale: scale }
}

const STEP_TWO_CENTER_CARD_SCALE = 1.1
const STEP_TWO_CENTER_CARD_WIDTH = 495
const STEP_TWO_CENTER_CARD_HEIGHT = 594
const STEP_TWO_CENTER_CARD_RADIUS = 28
const actionButtonBreathingTransition: Transition = {
  duration: 2.4,
  ease: [0.45, 0, 0.2, 1],
  repeat: Infinity,
  times: [0, 0.5, 1],
}
const STEP_FOUR_PRODUCT_CARD_WIDTH = 225
const STEP_FOUR_PRODUCT_CARD_HEIGHT = 270
const STEP_FOUR_PRODUCT_CARD_LEFT = 28
const STEP_FOUR_TREE_TRUNK_X = 335
const STEP_FOUR_TREE_LINE_WIDTH = 5
const STEP_FOUR_TREE_GROUP_CENTERS = [70, 250, 430, 610, 790]
const STEP_FOUR_TREE_TRUNK_BRANCH_WIDTH = 45
const STEP_FOUR_TREE_NODE_HEIGHT = 44
const STEP_FOUR_TREE_NODE_RADIUS = 12
const STEP_FOUR_TREE_NODE_GAP = 8
const STEP_FOUR_TREE_CHILD_OFFSET = STEP_FOUR_TREE_NODE_HEIGHT + STEP_FOUR_TREE_NODE_GAP
const STEP_FOUR_TREE_LEVELS = [
  { left: 380, width: 130 },
  { left: 460, width: 130 },
  { left: 540, width: 154 },
]
const STEP_FOUR_TREE_TOP = STEP_FOUR_TREE_GROUP_CENTERS[0] - STEP_FOUR_TREE_NODE_HEIGHT / 2
const STEP_FOUR_TREE_BOTTOM = STEP_FOUR_TREE_GROUP_CENTERS[STEP_FOUR_TREE_GROUP_CENTERS.length - 1] + STEP_FOUR_TREE_NODE_HEIGHT / 2
const STEP_FOUR_TREE_HEIGHT = STEP_FOUR_TREE_BOTTOM - STEP_FOUR_TREE_TOP
const STEP_FOUR_TREE_RIGHT = Math.max(...STEP_FOUR_TREE_LEVELS.map((level) => level.left + level.width))
const STEP_FOUR_TREE_DETAIL_GAP = 50
const STEP_FOUR_DETAIL_LEFT = STEP_FOUR_TREE_RIGHT + STEP_FOUR_TREE_DETAIL_GAP
const STEP_FOUR_PRODUCT_CONNECTOR_WIDTH =
  STEP_FOUR_TREE_TRUNK_X + 3 - (STEP_FOUR_PRODUCT_CARD_LEFT + STEP_FOUR_PRODUCT_CARD_WIDTH)
const STEP_FOUR_PRODUCT_NAME_GAP = 20

/** Per-product tree node labels: [level1, level2, level3] per group */
const stepFourTreeLabels: Record<string, [string, string, string][]> = {
  backpack: [
    ['原材料获取', '原材料生产', '涤纶面料'],
    ['生产制造', '能源使用', '电网供电'],
    ['产品分销', '成品运输', '双肩包货车运输'],
    ['最终处置', '产品最终处置', '废弃双肩包处置'],
  ],
  'lithium-battery': [
    ['原材料获取', '原材料生产', '阳极石墨'],
    ['生产制造', '能源使用', '电网供电'],
    ['产品分销', '成品运输', '锂电池货车运输'],
    ['最终处置', '产品最终处置', '锂电池回收处置'],
  ],
  transformer: [
    ['原材料获取', '原材料生产', '非晶带材'],
    ['生产制造', '能源使用', '电网供电'],
  ],
  formaldehyde: [
    ['原材料获取', '原材料生产', '甲醇'],
    ['生产制造', '能源使用', '电网供电'],
  ],
}
const STEP_TWO_INFO_CARD_WIDTH = 476
const STEP_TWO_VISUAL_WIDTH = 1698
const STEP_TWO_VISUAL_HEIGHT = 820
const STEP_TWO_SAFE_GUTTER_X = 80
const STEP_TWO_SAFE_GUTTER_Y = 24
const STEP_TWO_ACTION_BUTTON_TOP_OFFSET = 344
const STEP_ONE_VISUAL_WIDTH = 1220
const STEP_ONE_VISUAL_HEIGHT = 732
const STEP_ONE_SAFE_GUTTER_X = 80
const STEP_ONE_SAFE_GUTTER_Y = 24
const STEP_ONE_CARD_BOTTOM_OFFSET = 112
const STEP_ONE_ACTION_BUTTON_TOP_OFFSET = 644
const STEP_TWO_CONNECTOR_INFO_CARD_GAP = 20
const CONNECTOR_CARD_BOTTOM_OFFSET = 30
const STEP_TWO_CONNECTOR_DOT_X = 177
const STEP_TWO_CONNECTOR_DOT_Y = 227
const STEP_TWO_CONNECTOR_ELBOW_X = 298
const STEP_TWO_CONNECTOR_ELBOW_Y = 348
const STEP_TWO_CONNECTOR_END_LENGTH = 55

function getStepTwoInfoCardLeft(isLeftSide: boolean) {
  if (isLeftSide) {
    return -STEP_TWO_CONNECTOR_ELBOW_X - STEP_TWO_CONNECTOR_END_LENGTH - STEP_TWO_CONNECTOR_INFO_CARD_GAP - STEP_TWO_INFO_CARD_WIDTH
  }

  return STEP_TWO_CONNECTOR_ELBOW_X + STEP_TWO_CONNECTOR_END_LENGTH + STEP_TWO_CONNECTOR_INFO_CARD_GAP
}

function useStepOneStageScale() {
  const { containerRef, isMeasured, scale } = useElementFitScale({
    baseHeight: STEP_ONE_VISUAL_HEIGHT,
    baseWidth: STEP_ONE_VISUAL_WIDTH,
    maxScale: 1,
    safeInsetX: STEP_ONE_SAFE_GUTTER_X,
    safeInsetY: STEP_ONE_SAFE_GUTTER_Y,
  })

  return { isStageMeasured: isMeasured, stageContainerRef: containerRef, stageScale: scale }
}

function scaleStepTwoAnnotation(annotation: CardAnnotation) {
  const scaledAnnotation = {
    ...annotation,
    dotX: annotation.dotX * STEP_TWO_CENTER_CARD_SCALE,
    dotY: annotation.dotY * STEP_TWO_CENTER_CARD_SCALE,
    line1X: annotation.line1X * STEP_TWO_CENTER_CARD_SCALE,
    line1Y: annotation.line1Y * STEP_TWO_CENTER_CARD_SCALE,
    line1Width: annotation.line1Width * STEP_TWO_CENTER_CARD_SCALE,
    line1Height: annotation.line1Height * STEP_TWO_CENTER_CARD_SCALE,
    line2X: annotation.line2X * STEP_TWO_CENTER_CARD_SCALE,
    line2Y: annotation.line2Y * STEP_TWO_CENTER_CARD_SCALE,
    line2Width: annotation.line2Width * STEP_TWO_CENTER_CARD_SCALE,
    line2Height: annotation.line2Height * STEP_TWO_CENTER_CARD_SCALE,
    line3X: annotation.line3X * STEP_TWO_CENTER_CARD_SCALE,
    line3Y: annotation.line3Y * STEP_TWO_CENTER_CARD_SCALE,
    line3Width: annotation.line3Width * STEP_TWO_CENTER_CARD_SCALE,
    line3Height: annotation.line3Height * STEP_TWO_CENTER_CARD_SCALE,
    cardX: annotation.cardX * STEP_TWO_CENTER_CARD_SCALE,
    cardY: annotation.cardY * STEP_TWO_CENTER_CARD_SCALE,
  }

  const horizontalDirection = annotation.dotX < 0 ? -1 : 1
  const verticalDirection = annotation.dotY < 0 ? -1 : 1
  return {
    ...scaledAnnotation,
    dotX: horizontalDirection * STEP_TWO_CONNECTOR_DOT_X,
    dotY: verticalDirection * STEP_TWO_CONNECTOR_DOT_Y,
    line1X: horizontalDirection < 0 ? -STEP_TWO_CONNECTOR_ELBOW_X : STEP_TWO_CONNECTOR_DOT_X,
    line1Y: verticalDirection * STEP_TWO_CONNECTOR_DOT_Y,
    line1Width: STEP_TWO_CONNECTOR_ELBOW_X - STEP_TWO_CONNECTOR_DOT_X,
    line1Origin: horizontalDirection < 0 ? 'right center' : 'left center',
    line2X: horizontalDirection < 0 ? -STEP_TWO_CONNECTOR_ELBOW_X : STEP_TWO_CONNECTOR_ELBOW_X,
    line2Y: verticalDirection < 0 ? -STEP_TWO_CONNECTOR_ELBOW_Y : STEP_TWO_CONNECTOR_DOT_Y,
    line2Height: STEP_TWO_CONNECTOR_ELBOW_Y - STEP_TWO_CONNECTOR_DOT_Y,
    line2Origin: verticalDirection < 0 ? 'center bottom' : 'center top',
    line3X: horizontalDirection < 0 ? -STEP_TWO_CONNECTOR_ELBOW_X - STEP_TWO_CONNECTOR_END_LENGTH : STEP_TWO_CONNECTOR_ELBOW_X,
    line3Y: verticalDirection * STEP_TWO_CONNECTOR_ELBOW_Y,
    line3Width: STEP_TWO_CONNECTOR_END_LENGTH,
    line3Origin: horizontalDirection < 0 ? 'right center' : 'left center',
  }
}

type StepTwoRecognitionContentSection = {
  title: string
  bullets: string[]
}

const backpackStepTwoRecognitionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品信息',
      bullets: ['产品名称：双肩包', '所属行业：轻工行业', '规格型号：1个双肩包'],
    },
  ],
  'top-right': [
    {
      title: '系统边界',
      bullets: ['从摇篮到坟墓'],
    },
    {
      title: '参考资料：',
      bullets: ['PRODUCT CATEGORY RULES (PCR)-LUGGAGE AND HANDBAGS'],
    },
  ],
  'bottom-left': [
    {
      title: '生命周期阶段',
      bullets: ['原材料获取', '生产制造', '产品分销', '最终处置'],
    },
  ],
  'bottom-right': [
    {
      title: '地理边界',
      bullets: ['中国上海'],
    },
    {
      title: '核算周期',
      bullets: ['20230101-20230630'],
    },
  ],
}

const lithiumBatteryStepTwoRecognitionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品信息',
      bullets: ['产品名称：锂电池', '所属行业：新能源行业', '规格型号：1kW·h锂电池'],
    },
  ],
  'top-right': [
    {
      title: '系统边界',
      bullets: ['从摇篮到坟墓'],
    },
    {
      title: '参考资料：',
      bullets: ['《温室气体产品碳足迹量化方法与要求动力电池（征求意见稿）》'],
    },
  ],
  'bottom-left': [
    {
      title: '生命周期阶段',
      bullets: ['原材料获取', '生产制造', '产品分销', '最终处置'],
    },
  ],
  'bottom-right': [
    {
      title: '地理边界',
      bullets: ['中国江苏'],
    },
    {
      title: '核算周期',
      bullets: ['20250101-20251231'],
    },
  ],
}

const formaldehydeStepTwoRecognitionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品信息',
      bullets: ['产品名称：甲醛', '所属行业：化工行业', '规格型号：1kg甲醛'],
    },
  ],
  'top-right': [
    {
      title: '系统边界',
      bullets: ['从摇篮到大门'],
    },
  ],
  'bottom-left': [
    {
      title: '生命周期阶段',
      bullets: ['原材料获取', '生产制造'],
    },
  ],
  'bottom-right': [
    {
      title: '地理边界',
      bullets: ['中国山东'],
    },
    {
      title: '核算周期',
      bullets: ['20250101-20251231'],
    },
  ],
}

const backpackStepThreeDeconstructionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品结构',
      bullets: ['原辅材料：涤纶面料、背板海绵、合金拉片、塑料扣具……', '包装：纸箱、吊牌、无纺布袋'],
    },
  ],
  'top-right': [
    {
      title: '能源消耗',
      bullets: ['电力'],
    },
  ],
  'bottom-left': [
    {
      title: '项目执行标准',
      bullets: ['ISO 14067'],
    },
  ],
  'bottom-right': [
    {
      title: '温室气体量化方法',
      bullets: ['排放因子法', '∑活动数据*排放因子*GWP'],
    },
  ],
}

const lithiumBatteryStepThreeDeconstructionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品结构',
      bullets: ['原辅材料：阳极石墨、阴极锂锰氧化物、阳极铜、阴极铝、六氟磷酸锂…', '包装：纸箱、塑料膜'],
    },
  ],
  'top-right': [
    {
      title: '能源消耗',
      bullets: ['电力、自来水、天然气'],
    },
  ],
  'bottom-left': [
    {
      title: '项目执行标准',
      bullets: ['ISO 14067'],
    },
  ],
  'bottom-right': [
    {
      title: '温室气体量化方法',
      bullets: ['排放因子法', '∑活动数据*排放因子*GWP', '质量守恒法', '∑活动数据*含碳量*44/12'],
    },
  ],
}

const formaldehydeStepThreeDeconstructionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品结构',
      bullets: ['原辅材料：甲醇、银触媒、活性炭、液压油'],
    },
  ],
  'top-right': [
    {
      title: '能源消耗',
      bullets: ['电力、自来水'],
    },
  ],
  'bottom-left': [
    {
      title: '项目执行标准',
      bullets: ['ISO 14067'],
    },
  ],
  'bottom-right': [
    {
      title: '温室气体量化方法',
      bullets: ['排放因子法', '∑活动数据*排放因子*GWP'],
    },
  ],
}

const transformerStepTwoRecognitionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品信息',
      bullets: ['产品名称：变压器', '所属行业：电气设备行业', '规格型号：1台非晶油浸式配电变压器'],
    },
  ],
  'top-right': [
    {
      title: '系统边界',
      bullets: ['从摇篮到大门'],
    },
    {
      title: '参考资料：',
      bullets: ['团体标准《温室气体 产品碳足迹量化方法与要求 电力变压器（征求意见稿）》'],
    },
  ],
  'bottom-left': [
    {
      title: '生命周期阶段',
      bullets: ['原材料获取', '生产制造'],
    },
  ],
  'bottom-right': [
    {
      title: '地理边界',
      bullets: ['中国山东'],
    },
    {
      title: '核算周期',
      bullets: ['20240101-20241231'],
    },
  ],
}

const transformerStepThreeDeconstructionContent: Record<string, StepTwoRecognitionContentSection[]> = {
  'top-left': [
    {
      title: '产品结构',
      bullets: ['原辅材料：非晶带材、聚酯漆包铜扁线、油箱、油盖、减震垫…'],
    },
  ],
  'top-right': [
    {
      title: '能源消耗',
      bullets: ['电力、丙烷、氩气、氮气、氧气'],
    },
  ],
  'bottom-left': [
    {
      title: '项目执行标准',
      bullets: ['ISO 14067'],
    },
  ],
  'bottom-right': [
    {
      title: '温室气体量化方法',
      bullets: ['排放因子法', '∑活动数据*排放因子*GWP', '质量守恒法', '∑活动数据*含碳量*44/12'],
    },
  ],
}

function getStepTwoRecognitionContent(cardId: string, annotationId: string) {
  if (cardId === 'backpack') {
    return backpackStepTwoRecognitionContent[annotationId]
  }
  if (cardId === 'lithium-battery') {
    return lithiumBatteryStepTwoRecognitionContent[annotationId]
  }
  if (cardId === 'formaldehyde') {
    return formaldehydeStepTwoRecognitionContent[annotationId]
  }
  if (cardId === 'transformer') {
    return transformerStepTwoRecognitionContent[annotationId]
  }
  return undefined
}

function getStepThreeDeconstructionContent(cardId: string, annotationId: string) {
  if (cardId === 'backpack') {
    return backpackStepThreeDeconstructionContent[annotationId]
  }
  if (cardId === 'lithium-battery') {
    return lithiumBatteryStepThreeDeconstructionContent[annotationId]
  }
  if (cardId === 'formaldehyde') {
    return formaldehydeStepThreeDeconstructionContent[annotationId]
  }
  if (cardId === 'transformer') {
    return transformerStepThreeDeconstructionContent[annotationId]
  }
  return undefined
}

function StepFourTreeNodeIcon({ level }: { level: 1 | 2 | 3 }) {
  const size = 14
  const color = '#94A3B8'

  if (level === 1) {
    // Layers / stage icon
    return (
      <svg aria-hidden="true" className="shrink-0" fill="none" height={size} viewBox="0 0 16 16" width={size}>
        <path d="M8 1.5L1.5 5L8 8.5L14.5 5L8 1.5Z" fill={color} fillOpacity={0.25} stroke={color} strokeLinejoin="round" strokeWidth={1.2} />
        <path d="M1.5 8L8 11.5L14.5 8" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
        <path d="M1.5 11L8 14.5L14.5 11" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
      </svg>
    )
  }

  if (level === 2) {
    // Cube / module icon
    return (
      <svg aria-hidden="true" className="shrink-0" fill="none" height={size} viewBox="0 0 16 16" width={size}>
        <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill={color} fillOpacity={0.15} stroke={color} strokeLinejoin="round" strokeWidth={1.2} />
        <path d="M2 4.5L8 8M8 8L14 4.5M8 8V15" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
      </svg>
    )
  }

  // Gear / unit process icon
  return (
    <svg aria-hidden="true" className="shrink-0" fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <circle cx={8} cy={8} r={2.5} stroke={color} strokeWidth={1.2} />
      <path d="M8 0.5V3M8 13V15.5M15.5 8H13M3 8H0.5M13.3 2.7L11.5 4.5M4.5 11.5L2.7 13.3M13.3 13.3L11.5 11.5M4.5 4.5L2.7 2.7" stroke={color} strokeLinecap="round" strokeWidth={1.2} />
    </svg>
  )
}

function StepFourTreeNode({
  delay,
  highlightColor = '#54E8FF',
  highlighted = false,
  label,
  left,
  level,
  onClick,
  showDetailArrow = false,
  top,
  width,
}: {
  delay: number
  highlightColor?: string
  highlighted?: boolean
  label?: string
  left: number
  level?: 1 | 2 | 3
  onClick?: () => void
  showDetailArrow?: boolean
  top: number
  width: number
}) {
  const transparentHighlightColor = colorWithOpacity(highlightColor, 0)

  return (
    <motion.div
      animate={
        highlighted
          ? {
              opacity: 1,
              x: 0,
              scale: [1, 1, 1, 1.03, 1],
              borderColor: [transparentHighlightColor, transparentHighlightColor, transparentHighlightColor, highlightColor, highlightColor],
            }
          : { opacity: 1, x: 0 }
      }
      className={cn(
        'absolute z-20 flex items-center justify-center border-transparent bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]',
        onClick ? 'pointer-events-auto cursor-pointer transition-shadow hover:shadow-[0_18px_42px_rgba(15,23,42,0.14)]' : undefined,
      )}
      initial={{ opacity: 0, x: 14, borderColor: transparentHighlightColor }}
      onClick={onClick}
      style={{
        borderRadius: STEP_FOUR_TREE_NODE_RADIUS,
        borderWidth: highlighted ? 3 : 0,
        height: STEP_FOUR_TREE_NODE_HEIGHT,
        left,
        top,
        width,
      }}
      transition={
        highlighted
          ? {
              opacity: { delay, duration: 0.2, ease: 'easeOut' },
              x: { delay, duration: 0.2, ease: 'easeOut' },
              scale: { delay: delay + 0.76, duration: 0.32, ease: 'easeOut' },
              borderColor: { delay: delay + 0.76, duration: 0.24, ease: 'linear' },
            }
          : { delay, duration: 0.2, ease: 'easeOut' }
      }
    >
      {label ? (
        <span className="flex w-full items-center justify-between gap-1.5 px-3 text-[13px] font-medium leading-none text-[#334155]">
          <span className="flex min-w-0 items-center gap-1.5">
            {level ? <StepFourTreeNodeIcon level={level} /> : null}
            <span className="truncate">{label}</span>
          </span>
          {highlighted || showDetailArrow ? <ChevronRight className="h-4 w-4 shrink-0 text-[#64748B]" strokeWidth={2.4} /> : null}
        </span>
      ) : null}
    </motion.div>
  )
}

function StepFourTreeConnector({
  delay,
  groupCenters = STEP_FOUR_TREE_GROUP_CENTERS,
  left,
  top,
  type,
}: {
  delay: number
  groupCenters?: number[]
  left: number
  top: number
  type: 'branch' | 'product' | 'trunk' | 'splitBranch'
}) {
  if (type === 'trunk') {
    const trunkStart = groupCenters[0]
    const trunkEnd = groupCenters[groupCenters.length - 1]
    const branchPaths = groupCenters.map((center) => `M3 ${center - trunkStart} H${STEP_FOUR_TREE_TRUNK_BRANCH_WIDTH}`).join(' ')

    return (
      <motion.svg
        className="absolute z-10 overflow-visible"
        initial={{ opacity: 1 }}
        style={{ left, top: trunkStart, width: STEP_FOUR_TREE_TRUNK_BRANCH_WIDTH, height: trunkEnd - trunkStart }}
        viewBox={`0 0 ${STEP_FOUR_TREE_TRUNK_BRANCH_WIDTH} ${trunkEnd - trunkStart}`}
      >
        <motion.path
          animate={{ opacity: 1, pathLength: 1 }}
          d={`M3 0 V${trunkEnd - trunkStart} ${branchPaths}`}
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          stroke="#161A20"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={STEP_FOUR_TREE_LINE_WIDTH}
          transition={{ delay, duration: 0.64, ease: 'easeOut' }}
        />
      </motion.svg>
    )
  }

  const branchHeight = type === 'splitBranch' ? STEP_FOUR_TREE_CHILD_OFFSET * 3 : STEP_FOUR_TREE_CHILD_OFFSET
  const path = type === 'product'
    ? `M0 3 H${STEP_FOUR_PRODUCT_CONNECTOR_WIDTH}`
    : type === 'splitBranch'
      ? `M3 0 V${branchHeight} M3 ${STEP_FOUR_TREE_CHILD_OFFSET} H37 M3 ${branchHeight} H37`
      : `M3 0 V${branchHeight} H37`
  const width = type === 'product' ? STEP_FOUR_PRODUCT_CONNECTOR_WIDTH : 37
  const height = type === 'product' ? 6 : branchHeight + 3

  return (
    <motion.svg
      className="absolute z-10 overflow-visible"
      initial={{ opacity: 1 }}
      style={{ left, top, width, height }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <motion.path
        animate={{ opacity: 1, pathLength: 1 }}
        d={path}
        fill="none"
        initial={{ opacity: 0, pathLength: 0 }}
        stroke="#161A20"
        strokeLinecap={type === 'product' ? 'butt' : 'round'}
        strokeLinejoin="round"
        strokeWidth={STEP_FOUR_TREE_LINE_WIDTH}
        transition={{ delay, duration: type === 'product' ? 0.18 : 0.22, ease: 'linear' }}
      />
    </motion.svg>
  )
}

const stepTwoAnnotations: CardAnnotation[] = [
  {
    id: 'top-left',
    dotX: -145,
    dotY: -190,
    line1X: -255,
    line1Y: -193,
    line1Width: 110,
    line1Height: 6,
    line1Origin: 'right center',
    line2X: -258,
    line2Y: -313,
    line2Width: 6,
    line2Height: 120,
    line2Origin: 'center bottom',
    line3X: -305,
    line3Y: -313,
    line3Width: 50,
    line3Height: 6,
    line3Origin: 'right center',
    cardX: -622,
    cardY: -336,
  },
  {
    id: 'top-right',
    dotX: 145,
    dotY: -190,
    line1X: 145,
    line1Y: -193,
    line1Width: 110,
    line1Height: 6,
    line1Origin: 'left center',
    line2X: 249,
    line2Y: -313,
    line2Width: 6,
    line2Height: 120,
    line2Origin: 'center bottom',
    line3X: 249,
    line3Y: -313,
    line3Width: 50,
    line3Height: 6,
    line3Origin: 'left center',
    cardX: 322,
    cardY: -336,
  },
  {
    id: 'bottom-left',
    dotX: -145,
    dotY: 190,
    line1X: -255,
    line1Y: 187,
    line1Width: 110,
    line1Height: 6,
    line1Origin: 'right center',
    line2X: -258,
    line2Y: 103,
    line2Width: 6,
    line2Height: 0,
    line2Origin: 'center top',
    line3X: -305,
    line3Y: 103,
    line3Width: 50,
    line3Height: 6,
    line3Origin: 'right center',
    cardX: -622,
    cardY: 80,
  },
  {
    id: 'bottom-right',
    dotX: 145,
    dotY: 190,
    line1X: 145,
    line1Y: 187,
    line1Width: 110,
    line1Height: 6,
    line1Origin: 'left center',
    line2X: 249,
    line2Y: 103,
    line2Width: 6,
    line2Height: 0,
    line2Origin: 'center top',
    line3X: 249,
    line3Y: 103,
    line3Width: 50,
    line3Height: 6,
    line3Origin: 'left center',
    cardX: 322,
    cardY: 80,
  },
]

function ProductSelectorCarousel({
  onActiveCardChange,
  onSelect,
}: {
  onActiveCardChange?: (card: ProductCard) => void
  onSelect: (card: ProductCard) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isStageMeasured, stageContainerRef, stageScale } = useStepOneStageScale()
  const visibleSlots = [-3, -2, -1, 0, 1, 2, 3]
  const slotItems = visibleSlots.map((slot) => ({
    slot,
    sequenceIndex: activeIndex + slot,
    card: getLoopedStepOneCard(activeIndex + slot),
  }))

  const currentCard = getLoopedStepOneCard(activeIndex)

  useEffect(() => {
    onActiveCardChange?.(currentCard)
  }, [currentCard, onActiveCardChange])

  const handleSlotClick = (slot: number) => {
    if (slot === 0) {
      return
    }

    setActiveIndex((currentIndex) => currentIndex + slot)
  }

  return (
    <div ref={stageContainerRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
      <TargetCursor
        hideDefaultCursor
        hoverDuration={0.2}
        parallaxOn
        spinDuration={2}
      />
      <div
        style={{
          width: STEP_ONE_VISUAL_WIDTH * stageScale,
          height: STEP_ONE_VISUAL_HEIGHT * stageScale,
          opacity: isStageMeasured ? 1 : 0,
        }}
      >
        <div
          className="relative h-[732px] w-[1220px]"
          style={{
            perspective: 1200,
            transform: `scale(${stageScale})`,
            transformOrigin: 'top left',
          }}
        >
        {slotItems.map(({ card, sequenceIndex, slot }) => {
          const slotStyle = stepOneSlotStyles[slot]
          const isCenter = slot === 0
          const isHiddenReserve = Math.abs(slot) === 3
          const sharedMotionProps = {
            animate: {
              x: slotStyle.x,
              y: 0,
              scale: slotStyle.scale,
              opacity: slotStyle.opacity,
              filter: isCenter ? 'blur(0px)' : isHiddenReserve ? 'blur(2px)' : 'blur(0px)',
            },
            initial: false,
            style: {
              width: STEP_ONE_CARD_WIDTH,
              height: STEP_ONE_CARD_HEIGHT,
              zIndex: slotStyle.zIndex,
              bottom: STEP_ONE_CARD_BOTTOM_OFFSET,
            },
            transition: { duration: 0.5, ease: STEP_ONE_CARD_EASE },
          }

          if (isHiddenReserve) {
            return (
              <motion.div
                key={sequenceIndex}
                {...sharedMotionProps}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 flex origin-bottom -translate-x-1/2 items-center justify-center"
                style={{ ...sharedMotionProps.style, bottom: STEP_ONE_CARD_BOTTOM_OFFSET }}
              >
                <img
                  alt=""
                  className="pointer-events-none block h-full w-full select-none object-contain drop-shadow-[0_26px_50px_rgba(15,23,42,0.18)]"
                  draggable={false}
                  src={card.imageSrc}
                />
              </motion.div>
            )
          }

          return (
          <motion.button
            key={sequenceIndex}
            {...sharedMotionProps}
            aria-label={isCenter ? `选择${card.label}并进入下一步` : `切换到${card.label}`}
            className={cn(
              'cursor-target absolute left-1/2 flex items-center justify-center border-0 bg-transparent p-0 outline-none',
              'origin-bottom -translate-x-1/2',
              'transition-[filter] duration-300 ease-out focus-visible:ring-4 focus-visible:ring-[#54E8FF]/65',
              'hover:brightness-[1.04]',
            )}
            type="button"
            onClick={() => handleSlotClick(slot)}
            whileHover={{ y: -4, scale: slotStyle.scale * 1.035 }}
            whileTap={{ scale: slotStyle.scale * 0.98 }}
          >
            <img
              alt={card.label}
              className="pointer-events-none block h-full w-full select-none object-contain drop-shadow-[0_26px_50px_rgba(15,23,42,0.18)]"
              draggable={false}
              src={card.imageSrc}
            />
          </motion.button>
          )
        })}

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hidden"
          initial={{ opacity: 0, y: 10 }}
          style={{ top: STEP_ONE_ACTION_BUTTON_TOP_OFFSET }}
          transition={{ delay: 0.4, duration: 0.24, ease: 'linear' }}
        >
          <Button
            asChild
            className="h-[79.2px] rounded-[0.857em] px-[43.2px] text-[25.2px] font-semibold shadow-[0_18px_42px_rgba(15,23,42,0.16)] hover:brightness-105"
            style={{ backgroundColor: getProductReportButtonColor(currentCard.id), color: '#FFFFFF' }}
            size="default"
          >
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              style={{ transformOrigin: 'center', willChange: 'transform' }}
              transition={actionButtonBreathingTransition}
              type="button"
              onClick={() => onSelect(currentCard)}
            >
              <span>选择当前产品</span>
              <MousePointerClick className="ml-[9px] h-[57.6px] w-[57.6px] shrink-0" strokeWidth={2.4} />
            </motion.button>
          </Button>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProductSelectionStepTwo({
  selectedCard,
  onAdvance,
}: {
  selectedCard: ProductCard
  onAdvance: () => void
}) {
  const [isAdvancing, setIsAdvancing] = useState(false)
  const { isStageMeasured, stageContainerRef, stageScale } = useStepTwoStageScale()
  const accentColors = getStepTwoProductAccentColors(selectedCard.id)
  const connectorColor = selectedCard.id === 'backpack' ? accentColors.light : accentColors.dark
  const annotationOuterDotOpacity = selectedCard.id === 'backpack' ? 0.2 : 0.8
  const annotationInnerDotColor = selectedCard.id === 'backpack' ? connectorColor : accentColors.dark
  const reportButtonColor = getProductReportButtonColor(selectedCard.id)

  return (
    <div ref={stageContainerRef} className="relative flex min-h-0 flex-1 items-center justify-center">
      <div
        className="relative h-[620px] w-[1532px]"
        style={{ opacity: isStageMeasured ? 1 : 0, transform: `scale(${stageScale})`, transformOrigin: 'center center' }}
      >
        <motion.div
          className="text-display absolute left-1/2 top-1/2 isolate flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[28px] font-semibold text-[#0E1624] shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-md"
          initial={false}
          style={{
            width: STEP_TWO_CENTER_CARD_WIDTH,
            height: STEP_TWO_CENTER_CARD_HEIGHT,
            zIndex: 3,
          }}
        >
          <ProductCarbonCardVisual selectedCard={selectedCard} />
          <NeonBorder
            borderWidth={8}
            color1={accentColors.light}
            color2={accentColors.dark}
            finalOpacity={0.1}
            height={STEP_TWO_CENTER_CARD_HEIGHT}
            radius={STEP_TWO_CENTER_CARD_RADIUS}
            width={STEP_TWO_CENTER_CARD_WIDTH}
          />
        </motion.div>

        {stepTwoAnnotations.map((annotation, index) => {
          const scaledAnnotation = scaleStepTwoAnnotation(annotation)
          const recognitionContent = getStepTwoRecognitionContent(selectedCard.id, annotation.id)
          const stageDuration = 5 / 4
          const delay = index * stageDuration

          return (
            <motion.div
              key={annotation.id}
              animate={{ opacity: isAdvancing ? 0 : 1 }}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: 6 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <AnnotationConnector
                annotation={scaledAnnotation}
                delay={delay}
                stroke={connectorColor}
                strokeWidth={6}
              />

              <motion.div
                animate={{ opacity: annotationOuterDotOpacity, scale: 1 }}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0.2 }}
                style={{
                  backgroundColor: accentColors.light,
                  left: scaledAnnotation.dotX - 19.44,
                  top: scaledAnnotation.dotY - 19.44,
                  width: 38.88,
                  height: 38.88,
                }}
                transition={{ delay, duration: 0.18, ease: 'easeOut' }}
              />
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0.2 }}
                style={{
                  backgroundColor: annotationInnerDotColor,
                  left: scaledAnnotation.dotX - 9.72,
                  top: scaledAnnotation.dotY - 9.72,
                  width: 19.44,
                  height: 19.44,
                }}
                transition={{ delay: delay + 0.04, duration: 0.18, ease: 'easeOut' }}
              />

              <motion.div
                animate={{ opacity: 1, scale: 1, ...(annotation.id.startsWith('bottom-') ? { y: '-100%' } : {}) }}
                className={cn(
                  'absolute isolate flex flex-col overflow-hidden rounded-[24px] px-8 py-7 shadow-[0_22px_48px_rgba(15,23,42,0.14)] bg-white/50 backdrop-blur-2xl ring-1 ring-white/80',
                  annotation.id === 'bottom-right' ? 'gap-6' : 'gap-5',
                )}
                initial={{ opacity: 0, scale: 0.92, ...(annotation.id.startsWith('bottom-') ? { y: '-100%' } : {}) }}
                style={{
                  left: getStepTwoInfoCardLeft(annotation.cardX < 0),
                  top: annotation.id.startsWith('bottom-')
                    ? STEP_TWO_CONNECTOR_ELBOW_Y + CONNECTOR_CARD_BOTTOM_OFFSET
                    : scaledAnnotation.cardY - 20,
                  width: STEP_TWO_INFO_CARD_WIDTH,
                }}
                transition={{ delay: delay + 0.8, duration: 0.2, ease: 'linear' }}
              >
                <div 
                  className="absolute -left-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-[30px]" 
                  style={{ backgroundColor: accentColors.light }}
                />
                <NoiseTexture className="opacity-20 mix-blend-overlay" frequency={0.7} noiseOpacity={0.4} octaves={6} slope={0.28} />
                
                {recognitionContent?.map((section) => (
                  <div key={section.title} className="relative z-10 flex flex-col gap-3 text-left">
                    {section.title === '参考资料：' ? (
                      <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-slate-50/80 px-4 py-3 ring-1 ring-slate-100/80">
                        <p className="text-[16px] font-medium leading-[1.35] text-slate-500">
                          <span className="mr-1 font-bold text-slate-400">{section.title}</span>
                          {section.bullets[0]}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-1.5 rounded-full" style={{ backgroundColor: accentColors.dark }} />
                          <h3 className="text-[28px] font-bold tracking-tight text-[#0F172A]">{section.title}</h3>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="relative flex items-start gap-3 rounded-lg px-2 py-1.5 transition-colors">
                              <div className="mt-2.5 flex shrink-0 items-center justify-center">
                                <div className="h-2 w-2 rotate-45 rounded-sm transition-transform" style={{ backgroundColor: accentColors.light, boxShadow: `0 0 8px ${accentColors.light}` }} />
                              </div>
                              <span className="text-[22px] font-medium leading-[1.4] text-[#334155] transition-colors">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )
        })}

        <motion.div
          animate={{ opacity: isAdvancing ? 0 : 1, y: isAdvancing ? 10 : 0 }}
          className="hidden"
          initial={{ opacity: 0, y: 10 }}
          style={{ top: `calc(50% + ${STEP_TWO_ACTION_BUTTON_TOP_OFFSET}px)` }}
          transition={{ delay: isAdvancing ? 0 : 5, duration: 0.24, ease: 'linear' }}
        >
          <Button
            asChild
            className="h-[79.2px] rounded-[0.857em] px-[43.2px] text-[25.2px] font-semibold shadow-[0_18px_42px_rgba(15,23,42,0.16)] hover:brightness-105"
            style={{ backgroundColor: reportButtonColor, color: '#FFFFFF' }}
            size="default"
          >
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              style={{ transformOrigin: 'center', willChange: 'transform' }}
              transition={actionButtonBreathingTransition}
              type="button"
              onClick={() => {
                if (isAdvancing) {
                  return
                }

                setIsAdvancing(true)
                window.setTimeout(() => {
                  onAdvance()
                }, 320)
              }}
            >
              <span>启动数据解构</span>
              <MousePointerClick className="ml-[9px] h-[57.6px] w-[57.6px] shrink-0" strokeWidth={2.4} />
            </motion.button>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ProductSelectionStepThree({
  selectedCard,
  onAdvance,
}: {
  selectedCard: ProductCard
  onAdvance: () => void
}) {
  const [isAdvancing, setIsAdvancing] = useState(false)
  const { isStageMeasured, stageContainerRef, stageScale } = useStepTwoStageScale()
  const accentColors = getStepTwoProductAccentColors(selectedCard.id)
  const connectorColor = selectedCard.id === 'backpack' ? accentColors.light : accentColors.dark
  const annotationOuterDotOpacity = selectedCard.id === 'backpack' ? 0.2 : 0.8
  const annotationInnerDotColor = selectedCard.id === 'backpack' ? connectorColor : accentColors.dark
  const scanCornerColor = selectedCard.id === 'backpack' ? '#8ED4FF' : undefined
  const reportButtonColor = getProductReportButtonColor(selectedCard.id)

  return (
    <div ref={stageContainerRef} className="relative flex min-h-0 flex-1 items-center justify-center">
      <div
        className="relative h-[620px] w-[1532px]"
        style={{ opacity: isStageMeasured ? 1 : 0, transform: `scale(${stageScale})`, transformOrigin: 'center center' }}
      >
        <motion.div
          className="text-display absolute left-1/2 top-1/2 isolate flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[28px] font-semibold text-[#0E1624] shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-md"
          initial={false}
          style={{
            width: STEP_TWO_CENTER_CARD_WIDTH,
            height: STEP_TWO_CENTER_CARD_HEIGHT,
            zIndex: 3,
          }}
        >
          <ProductCarbonCardVisual selectedCard={selectedCard} scanColor={scanCornerColor} scanDelay={0.18} showScan />
        </motion.div>

        {stepTwoAnnotations.map((annotation, index) => {
          const scaledAnnotation = scaleStepTwoAnnotation(annotation)
          const deconstructionContent = getStepThreeDeconstructionContent(selectedCard.id, annotation.id)
          const stageDuration = 5 / 4
          const delay = index * stageDuration

          return (
            <motion.div
              key={annotation.id}
              animate={{ opacity: isAdvancing ? 0 : 1 }}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: 6 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <AnnotationConnector
                annotation={scaledAnnotation}
                delay={delay}
                stroke={connectorColor}
                strokeWidth={6}
              />

              <motion.div
                animate={{ opacity: annotationOuterDotOpacity, scale: 1 }}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0.2 }}
                style={{
                  backgroundColor: accentColors.light,
                  left: scaledAnnotation.dotX - 19.44,
                  top: scaledAnnotation.dotY - 19.44,
                  width: 38.88,
                  height: 38.88,
                }}
                transition={{ delay, duration: 0.18, ease: 'easeOut' }}
              />
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0.2 }}
                style={{
                  backgroundColor: annotationInnerDotColor,
                  left: scaledAnnotation.dotX - 9.72,
                  top: scaledAnnotation.dotY - 9.72,
                  width: 19.44,
                  height: 19.44,
                }}
                transition={{ delay: delay + 0.04, duration: 0.18, ease: 'easeOut' }}
              />

              <motion.div
                animate={{ opacity: 1, scale: 1, ...(annotation.id.startsWith('bottom-') ? { y: '-100%' } : {}) }}
                className="absolute isolate flex flex-col gap-5 overflow-hidden rounded-[24px] px-8 py-7 shadow-[0_22px_48px_rgba(15,23,42,0.14)] bg-white/50 backdrop-blur-2xl ring-1 ring-white/80"
                initial={{ opacity: 0, scale: 0.92, ...(annotation.id.startsWith('bottom-') ? { y: '-100%' } : {}) }}
                style={{
                  left: getStepTwoInfoCardLeft(annotation.cardX < 0),
                  top: annotation.id.startsWith('bottom-')
                    ? STEP_TWO_CONNECTOR_ELBOW_Y + CONNECTOR_CARD_BOTTOM_OFFSET
                    : scaledAnnotation.cardY - 20,
                  width: STEP_TWO_INFO_CARD_WIDTH,
                }}
                transition={{ delay: delay + 0.8, duration: 0.2, ease: 'linear' }}
              >
                <div 
                  className="absolute -left-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-[30px]" 
                  style={{ backgroundColor: accentColors.light }}
                />
                <NoiseTexture className="opacity-20 mix-blend-overlay" frequency={0.7} noiseOpacity={0.4} octaves={6} slope={0.28} />
                
                {deconstructionContent?.map((section) => (
                  <div key={section.title} className="relative z-10 flex flex-col gap-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1.5 rounded-full" style={{ backgroundColor: accentColors.dark }} />
                      <h3 className="text-[28px] font-bold tracking-tight text-[#0F172A]">{section.title}</h3>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="relative flex items-start gap-3 rounded-lg px-2 py-1 transition-colors">
                          {bullet === '……' ? (
                            <div className="ml-1 mt-1 text-[22px] font-bold tracking-[0.2em] text-slate-400">{bullet}</div>
                          ) : (
                            <>
                              <div className="mt-2.5 flex shrink-0 items-center justify-center">
                                <div className="h-2 w-2 rotate-45 rounded-sm transition-transform" style={{ backgroundColor: accentColors.light, boxShadow: `0 0 8px ${accentColors.light}` }} />
                              </div>
                              <span className="whitespace-pre-line text-[22px] font-medium leading-[1.35] text-[#334155] transition-colors">{bullet}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )
        })}

        <motion.div
          animate={{ opacity: isAdvancing ? 0 : 1, y: isAdvancing ? 10 : 0 }}
          className="hidden"
          initial={{ opacity: 0, y: 10 }}
          style={{ top: `calc(50% + ${STEP_TWO_ACTION_BUTTON_TOP_OFFSET}px)` }}
          transition={{ delay: isAdvancing ? 0 : 5, duration: 0.24, ease: 'linear' }}
        >
          <Button
            asChild
            className="h-[79.2px] rounded-[0.857em] px-[43.2px] text-[25.2px] font-semibold shadow-[0_18px_42px_rgba(15,23,42,0.16)] hover:brightness-105"
            style={{ backgroundColor: reportButtonColor, color: '#FFFFFF' }}
            size="default"
          >
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              style={{ transformOrigin: 'center', willChange: 'transform' }}
              transition={actionButtonBreathingTransition}
              type="button"
              onClick={() => {
                if (isAdvancing) {
                  return
                }

                setIsAdvancing(true)
                window.setTimeout(() => {
                  onAdvance()
                }, 320)
              }}
            >
              <span>启动智能建模</span>
              <MousePointerClick className="ml-[9px] h-[57.6px] w-[57.6px] shrink-0" strokeWidth={2.4} />
            </motion.button>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ProductSelectionStepFour({
  advanceRequestKey,
  onBusinessDisabledChange,
  selectedCard,
  onAdvance,
}: {
  advanceRequestKey: number
  onBusinessDisabledChange: (disabled: boolean) => void
  selectedCard: ProductCard
  onAdvance: (scheme: 'recommended' | 'custom') => void
}) {
  const { containerRef, containerSize, scale } = useStageScale(PRODUCT_FLOW_STAGE_WIDTH, PRODUCT_FLOW_STAGE_HEIGHT)
  const [activeTab, setActiveTab] = useState<'recommended' | 'custom'>('recommended')
  const [selectedDetailNode, setSelectedDetailNode] = useState<'material' | 'transport'>('material')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)
  const [openDropdown, setOpenDropdown] = useState<'component' | 'formula' | 'factor' | null>(null)
  const [isCustomFactorSelected, setIsCustomFactorSelected] = useState<boolean>(false)
  const activeColor = getProductReportButtonColor(selectedCard.id)
  const accentColors = getStepTwoProductAccentColors(selectedCard.id)

  // Transition States
  const [transitionPhase, setTransitionPhase] = useState<'none' | 'moving' | 'scanning' | 'revealing' | 'completed'>('none')
  const [isHandingOffToStepFive, setIsHandingOffToStepFive] = useState(false)
  const [progress, setProgress] = useState(0)
  const handleAdvanceRef = useRef<() => void>(() => undefined)

  const isTransitioning = transitionPhase !== 'none'
  const isScanning = transitionPhase === 'scanning' || transitionPhase === 'revealing' || transitionPhase === 'completed'
  const showScanStatus = transitionPhase === 'scanning'

  const treeStartDelay = 1.08
  const trunkVerticalDelay = treeStartDelay
  const trunkVerticalDuration = 0.5
  const branchStartDelay = trunkVerticalDelay + trunkVerticalDuration + 0.06
  const stageOffsetX = Math.max(0, (containerSize.width - PRODUCT_FLOW_STAGE_WIDTH * scale) / 2)
  const usesTwoStageTree = selectedCard.id === 'transformer' || selectedCard.id === 'formaldehyde'
  const usesMaterialTransportBranch = selectedCard.id === 'transformer' || selectedCard.id === 'formaldehyde'
  const transportBranchLabels = selectedCard.id === 'formaldehyde'
    ? { levelTwo: '原材料的运输', levelThree: '甲醇货车运输' }
    : { levelTwo: '原材料运输', levelThree: '非晶带材货车运输' }
  const numGroups = usesTwoStageTree ? 2 : 4
  
  // Compute group centers so the tree visual height (including children) matches the detail panel height
  const treeVisualSpan = STEP_FOUR_TREE_HEIGHT - 2 * STEP_FOUR_TREE_CHILD_OFFSET - STEP_FOUR_TREE_NODE_HEIGHT
  const firstCenter = STEP_FOUR_TREE_TOP + STEP_FOUR_TREE_NODE_HEIGHT / 2
  
  let treeGroupCenters: number[]
  if (usesTwoStageTree) {
    const centerY = STEP_FOUR_TREE_TOP + STEP_FOUR_TREE_HEIGHT / 2
    treeGroupCenters = [centerY - 170, centerY + 180]
  } else {
    const treeGroupGap = treeVisualSpan / (numGroups - 1)
    treeGroupCenters = Array.from({ length: numGroups }, (_, i) => Math.round(firstCenter + i * treeGroupGap))
  }

  const treeLabels = stepFourTreeLabels[selectedCard.id] ?? stepFourTreeLabels.backpack
  const treeCenterY = (treeGroupCenters[0] + treeGroupCenters[treeGroupCenters.length - 1]) / 2
  const treeVisualTop = STEP_FOUR_TREE_TOP
  const treeVisualBottom = STEP_FOUR_TREE_TOP + STEP_FOUR_TREE_HEIGHT
  const leftGroupOffsetY = selectedCard.id === 'formaldehyde' || selectedCard.id === 'transformer' ? -68 : 0
  const productNameTop = treeCenterY + STEP_FOUR_PRODUCT_CARD_HEIGHT / 2 + STEP_FOUR_PRODUCT_NAME_GAP
  const materialLCI: StepFourLCI = selectedCard.id === 'lithium-battery' ? {
    activityValue: '1.06', activityUnit: 'kg', activityRef: '石墨使用量', activityDQI: 3, activityUncert: '5%',
    recEfValue: '47.03568127', efUnit: 'kgCO₂e/kg', recEfSource: 'Ecoinvent 3.11', efRef: '[CN] synthetic graphite production, battery grade, via Acheson powder route | synthetic graphite, battery grade', efDQI: 3, efUncert: '15%',
    recTotal: '49.85782214', recUncertLower: '-XX', recUncertUpper: '+YY',
    cusEfValue: '47.19799379', cusEfSource: 'Ecoinvent 3.12', cusTotal: '50.02987341', cusUncertLower: '-15.4', cusUncertUpper: '+15.86'
  } : selectedCard.id === 'transformer' ? {
    activityValue: '530.0529', activityUnit: 'kg', activityRef: '变压器-非晶带材', activityDQI: 3, activityUncert: '5%',
    recEfValue: '8.07', efUnit: 'kgCO₂e/kg', recEfSource: 'Lifeng Liu,2016', recEfRef: '非晶合金带', efRef: '非晶合金带', efDQI: 2.5, efUncert: '30%',
    recTotal: '4277.526903', recUncertLower: '-30.09', recUncertUpper: '30.67',
    cusEfValue: '3.1', cusEfSource: 'Proterial, Ltd.，2024', cusEfRef: '非晶合金非晶合金MaDC-A™', cusTotal: '1643.16399', cusUncertLower: '-30.09', cusUncertUpper: '30.67'
  } : selectedCard.id === 'formaldehyde' ? {
    activityValue: '1', activityUnit: 'kg', activityRef: '甲醇使用量', activityDQI: 3, activityUncert: '5%',
    recEfValue: '0', efUnit: 'kgCO₂e/kg', recEfSource: '待匹配因子库', recEfRef: '甲醇', efRef: '甲醇', efDQI: 3, efUncert: '15%',
    recTotal: '0', recUncertLower: '-XX', recUncertUpper: '+YY',
    cusEfValue: '0', cusEfSource: '自定义因子', cusEfRef: '甲醇', cusTotal: '0', cusUncertLower: '-XX', cusUncertUpper: '+YY'
  } : {
    activityValue: '0.22', activityUnit: 'kg', activityRef: '用量', activityDQI: 4, activityUncert: '2%',
    recEfValue: '25.70', efUnit: 'kgCO₂e/kg', recEfSource: 'CPCD数据库', efRef: '普通涤纶面料生产', efDQI: 3, efUncert: '10%',
    recTotal: '5.65', recUncertLower: '-XX', recUncertUpper: '+YY',
    cusEfValue: '4.31', cusEfSource: '自定义因子', cusTotal: '0.95', cusUncertLower: '-5.0', cusUncertUpper: '+5.0'
  }

  const transformerTransportLCI: StepFourLCI = {
    activityValue: '530.0529', activityUnit: 'kg', activityRef: '非晶带材使用量', activityDQI: 3, activityUncert: '5%',
    secondaryActivityValue: '83.52', secondaryActivityUnit: 'km', secondaryActivityRef: '原辅料的运输距离', secondaryActivityDQI: 1, secondaryActivityUncert: '25%',
    recEfValue: '0.1112575', efUnit: 'kgCO₂e/t/km', recEfSource: 'Ecoinvent 3.11', recEfRef: '[RoW] transport, freight, lorry, >32 metric ton, diesel, EURO 5 | transport, freight, lorry, >32 metric ton, diesel, EURO 5', efRef: '[RoW] transport, freight, lorry, >32 metric ton, diesel, EURO 5 | transport, freight, lorry, >32 metric ton, diesel, EURO 5', efDQI: 2.5, efUncert: '30%',
    recTotal: '4.9253166', recUncertLower: '-35.67', recUncertUpper: '42.14',
    cusEfValue: '0.1112575', cusEfSource: 'Ecoinvent 3.12', cusEfRef: '[RoW] transport, freight, lorry, >32 metric ton, diesel, EURO 5 | transport, freight, lorry, >32 metric ton, diesel, EURO 5', cusTotal: '4.9253166', cusUncertLower: '-35.67', cusUncertUpper: '42.14',
  }

  const formaldehydeTransportLCI: StepFourLCI = {
    activityValue: '1', activityUnit: 'kg', activityRef: '甲醇使用量', activityDQI: 3, activityUncert: '5%',
    secondaryActivityValue: '0', secondaryActivityUnit: 'km', secondaryActivityRef: '原辅料的运输距离', secondaryActivityDQI: 1, secondaryActivityUncert: '25%',
    recEfValue: '0', efUnit: 'kgCO₂e/t/km', recEfSource: '待匹配因子库', recEfRef: '甲醇运输', efRef: '甲醇运输', efDQI: 2.5, efUncert: '30%',
    recTotal: '0', recUncertLower: '-XX', recUncertUpper: '+YY',
    cusEfValue: '0', cusEfSource: '自定义因子', cusEfRef: '甲醇运输', cusTotal: '0', cusUncertLower: '-XX', cusUncertUpper: '+YY',
  }

  const currentLCI = usesMaterialTransportBranch && selectedDetailNode === 'transport'
    ? selectedCard.id === 'formaldehyde' ? formaldehydeTransportLCI : transformerTransportLCI
    : materialLCI

  const nodeTitle = 
    selectedCard.id === 'lithium-battery' ? '阳极石墨' :
    selectedCard.id === 'formaldehyde' && selectedDetailNode === 'transport' ? '甲醇的运输' :
    selectedCard.id === 'formaldehyde' ? '甲醇' :
    selectedCard.id === 'transformer' && selectedDetailNode === 'transport' ? '非晶带材的运输' :
    selectedCard.id === 'transformer' ? '非晶带材' :
    '涤纶面料'

  const formatLciNumber = (value: string) => {
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      return value
    }

    return new Intl.NumberFormat('zh-CN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(numericValue)
  }

  const currentEfSource = activeTab === 'custom' 
    ? (currentLCI.autoSelectCustomFactor || isCustomFactorSelected ? currentLCI.cusEfSource : '请选择因子版本')
    : currentLCI.recEfSource
  const currentEfRef = activeTab === 'custom'
    ? (currentLCI.autoSelectCustomFactor || isCustomFactorSelected ? (currentLCI.cusEfRef ?? currentLCI.efRef) : '请选择因子版本')
    : (currentLCI.recEfRef ?? currentLCI.efRef)
  const currentEfValue = activeTab === 'custom' 
    ? (currentLCI.autoSelectCustomFactor || isCustomFactorSelected ? formatLciNumber(currentLCI.cusEfValue) : '---')
    : formatLciNumber(currentLCI.recEfValue)
  const currentTotal = activeTab === 'custom' 
    ? (currentLCI.autoSelectCustomFactor || isCustomFactorSelected ? formatLciNumber(currentLCI.cusTotal) : '---')
    : formatLciNumber(currentLCI.recTotal)

  const handleAdvance = useCallback(() => {
    if (transitionPhase !== 'none') return
    setTransitionPhase('moving')
    
    // Step 1: Wait 1000ms for Card and Detail Panel to move to the center
    setTimeout(() => {
      setTransitionPhase('scanning')
    }, 1000)
  }, [transitionPhase])

  useEffect(() => {
    handleAdvanceRef.current = handleAdvance
  }, [handleAdvance])

  // Handle scanning phase progress animation
  useEffect(() => {
    if (transitionPhase !== 'scanning') return

    let start: number | null = null
    const duration = 4000 // 4.0 seconds
    let animationFrameId: number

    const tick = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const currentProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(currentProgress)

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(tick)
      } else {
        setTransitionPhase('revealing')
      }
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [transitionPhase])

  // Fade out the Step 4 surface after the scan completes, then reveal Step 5.
  useEffect(() => {
    if (transitionPhase !== 'revealing') return

    const timeoutId = window.setTimeout(() => {
      setTransitionPhase('completed')
    }, 600)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [transitionPhase])

  // Navigate to Step 5 when docking is completed
  useEffect(() => {
    if (transitionPhase === 'completed') {
      const timeoutId = window.setTimeout(() => {
        flushSync(() => {
          setIsHandingOffToStepFive(true)
        })
        onAdvance(activeTab)
      }, 80)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }
  }, [transitionPhase, activeTab, onAdvance])

  const isButtonDisabled = (activeTab === 'custom' && !currentLCI.autoSelectCustomFactor && !isCustomFactorSelected) || transitionPhase !== 'none'
  const detailWidth = PRODUCT_FLOW_STAGE_WIDTH - STEP_FOUR_DETAIL_LEFT - STEP_FOUR_PRODUCT_CARD_LEFT

  useEffect(() => {
    onBusinessDisabledChange(isButtonDisabled)
  }, [isButtonDisabled, onBusinessDisabledChange])

  useEffect(() => {
    if (advanceRequestKey <= 0 || isButtonDisabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      handleAdvanceRef.current()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [advanceRequestKey, isButtonDisabled])
  const renderActivityDataCard = ({
    dqi,
    ref,
    title,
    uncertainty,
    unit,
    value,
  }: {
    dqi: number
    ref: string
    title: string
    uncertainty: string
    unit: string
    value: string
  }) => (
    <div className="flex-1 rounded-[20px] bg-white border border-[#0F172A]/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center min-h-[24px]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]/40">{title}</div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
          <span className="text-sm font-bold text-[#0F172A]/40">{unit}</span>
        </div>
        <div className="mt-1 text-sm font-medium text-[#24406E] break-words">{ref}</div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 pt-4 border-t border-[#0F172A]/5">
        <div className="flex items-center text-xs font-semibold text-[#0F172A]/60">
          数据质量打分：{dqi}
        </div>
        <div className="flex items-center text-xs font-semibold text-[#0F172A]/60">
          不确定性：{uncertainty}
        </div>
      </div>
    </div>
  )
  const operatorSymbol = (
    <div className="flex w-6 shrink-0 items-center justify-center text-[#0F172A]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </div>
  )

  return (
    <div ref={containerRef} className="relative flex min-h-0 flex-1 items-center justify-start overflow-hidden">
      <div
        className="relative shrink-0 origin-left"
        style={{
          width: PRODUCT_FLOW_STAGE_WIDTH,
          height: PRODUCT_FLOW_STAGE_HEIGHT,
          transform: `translateX(${stageOffsetX}px) scale(${scale})`,
        }}
      >
        {/* Product Card Container */}
        {!isHandingOffToStepFive ? (
          <motion.div
            animate={
              isTransitioning
                ? {
                    left: (PRODUCT_FLOW_STAGE_WIDTH - 300) / 2,
                    width: 300,
                    height: 360,
                    opacity: transitionPhase === 'revealing' || transitionPhase === 'completed' ? 0 : 1,
                  }
                : {
                    left: STEP_FOUR_PRODUCT_CARD_LEFT,
                    width: STEP_FOUR_PRODUCT_CARD_WIDTH,
                    height: STEP_FOUR_PRODUCT_CARD_HEIGHT,
                    opacity: 1,
                  }
            }
            className="absolute top-1/2 isolate -translate-y-1/2 overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
            initial={
              isTransitioning
                ? false
                : {
                    left: (PRODUCT_FLOW_STAGE_WIDTH - STEP_TWO_CENTER_CARD_WIDTH) / 2,
                    width: STEP_TWO_CENTER_CARD_WIDTH,
                    height: STEP_TWO_CENTER_CARD_HEIGHT,
                  }
            }
            style={{
              zIndex: isTransitioning ? 50 : 40,
              top: treeCenterY + leftGroupOffsetY,
            }}
            transition={
              isTransitioning
                ? { duration: transitionPhase === 'revealing' ? 0.5 : 0.8, ease: [0.22, 0.8, 0.22, 1] }
                : { duration: 1.05, ease: [0.22, 0.8, 0.22, 1] }
            }
          >
            <ProductCarbonCardVisual selectedCard={selectedCard} />
            
            {/* Glowing Border Progress Bar (Using Step 2's NeonBorder) */}
            {isScanning && (
              <NeonBorder
                borderWidth={8}
                color1={accentColors.light}
                color2={accentColors.dark}
                finalOpacity={1}
                height={360}
                radius={28}
                width={300}
                progress={progress}
              />
            )}
          </motion.div>
        ) : null}

        {/* Tree & Connector Structure (fades out during transition) */}
        <motion.div
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          style={{ y: leftGroupOffsetY }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <StepFourTreeConnector delay={trunkVerticalDelay} groupCenters={treeGroupCenters} left={STEP_FOUR_TREE_TRUNK_X} top={0} type="trunk" />
          <StepFourTreeConnector
            delay={treeStartDelay + 0.08}
            left={STEP_FOUR_PRODUCT_CARD_LEFT + STEP_FOUR_PRODUCT_CARD_WIDTH}
            top={treeCenterY - 3}
            type="product"
          />
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute text-center text-[20px] font-medium leading-none text-[#0F172A]"
            initial={{ opacity: 0, y: 8 }}
            style={{
              left: STEP_FOUR_PRODUCT_CARD_LEFT,
              top: productNameTop,
              width: STEP_FOUR_PRODUCT_CARD_WIDTH,
            }}
            transition={{ delay: branchStartDelay, duration: 0.24, ease: 'easeOut' }}
          >
            {selectedCard.label}
            <div className="mt-2 text-[14px] font-normal text-[#64748B]">（仅展示部分节点）</div>
          </motion.div>

          {treeGroupCenters.map((center, groupIndex) => {
            const nodeDelay = branchStartDelay + 0.14 + groupIndex * 0.08
            const hasChildren = true
            const levelOne = STEP_FOUR_TREE_LEVELS[0]
            const levelTwo = STEP_FOUR_TREE_LEVELS[1]
            const levelThree = STEP_FOUR_TREE_LEVELS[2]
            const levelOneTop = center - STEP_FOUR_TREE_NODE_HEIGHT / 2
            const levelTwoTop = center + STEP_FOUR_TREE_CHILD_OFFSET - STEP_FOUR_TREE_NODE_HEIGHT / 2
            const levelThreeTop = center + STEP_FOUR_TREE_CHILD_OFFSET * 2 - STEP_FOUR_TREE_NODE_HEIGHT / 2
            const isHighlighted = groupIndex === selectedGroupIndex
            const groupLabels = treeLabels?.[groupIndex]
            const showMaterialTransportBranch = usesMaterialTransportBranch && groupIndex === 0
            const isTransportNodeInteractive = false
            const transportLevelTwoTop = center + STEP_FOUR_TREE_CHILD_OFFSET * 3 - STEP_FOUR_TREE_NODE_HEIGHT / 2
            const transportLevelThreeTop = center + STEP_FOUR_TREE_CHILD_OFFSET * 4 - STEP_FOUR_TREE_NODE_HEIGHT / 2

            return (
              <div key={center}>
                <StepFourTreeNode delay={nodeDelay} label={groupLabels?.[0]} left={levelOne.left} level={1} top={levelOneTop} width={levelOne.width} />
                {hasChildren ? (
                  <>
                    <StepFourTreeConnector
                      delay={nodeDelay + 0.18}
                      left={levelOne.left + 54}
                      top={levelOneTop + STEP_FOUR_TREE_NODE_HEIGHT / 2}
                      type={showMaterialTransportBranch ? 'splitBranch' : 'branch'}
                    />
                    <StepFourTreeNode delay={nodeDelay + 0.38} label={groupLabels?.[1]} left={levelTwo.left} level={2} top={levelTwoTop} width={levelTwo.width} />
                    <StepFourTreeConnector delay={nodeDelay + 0.58} left={levelTwo.left + 62} top={levelTwoTop + STEP_FOUR_TREE_NODE_HEIGHT / 2} type="branch" />
                    <StepFourTreeNode
                      delay={nodeDelay + 0.78}
                      highlightColor={accentColors.dark}
                      highlighted={isHighlighted && selectedDetailNode === 'material'}
                      label={groupLabels?.[2]}
                      left={levelThree.left}
                      level={3}
                      onClick={groupLabels?.[2] !== '电网供电' ? () => {
                        setSelectedGroupIndex(groupIndex)
                        setSelectedDetailNode('material')
                        setOpenDropdown(null)
                      } : undefined}
                      showDetailArrow={groupLabels?.[2] !== '电网供电'}
                      top={levelThreeTop}
                      width={levelThree.width}
                    />
                    {showMaterialTransportBranch ? (
                      <>
                        <StepFourTreeNode delay={nodeDelay + 1.18} label={transportBranchLabels.levelTwo} left={levelTwo.left} level={2} top={transportLevelTwoTop} width={levelTwo.width} />
                        <StepFourTreeConnector delay={nodeDelay + 1.38} left={levelTwo.left + 62} top={transportLevelTwoTop + STEP_FOUR_TREE_NODE_HEIGHT / 2} type="branch" />
                        <StepFourTreeNode
                          delay={nodeDelay + 1.58}
                          highlightColor={accentColors.dark}
                          label={transportBranchLabels.levelThree}
                          left={levelThree.left}
                          level={3}
                          highlighted={isTransportNodeInteractive && selectedDetailNode === 'transport'}
                          onClick={isTransportNodeInteractive ? () => {
                            setSelectedDetailNode('transport')
                            setOpenDropdown(null)
                          } : undefined}
                          showDetailArrow={isTransportNodeInteractive}
                          top={transportLevelThreeTop}
                          width={levelThree.width}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            )
          })}
        </motion.div>

        {/* Left and Right Symmetrical Percentage-only Indicators */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showScanStatus ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none z-40"
          >
            {/* Left Side Percentage */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 120 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[616px] flex items-center justify-center font-black tracking-tighter"
              style={{
                fontSize: '110px',
                color: activeColor,
                textShadow: `0 0 45px ${activeColor}33`,
              }}
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Right Side Percentage */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 120 }}
              className="absolute left-[916px] top-1/2 -translate-y-1/2 w-[616px] flex items-center justify-center font-black tracking-tighter"
              style={{
                fontSize: '110px',
                color: activeColor,
                textShadow: `0 0 45px ${activeColor}33`,
              }}
            >
              {Math.round(progress)}%
            </motion.div>
          </motion.div>
        )}

        {/* Dynamic Progress Description below Card */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showScanStatus ? 1 : 0, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none"
            style={{
              top: '585px',
              width: '600px',
            }}
          >
            <div 
              className="text-[24px] font-bold tracking-wide transition-colors duration-300" 
              style={{ 
                color: activeColor,
                textShadow: `0 0 25px ${activeColor}22`
              }}
            >
              {progress < 30 && "正在整合生命周期数据..."}
              {progress >= 30 && progress < 70 && "正在进行排放因子建模与映射..."}
              {progress >= 70 && progress < 95 && "正在汇总碳足迹核算结果..."}
              {progress >= 95 && "核算完成，生成报告中..."}
            </div>
            <div className="mt-2 text-[13px] font-bold text-[#0F172A]/30 uppercase tracking-[0.2em]">
              SYSTEM ACCUMULATION STATUS
            </div>
          </motion.div>
        )}

        {/* Real Scheme Details Panel (moves to center behind card, scales & fades out) */}
        <motion.div
          animate={
            isTransitioning
              ? {
                  left: (PRODUCT_FLOW_STAGE_WIDTH - detailWidth) / 2,
                  scale: isScanning ? 0.7 : 1,
                  opacity: isScanning || isHandingOffToStepFive ? 0 : 1,
                }
              : {
                  opacity: 1,
                  x: 0,
                }
          }
          className="absolute rounded-[24px] bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
          initial={
            isTransitioning
              ? false
              : { opacity: 0, x: 24 }
          }
          style={{
            left: STEP_FOUR_DETAIL_LEFT,
            top: treeVisualTop,
            width: detailWidth,
            height: treeVisualBottom - treeVisualTop,
            y: 0,
            zIndex: isTransitioning ? 10 : 30, // Stay behind card during transition
          }}
          transition={
            isTransitioning
              ? { duration: 0.8, ease: 'easeInOut' }
              : { delay: branchStartDelay + 2.54, duration: 0.34, ease: 'easeOut' }
          }
        >
          <div className="flex h-full flex-col justify-between p-8">
            {/* Invisible Click-away Backdrop */}
            {openDropdown && (
              <div className="fixed inset-0 z-[90]" onClick={() => setOpenDropdown(null)} />
            )}
            
            <div className="relative z-[95]">
              {/* Node Title */}
              <div className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: activeColor }} />
                <h3 className="text-[28px] font-bold text-[#0F172A]">{nodeTitle}</h3>
                <span
                  className="rounded-lg px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${activeColor}1a`,
                    color: activeColor,
                  }}
                >
                  示例节点
                </span>
              </div>
              
              {/* Tabs Switcher - 100% full width dynamic tabs */}
              <div className="relative mt-8 flex rounded-2xl bg-[#0F172A]/5 p-1.5 w-full">
                <button
                  disabled={transitionPhase !== 'none'}
                  onClick={() => {
                    if (activeTab !== 'recommended') {
                      setActiveTab('recommended')
                    }
                  }}
                  className={`relative z-10 flex-1 py-2 text-center text-sm font-semibold rounded-[0.875em] transition-colors duration-300 ${
                    activeTab === 'recommended' ? 'text-white' : 'text-[#0F172A]/60 hover:text-[#0F172A]'
                  }`}
                  type="button"
                >
                  推荐方案
                  {activeTab === 'recommended' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 z-[-1] rounded-[0.875em] shadow-sm"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  disabled={transitionPhase !== 'none'}
                  onClick={() => {
                    if (activeTab !== 'custom') {
                      setActiveTab('custom')
                    }
                  }}
                  className={`relative z-10 flex-1 py-2 text-center text-sm font-semibold rounded-[0.875em] transition-colors duration-300 ${
                    activeTab === 'custom' ? 'text-white' : 'text-[#0F172A]/60 hover:text-[#0F172A]'
                  }`}
                  type="button"
                >
                  自选方案
                  {activeTab === 'custom' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 z-[-1] rounded-[0.875em] shadow-sm"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>
              
              {/* Scheme Content Cards - LCI Dashboard */}
              <div className="mt-8">
                {/* Top: Result & Precision */}
                {!(activeTab === 'custom' && !currentLCI.autoSelectCustomFactor && !isCustomFactorSelected) && (
                  <div className="flex items-start justify-between rounded-[20px] bg-[#0F172A]/[0.02] p-6 transition-all duration-300">
                    <div className="flex-1 flex flex-col items-start pl-2">
                      <div className="text-sm font-semibold text-[#0F172A]/40 mb-1">单位排放结果</div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[35px] font-bold tracking-tight text-[#0F172A] transition-all leading-none">{currentTotal}</span>
                        <span className="text-lg font-bold text-[#0F172A]/60">kgCO<sub>2</sub>e</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-start border-l border-[#0F172A]/5 pl-8">
                      <div className="text-sm font-semibold text-[#0F172A]/40 mb-1">不确定性范围</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 flex items-baseline gap-1"
                      >
                        <span className="text-[35px] font-bold tracking-tight text-[#0F172A] leading-none">
                          {activeTab === 'custom' ? currentLCI.cusUncertLower : currentLCI.recUncertLower}
                        </span>
                        <span className="text-lg font-bold text-[#0F172A]/60">%</span>
                        <span className="text-[35px] font-bold tracking-tight text-[#0F172A] leading-none mx-1.5">~</span>
                        <span className="text-[35px] font-bold tracking-tight text-[#0F172A] leading-none">
                          {activeTab === 'custom' ? currentLCI.cusUncertUpper : currentLCI.recUncertUpper}
                        </span>
                        <span className="text-lg font-bold text-[#0F172A]/60">%</span>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Component and Formula Area Placeholder */}
                <div className="mt-4 flex flex-col gap-2 rounded-[20px] bg-[#0F172A]/[0.02] px-6 py-4 transition-all">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-[#0F172A]/60">元件：</span>
                    <span className="text-sm font-bold text-[#0F172A]">这里需要补充元件名称</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-[#0F172A]/60">公式：</span>
                    <span className="text-sm font-bold text-[#0F172A]">活动数据 × 排放因子</span>
                  </div>
                </div>

                {/* Middle: Split Layout */}
                <div className="mt-4 flex items-stretch gap-3">
                  {renderActivityDataCard({
                    dqi: currentLCI.activityDQI,
                    ref: currentLCI.activityRef,
                    title: currentLCI.secondaryActivityValue ? '活动数据 1' : '活动数据',
                    uncertainty: currentLCI.activityUncert,
                    unit: currentLCI.activityUnit,
                    value: currentLCI.activityValue,
                  })}

                  {operatorSymbol}

                  {currentLCI.secondaryActivityValue ? (
                    <>
                      {renderActivityDataCard({
                        dqi: currentLCI.secondaryActivityDQI ?? 0,
                        ref: currentLCI.secondaryActivityRef ?? '',
                        title: '活动数据 2',
                        uncertainty: currentLCI.secondaryActivityUncert ?? '',
                        unit: currentLCI.secondaryActivityUnit ?? '',
                        value: currentLCI.secondaryActivityValue,
                      })}

                      {operatorSymbol}
                    </>
                  ) : null}

                  {/* Right: Emission Factor */}
                  <div className="flex-1 rounded-[20px] bg-white border border-[#0F172A]/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative flex flex-col justify-between transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 min-h-[24px]">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]/40 shrink-0">排放因子</div>
                        
                        <div className="relative">
                          {activeTab === 'custom' ? (
                            <div 
                              onClick={() => {
                                if (transitionPhase !== 'none') return
                                setOpenDropdown(openDropdown === 'factor' ? null : 'factor')
                              }}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-[#24406E]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#24406E] hover:bg-[#24406E]/15 transition-colors"
                            >
                              {currentEfSource}
                              <ChevronDown className="h-2.5 w-2.5" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 rounded-md bg-[#0F172A]/5 px-1.5 py-0.5 text-[10px] font-bold text-[#0F172A]/60">
                              {currentEfSource}
                            </div>
                          )}

                          {activeTab === 'custom' && openDropdown === 'factor' && (
                            <div className="absolute right-0 top-6 z-[100] w-max min-w-[120px] rounded-xl bg-white border border-[#0F172A]/5 p-2 shadow-xl">
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setIsCustomFactorSelected(true)
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm font-medium text-[#0F172A] rounded-[0.625em] hover:bg-[#0F172A]/5"
                                >
                                  {currentLCI.cusEfSource}
                                </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {(activeTab !== 'custom' || currentLCI.autoSelectCustomFactor || isCustomFactorSelected) && (
                        <>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#0F172A] transition-all">{currentEfValue}</span>
                            <span className="text-sm font-bold text-[#0F172A]/40">{currentLCI.efUnit}</span>
                          </div>

                          <div className="mt-1 text-xs font-medium text-[#24406E] leading-relaxed break-words" title={currentEfRef}>
                            {currentEfRef}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {(activeTab !== 'custom' || currentLCI.autoSelectCustomFactor || isCustomFactorSelected) && (
                      <div className="mt-4 flex flex-col gap-1.5 pt-4 border-t border-[#0F172A]/5">
                        <div className="flex items-center text-xs font-semibold text-[#0F172A]/60">
                          数据质量打分：{currentLCI.efDQI}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-[#0F172A]/60">
                          不确定性：{currentLCI.efUncert}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Container */}
            <div className="mt-8 flex items-center justify-between w-full">
              {activeTab === 'custom' ? (
                <Button
                  disabled={transitionPhase !== 'none'}
                  className="h-12 rounded-[0.875em] px-6 text-sm font-semibold border-2 bg-transparent transition-all duration-200 hover:bg-[#0F172A]/5"
                  style={{
                    borderColor: `${activeColor}33`,
                    color: activeColor,
                  }}
                  size="default"
                  type="button"
                  onClick={() => {
                    setIsCustomFactorSelected(false)
                    setOpenDropdown(null)
                  }}
                >
                  重置
                </Button>
              ) : (
                <div />
              )}

              <Button
                asChild
                className={cn(
                  "hidden h-12 rounded-[0.875em] px-8 text-base font-semibold shadow-lg transition-all duration-200",
                  isButtonDisabled
                    ? "bg-[#0F172A]/30 text-white/50 cursor-not-allowed pointer-events-none"
                    : "text-white hover:scale-[1.03] hover:brightness-110"
                )}
                style={{
                  backgroundColor: isButtonDisabled ? undefined : activeColor,
                }}
                size="default"
              >
                <motion.button
                  animate={isButtonDisabled ? { scale: 1 } : { scale: [1, 1.05, 1] }}
                  disabled={isButtonDisabled}
                  style={{ transformOrigin: 'center', willChange: isButtonDisabled ? 'auto' : 'transform' }}
                  transition={actionButtonBreathingTransition}
                  type="button"
                  onClick={handleAdvance}
                >
                  <span>生成核算结果</span>
                  <MousePointerClick className="ml-[10px] h-5 w-5 shrink-0" strokeWidth={2.4} />
                </motion.button>
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function ProductSelectionStepFive({
  revealFromStepFour = false,
  selectedCard,
  onAdvance,
}: {
  revealFromStepFour?: boolean
  selectedCard: ProductCard
  onAdvance: () => void
}) {
  const resultCardRef = useRef<HTMLDivElement>(null)
  const [resultCardSize, setResultCardSize] = useState({ width: 1600, height: 860 })
  const sectionOrder = ['overview', 'stage-share', 'process-top5', 'process-share'] as const
  const [activeSection, setActiveSection] = useState<typeof sectionOrder[number]>('overview')
  const [pageTurnDirection, setPageTurnDirection] = useState<StepFivePageTurnDirection>('forward')
  const productResultTheme = getProductResultTheme(selectedCard.id)
  const topFiveItems = selectedCard.id === 'backpack' ? [
    { height: 500, name: '涤纶面料', percentage: '39.44%', unit: 'kgCO₂e', value: '5.65' },
    { height: 420, name: '涤纶里料', percentage: '17.93%', unit: 'kgCO₂e', value: '2.57' },
    { height: 340, name: '涤纶织带', percentage: '13.45%', unit: 'kgCO₂e', value: '1.93' },
    { height: 280, name: '电网供电', percentage: '8.66%', unit: 'kgCO₂e', value: '1.24' },
    { height: 220, name: '涤纶包边带', percentage: '7.17%', unit: 'kgCO₂e', value: '1.03' },
  ] : selectedCard.id === 'lithium-battery' ? [
    { height: 500, name: '阳极石墨', percentage: '39.4%', unit: 'kgCO₂e', value: '49.86' },
    { height: 420, name: '六氟磷酸锂', percentage: '17.07%', unit: 'kgCO₂e', value: '21.60' },
    { height: 340, name: '阴极铝', percentage: '14.51%', unit: 'kgCO₂e', value: '18.36' },
    { height: 280, name: '阴极锂锰氧化物', percentage: '8.66%', unit: 'kgCO₂e', value: '10.96' },
    { height: 220, name: '天然气的燃烧', percentage: '6.33%', unit: 'kgCO₂e', value: '8.01' },
  ] : selectedCard.id === 'transformer' ? [
    { height: 500, name: '非晶带材', percentage: '49.65%', unit: 'kgCO₂e', value: '4277.50' },
    { height: 420, name: '油箱', percentage: '15.06%', unit: 'kgCO₂e', value: '1297.46' },
    { height: 340, name: '聚酯漆包铜扁线', percentage: '15.04%', unit: 'kgCO₂e', value: '1295.74' },
    { height: 280, name: '铜带', percentage: '7.44%', unit: 'kgCO₂e', value: '640.97' },
    { height: 220, name: '变压器油', percentage: '3.75%', unit: 'kgCO₂e', value: '323.07' },
  ] : selectedCard.id === 'formaldehyde' ? [
    { height: 500, name: '甲醇的生产', percentage: '97.85%', unit: 'kgCO₂e', value: '1.33' },
    { height: 420, name: '电网供电', percentage: '1.22%', unit: 'kgCO₂e', value: '0.016' },
    { height: 340, name: '甲醇的运输', percentage: '0.73%', unit: 'kgCO₂e', value: '0.009' },
    { height: 280, name: '自来水', percentage: '0.20%', unit: 'kgCO₂e', value: '0.002' },
    { height: 220, name: '废水处置', percentage: '0.01%', unit: 'kgCO₂e', value: '0.0001' },
  ] : [
    { height: 500, name: '运输配送过程', percentage: '42.8%', unit: 'kgCO₂e', value: '6.74296' },
    { height: 420, name: '包装纸箱材料', percentage: '31.4%', unit: 'kgCO₂e', value: '5.28741' },
    { height: 340, name: '拉链金属配件', percentage: '23.6%', unit: 'kgCO₂e', value: '4.09325' },
    { height: 280, name: '聚酯纤维辅料', percentage: '18.2%', unit: 'kgCO₂e', value: '3.12864' },
    { height: 220, name: '再生涤纶面料', percentage: '12.5%', unit: 'kgCO₂e', value: '2.45678' },
  ]

  const rightCards: StepFiveDrilldownCard[] = [
    {
      id: 'stage-share',
      Icon: PieChart,
      cardText: `阶段排放占比\n最高：原材料获取阶段`,
      titleLine: '阶段',
      highlight: '排放占比',
      path: '核算结果概览 > 阶段-排放占比',
      pathCurrent: '阶段-排放占比',
    },
    {
      id: 'process-top5',
      Icon: BarChart3,
      cardText: `单元过程排放占比TOP5\n最高：${topFiveItems[0].name}`,
      titleLine: '单元过程',
      highlight: '排放TOP5',
      path: '核算结果概览 > 单元过程-排放TOP5',
      pathCurrent: '单元过程-排放TOP5',
    },
    {
      id: 'process-share',
      Icon: GitBranch,
      cardText: '单元过程排放占比\n流向情况',
      titleLine: '单元过程',
      highlight: '排放占比流向',
      path: '核算结果概览 > 单元过程-排放流向',
      pathCurrent: '单元过程-排放流向',
    },
  ]
  const selectedDrilldown = rightCards.find((card) => card.id === activeSection) ?? null
  const onSectionSelect = (newSection: typeof sectionOrder[number]) => {
    const currentIndex = sectionOrder.indexOf(activeSection)
    const newIndex = sectionOrder.indexOf(newSection)
    flushSync(() => setPageTurnDirection(newIndex > currentIndex ? 'forward' : 'backward'))
    setActiveSection(newSection)
  }
  const showDrilldown = (id: StepFiveDrilldownCard['id']) => onSectionSelect(id)
  const returnToOverview = () => onSectionSelect('overview')
  const siblingDrilldownCards = rightCards.filter((card) => card.id !== activeSection)
  const resultContentPadding = 40
  const resultDesignHeight = 1040
  const resultMinimumContentWidth = 1180
  const resultContentScale = Math.min(
    1,
    Math.max(0.42, (resultCardSize.width - resultContentPadding * 2) / resultMinimumContentWidth),
    Math.max(0.42, (resultCardSize.height - resultContentPadding * 2) / resultDesignHeight),
  )
  const drilldownDesignWidth = 1680
  const drilldownDesignHeight = 960
  const drilldownContentScale = Math.min(resultCardSize.width / drilldownDesignWidth, resultCardSize.height / drilldownDesignHeight)
  const drilldownPathStyle: CSSProperties = {
    width: 604.8 * drilldownContentScale,
    fontSize: 20.16 * drilldownContentScale,
    lineHeight: `${28.56 * drilldownContentScale}px`,
  }
  const drilldownTitleStyle: CSSProperties = {
    width: 397.488 * drilldownContentScale,
    height: 275.184 * drilldownContentScale,
    fontSize: 61.152 * drilldownContentScale,
  }
  const drilldownInset = 40
  const drilldownAvailableWidth = Math.max(320, resultCardSize.width - drilldownInset * 2)
  const drilldownAvailableHeight = Math.max(320, resultCardSize.height - drilldownInset * 2)
  const sankeySafeInset = 80 * drilldownContentScale
  const sankeyLabelSpace = 156
  const sankeyBottomExtension = 50 * drilldownContentScale
  const sankeyWidthScale = 0.6
  const drilldownActionScale = drilldownContentScale * 0.6
  const drilldownActionVisualWidth = 587 * drilldownActionScale
  const drilldownActionChartGap = 50
  const topFiveMaxWidth = Math.max(
    320,
    resultCardSize.width - drilldownInset * 2 - drilldownActionVisualWidth - drilldownActionChartGap,
  )
  const topFiveScale = Math.min(drilldownContentScale * 1.1, topFiveMaxWidth / 1280)
  const roseMaxWidth = Math.max(
    320,
    resultCardSize.width - drilldownInset * 2 - drilldownActionVisualWidth - drilldownActionChartGap,
  )
  const drilldownChartSize = {
    roseWidth: Math.min(1680 * drilldownContentScale, roseMaxWidth),
    roseHeight: Math.min(3244.8 * drilldownContentScale, drilldownAvailableHeight),
    sankeyWidth: Math.min(1760 * drilldownContentScale, Math.max(320, drilldownAvailableWidth - sankeySafeInset * 2 - sankeyLabelSpace)) * sankeyWidthScale,
    sankeyHeight: Math.min(554.4 * drilldownContentScale + sankeyBottomExtension, drilldownAvailableHeight),
    sankeyTopOffset: 90 * drilldownContentScale + sankeyBottomExtension / 2,
    topFiveWidth: 1280 * topFiveScale,
    topFiveHeight: 560 * topFiveScale,
    topFiveGap: 20 * topFiveScale,
    topFiveBarWidth: 240 * topFiveScale,
    topFiveInnerBorder: 15 * topFiveScale,
    topFiveRadius: 16 * topFiveScale,
    topFiveBarPaddingX: 20 * topFiveScale,
  }

  useEffect(() => {
    const card = resultCardRef.current
    if (!card) return

    const updateSize = () => {
      const rect = card.getBoundingClientRect()
      setResultCardSize({ width: rect.width, height: rect.height })
    }
    const resizeObserver = new ResizeObserver(updateSize)

    updateSize()
    resizeObserver.observe(card)

    return () => resizeObserver.disconnect()
  }, [revealFromStepFour])

  const shellFadeDelay = revealFromStepFour ? 0.18 : 0
  const contentFadeDelay = revealFromStepFour ? 0.36 : 0

  return (
    <div className="flex min-h-0 flex-1 px-[144px] py-5">
      <motion.div
        ref={resultCardRef}
        animate={{ scale: 1 }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] shadow-[0_16px_36px_rgba(15,23,42,0.08)] outline outline-[10px] outline-offset-0"
        initial={revealFromStepFour ? { scale: 0.985 } : { scale: 1 }}
        style={{
          backgroundColor: '#FFFFFF',
          outlineColor: `${productResultTheme.resultText}26`,
        }}
        transition={{ delay: shellFadeDelay, duration: 0.56, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          initial={revealFromStepFour ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
          style={{ perspective: 1600 }}
          transition={{ delay: contentFadeDelay, duration: 0.62, ease: 'easeOut' }}
        >
          <AnimatePresence custom={pageTurnDirection} initial={false} mode="sync">
          {selectedDrilldown ? (
            <motion.div
              key={`drilldown-${selectedDrilldown.id}`}
              animate="animate"
              className="absolute inset-0 bg-white"
              custom={pageTurnDirection}
              exit="exit"
              initial="initial"
              style={{ backfaceVisibility: 'hidden', boxShadow: '0 -28px 48px rgba(15,23,42,0.10)', transformStyle: 'preserve-3d' }}
              transition={stepFivePageTurnTransition}
              variants={stepFivePageTurnVariants}
            >
              <StepFiveGridBackground color={productResultTheme.rightButtonBackground} />

              <div
                className="absolute left-10 top-10 flex justify-start font-['PingFang_SC'] font-medium text-[#64748B]"
                style={drilldownPathStyle}
              >
                <button
                  className="pointer-events-auto cursor-pointer text-left transition-colors duration-200 hover:text-[#0F172A]"
                  type="button"
                  onClick={returnToOverview}
                >
                  核算结果概览
                </button>
                <span style={{ marginInline: 8 * drilldownContentScale }}>&gt;</span>
                <span>{selectedDrilldown.pathCurrent}</span>
              </div>

              <h2
                className="absolute right-10 top-10 text-right font-['PingFang_SC'] font-semibold leading-[150%] tracking-[0.1em] text-black"
                style={drilldownTitleStyle}
              >
                <span className="block whitespace-nowrap">{selectedDrilldown.titleLine}</span>
                <span className="block whitespace-nowrap" style={{ color: productResultTheme.resultText }}>
                  {selectedDrilldown.highlight}
                </span>
              </h2>

              <div className="pointer-events-auto absolute bottom-10 right-10 h-[604px] w-[587px] origin-bottom-right" style={{ transform: `scale(${drilldownActionScale})` }}>
                <div className="flex h-[604px] w-[587px] flex-col gap-8">
                  {siblingDrilldownCards.map(({ Icon, cardText, id }) => (
                    <button
                      key={id}
                      className="relative h-[127px] w-[587px] flex-none rounded-[0.5em] bg-white text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:scale-[1.015]"
                      type="button"
                      onClick={() => showDrilldown(id)}
                    >
                      <div className="absolute left-[30px] top-1/2 flex h-[70px] w-[70px] -translate-y-1/2 items-center justify-center rounded-[0.625em]" style={{ backgroundColor: productResultTheme.rightCardText }}>
                        <Icon className="h-[38px] w-[38px] text-white" strokeWidth={2.6} />
                      </div>
                      <p className="absolute left-[120.78px] top-1/2 h-[84px] w-[310px] -translate-y-1/2 whitespace-pre-line font-['PingFang_SC'] text-[30px] font-semibold leading-[42px]" style={{ color: productResultTheme.rightCardText }}>
                        {cardText}
                      </p>
                      <svg
                        className="absolute left-[530px] top-[70.84px] h-[25px] w-[25px]"
                        fill="none"
                        viewBox="0 0 25 25"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.9644 24.7705C23.621 24.7703 24.9644 23.4272 24.9644 21.7705V3.77344C24.9641 2.11694 23.6209 0.773663 21.9644 0.773438C20.3077 0.773438 18.9646 2.1168 18.9644 3.77344V14.7227L5.12061 0.878906C3.94907 -0.29263 2.05 -0.292559 0.878418 0.878906C-0.293041 2.05049 -0.293117 3.94956 0.878418 5.12109L14.5278 18.7705H3.96729C2.31056 18.7705 0.967494 20.1138 0.967285 21.7705C0.967285 23.4274 2.31043 24.7705 3.96729 24.7705H21.9644Z"
                          fill={productResultTheme.rightCardText}
                        />
                      </svg>
                    </button>
                  ))}
                  <button
                    className="relative h-[127px] w-[587px] flex-none rounded-[0.5em] bg-white text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:scale-[1.015]"
                    type="button"
                    onClick={returnToOverview}
                  >
                    <div className="absolute left-[30px] top-1/2 flex h-[70px] w-[70px] -translate-y-1/2 items-center justify-center rounded-[0.625em]" style={{ backgroundColor: productResultTheme.rightCardText }}>
                      <ArrowLeft className="h-[38px] w-[38px] text-white" strokeWidth={2.6} />
                    </div>
                    <p className="absolute left-[120.78px] top-1/2 h-[42px] w-[380px] -translate-y-1/2 whitespace-nowrap font-['PingFang_SC'] text-[30px] font-semibold leading-[42px]" style={{ color: productResultTheme.rightCardText }}>
                      返回核算结果概览
                    </p>
                  </button>
                  <button
                    className="hidden h-[127px] w-[587px] flex-none items-center justify-center rounded-[0.5em] font-['PingFang_SC'] text-[40px] font-semibold leading-[56px] text-white shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:scale-[1.015]"
                    style={{ backgroundColor: productResultTheme.rightButtonBackground }}
                    type="button"
                    onClick={onAdvance}
                  >
                    <span>生成核算报告</span>
                    <MousePointerClick className="ml-[10px] h-[38px] w-[38px] shrink-0" strokeWidth={2.4} />
                  </button>
                </div>
              </div>

              {selectedDrilldown.id === 'stage-share' && (
                <StepFiveRoseChart
                  className="absolute bottom-[-40px] left-[-10px]"
                  compact
                  labelScale={drilldownContentScale}
                  style={{ width: drilldownChartSize.roseWidth, height: drilldownChartSize.roseHeight }}
                  theme={productResultTheme}
                  selectedCardId={selectedCard.id}
                />
              )}

              {selectedDrilldown.id === 'process-share' && (
                <StepFiveSankeyChart
                  className="absolute -translate-y-1/2"
                  style={{
                    width: drilldownChartSize.sankeyWidth,
                    height: drilldownChartSize.sankeyHeight,
                    left: drilldownInset + sankeyLabelSpace,
                    top: `calc(50% + ${drilldownChartSize.sankeyTopOffset}px)`,
                  }}
                  theme={productResultTheme}
                />
              )}

              {selectedDrilldown.id === 'process-top5' && (
                <div
                  className="absolute bottom-10 left-10 flex items-end"
                  style={{ width: drilldownChartSize.topFiveWidth, height: drilldownChartSize.topFiveHeight, gap: drilldownChartSize.topFiveGap }}
                >
                  {topFiveItems.map((item) => (
                    <div
                      key={item.name}
                      className="relative shrink-0"
                      style={{
                        width: drilldownChartSize.topFiveBarWidth,
                        height: drilldownChartSize.topFiveHeight,
                      }}
                    >
                      <span
                        className="absolute whitespace-nowrap font-['Inter'] font-bold"
                        style={{
                          left: drilldownChartSize.topFiveBarPaddingX,
                          bottom: item.height * topFiveScale + 10 * topFiveScale,
                          color: productResultTheme.rightCardText,
                          fontSize: 50 * topFiveScale,
                          lineHeight: `${60 * topFiveScale}px`,
                        }}
                      >
                        {item.percentage}
                      </span>
                      <div
                        data-step-five-top5-bar
                        className="absolute bottom-0 inset-x-0 overflow-hidden"
                        style={{
                          height: item.height * topFiveScale,
                          borderTopLeftRadius: drilldownChartSize.topFiveRadius,
                          borderTopRightRadius: drilldownChartSize.topFiveRadius,
                          backgroundColor: colorWithOpacity(productResultTheme.rightCardText, 0.04),
                        }}
                      >
                        <div
                          className="absolute inset-x-0 top-0"
                          style={{
                            height: drilldownChartSize.topFiveInnerBorder,
                            borderTopLeftRadius: drilldownChartSize.topFiveRadius,
                            borderTopRightRadius: drilldownChartSize.topFiveRadius,
                            backgroundColor: productResultTheme.rightCardText,
                          }}
                        />
                        <span
                          className="absolute flex flex-col whitespace-nowrap font-['Inter'] font-bold"
                          style={{
                            left: drilldownChartSize.topFiveBarPaddingX,
                            top: 40 * topFiveScale,
                            color: productResultTheme.rightCardText,
                            fontSize: 30 * topFiveScale,
                            lineHeight: `${45 * topFiveScale}px`,
                          }}
                        >
                          <span>{item.value}</span>
                          <span
                            style={{
                              color: colorWithOpacity(productResultTheme.rightCardText, 0.58),
                              fontSize: 21.6 * topFiveScale,
                              lineHeight: `${32.4 * topFiveScale}px`,
                            }}
                          >
                            {item.unit}
                          </span>
                        </span>
                        <span
                          className="absolute font-['PingFang_SC'] font-medium text-left"
                          style={{
                            left: drilldownChartSize.topFiveBarPaddingX,
                            bottom: 40 * topFiveScale,
                            width: drilldownChartSize.topFiveBarWidth - drilldownChartSize.topFiveBarPaddingX * 2,
                            color: productResultTheme.rightCardText,
                            fontSize: 26 * topFiveScale,
                            lineHeight: `${39 * topFiveScale}px`,
                            wordBreak: 'break-all',
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              animate="animate"
              className="absolute inset-0 overflow-hidden"
              custom={pageTurnDirection}
              exit="exit"
              initial="initial"
              style={{
                backfaceVisibility: 'hidden',
                backgroundColor: productResultTheme.containerBackground,
                boxShadow: '0 28px 52px rgba(15,23,42,0.12)',
                transformStyle: 'preserve-3d',
              }}
              transition={stepFivePageTurnTransition}
              variants={stepFivePageTurnVariants}
            >
              <NoiseTexture className="absolute inset-0 opacity-30" frequency={0.8} noiseOpacity={0.35} octaves={4} slope={0.1} />
              <StepFiveGridBackground color={productResultTheme.rightButtonBackground} />
              <div className="pointer-events-none absolute inset-0 bg-white/10" />
              <img
                alt={selectedCard.label}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[2] max-h-[82%] max-w-[42%] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_34px_32px_rgba(15,23,42,0.22)]"
                draggable={false}
                src={selectedCard.detailImageSrc}
                style={{ scale: selectedCard.id === 'lithium-battery' ? 0.9 : 1 }}
              />
              <div className="absolute inset-10 z-10 overflow-hidden">
          <div className="absolute left-0 top-0 h-[360px] w-[344px]">
            <div
              className="h-[360px] w-[344px] origin-top-left"
              style={{ transform: `scale(${resultContentScale * 1.05})` }}
            >
              <h2 className="h-[360px] w-[344px] font-['PingFang_SC'] text-[80px] font-semibold leading-[150%] tracking-[0.1em] text-black">
                <span className="block whitespace-nowrap">{selectedCard.label}</span>
                <span className="block whitespace-nowrap" style={{ color: productResultTheme.resultText }}>核算结果</span>
                <span className="block whitespace-nowrap">概览</span>
              </h2>
            </div>
          </div>

          <div className="absolute bottom-[30px] left-0 h-[473px] min-w-[873px] w-max">
            <div
              className="flex h-[473px] min-w-[873px] w-max origin-bottom-left flex-col items-start gap-5"
              style={{ transform: `scale(${resultContentScale})` }}
            >
                <section
                  className="flex h-[219px] min-w-[579px] w-max flex-none flex-col items-start justify-end gap-5 rounded-[20px] px-[50px] py-[30px] shadow-[0_6px_18px_rgba(15,23,42,0.12)]"
                  style={{ backgroundColor: productResultTheme.resultCardBackground }}
                >
                  <div className="flex h-[97px] w-full items-end gap-[20px]">
                    <span className="h-[97px] whitespace-nowrap font-['Inter'] text-[80px] font-semibold leading-[97px] text-white">
                      {selectedCard.id === 'backpack' ? '14.33' : selectedCard.id === 'lithium-battery' ? '126.57' : selectedCard.id === 'transformer' ? '8615.32' : '1.36'}
                    </span>
                    <span className="h-[60px] whitespace-nowrap font-['Inter'] text-[30px] font-semibold leading-[2] text-white">
                      {selectedCard.id === 'backpack' ? <>kgCO<sub>2</sub>e/件</> : selectedCard.id === 'lithium-battery' ? <>kgCO<sub>2</sub>e/kW·h</> : selectedCard.id === 'transformer' ? <>kgCO<sub>2</sub>e/台</> : <>kgCO<sub>2</sub>e/kg</>}
                    </span>
                  </div>
                  <p className="h-[42px] w-full font-['PingFang_SC'] text-[30px] font-semibold leading-[42px] text-white">
                    单位排放结果
                  </p>
                </section>

                <section className="flex h-[234px] min-w-[873px] w-max flex-none flex-col items-start justify-end gap-5 rounded-[20px] bg-white px-[50px] py-[30px] shadow-[0_6px_18px_rgba(15,23,42,0.12)]">
                  <div className="flex h-[112px] w-full items-center gap-[50px]">
                    <div className="flex h-[112px] items-end gap-[20px]">
                      <span className="h-[112px] whitespace-nowrap font-['PingFang_SC'] text-[80px] font-semibold leading-[112px]" style={{ color: productResultTheme.intervalText }}>
                        {selectedCard.id === 'backpack' ? '-14.34' : selectedCard.id === 'lithium-battery' ? '-8.01' : selectedCard.id === 'transformer' ? '-16.87' : '-15.47'}
                      </span>
                      <span className="h-[60px] whitespace-nowrap font-['PingFang_SC'] text-[30px] font-semibold leading-[2]" style={{ color: productResultTheme.intervalText }}>
                        %
                      </span>
                    </div>
                    <span className="h-[97px] whitespace-nowrap font-['Inter'] text-[80px] font-semibold leading-[97px]" style={{ color: productResultTheme.intervalText }}>
                      ~
                    </span>
                    <div className="flex h-[112px] items-end gap-[20px]">
                      <span className="h-[112px] whitespace-nowrap font-['PingFang_SC'] text-[80px] font-semibold leading-[112px]" style={{ color: productResultTheme.intervalText }}>
                        {selectedCard.id === 'backpack' ? '14.34' : selectedCard.id === 'lithium-battery' ? '8.01' : selectedCard.id === 'transformer' ? '16.87' : '15.47'}
                      </span>
                      <span className="h-[60px] whitespace-nowrap font-['PingFang_SC'] text-[30px] font-semibold leading-[2]" style={{ color: productResultTheme.intervalText }}>
                        %
                      </span>
                    </div>
                  </div>
                  <p className="h-[42px] w-full font-['PingFang_SC'] text-[30px] font-semibold leading-[42px]" style={{ color: productResultTheme.intervalText }}>
                  不确定性范围
                </p>
              </section>
            </div>
          </div>

          <div className="absolute right-[20px] top-1/2 h-[723px] w-[587px] -translate-y-1/2">
            <div
              className="flex h-[723px] w-[587px] origin-right flex-col items-center gap-[72px]"
              style={{ transform: `scale(${resultContentScale})` }}
            >
              {rightCards.map(({ Icon, cardText, id }) => (
                <button
                  key={id}
                  className="pointer-events-auto relative h-[127px] w-[587px] flex-none rounded-[0.5em] bg-white text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:scale-[1.015] first:h-[126px]"
                  type="button"
                  onClick={() => showDrilldown(id)}
                >
                  <div className="absolute left-[30px] top-1/2 flex h-[70px] w-[70px] -translate-y-1/2 items-center justify-center rounded-[0.625em]" style={{ backgroundColor: productResultTheme.rightCardText }}>
                    <Icon className="h-[38px] w-[38px] text-white" strokeWidth={2.6} />
                  </div>
                  <p className="absolute left-[120.78px] top-1/2 h-[84px] w-[410px] -translate-y-1/2 whitespace-pre font-['PingFang_SC'] text-[30px] font-semibold leading-[42px]" style={{ color: productResultTheme.rightCardText }}>
                    {cardText}
                  </p>
                  <svg
                    className="absolute left-[530px] top-[70.84px] h-[25px] w-[25px]"
                    fill="none"
                    viewBox="0 0 25 25"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.9644 24.7705C23.621 24.7703 24.9644 23.4272 24.9644 21.7705V3.77344C24.9641 2.11694 23.6209 0.773663 21.9644 0.773438C20.3077 0.773438 18.9646 2.1168 18.9644 3.77344V14.7227L5.12061 0.878906C3.94907 -0.29263 2.05 -0.292559 0.878418 0.878906C-0.293041 2.05049 -0.293117 3.94956 0.878418 5.12109L14.5278 18.7705H3.96729C2.31056 18.7705 0.967494 20.1138 0.967285 21.7705C0.967285 23.4274 2.31043 24.7705 3.96729 24.7705H21.9644Z"
                      fill={productResultTheme.rightCardText}
                    />
                  </svg>
                </button>
              ))}

              <button
                className="hidden h-[127px] w-[587px] flex-none items-center justify-center rounded-[0.5em] font-['PingFang_SC'] text-[40px] font-semibold leading-[56px] text-white shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
                style={{ backgroundColor: productResultTheme.rightButtonBackground }}
                type="button"
                onClick={onAdvance}
              >
                <span>生成核算报告</span>
                <MousePointerClick className="ml-[10px] h-[38px] w-[38px] shrink-0" strokeWidth={2.4} />
              </button>
            </div>
          </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
        <AbilityPageTurnControls
          activeSection={activeSection}
          iconColor={productResultTheme.rightButtonBackground}
          sectionOrder={sectionOrder}
          showDisabledButtons
          showDots={false}
          onSectionSelect={onSectionSelect}
        />
      </motion.div>
    </div>
  )
}

function ProductSurfaceBackground({ backgroundColor, selectedCardId, step }: { backgroundColor?: string; selectedCardId: string; step?: string }) {
  const reportConfig = stepSixReportConfigs[selectedCardId] ?? stepSixReportConfigs.backpack
  const themeColor = step === 'step1' ? '#9AA8BF' : reportConfig.leftDeepColor
  const surfaceColor = backgroundColor ?? getProductFlowNeutralBackground()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor: surfaceColor }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `radial-gradient(circle, ${themeColor} 0 2px, transparent 2.7px)`,
          backgroundSize: '22px 22px',
          opacity: 0.1,
        }}
      />
    </div>
  )
}


function ProductFlowThreeZoneLayout({
  activeColor,
  activeStepTitle,
  businessButtonDisabled,
  businessButtonLabel,
  onBusinessButtonClick,
  children,
  footerTitle,
  previousStep,
  selectedCardId,
  selectedScheme,
  step,
}: {
  activeColor: string
  activeStepTitle: string
  businessButtonDisabled?: boolean
  businessButtonLabel: string
  onBusinessButtonClick: () => void
  children: ReactNode
  footerTitle?: string
  previousStep?: { step: string }
  selectedCardId: string
  selectedScheme?: 'recommended' | 'custom'
  step: string
}) {
  const stepNumber = getStepNumber(step)
  const progressColor = stepNumber === 1 ? '#9AA8BF' : activeColor

  return (
    <ScreenShell contentClassName="px-0 py-0">
      <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCardId} step={step} />
      <section className="relative z-20 flex h-screen w-full flex-col supports-[height:100dvh]:h-dvh overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between px-10">
          <Link className="flex h-9 items-center" to="/">
            <img
              alt="青钥 Cyacle"
              className="h-9 w-auto shrink-0 select-none"
              draggable={false}
              src={brandLogoDark}
            />
          </Link>

          <h1 className="text-right text-[26.88px] font-semibold leading-[1.05] text-[#0F172A] opacity-30">
            {footerTitle ?? activeStepTitle}
          </h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>

        <ProductFlowFooter
          activeColor={progressColor}
          activeStepNumber={stepNumber}
          businessButtonColor={activeColor}
          businessButtonDisabled={businessButtonDisabled}
          businessButtonLabel={businessButtonLabel}
          previousStep={previousStep}
          selectedCardId={selectedCardId}
          selectedScheme={selectedScheme}
          onBusinessButtonClick={onBusinessButtonClick}
        />
      </section>
    </ScreenShell>
  )
}

function ProductFlowFooter({
  activeColor,
  activeStepNumber,
  businessButtonDisabled = false,
  businessButtonColor,
  businessButtonLabel,
  previousStep,
  selectedCardId,
  selectedScheme = 'recommended',
  onBusinessButtonClick,
}: {
  activeColor: string
  activeStepNumber: number
  businessButtonDisabled?: boolean
  businessButtonColor?: string
  businessButtonLabel: string
  previousStep?: { step: string }
  selectedCardId: string
  selectedScheme?: 'recommended' | 'custom'
  onBusinessButtonClick: () => void
}) {
  const commonGhostActionClassName = 'gap-2 border-0 bg-transparent px-3 text-[#0F172A] shadow-none hover:bg-[#0F172A]/8 hover:text-[#0F172A]'
  const actionColor = businessButtonColor ?? activeColor
  const matchedActionButtonClassName = 'h-[63.36px] w-[236px] rounded-[0.857em] px-[28px] text-[20.16px] font-semibold shadow-[0_14px_34px_rgba(15,23,42,0.14)]'

  return (
    <footer className="flex h-[93.36px] shrink-0 items-end justify-between px-10 pb-[30px]">
      <div className="flex min-w-[320px] items-center justify-start">
        <ProductPuzzleProgress
          activeColor={activeColor}
          activeStepNumber={activeStepNumber}
          animateOnComplete={false}
          placement="inline"
        />
      </div>

      <nav className="flex flex-1 origin-bottom scale-90 items-center justify-center">
        {previousStep ? (
          <Button
            asChild
            className={cn(
              matchedActionButtonClassName,
              'border-0 bg-white transition-all duration-200 hover:bg-white hover:brightness-105',
            )}
            size="default"
            style={{ color: actionColor }}
            variant="outline"
          >
            <Link
              className="gap-2"
              state={{ selectedCardId, selectedScheme }}
              to={`/product-carbon-flow/${previousStep.step}`}
            >
              <ArrowLeft className="!size-[28px] shrink-0" strokeWidth={2.4} />
              <span>上一步</span>
            </Link>
          </Button>
        ) : null}
        <Button
          className={cn(
            matchedActionButtonClassName,
            previousStep ? 'ml-5' : '',
            'text-white transition-all duration-200',
            businessButtonDisabled
              ? 'cursor-not-allowed bg-[#0F172A]/30 text-white/55 hover:bg-[#0F172A]/30'
              : 'hover:brightness-105',
          )}
          disabled={businessButtonDisabled}
          size="default"
          style={{ backgroundColor: businessButtonDisabled ? undefined : actionColor }}
          type="button"
          onClick={onBusinessButtonClick}
        >
          <span className="flex items-center">
            <span>{businessButtonLabel}</span>
            <MousePointerClick className="ml-[7.2px] !size-[28px] shrink-0" strokeWidth={2.4} />
          </span>
        </Button>
      </nav>

      <div className="flex min-w-[320px] items-center justify-end gap-2">
        <Button asChild className={commonGhostActionClassName} size="lg" variant="ghost">
          <Link to="/ability/carbon-accounting/mechanism">
            <LogOut />
            <span>退出体验</span>
          </Link>
        </Button>
        <FullscreenButton
          className={commonGhostActionClassName}
          display="text"
          textLabel="退出全屏（临时）"
          variant="ghost"
        />
      </div>
    </footer>
  )
}

function ProductSelectionStepSix({
  selectedCard,
  selectedScheme,
  onAdvance,
}: {
  selectedCard: ProductCard
  selectedScheme: 'recommended' | 'custom'
  onAdvance: () => void
}) {
  const reportCardRef = useRef<HTMLDivElement>(null)
  const leftConfettiRef = useRef<ConfettiRef>(null)
  const rightConfettiRef = useRef<ConfettiRef>(null)
  const [activeReportPage, setActiveReportPage] = useState<typeof stepSixReportPageOrder[number]>('report')
  const [reportPageDirection, setReportPageDirection] = useState<StepFivePageTurnDirection>('forward')
  const [showReportLoadingCounter, setShowReportLoadingCounter] = useState(true)
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(true)
  const [reportCardSize, setReportCardSize] = useState({ width: 1600, height: 860 })
  const reportConfig = stepSixReportConfigs[selectedCard.id] ?? stepSixReportConfigs.backpack
  const productResultTheme = getProductResultTheme(selectedCard.id)
  const reportDesignWidth = 1600
  const reportDesignHeight = 860
  const squaresConvergeDuration = STEP_SIX_SQUARES_CONVERGE_DURATION
  const progressStartDelay = STEP_SIX_PROGRESS_START_DELAY
  const reportRevealDelay = STEP_SIX_REPORT_REVEAL_DELAY
  const squarePositions = [
    { x: -1200, y: -800 },
    { x: 0, y: -1000 },
    { x: 1200, y: -800 },
    { x: -1000, y: 800 },
    { x: 1000, y: 800 },
    { x: 0, y: 1000 },
  ]
  const reportScale = Math.min(
    reportCardSize.width / reportDesignWidth,
    reportCardSize.height / reportDesignHeight,
  )
  const reportOffsetX = (reportCardSize.width - reportDesignWidth * reportScale) / 2
  const reportOffsetY = (reportCardSize.height - reportDesignHeight * reportScale) / 2

  function fireConfetti() {
    leftConfettiRef.current?.fire({})
    rightConfettiRef.current?.fire({})
  }

  const openReportPreview = () => {
    onReportPageSelect('preview-page-1')
  }

  const onReportPageSelect = (newPage: typeof stepSixReportPageOrder[number]) => {
    const currentIndex = stepSixReportPageOrder.indexOf(activeReportPage)
    const newIndex = stepSixReportPageOrder.indexOf(newPage)
    flushSync(() => setReportPageDirection(newIndex > currentIndex ? 'forward' : 'backward'))
    setActiveReportPage(newPage)
  }

  useEffect(() => {
    const confettiTimer = window.setTimeout(() => {
      fireConfetti()
    }, reportRevealDelay * 1000)
    const counterTimer = window.setTimeout(() => {
      setShowReportLoadingCounter(false)
    }, reportRevealDelay * 1000)

    return () => {
      window.clearTimeout(confettiTimer)
      window.clearTimeout(counterTimer)
    }
  }, [reportRevealDelay])

  useEffect(() => {
    const card = reportCardRef.current
    if (!card) return

    const updateSize = () => {
      const rect = card.getBoundingClientRect()
      setReportCardSize({ width: rect.width, height: rect.height })
    }
    const resizeObserver = new ResizeObserver(updateSize)

    updateSize()
    resizeObserver.observe(card)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="relative flex min-h-0 flex-1 px-[144px] py-5">
      <motion.div
        ref={reportCardRef}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] shadow-[0_16px_36px_rgba(15,23,42,0.08)] outline outline-[10px] outline-offset-0"
        initial={{ opacity: 0, y: 18 }}
        transition={{ delay: reportRevealDelay, duration: 0.42, ease: 'easeOut' }}
        style={{
          backgroundColor: productResultTheme.containerBackground,
          outlineColor: `${productResultTheme.resultText}26`,
        }}
      >
        <AnimatePresence custom={reportPageDirection} initial={false} mode="sync">
          {activeReportPage === 'report' ? (
            <motion.div
              key="step-six-report"
              animate="animate"
              className="absolute inset-0 overflow-hidden text-white"
              custom={reportPageDirection}
              exit="exit"
              initial="initial"
              transition={stepFivePageTurnTransition}
              variants={stepFivePageTurnVariants}
            >
              <NoiseTexture className="absolute inset-0 z-0 opacity-20" frequency={0.8} noiseOpacity={0.35} octaves={4} slope={0.1} />
              <div
                className="absolute h-[860px] w-[1600px] origin-top-left overflow-hidden text-white"
                style={{
                  left: reportOffsetX,
                  top: reportOffsetY,
                  transform: `scale(${reportScale})`,
                }}
              >
          <div className="absolute inset-y-0 left-0 z-0 w-[63.3%]" style={{ background: reportConfig.leftBackground }} />
          <div className="absolute inset-y-0 right-0 z-0 w-[36.7%]" style={{ background: reportConfig.rightBackground }} />
          <NoiseTexture className="absolute inset-0 z-[1] opacity-100 mix-blend-overlay" frequency={0.78} noiseOpacity={1} octaves={7} slope={0.62} />

          <section className="relative z-10 flex h-full min-w-0 flex-1">
            <div className="relative flex min-w-0 flex-1 justify-center px-[50px] py-[48px]">
              <div className="mx-auto flex h-full w-full min-w-0 flex-col justify-center text-left">
                <h2 className="-ml-[0.18em] text-[45px] font-semibold leading-[1.4] tracking-[0.01em] text-white">
                  《{selectedCard.label} - 产品碳足迹报告》
                </h2>
                <div className="mt-[38px] grid min-h-0 w-full content-start grid-cols-2 grid-rows-[auto_auto] gap-x-[40px] gap-y-[30px]">
                  {getActiveReportSections(reportConfig, selectedScheme).map((section) => (
                    <article key={section.title} className="min-w-0">
                      <h3 className="text-[32px] font-semibold leading-[1.4] text-white/50">{section.title}</h3>
                      <ul className="mt-5 space-y-1.5 text-[18px] font-medium leading-[1.9] text-white">
                        {section.body.map((line) => (
                          <li key={line} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.8em] size-1.5 shrink-0 rounded-full bg-white" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex w-[36.7%] shrink-0 items-center justify-center py-[38px]">
              <div className="flex w-full origin-center scale-[0.85] flex-col items-center">
                <img
                  alt={selectedCard.label}
                  className="h-[360px] w-auto select-none object-contain drop-shadow-[0_34px_70px_rgba(2,8,23,0.26)]"
                  draggable={false}
                  src={selectedCard.detailImageSrc}
                />
                <div className="mt-10 flex w-[81%] max-w-[532px] flex-col items-center gap-9">
                  <p className="whitespace-pre-line text-center text-[22px] font-normal leading-[200%] text-white">
                    {reportConfig.rightInfoText ?? `产品名称：${selectedCard.label}\n系统边界：从摇篮到坟墓\n地理边界：中国-上海\n核算周期：2025年01月01日-2025年12月31日`}
                  </p>
                  <div className="flex gap-4">
                    <button
                      className="pointer-events-auto flex h-[57px] w-[187px] items-center justify-center rounded-[0.444em] border-2 border-white bg-white/20 text-[18px] font-medium leading-[25px] text-white shadow-[0_18px_44px_rgba(2,8,23,0.14)] transition-transform duration-200 hover:scale-[1.03] hover:bg-white/28"
                      type="button"
                      onClick={openReportPreview}
                    >
                      <span>预览报告示例</span>
                      <FileText className="ml-[10px] h-[22px] w-[22px] shrink-0" strokeWidth={2.4} />
                    </button>
                    <button
                      className="hidden h-[57px] w-[187px] items-center justify-center rounded-[0.444em] border-2 border-white bg-white text-[18px] font-medium leading-[25px] shadow-[0_18px_44px_rgba(2,8,23,0.14)] transition-transform duration-200 hover:scale-[1.03] hover:bg-white"
                      style={{ color: productResultTheme.rightButtonBackground }}
                      type="button"
                      onClick={onAdvance}
                    >
                      <span>进入送审环节</span>
                      <MousePointerClick className="ml-[10px] h-[22px] w-[22px] shrink-0" strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </section>
            </div>
          </motion.div>
          ) : (
            <motion.div
              key={activeReportPage}
              animate="animate"
              className="absolute inset-0 flex items-center justify-center gap-8 bg-[#F8FAFC] px-[72px] py-[52px]"
              custom={reportPageDirection}
              exit="exit"
              initial="initial"
              transition={stepFivePageTurnTransition}
              variants={stepFivePageTurnVariants}
            >
              {[0, 1].map((itemIndex) => {
                const pageIndex = Math.max(0, stepSixReportPageOrder.indexOf(activeReportPage) - 1)
                const previewIndex = pageIndex * 2 + itemIndex + 1

                return (
                  <article
                    key={`report-preview-${previewIndex}`}
                    aria-label={`真实报告示例第 ${previewIndex} 张`}
                    className="relative h-full max-h-[760px] w-[min(37vw,538px)] overflow-hidden rounded-[8px] bg-white shadow-[0_16px_45px_rgba(2,8,23,0.21)] ring-1 ring-slate-200/80"
                  >
                    <div className="absolute inset-[34px] rounded-[3px] border border-slate-200/70" />
                    <div className="absolute inset-x-[54px] top-[70px] h-3 rounded-full bg-slate-100" />
                    <div className="absolute left-[54px] top-[104px] h-2 w-[42%] rounded-full bg-slate-100" />
                    <div className="absolute inset-x-[54px] top-[154px] space-y-4">
                      {Array.from({ length: 9 }).map((_, lineIndex) => (
                        <div
                          key={`preview-line-${lineIndex}`}
                          className="h-2 rounded-full bg-slate-100"
                          style={{ width: `${lineIndex % 3 === 0 ? 86 : lineIndex % 3 === 1 ? 72 : 94}%` }}
                        />
                      ))}
                    </div>
                    <div
                      className="absolute left-1/2 top-1/2 whitespace-nowrap font-['PingFang_SC'] text-[42px] font-semibold tracking-[0.08em] text-slate-400/32"
                      style={{ transform: 'translate(-50%, -50%) rotate(-28deg)' }}
                    >
                      真实报告示例（部分）
                    </div>
                  </article>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <AbilityPageTurnControls
          activeSection={activeReportPage}
          iconColor={productResultTheme.rightButtonBackground}
          sectionOrder={stepSixReportPageOrder}
          showDisabledButtons
          showDots={false}
          onSectionSelect={onReportPageSelect}
        />
      </motion.div>

      {showTransitionOverlay ? (
        <motion.div
          animate={{ opacity: 0 }}
          className="fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 1 }}
          transition={{ delay: reportRevealDelay, duration: 0.24, ease: 'easeOut' }}
          onAnimationComplete={() => setShowTransitionOverlay(false)}
        >
          <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCard.id} />
          <div className="pointer-events-none absolute left-10 top-[22px] z-40 flex h-9 items-center">
            <img
              alt="青钥 Cyacle"
              className="h-9 w-auto shrink-0 select-none"
              draggable={false}
              src={brandLogoDark}
            />
          </div>
          {squarePositions.map((position, index) => {
            const Icon = puzzlePieces[index]?.icon

            return (
              <motion.div
                key={`step-six-transition-${position.x}-${position.y}`}
                animate={{
                  opacity: [0, 1, 1],
                  x: [position.x, 0],
                  y: [position.y, 0],
                  scale: [1, 1, 0],
                }}
                className="absolute left-1/2 top-1/2 z-20 flex h-[388.8px] w-[388.8px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[57.6px] shadow-[0_32px_80px_rgba(15,23,42,0.18)] ring-[8.4px] ring-white/55"
                initial={{ opacity: 0, x: position.x, y: position.y, scale: 1 }}
                style={{ backgroundColor: productResultTheme.rightButtonBackground }}
                transition={{
                  duration: squaresConvergeDuration,
                  ease: 'linear',
                  times: [0, 0.0001, 1],
                  delay: progressStartDelay + index * STEP_SIX_SQUARES_STAGGER,
                }}
              >
                {Icon ? <Icon className="h-[184.32px] w-[184.32px] text-white" /> : null}
              </motion.div>
            )
          })}
          {showReportLoadingCounter ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              initial={{ opacity: 0 }}
              transition={{ delay: progressStartDelay, duration: 0.24, ease: 'easeOut' }}
            >
              <AnimatedProgressCounter color={productResultTheme.rightButtonBackground} duration={squaresConvergeDuration} startDelay={progressStartDelay} />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}

      <Confetti
        ref={leftConfettiRef}
        angle={-Math.PI / 4}
        className="fixed inset-0 z-[70] size-full"
        originX={0}
        originY={1}
        particleCount={114}
        speedMultiplier={1.2}
        spread={Math.PI * 0.5}
      />
      <Confetti
        ref={rightConfettiRef}
        angle={-Math.PI * 0.75}
        className="fixed inset-0 z-[70] size-full"
        originX={1}
        originY={1}
        particleCount={114}
        speedMultiplier={1.2}
        spread={Math.PI * 0.5}
      />
    </div>
  )
}

export function ProductCarbonFlowPage({ step }: ProductCarbonFlowPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [stepOneActiveCard, setStepOneActiveCard] = useState<ProductCard>(stepOneCards[0])
  const [contentReadyStep, setContentReadyStep] = useState('')
  const [stepFourBusinessDisabled, setStepFourBusinessDisabled] = useState(false)
  const [stepFourAdvanceRequestKey, setStepFourAdvanceRequestKey] = useState(0)
  const routeState = location.state as {
    entryTransition?: 'slide-up'
    selectedCardId?: string
    selectedScheme?: 'recommended' | 'custom'
    revealFromStepFour?: boolean
  } | null
  const activeStep = getProductCarbonStep(step) ?? productCarbonSteps[0]
  const activeIndex = productCarbonSteps.findIndex((item) => item.step === activeStep.step)
  const previousStep = activeIndex > 0 ? productCarbonSteps[activeIndex - 1] : undefined
  const nextStep = productCarbonSteps[activeIndex + 1]
  const selectedCardId = routeState?.selectedCardId ?? stepOneCards[0].id
  const selectedCard =
    stepOneCards.find((card) => card.id === selectedCardId) ?? stepOneCards[0]
  const selectedScheme = routeState?.selectedScheme ?? 'recommended'
  const shouldUseEntrySlideUp = activeStep.step === 'step1' && routeState?.entryTransition === 'slide-up'

  useEffect(() => {
    if (activeStep.step === 'step7') {
      return undefined
    }

    const readyDelays: Record<string, number> = {
      step1: 480,
      step2: 5200,
      step3: 5200,
      step4: 900,
      step5: routeState?.revealFromStepFour === true ? 1100 : 250,
      step6: STEP_SIX_REPORT_REVEAL_DELAY * 1000 + 250,
    }
    const timeoutId = window.setTimeout(() => {
      setContentReadyStep(activeStep.step)
    }, readyDelays[activeStep.step] ?? 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeStep.step, routeState?.revealFromStepFour])

  const businessButtonLabels: Record<string, string> = {
    step1: '选择当前产品',
    step2: '启动数据解构',
    step3: '启动智能建模',
    step4: '生成核算结果',
    step5: '生成核算报告',
    step6: '进入送审环节',
    step7: '欢迎再次体验',
  }
  const goToNextStep = (state: Record<string, unknown> = {}) => {
    if (!nextStep) {
      return
    }

    navigate(`/product-carbon-flow/${nextStep.step}`, {
      state: { selectedCardId: selectedCard.id, selectedScheme, ...state },
    })
  }
  const handleBusinessButtonClick = () => {
    if (activeStep.step === 'step1') {
      navigate(`/product-carbon-flow/${nextStep?.step ?? 'step2'}`, {
        state: { selectedCardId: stepOneActiveCard.id },
      })
      return
    }

    if (activeStep.step === 'step4') {
      setStepFourAdvanceRequestKey((currentKey) => currentKey + 1)
      return
    }

    if (activeStep.step === 'step7') {
      navigate('/product-carbon-flow/step1', {
        state: { selectedCardId: selectedCard.id, selectedScheme },
      })
      return
    }

    goToNextStep()
  }
  const isBusinessButtonDisabled =
    (activeStep.step !== 'step7' && contentReadyStep !== activeStep.step) ||
    (activeStep.step === 'step4' && stepFourBusinessDisabled) ||
    !businessButtonLabels[activeStep.step]

function ProductSelectionStepSeven({
  selectedCard,
  activeStep,
  businessButtonDisabled,
  businessButtonLabel,
  previousStep,
  selectedScheme,
  onBusinessButtonClick,
}: {
  selectedCard: ProductCard
  activeStep: { step: string; title: string }
  businessButtonDisabled?: boolean
  businessButtonLabel: string
  previousStep?: { step: string }
  selectedScheme?: 'recommended' | 'custom'
  onBusinessButtonClick: () => void
}) {
  const certificationAgencies = [
    'TÜV SÜD 南德意志集团',
    'DNV 上海挪华威认证',
    'BV 必维国际检验集团',
    'SGS 通标',
    'TÜV 莱茵',
    'Intertek 天祥集团',
    'CTI 华测检测',
    'CQC 中国质量认证中心',
    'WIT 万泰认证',
    'Kiwa BCC 新世纪检验认证',
    '钛和检测认证集团',
    '绿林认证',
    'TESTEX 特思达',
    '中国电研威凯公司（CVC威凯）',
  ]
  const reportConfig = stepSixReportConfigs[selectedCard.id] ?? stepSixReportConfigs.backpack
  const themeColor = reportConfig.leftDeepColor
  const stepSevenStageWidth = 1920
  const stepSevenStageHeight = 1080
  const { containerRef, containerSize, scale } = useStageScale(stepSevenStageWidth, stepSevenStageHeight)
  
  const scaledOffsetX = Math.max(0, (containerSize.width - stepSevenStageWidth * scale) / 2)
  const scaledOffsetY = Math.max(0, (containerSize.height - stepSevenStageHeight * scale) / 2)

  return (
    <PageTransition disableOpacity>
      <ScreenShell contentClassName="px-0 py-0">
        <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCard.id} step={activeStep.step} />

        <NavControl
          actions={
            <h1 className="text-right text-[26.88px] font-semibold leading-[1.05] text-[#0F172A] opacity-30">
              {activeStep.title}
            </h1>
          }
          showBack={false}
          showHome={false}
          showFullscreen={false}
        />
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <ProductFlowFooter
            activeColor={getProductReportButtonColor(selectedCard.id)}
            activeStepNumber={getStepNumber(activeStep.step)}
            businessButtonDisabled={businessButtonDisabled}
            businessButtonLabel={businessButtonLabel}
            previousStep={previousStep}
            selectedCardId={selectedCard.id}
            selectedScheme={selectedScheme}
            onBusinessButtonClick={onBusinessButtonClick}
          />
        </div>
        
        <section ref={containerRef} className="relative z-20 flex h-screen min-h-0 w-full items-center justify-center overflow-hidden supports-[height:100dvh]:h-dvh">
          <div className="relative shrink-0 w-full h-full">
            <div 
              className="absolute left-0 top-0 flex h-[1080px] w-[1920px] origin-top-left flex-col items-center justify-center" 
              style={{
                transform: `translate(${scaledOffsetX}px, ${scaledOffsetY}px) scale(${scale})`,
              }}
            >
              <motion.div 
                className="mb-10 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h2 className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-[44px] font-extrabold tracking-tight text-transparent">
                  权威第三方认证机构
                </h2>
                <p className="mt-5 text-[18px] font-medium text-slate-500">
                  携手全球顶尖认证平台，确保碳足迹核算结果
                  <span style={{ color: themeColor }} className="mx-1 font-bold">合规、准确、可信</span>
                </p>
              </motion.div>
              
              <motion.div 
                className="grid w-[1440px] grid-cols-4 gap-5 px-8"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                }}
                initial="hidden"
                animate="show"
              >
                {certificationAgencies.map((agency, index) => (
                  <motion.div 
                    key={agency} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                    }}
                    className={cn(
                      'relative flex min-h-[112px] items-center gap-4 rounded-[20px] bg-white/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300',
                      index === certificationAgencies.length - 2 && 'col-start-2',
                    )}
                  >
                    <div className="absolute inset-0 rounded-[20px] ring-2 ring-transparent transition-all duration-300 opacity-20" style={{ color: themeColor }} />

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-inner ring-1 ring-slate-200/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-100 transition-all duration-500" style={{ color: themeColor }} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                        <path d="M12 11l0 4" />
                        <path d="M12 15l.01 0" />
                      </svg>
                    </div>
                    <span className="min-w-0 text-left text-[16px] font-bold leading-snug text-slate-800 transition-colors duration-300">
                      {agency}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </ScreenShell>
    </PageTransition>
  )
}

  if (activeStep.step === 'step1') {
    return (
      <PageTransition disableOpacity={!shouldUseEntrySlideUp} variant="slide-up">
        <ProductFlowThreeZoneLayout
          activeColor={getProductReportButtonColor(stepOneActiveCard.id)}
          activeStepTitle={activeStep.title}
          businessButtonDisabled={isBusinessButtonDisabled}
          businessButtonLabel={businessButtonLabels[activeStep.step]}
          previousStep={previousStep}
          selectedCardId={selectedCard.id}
          selectedScheme={selectedScheme}
          step={activeStep.step}
          onBusinessButtonClick={handleBusinessButtonClick}
        >
          <section className="relative z-20 flex min-h-0 flex-1 flex-col">
            <ProductSelectorCarousel
              onActiveCardChange={setStepOneActiveCard}
              onSelect={(card) => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: card.id },
                  })
                }
              }}
            />
          </section>
        </ProductFlowThreeZoneLayout>
      </PageTransition>
    )
  }

  if (activeStep.step === 'step2') {
    return (
      <PageTransition disableOpacity>
        <ProductFlowThreeZoneLayout
          activeColor={getProductReportButtonColor(selectedCard.id)}
          activeStepTitle={activeStep.title}
          businessButtonDisabled={isBusinessButtonDisabled}
          businessButtonLabel={businessButtonLabels[activeStep.step]}
          previousStep={previousStep}
          selectedCardId={selectedCard.id}
          selectedScheme={selectedScheme}
          step={activeStep.step}
          onBusinessButtonClick={handleBusinessButtonClick}
        >
          <section className="relative z-20 flex min-h-0 flex-1 flex-col">
            <ProductSelectionStepTwo
              selectedCard={selectedCard}
              onAdvance={() => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: selectedCard.id },
                  })
                }
              }}
            />
          </section>
        </ProductFlowThreeZoneLayout>
      </PageTransition>
    )
  }

  if (activeStep.step === 'step3') {
    return (
      <PageTransition disableOpacity>
        <ProductFlowThreeZoneLayout
          activeColor={getProductReportButtonColor(selectedCard.id)}
          activeStepTitle={activeStep.title}
          businessButtonDisabled={isBusinessButtonDisabled}
          businessButtonLabel={businessButtonLabels[activeStep.step]}
          previousStep={previousStep}
          selectedCardId={selectedCard.id}
          selectedScheme={selectedScheme}
          step={activeStep.step}
          onBusinessButtonClick={handleBusinessButtonClick}
        >
          <section className="relative z-20 flex min-h-0 flex-1 flex-col">
            <ProductSelectionStepThree
              selectedCard={selectedCard}
              onAdvance={() => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: selectedCard.id },
                  })
                }
              }}
            />
          </section>
        </ProductFlowThreeZoneLayout>
      </PageTransition>
    )
  }

  if (activeStep.step === 'step7') {
    return (
      <ProductSelectionStepSeven
        activeStep={activeStep}
        businessButtonDisabled={isBusinessButtonDisabled}
        businessButtonLabel={businessButtonLabels[activeStep.step]}
        previousStep={previousStep}
        selectedCard={selectedCard}
        selectedScheme={selectedScheme}
        onBusinessButtonClick={handleBusinessButtonClick}
      />
    )
  }

  if (activeStep.step === 'step4') {
    return (
      <PageTransition disableOpacity>
        <ProductFlowThreeZoneLayout
          activeColor={getProductReportButtonColor(selectedCard.id)}
          activeStepTitle={activeStep.title}
          businessButtonDisabled={isBusinessButtonDisabled}
          businessButtonLabel={businessButtonLabels[activeStep.step]}
          previousStep={previousStep}
          selectedCardId={selectedCard.id}
          selectedScheme={selectedScheme}
          step={activeStep.step}
          onBusinessButtonClick={handleBusinessButtonClick}
        >
          <section className="relative z-20 flex min-h-0 flex-1 flex-col">
            <ProductSelectionStepFour
              advanceRequestKey={stepFourAdvanceRequestKey}
              onBusinessDisabledChange={setStepFourBusinessDisabled}
              selectedCard={selectedCard}
              onAdvance={(scheme) => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: selectedCard.id, selectedScheme: scheme, revealFromStepFour: true },
                  })
                }
              }}
            />
          </section>
        </ProductFlowThreeZoneLayout>
      </PageTransition>
    )
  }

  if (activeStep.step === 'step5') {
    const activeColor = getProductReportButtonColor(selectedCard.id)

    return (
      <PageTransition disableOpacity>
        <ScreenShell contentClassName="px-0 py-0">
          <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCard.id} step={activeStep.step} />
          <section className="relative z-20 flex min-h-screen w-full flex-col supports-[height:100dvh]:min-h-dvh">
            <header className="flex h-20 shrink-0 items-center justify-between px-10">
              <Link className="flex h-9 items-center" to="/">
                <img
                  alt="青钥 Cyacle"
                  className="h-9 w-auto shrink-0 select-none"
                  draggable={false}
                  src={brandLogoDark}
                />
              </Link>

              <h1 className="text-right text-[26.88px] font-semibold leading-[1.05] text-[#0F172A] opacity-30">
                {`${activeStep.title}（${selectedScheme === 'custom' ? '自选方案' : '推荐方案'}）`}
              </h1>
            </header>

            <ProductSelectionStepFive
              revealFromStepFour={routeState?.revealFromStepFour === true}
              selectedCard={selectedCard}
              onAdvance={() => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: selectedCard.id, selectedScheme },
                  })
                }
              }}
            />

            <ProductFlowFooter
              activeColor={activeColor}
              activeStepNumber={getStepNumber(activeStep.step)}
              businessButtonDisabled={isBusinessButtonDisabled}
              businessButtonLabel={businessButtonLabels[activeStep.step]}
              previousStep={previousStep}
              selectedCardId={selectedCard.id}
              selectedScheme={selectedScheme}
              onBusinessButtonClick={handleBusinessButtonClick}
            />
          </section>
        </ScreenShell>
      </PageTransition>
    )
  }

  if (activeStep.step === 'step6') {
    const activeColor = getProductReportButtonColor(selectedCard.id)

    return (
      <PageTransition disableOpacity>
        <ScreenShell contentClassName="px-0 py-0">
          <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCard.id} step={activeStep.step} />
          <section className="relative z-20 flex min-h-screen w-full flex-col supports-[height:100dvh]:min-h-dvh">
            <header className="flex h-20 shrink-0 items-center justify-between px-10">
              <Link className="flex h-9 items-center" to="/">
                <img
                  alt="青钥 Cyacle"
                  className="h-9 w-auto shrink-0 select-none"
                  draggable={false}
                  src={brandLogoDark}
                />
              </Link>

              <h1 className="text-right text-[26.88px] font-semibold leading-[1.05] text-[#0F172A] opacity-30">
                {`${activeStep.title}（${selectedScheme === 'custom' ? '自选方案' : '推荐方案'}）`}
              </h1>
            </header>

            <ProductSelectionStepSix
              selectedCard={selectedCard}
              selectedScheme={selectedScheme}
              onAdvance={() => {
                if (nextStep) {
                  navigate(`/product-carbon-flow/${nextStep.step}`, {
                    state: { selectedCardId: selectedCard.id, selectedScheme },
                  })
                }
              }}
            />

            <ProductFlowFooter
              activeColor={activeColor}
              activeStepNumber={getStepNumber(activeStep.step)}
              businessButtonDisabled={isBusinessButtonDisabled}
              businessButtonLabel={businessButtonLabels[activeStep.step]}
              previousStep={previousStep}
              selectedCardId={selectedCard.id}
              selectedScheme={selectedScheme}
              onBusinessButtonClick={handleBusinessButtonClick}
            />
          </section>
        </ScreenShell>
      </PageTransition>
    )
  }

  return (
    <PageTransition disableOpacity>
      <ScreenShell>
        <ProductSurfaceBackground backgroundColor={getProductFlowNeutralBackground()} selectedCardId={selectedCard.id} step={activeStep.step} />
        <ProductStepPuzzle selectedCardId={selectedCard.id} step={activeStep.step} />
        <NavControl
          actions={<h1 className="text-right text-[26.88px] font-semibold leading-[1.05] text-[#0F172A] opacity-30">{activeStep.title}</h1>}
          showBack={false}
          showHome={false}
          showFullscreen={false}
        />
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <ProductFlowFooter
            activeColor={getProductReportButtonColor(selectedCard.id)}
            activeStepNumber={getStepNumber(activeStep.step)}
            businessButtonDisabled={isBusinessButtonDisabled}
            businessButtonLabel={businessButtonLabels[activeStep.step] ?? '下一步'}
            previousStep={previousStep}
            selectedCardId={selectedCard.id}
            selectedScheme={selectedScheme}
            onBusinessButtonClick={handleBusinessButtonClick}
          />
        </div>
        <section className="relative z-20 pt-20">
          <p className="text-control font-medium text-emerald-700">产品碳核算流程</p>
          <p className="text-label-lg mt-6 max-w-3xl text-slate-600">{activeStep.subtitle}</p>
          <div className="mt-10 grid h-80 grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-500">
              {activeStep.mode === 'ai-process' ? 'AI 连续处理画布占位' : '送审认证展示画布占位'}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-500">步骤说明与状态占位</div>
          </div>
        </section>
      </ScreenShell>
    </PageTransition>
  )
}
