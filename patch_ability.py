import re

with open("src/components/ability/AbilitySchemeOneLanding.tsx", "r") as f:
    content = f.read()

# Replace lucide imports
content = re.sub(
    r"import \{ ArrowDown, CircleDot \} from 'lucide-react'",
    "import { ArrowDown, CircleDot, Gauge, PlugZap, ScanSearch, SlidersHorizontal, Search, FileCog, FileCheck, ShieldCheck, BookOpen, Users, BarChart, FileArchive, UserPlus, ListTodo, Calculator, ShieldAlert, Wallet, LineChart, ArrowRightLeft, Pickaxe } from 'lucide-react'",
    content
)

# Replace the chunk from 'type CbamMechanismFrameContent' to 'function MechanismSection'
# Find start
start_str = "type CbamMechanismFrameContent = {"
end_str = "type ScenarioGroupKey = 'problems' | 'scenarios'"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx == -1 or end_idx == -1:
    print(f"Could not find indices: start={start_idx}, end={end_idx}")
    exit(1)

unified_code = """
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

"""

new_content = content[:start_idx] + unified_code + content[end_idx:]

with open("src/components/ability/AbilitySchemeOneLanding.tsx", "w") as f:
    f.write(new_content)

print("Patch applied successfully.")
