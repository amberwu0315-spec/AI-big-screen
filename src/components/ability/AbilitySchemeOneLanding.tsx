import { useState, type ReactNode } from 'react'
import { ArrowDown, Gauge, PlugZap, ScanSearch, SlidersHorizontal, Search, FileCog, FileCheck, ShieldCheck, BookOpen, Users, BarChart, FileArchive, UserPlus, ListTodo, Calculator, ShieldAlert, Wallet, LineChart, ArrowRightLeft, Pickaxe } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AbilityGridBackground } from './AbilityGridBackground'
import { CarbonAccountingExperienceSection } from './CarbonAccountingExperienceSection'
import { MagicRings } from './MagicRings'
import carbonAssetsProblemCcerPotentialBuriedImage from '@/assets/carbon-assets-problem-ccer-potential-buried.png'
import carbonAssetsProblemExperienceBasedTradingImage from '@/assets/carbon-assets-problem-experience-based-trading.png'
import carbonAssetsProblemScatteredHoldingsImage from '@/assets/carbon-assets-problem-scattered-holdings.png'
import carbonAssetsScenarioCcerProjectDevelopmentImage from '@/assets/carbon-assets-scenario-ccer-project-development.png'
import carbonAssetsScenarioGlobalManagementImage from '@/assets/carbon-assets-scenario-global-management.png'
import carbonAssetsScenarioTradingDecisionSupportImage from '@/assets/carbon-assets-scenario-trading-decision-support.png'
import cbamProblemAuditApprovalImage from '@/assets/cbam-problem-audit-approval.png'
import cbamProblemCalculationRulesImage from '@/assets/cbam-problem-calculation-rules.png'
import cbamProblemDataTraceabilityImage from '@/assets/cbam-problem-data-traceability.png'
import cbamProblemFilingThresholdImage from '@/assets/cbam-problem-filing-threshold.png'
import energyProblemScenarioSharedImage from '@/assets/energy-problem-scenario-shared.png'
import energyProblemAnomalyLagImage from '@/assets/energy-problem-anomaly-lag.png'
import energyProblemCarbonDisconnectImage from '@/assets/energy-problem-carbon-disconnect.png'
import energyScenarioAnalysisOptimizationBenchmarkImage from '@/assets/energy-scenario-analysis-optimization-benchmark.png'
import energyScenarioCarbonAccountingLinkImage from '@/assets/energy-scenario-carbon-accounting-link.png'
import energyScenarioGlobalMonitoringImage from '@/assets/energy-scenario-global-monitoring.png'
import esgProblemCrossDepartmentDataSilosImage from '@/assets/esg-problem-cross-department-data-silos.png'
import esgProblemMethodologyAuditRiskImage from '@/assets/esg-problem-methodology-audit-risk.png'
import esgProblemMultipleDisclosureFrameworksImage from '@/assets/esg-problem-multiple-disclosure-frameworks.png'
import esgProblemProgressBlackBoxImage from '@/assets/esg-problem-progress-black-box.png'
import esgScenarioCapitalMarketReportingImage from '@/assets/esg-scenario-capital-market-reporting.png'
import esgScenarioGroupTargetCollaborationImage from '@/assets/esg-scenario-group-target-collaboration.png'
import esgScenarioRatingDynamicResponseImage from '@/assets/esg-scenario-rating-dynamic-response.png'
import esgScenarioSupplyChainDueDiligenceImage from '@/assets/esg-scenario-supply-chain-due-diligence.png'
import supplyChainProblemCrossTierBlindspotImage from '@/assets/supply-chain-problem-cross-tier-blindspot.png'
import supplyChainProblemDataSovereigntyImage from '@/assets/supply-chain-problem-data-sovereignty.png'
import supplyChainProblemReductionTrackingInefficientImage from '@/assets/supply-chain-problem-reduction-tracking-inefficient.png'
import supplyChainProblemScopeThreeDataDistortionImage from '@/assets/supply-chain-problem-scope-three-data-distortion.png'
import supplyChainScenarioCarbonDataCollaborationImage from '@/assets/supply-chain-scenario-carbon-data-collaboration.png'
import supplyChainScenarioCarbonFootprintTraceImage from '@/assets/supply-chain-scenario-carbon-footprint-trace.png'
import supplyChainScenarioLowCarbonAdmissionImage from '@/assets/supply-chain-scenario-low-carbon-admission.png'
import supplyChainScenarioSupplierCarbonSurveyImage from '@/assets/supply-chain-scenario-supplier-carbon-survey.png'
import { BlurReveal, BlurRevealScope } from '@/components/magicui/BlurReveal'
import { TOUCH_SCREEN_DESIGN_WIDTH, useViewportFitScale } from '@/components/common/ScaledStage'
import { AnimatedTestimonials, type AnimatedTestimonial } from '@/components/ui/animated-testimonials'
import { getAbilitySectionLabel, type Ability, type AbilityContentItem, type AbilitySectionKey } from '@/data/abilities'

const abilityDescriptions: Record<string, string> = {
  cbam: '面向欧盟碳边境调节机制（CBAM），针对钢铁、铝、水泥、化肥等管控品类，提供从工艺解构、排放核算到合规申报的全流程合规支持。系统内置动态对齐欧盟规则的核算模型与税额预演能力，赋能对欧出口企业实现高效常态化履约申报。',
  energy: '围绕企业电、热、燃料、蒸汽等多种能源介质，构建覆盖数据接入、实时监控、计量结算、运行优化与经济性分析的一体化能源管理体系。同步服务于碳盘查与产品碳足迹核算，让能源治理与碳管理共享同一数据底座。',
  'supply-chain': '构建全景式供应链碳排放图谱，赋能链主企业量化并穿透管理多级上游的真实碳排放数据，将范围三黑盒转化为清晰的管理抓手，驱动整条价值链的风险管控与协同降碳。',
  esg: '遵循 CDP、MSCI 等国际评级体系及各大交易所披露指引，构建“底层数据一次采集、多披露场景自动适配”的统一可持续数据底座，将宏大的 ESG 战略拆解为可落地的执行方案。',
  'carbon-assets': '面向纳入全国及地方碳市场的控排企业，提供以统一碳资产账本为中枢的一站式管理平台，让碳排放权从合规负担转化为可量化、可经营的企业资产。',
  'carbon-accounting': '从产品、企业到供应链，构建不同层级，从活动数据归集、模型计算、报告输出到审核认证的一体化碳管理体系。',
}

const heroTitles: Record<string, { lead: string; suffix: string }> = {
  cbam: { lead: 'CBAM', suffix: '合规管理' },
  esg: { lead: 'ESG', suffix: '合规管理' },
  'supply-chain': { lead: '供应链', suffix: '碳管理' },
  energy: { lead: '能碳', suffix: '管理' },
  'carbon-assets': { lead: '碳资产', suffix: '管理' },
  'carbon-accounting': { lead: '碳', suffix: '核算' },
}

const heroActionLinks: Record<string, { label: string; to: string }> = {
  cbam: { label: '点击测算碳税', to: '/ability/cbam/carbon-tax' },
  energy: { label: '点击试用', to: '/company-carbon-dashboard' },
}

const gradientStartColor = '#12E1C5'
const gradientMiddleColor = '#18C7E5'
const gradientEndColor = '#0771FC'
const gradientTitleClassName = 'bg-[linear-gradient(135deg,#12E1C5_0%,#18C7E5_50%,#0771FC_100%)] bg-clip-text text-transparent'
const gradientFillClassName = 'bg-[linear-gradient(135deg,#12E1C5_0%,#18C7E5_50%,#0771FC_100%)]'
const heroOutlineActionClassName = `flex h-[73px] w-[234px] items-center justify-center rounded-[0.556em] ${gradientFillClassName} p-[2px] text-[23px] font-semibold text-white transition-opacity hover:opacity-90`
const heroOutlineActionInnerClassName = 'flex h-full w-full items-center justify-center rounded-[0.444em] bg-[#030405]'
const heroActionIconClassName = 'ml-[6px] size-[23px] stroke-[2.2]'
const designViewportWidth = TOUCH_SCREEN_DESIGN_WIDTH
const abilitySideSafeInset = 80
const tabSectionPaddingClassName = 'px-20 pb-[80px] pt-[120px]'
const fullscreenSectionClassName = 'relative z-10 h-screen max-h-screen snap-start overflow-visible bg-[#030405] supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh'

type SectionTitleBlockProps = {
  abilityName: string
  align?: 'center' | 'left' | 'right'
  summary?: string
  summaryWidth?: number
  title: string
}

export function SectionTitleBlock({ abilityName, align = 'center', summary, summaryWidth, title }: SectionTitleBlockProps) {
  const isCenter = align === 'center'
  const isRight = align === 'right'
  const alignmentClassName = isCenter ? 'items-center text-center' : isRight ? 'items-end text-right' : 'items-start text-left'
  const textAlignmentClassName = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'
  const tagAlignmentClassName = isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'

  return (
    <div className={`flex w-full flex-none flex-col ${alignmentClassName} gap-5 p-0`}>
      <div className={`flex w-full flex-none flex-col ${alignmentClassName} gap-[10px] p-0`}>
        <BlurReveal className={`flex w-full flex-none ${tagAlignmentClassName}`} delay={0.04} duration={0.6} inView>
          <div>
            <span className="inline-flex h-9 items-center justify-center rounded-[6px] bg-[rgba(255,255,255,0.1)] px-[10px] text-center text-[17px] font-semibold leading-none tracking-[-0.2px] text-white mix-blend-normal">
              <span className="translate-y-[1px]">{abilityName}</span>
            </span>
          </div>
        </BlurReveal>
        <BlurReveal delay={0.12} duration={0.68} inView>
          <h2 className={`w-full flex-none whitespace-nowrap text-[60px] font-semibold leading-[84px] ${textAlignmentClassName}`}>
            <span className={gradientTitleClassName}>{title}</span>
          </h2>
        </BlurReveal>
      </div>
      {summary ? (
        <BlurReveal delay={0.22} duration={0.68} inView>
          <p
            className={`w-full flex-none text-[22.1px] font-semibold leading-[37.7px] tracking-[-0.2px] text-white mix-blend-normal ${textAlignmentClassName}`}
            style={summaryWidth ? { width: summaryWidth } : undefined}
          >
            {summary}
          </p>
        </BlurReveal>
      ) : null}
    </div>
  )
}

export function ScaledContent({
  children,
  height,
  scale,
  width,
}: {
  children: ReactNode
  height: number
  scale: number
  width: number
}) {
  return (
    <div
      className="relative flex-none"
      style={{
        height: height * scale,
        width: width * scale,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          width,
        }}
      >
        {children}
      </div>
    </div>
  )
}


type UnifiedMechanismStep = {
  number: string
  title: string
  description?: string
  items?: string[]
  hideDots?: boolean
  Icon: React.ElementType
}

function UnifiedMechanismFrameGroup({ steps }: { steps: UnifiedMechanismStep[] }) {
  const mechanismPanelTop = 96
  const mechanismPanelHeight = 340
  const mechanismIconSize = 96
  const mechanismIconTop = mechanismPanelTop - mechanismIconSize / 2

  const itemWidth = 372
  const gap = 64
  const containerWidth = steps.length * itemWidth + Math.max(0, steps.length - 1) * gap

  return (
    <div className="relative mx-auto h-[436px] max-w-full" style={{ width: containerWidth }}>
      <div
        className="pointer-events-none absolute left-0 top-[-10px] z-0 grid w-full gap-[64px]"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((content) => (
          <div
            key={content.title}
            className="relative flex min-w-0 items-start justify-center text-center"
            style={{ fontFamily: 'PingFang SC, sans-serif' }}
          >
            <span className="select-none bg-[linear-gradient(135deg,#16D6E3_0%,#168BFF_100%)] bg-clip-text text-[184px] font-black leading-[0.92] tracking-normal text-transparent opacity-80">
              {content.number}
            </span>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 z-10 w-full overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,rgba(8,9,10,0.96)_0%,rgba(3,4,5,0.98)_100%)] shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-md"
        style={{
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 58%, transparent 100%)',
          height: mechanismPanelHeight,
          maskImage: 'linear-gradient(180deg, #000 0%, #000 58%, transparent 100%)',
          top: mechanismPanelTop,
        }}
      >
        <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),rgba(255,255,255,0.18),transparent)]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 z-20 grid w-full gap-[64px]"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, height: mechanismPanelHeight, top: mechanismPanelTop }}
      >
        {steps.map((content, index) => (
          <div key={content.title} className="relative min-w-0">
            {index > 0 ? (
              <div className="absolute left-[-32px] top-[86px] h-[150px] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18),transparent)]" />
            ) : null}
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute left-0 z-30 grid w-full gap-[64px]"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, top: mechanismIconTop }}
      >
        {steps.map((content, index) => {
          const Icon = content.Icon
          return (
            <div key={content.title} className="flex min-w-0 justify-center">
              <BlurReveal delay={0.1 + index * 0.04} duration={0.6} inView>
                <span
                  className="flex items-center justify-center rounded-full bg-white/10 shadow-[0_18px_42px_rgba(3,4,5,0.18),inset_0_1px_14px_rgba(255,255,255,0.08)] backdrop-blur-md"
                  style={{ height: mechanismIconSize, width: mechanismIconSize }}
                >
                  <Icon aria-hidden="true" className="h-[46px] w-[46px] text-white" strokeWidth={1.9} />
                </span>
              </BlurReveal>
            </div>
          )
        })}
      </div>
      <div
        className="relative z-20 grid h-full gap-[64px]"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((content, index) => {
          return (
            <div
              key={content.title}
              className="relative flex min-w-0 flex-col items-center text-center"
              style={{ fontFamily: 'PingFang SC, sans-serif' }}
            >
              <div
                className="relative z-10 flex w-[332px] flex-col items-center justify-start overflow-visible px-4 pb-4 pt-[76px] text-center"
                style={{ marginTop: mechanismPanelTop, minHeight: mechanismPanelHeight }}
              >
                <BlurReveal delay={0.18 + index * 0.04} duration={0.6} inView>
                  <h3 className="whitespace-nowrap text-center text-[31px] font-bold leading-[44px] tracking-normal text-white">
                    {content.title}
                  </h3>
                </BlurReveal>
                {content.description ? (
                  <BlurReveal delay={0.26 + index * 0.04} duration={0.6} inView>
                    <p className="mt-4 text-center text-[22px] font-normal leading-[38px] tracking-normal text-white/70">
                      {content.description}
                    </p>
                  </BlurReveal>
                ) : null}
                {content.items && content.items.length > 0 ? (
                  <BlurReveal delay={0.26 + index * 0.04} duration={0.6} inView>
                    <ul className={`mt-4 flex w-full flex-col gap-2 text-[20px] font-normal leading-[32px] text-white/70 ${content.hideDots ? 'items-center text-center' : 'items-start text-left'}`}>
                      {content.items.map((item, i) => (
                        <li key={i} className={`flex items-start ${content.hideDots ? 'w-full justify-center' : 'text-left'}`}>
                          {!content.hideDots && <span className="mr-2 mt-[12px] h-[6px] w-[6px] flex-none rounded-full bg-white/40" />}
                          <span className={content.hideDots ? 'w-full text-center' : ''}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </BlurReveal>
                ) : null}
                <div
                  aria-hidden="true"
                  className="pointer-events-none mt-auto mb-3 h-[2px] w-[118px] bg-[linear-gradient(90deg,transparent,rgba(22,214,227,0.55),transparent)] shadow-[0_0_20px_rgba(22,214,227,0.28)]"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const unifiedCbamSteps: UnifiedMechanismStep[] = [
  {
    number: '01',
    title: '数据摸底与边界确认',
    items: ['按 CN code 摸底', '划定核算边界', '制定初步填报策略'],
    hideDots: true,
    Icon: Search,
  },
  {
    number: '02',
    title: '归集数据并制定策略',
    items: ['发起上游协作邀请', '处理异常或缺失数据', '对比税额并制定策略'],
    hideDots: true,
    Icon: FileCog,
  },
  {
    number: '03',
    title: 'CBAM填报与合规申报',
    items: ['准备审核物料', '通过第三方合规审核', '完成 CBAM 合规填报'],
    hideDots: true,
    Icon: FileCheck,
  },
  {
    number: '04',
    title: '体系存证与长期管理',
    items: ['统一归档存证', '沉淀长效合规体系', '支撑常态化申报'],
    hideDots: true,
    Icon: ShieldCheck,
  },
]

const unifiedEsgSteps: UnifiedMechanismStep[] = [
  {
    number: '01',
    title: '准则解析与框架映射',
    items: ['解析评级与披露准则', '统一锚定底层指标', '建立企业指标体系'],
    hideDots: true,
    Icon: BookOpen,
  },
  {
    number: '02',
    title: '任务分派与协同执行',
    items: ['指标定向派发', '建立成果反馈机制', '实时跟进指标进度'],
    hideDots: true,
    Icon: Users,
  },
  {
    number: '03',
    title: '进度看板与模型计算',
    items: ['呈现采集全流程进度', '自动试算 E/S/G 指标', '定位指标表现变化'],
    hideDots: true,
    Icon: BarChart,
  },
  {
    number: '04',
    title: '按需生成报告并归档',
    items: ['生成结构化报告', '数据随方法论更新', '穿透回溯历史档案'],
    hideDots: true,
    Icon: FileArchive,
  },
]

const unifiedSupplyChainSteps: UnifiedMechanismStep[] = [
  {
    number: '01',
    title: '供应商入驻与动态分级',
    items: ['批量引入供应商', '自动划定层级结构', '锁定重点提升对象'],
    hideDots: true,
    Icon: UserPlus,
  },
  {
    number: '02',
    title: '差异化分发与追踪',
    items: ['定制化数据问卷', '监测响应状态', '追踪交付进度'],
    hideDots: true,
    Icon: ListTodo,
  },
  {
    number: '03',
    title: '统一归集与智能核算',
    items: ['统一归集上下游数据', '依照国标规则核算', '形成标准化数据台账'],
    hideDots: true,
    Icon: Calculator,
  },
  {
    number: '04',
    title: '风险拦截与合规闭环',
    items: ['追踪减排目标进展', '监测合规资质状态', '驱动价值链协同减排'],
    hideDots: true,
    Icon: ShieldAlert,
  },
]

const unifiedCarbonAssetsSteps: UnifiedMechanismStep[] = [
  {
    number: '01',
    title: '账本归集',
    items: ['归集配额与CCER资产', '按账户类型建账', '按组织维度建账'],
    hideDots: true,
    Icon: Wallet,
  },
  {
    number: '02',
    title: '估值与缺口测算',
    items: ['联动市场参考价', '实时测算资产估值', '测算履约缺口与成本'],
    hideDots: true,
    Icon: LineChart,
  },
  {
    number: '03',
    title: '交易与履约执行',
    items: ['开展买入卖出操作', '执行履约清缴', '过程数据回写账本'],
    hideDots: true,
    Icon: ArrowRightLeft,
  },
  {
    number: '04',
    title: 'CCER开发反哺',
    items: ['挖掘集团减排项目', '将CCER纳入账本', '增厚可用资产工具'],
    hideDots: true,
    Icon: Pickaxe,
  },
]

const unifiedEnergySteps: UnifiedMechanismStep[] = [
  {
    number: '01',
    title: '多源能源接入',
    description: '覆盖电力、燃料、蒸汽、热力等多种能源介质，建立覆盖工厂、产线、机组多层级的统一数据接入口。',
    Icon: PlugZap,
  },
  {
    number: '02',
    title: '实时监控与计量',
    description: '呈现机组、产线、组织不同层级的实时用能数据与关键指标对标分析，即时可见运行状态与异常波动。',
    Icon: Gauge,
  },
  {
    number: '03',
    title: '分析与诊断',
    description: '通过耗差归因、设备性能分析、管网平衡等专业工具，识别用能损耗的发生位置与归因路径，智能优化方案。',
    Icon: ScanSearch,
  },
  {
    number: '04',
    title: '计划与优化',
    description: '制定能源使用计划与机组调度方案，跟踪计划执行情况，形成“诊断-优化-复盘”的闭环迭代机制。',
    Icon: SlidersHorizontal,
  },
]

function MechanismSection({ ability, contentScale }: { ability: Ability; contentScale: number }) {
  const title = getAbilitySectionLabel(ability, 'mechanism')
  const summary = ability.id === 'supply-chain'
    ? '以可信数据流转为底层机制，构建兼顾安全与合规的供应链减排协作体系。'
    : ability.id === 'cbam'
      ? '将繁杂的 CBAM 合规要求转化为“摸排建档-数据归集-核算填报-合规审核”的标准化数字流水线。'
      : ability.id === 'esg'
        ? '建立从准则解析、任务协同到报告归档的全链路结构化数据流转体系。'
        : ability.id === 'carbon-assets'
          ? '以账本为中枢，形成持仓、估值、履约、交易与CCER开发的全链路闭环。'
          : ability.understand.what[0] ?? ability.description

  if (ability.id === 'carbon-accounting') {
    return (
      <CarbonAccountingExperienceSection
        abilityName={ability.name}
        className="min-h-0"
        contentScale={contentScale}
        showBackground={false}
        summary="围绕企业与产品两类核心核算场景，沉淀可审计、可追溯、可复用的碳数据结果。"
        title={title}
      />
    )
  }

  return (
    <div className="relative z-20 flex h-full w-full items-center justify-center text-center text-white">
      <ScaledContent height={720} scale={contentScale} width={designViewportWidth}>
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <SectionTitleBlock
            abilityName={ability.name}
            summary={summary}
            title={title}
          />
          <div className="mt-[60px] flex w-full flex-1 justify-center px-20">
            {ability.id === 'cbam' ? <UnifiedMechanismFrameGroup steps={unifiedCbamSteps} /> : null}
            {ability.id === 'esg' ? <UnifiedMechanismFrameGroup steps={unifiedEsgSteps} /> : null}
            {ability.id === 'supply-chain' ? <UnifiedMechanismFrameGroup steps={unifiedSupplyChainSteps} /> : null}
            {ability.id === 'carbon-assets' ? <UnifiedMechanismFrameGroup steps={unifiedCarbonAssetsSteps} /> : null}
            {ability.id === 'energy' ? <UnifiedMechanismFrameGroup steps={unifiedEnergySteps} /> : null}
          </div>
        </div>
      </ScaledContent>
    </div>
  )
}

type ScenarioGroupKey = 'problems' | 'scenarios'
type ScenarioGroupOption = { key: ScenarioGroupKey; label: string; items: AbilityContentItem[] }

function getContentItemTitle(item: AbilityContentItem) {
  return typeof item === 'string' ? item : item.title
}

function getContentItemDescription(item: AbilityContentItem) {
  return typeof item === 'string' ? item : item.description
}

function getAbilityScenarioImage(ability: Ability, item: AbilityContentItem) {
  if (ability.id === 'energy') {
    const energyImages: Record<string, string> = {
      用能异常洞察滞后: energyProblemAnomalyLagImage,
      能耗管控粗放低效: energyProblemScenarioSharedImage,
      无法直接打通碳管理场景: energyProblemCarbonDisconnectImage,
      全局能源监控: energyScenarioGlobalMonitoringImage,
      '能耗分析、优化与对标': energyScenarioAnalysisOptimizationBenchmarkImage,
      直连碳核算: energyScenarioCarbonAccountingLinkImage,
    }

    return energyImages[getContentItemTitle(item)]
  }

  if (ability.id === 'cbam') {
    const cbamProblemImages: Record<string, string> = {
      核算规则复杂严格: cbamProblemCalculationRulesImage,
      数据穿透与追溯难: cbamProblemDataTraceabilityImage,
      填报门槛高难度大: cbamProblemFilingThresholdImage,
      合规审核通过难: cbamProblemAuditApprovalImage,
    }

    return cbamProblemImages[getContentItemTitle(item)]
  }

  if (ability.id === 'supply-chain') {
    const supplyChainImages: Record<string, string> = {
      范围三底层数据失真: supplyChainProblemScopeThreeDataDistortionImage,
      供应商数据主权顾虑: supplyChainProblemDataSovereigntyImage,
      跨级供应链管理盲区: supplyChainProblemCrossTierBlindspotImage,
      减排目标协同与追踪低效: supplyChainProblemReductionTrackingInefficientImage,
      上游供应商碳摸排: supplyChainScenarioSupplierCarbonSurveyImage,
      供应链碳数据协同: supplyChainScenarioCarbonDataCollaborationImage,
      分级低碳准入管控: supplyChainScenarioLowCarbonAdmissionImage,
      全链碳足迹溯源: supplyChainScenarioCarbonFootprintTraceImage,
    }

    return supplyChainImages[getContentItemTitle(item)]
  }

  if (ability.id === 'esg') {
    const esgImages: Record<string, string> = {
      披露框架多套并行: esgProblemMultipleDisclosureFrameworksImage,
      跨部门数据割裂与归集低效: esgProblemCrossDepartmentDataSilosImage,
      口径冲突与外部审计风险: esgProblemMethodologyAuditRiskImage,
      管理过程黑盒与进度失控: esgProblemProgressBlackBoxImage,
      '主流 ESG 评级动态响应': esgScenarioRatingDynamicResponseImage,
      高标准资本市场报告披露: esgScenarioCapitalMarketReportingImage,
      供应链及大客户联合尽调: esgScenarioSupplyChainDueDiligenceImage,
      集团级目标下达与跨部门协同: esgScenarioGroupTargetCollaborationImage,
    }

    return esgImages[getContentItemTitle(item)]
  }

  if (ability.id === 'carbon-assets') {
    const carbonAssetsImages: Record<string, string> = {
      多组织持仓散乱难统管: carbonAssetsProblemScatteredHoldingsImage,
      交易决策凭经验: carbonAssetsProblemExperienceBasedTradingImage,
      CCER开发潜力被埋没: carbonAssetsProblemCcerPotentialBuriedImage,
      碳资产全局管理: carbonAssetsScenarioGlobalManagementImage,
      碳交易与决策支持: carbonAssetsScenarioTradingDecisionSupportImage,
      CCER项目挖掘与开发: carbonAssetsScenarioCcerProjectDevelopmentImage,
    }

    return carbonAssetsImages[getContentItemTitle(item)]
  }

  return undefined
}

function AbilityProblemScenarioSection({ ability, contentScale }: { ability: Ability; contentScale: number }) {
  const [activeGroup, setActiveGroup] = useState<ScenarioGroupKey>('problems')
  const allGroupOptions: ScenarioGroupOption[] = [
    { key: 'problems', label: '问题', items: ability.understand.problems },
    { key: 'scenarios', label: '场景', items: ability.understand.scenarios },
  ]
  const groupOptions = allGroupOptions.filter((option) => option.items.length > 0)
  const shouldShowGroupTabs = groupOptions.length > 1
  const activeOption = groupOptions.find((option) => option.key === activeGroup) ?? groupOptions[0]
  const activeTitle = activeOption.key === 'problems' ? '解决什么问题' : ability.understand.scenarioTitle.replace('/', ' / ')
  const testimonials: AnimatedTestimonial[] = activeOption.items.map((item, index) => ({
    designation: `${activeOption.key === 'problems' ? '问题' : '场景'}${index + 1}`,
    name: getContentItemTitle(item),
    quote: getContentItemDescription(item),
    src: getAbilityScenarioImage(ability, item),
  }))

  return (
    <div
      aria-label="解决问题&应用场景"
      className="relative h-screen max-h-screen overflow-hidden bg-[#030405] supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh"
      data-scheme-one-subsection="problem-scenario"
    >
      <AbilityGridBackground />
      <div className={`relative z-10 flex h-full w-full items-center justify-center overflow-hidden ${tabSectionPaddingClassName}`}>
        <ScaledContent height={820} scale={contentScale} width={1640}>
          <div className="flex h-full w-full flex-col items-start justify-center text-white">
            <div className="relative flex w-full items-end gap-10">
              <div className="min-w-0 flex-1">
                <SectionTitleBlock abilityName={ability.name} align="left" title={activeTitle} />
              </div>
              {shouldShowGroupTabs ? (
                <div className="flex rounded-[6px] border border-white/10 bg-white/[0.06] p-1 scale-[1.2] origin-bottom-right mb-[14px]">
                  {groupOptions.map((option) => {
                    const isActive = option.key === activeOption.key

                    return (
                      <button
                        key={option.key}
                        className={`h-[37px] rounded-[0.325em] px-[22px] text-[15.4px] font-semibold transition-colors ${isActive ? 'bg-white text-[#131415]' : 'text-white/55 hover:text-white'}`}
                        type="button"
                        onClick={() => setActiveGroup(option.key)}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <AnimatedTestimonials key={activeOption.key} className="mt-8 max-w-none px-0 py-12" contentPanelClassName="translate-x-[48px]" imagePanelClassName="-translate-x-[56px]" testimonials={testimonials} />
          </div>
        </ScaledContent>
      </div>
    </div>
  )
}

function ResultValueTitleBlock({ ability, contentScale }: { ability: Ability; contentScale: number }) {
  const getTitle = (item: AbilityContentItem) => (typeof item === 'string' ? item : item.title)
  const getDescription = (item: AbilityContentItem) => (typeof item === 'string' ? item : item.description)
  const valueSummary = ability.value.summary ?? `${ability.value.gains.slice(0, 2).map(getTitle).join('、')}，${ability.value.values.slice(0, 2).map(getTitle).join('、')}。`
  const resultValueGridColumnGap = 100
  const resultValueGridRowGap = 50
  const resultValueGridScale = 0.9
  const layoutWidth = designViewportWidth - 200
  const gridWidth = layoutWidth / resultValueGridScale
  const resultItems = ability.value.gains
  const valueItems = ability.value.values
  const orderedItems = [
    ...resultItems.map((item) => ({ item, label: '结果' })),
    ...valueItems.map((item) => ({ item, label: '价值' })),
  ]

  const renderCard = (item: AbilityContentItem, label: string, index: number) => {
    const gradientId = `result-value-icon-gradient-${label}-${index}`
    const icon = label === '结果'
      ? (
        <svg aria-hidden="true" className="h-[43px] w-[43px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="24" y1="0" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor={gradientStartColor} />
              <stop offset="0.5" stopColor={gradientMiddleColor} />
              <stop offset="1" stopColor={gradientEndColor} />
            </linearGradient>
          </defs>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 1 1 -2 0a1 1 0 0 1 -1 -1m7.53 -1.243a1 1 0 1 1 1.94 .486l-.5 2a1 1 0 1 1 -1.94 -.486zm6.47 1.243a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1m-8.81 4.293l6.517 6.518a1 1 0 0 1 -.29 1.617l-9.573 4.387a2 2 0 0 1 -2.661 -2.652l4.39 -9.58a1 1 0 0 1 1.616 -.29m7.517 -1a1 1 0 0 1 0 1.414l-1 1a1 1 0 0 1 -1.414 -1.414l1 -1a1 1 0 0 1 1.414 0m4.05 3.237a1 1 0 0 1 .486 1.94l-2 .5a1 1 0 0 1 -.486 -1.94zm-2.756 7.47a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1" fill={`url(#${gradientId})`} />
        </svg>
      )
      : (
        <svg aria-hidden="true" className="h-[43px] w-[43px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="24" y1="0" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor={gradientStartColor} />
              <stop offset="0.5" stopColor={gradientMiddleColor} />
              <stop offset="1" stopColor={gradientEndColor} />
            </linearGradient>
          </defs>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M17.964 2.733c.156 .563 .312 1 .484 1.353c.342 .71 .758 1.125 1.47 1.467c.353 .17 .79 .326 1.352 .484c.98 .276 .97 1.668 -.013 1.93a8.3 8.3 0 0 0 -1.34 .481c-.71 .342 -1.127 .757 -1.463 1.453a8 8 0 0 0 -.486 1.352c-.258 .988 -1.658 1 -1.932 .015c-.156 -.565 -.312 -1.002 -.484 -1.354c-.342 -.71 -.758 -1.124 -1.458 -1.46a8 8 0 0 0 -1.374 -.495a.4 .4 0 0 1 -.06 -.02l-.044 -.017l-.045 -.02l-.049 -.025l-.035 -.02a.4 .4 0 0 1 -.049 -.03l-.032 -.023l-.043 -.034l-.033 -.028l-.036 -.035l-.034 -.035l-.028 -.033l-.035 -.043l-.022 -.032a.4 .4 0 0 1 -.032 -.049l-.02 -.035l-.025 -.05l-.02 -.044l-.017 -.043a.4 .4 0 0 1 -.02 -.06l-.01 -.034a.5 .5 0 0 1 -.02 -.098l-.006 -.065l-.005 -.035v-.05a.4 .4 0 0 1 .003 -.085a.5 .5 0 0 1 .013 -.093a.5 .5 0 0 1 .024 -.103a.4 .4 0 0 1 .02 -.06l.017 -.044l.02 -.045l.025 -.049l.02 -.035a.4 .4 0 0 1 .03 -.049l.023 -.032l.034 -.043l.028 -.033l.035 -.036l.035 -.034q .015 -.015 .033 -.028l.043 -.035l.032 -.022a.4 .4 0 0 1 .049 -.032l.035 -.02l.05 -.025l.044 -.02l.043 -.017a.4 .4 0 0 1 .06 -.02l.027 -.008a8.3 8.3 0 0 0 1.339 -.48c.71 -.342 1.127 -.757 1.47 -1.466c.17 -.354 .327 -.792 .483 -1.355c.272 -.976 1.657 -.976 1.928 0" fill={`url(#${gradientId})`} />
          <path d="M10.965 6.737q .219 .801 .503 1.574c.856 2.28 1.945 3.363 4.23 4.22q .708 .265 1.571 .506c.976 .272 .974 1.656 -.002 1.927q -.798 .221 -1.568 .504c-2.288 .858 -3.376 1.94 -4.229 4.216a19 19 0 0 0 -.505 1.579c-.268 .983 -1.662 .983 -1.93 0a19 19 0 0 0 -.503 -1.574c-.856 -2.281 -1.944 -3.363 -4.226 -4.219a20 20 0 0 0 -1.594 -.513a.4 .4 0 0 1 -.054 -.018l-.044 -.017l-.043 -.02a.3 .3 0 0 1 -.048 -.024l-.036 -.02a.4 .4 0 0 1 -.048 -.03l-.032 -.024l-.044 -.034l-.033 -.029l-.037 -.034l-.034 -.037l-.03 -.033l-.033 -.044l-.023 -.032a.4 .4 0 0 1 -.03 -.048l-.021 -.036a.3 .3 0 0 1 -.024 -.048l-.02 -.043l-.017 -.044a.4 .4 0 0 1 -.018 -.054a.2 .2 0 0 1 -.01 -.039a.4 .4 0 0 1 -.014 -.059l-.007 -.04l-.007 -.056l-.003 -.044l-.002 -.05v-.05q 0 -.023 .004 -.044q .001 -.03 .007 -.057l.007 -.04a.4 .4 0 0 1 .017 -.076l.007 -.021a.4 .4 0 0 1 .018 -.054l.017 -.044l.02 -.043a.3 .3 0 0 1 .024 -.048l.02 -.036a.4 .4 0 0 1 .03 -.048l.024 -.032l.034 -.044l.029 -.033l.034 -.037l.037 -.034l.033 -.03l.044 -.033l.032 -.023a.4 .4 0 0 1 .048 -.03l.036 -.021a.3 .3 0 0 1 .048 -.024l.043 -.02l.044 -.017a.4 .4 0 0 1 .054 -.018l.021 -.007a20 20 0 0 0 1.568 -.504c2.287 -.858 3.375 -1.94 4.229 -4.216a19 19 0 0 0 .505 -1.579c.268 -.983 1.662 -.983 1.93 0" fill={`url(#${gradientId})`} />
        </svg>
      )

    return (
    <div key={`${label}-${getTitle(item)}-${index}`} className="grid w-full grid-cols-[79px_1fr] items-start gap-x-[22.5px]">
      <div className="flex h-[79px] w-[79px] items-center justify-center rounded-[15px] bg-white">
        {icon}
      </div>
      <div className="min-w-0">
        <BlurReveal delay={0.05 * (index % 3)} duration={0.6} inView>
          <h3 className="h-12 whitespace-nowrap text-[28.35px] font-medium leading-[44px] tracking-[-0.5px] text-white">
            {getTitle(item)}
          </h3>
        </BlurReveal>
        <BlurReveal delay={0.08 + 0.05 * (index % 3)} duration={0.6} inView>
          <ul className="mt-[1.3px] list-none pl-0 text-[21.88px] font-normal leading-[37.32px] tracking-[-0.2px] text-white/80 mix-blend-normal">
            <li>{getDescription(item)}</li>
          </ul>
        </BlurReveal>
      </div>
    </div>
    )
  }

  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <div>
      <ScaledContent height={920} scale={contentScale} width={layoutWidth}>
        <div className="flex h-full w-full flex-col items-start justify-center">
          <SectionTitleBlock abilityName={ability.name} align="left" summary={valueSummary} title="结果 & 价值" />
          <div
            className="mt-[72px] grid origin-top-left grid-cols-3"
            style={{ columnGap: resultValueGridColumnGap, rowGap: resultValueGridRowGap, transform: `scale(${resultValueGridScale})`, width: gridWidth }}
          >
            {orderedItems.map(({ item, label }, index) => renderCard(item, label, index))}
          </div>
        </div>
      </ScaledContent>
      </div>
    </div>
  )
}

export function AbilitySchemeOneLanding({
  ability,
  activeSection = 'understand',
  onSectionSelect,
}: {
  ability: Ability
  activeSection?: AbilitySectionKey
  onSectionSelect?: (section: AbilitySectionKey) => void
}) {
  const heroTitle = heroTitles[ability.id] ?? { lead: ability.shortName, suffix: '管理' }
  const isCarbonAccounting = ability.id === 'carbon-accounting'
  const heroDescriptionWidth = ability.id === 'esg' ? 1430 : 1222
  const { scale: viewportScale, width: viewportWidth } = useViewportFitScale()
  const safeWidthScale = Math.max(0.1, (viewportWidth - abilitySideSafeInset * 2) / designViewportWidth)
  const contentScale = Math.min(viewportScale, safeWidthScale)
  const heroActionLink = heroActionLinks[ability.id]
  void onSectionSelect
  
  const renderActiveSection = () => {
    if (activeSection === 'understand') {
      return (
      <section aria-label="能力简介" className={fullscreenSectionClassName} data-section="understand">
        <BlurRevealScope revealKey={activeSection === 'understand' ? `understand-${ability.id}` : undefined}>
        <div aria-label="首屏" className="ability-scheme-one-hero relative h-full overflow-hidden bg-[#030405]">
          <MagicRings
            active={activeSection === 'understand'}
            color={gradientStartColor}
            colorTwo={gradientEndColor}
            ringCount={6}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={false}
            mouseInfluence={0.2}
            hoverScale={1.2}
            parallax={0.05}
            clickBurst={false}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center text-center">
            <div
              style={{
                height: 559,
                transform: `scale(${contentScale})`,
                transformOrigin: 'center center',
                width: designViewportWidth,
              }}
              className="flex flex-col items-center justify-center"
            >
                <BlurReveal delay={0.12} duration={0.75}>
                  <h1 className="text-[104px] font-semibold leading-[1.5] text-white">
                    <span className={gradientTitleClassName}>
                      「{heroTitle.lead}」
                    </span>
                    {heroTitle.suffix ? <span className="text-white">{heroTitle.suffix}</span> : null}
                  </h1>
                </BlurReveal>
                <BlurReveal delay={0.24} duration={0.75}>
                  <p
                    className="mt-[52px] text-[31px] font-normal leading-[1.5] text-white"
                    style={{
                      width: heroDescriptionWidth,
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      display: '-webkit-box',
                      overflow: 'hidden',
                    }}
                  >
                    {abilityDescriptions[ability.id] ?? ability.description}
                  </p>
                </BlurReveal>
                <BlurReveal delay={0.36} duration={0.75}>
                  {isCarbonAccounting ? (
                    <div className="mt-[63px] flex items-center justify-center gap-5">
                      <Link className={heroOutlineActionClassName} to="/product-carbon-flow/step1">
                        <span className={heroOutlineActionInnerClassName}>
                          产品碳核算
                          <ArrowDown aria-hidden="true" className={heroActionIconClassName} />
                        </span>
                      </Link>
                      <Link className={heroOutlineActionClassName} to="/enterprise-carbon-dashboard">
                        <span className={heroOutlineActionInnerClassName}>
                          企业碳核算
                          <ArrowDown aria-hidden="true" className={heroActionIconClassName} />
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-[63px] flex items-center justify-center gap-5">
                      {heroActionLink ? (
                        <Link
                          className={heroOutlineActionClassName}
                          to={heroActionLink.to}
                        >
                          <span className={heroOutlineActionInnerClassName}>
                            {heroActionLink.label}
                            <ArrowDown aria-hidden="true" className={heroActionIconClassName} />
                          </span>
                      </Link>
                    ) : null}
                  </div>
                  )}
                </BlurReveal>
            </div>
          </div>
        </div>
        </BlurRevealScope>
      </section>
      )
    }

    if (!isCarbonAccounting && activeSection === 'scenario') {
      return (
        <section aria-label="解决问题&应用场景" className="relative z-10 min-h-screen snap-start overflow-hidden bg-[#030405]" data-section="scenario">
          <BlurRevealScope revealKey={activeSection === 'scenario' ? `scenario-${ability.id}` : undefined}>
            <AbilityProblemScenarioSection ability={ability} contentScale={contentScale} />
          </BlurRevealScope>
        </section>
      )
    }

    if (activeSection === 'mechanism') {
      return (
      <section
        aria-label="如何运转"
        className={fullscreenSectionClassName}
        data-section="mechanism"
      >
        <AbilityGridBackground />
        <div className={`relative z-10 h-full w-full ${tabSectionPaddingClassName}`}>
          <BlurRevealScope revealKey={activeSection === 'mechanism' ? `mechanism-${ability.id}` : undefined}>
            <MechanismSection ability={ability} contentScale={contentScale} />
          </BlurRevealScope>
        </div>
      </section>
      )
    }

    if (!isCarbonAccounting && activeSection === 'value') {
      return (
        <section aria-label="价值提供" className={fullscreenSectionClassName} data-section="value">
          <AbilityGridBackground />
          <div className={`relative z-10 h-full w-full ${tabSectionPaddingClassName}`}>
            <BlurRevealScope revealKey={activeSection === 'value' ? `value-${ability.id}` : undefined}>
              <ResultValueTitleBlock ability={ability} contentScale={contentScale} />
            </BlurRevealScope>
          </div>
        </section>
      )
    }

    return null
  }

  return renderActiveSection()
}
