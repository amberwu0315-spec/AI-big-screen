import type { Ability, AbilitySectionKey } from '@/data/abilities'
import { CarbonAccountingExperienceSection } from '@/components/ability/CarbonAccountingExperienceSection'
import problemScenarioPlaceholder from '@/assets/ability-problem-scenario-placeholder.png'
import { createImagePlaceholder } from '@/lib/assetPlaceholders'

const abilityDescriptions: Record<string, string> = {
  cbam: '面向欧盟碳边境调节机制（CBAM），针对钢铁、铝、水泥、化肥等管控品类，提供从工艺解构、排放核算到合规申报的全流程合规支持。系统内置动态对齐欧盟规则的核算模型与税额预演能力，赋能对欧出口企业实现高效常态化履约申报。',
  energy: '围绕企业电、热、燃料、蒸汽等多种能源介质，构建覆盖数据接入、实时监控、计量结算、运行优化与经济性分析的一体化能源管理体系。同步服务于碳盘查与产品碳足迹核算，让能源治理与碳管理共享同一数据底座。',
  'supply-chain': '构建全景式供应链碳排放图谱，赋能链主企业量化并穿透管理多级上游的真实碳排放数据，将范围三黑盒转化为清晰的管理抓手，驱动整条价值链的风险管控与协同降碳。',
  esg: '遵循 CDP、MSCI 等国际评级体系及各大交易所披露指引，构建“底层数据一次采集、多披露场景自动适配”的统一可持续数据底座，将宏大的 ESG 战略拆解为可落地的执行方案。',
  'carbon-assets': '面向碳配额、碳信用与履约缺口管理，统一资产账本、估值分析和交易策略，支撑更稳健的碳资产运营。',
  'carbon-accounting': '从产品、企业到供应链，构建不同层级，从活动数据归集、模型计算、报告输出到审核认证的一体化碳管理体系。',
}

const mechanismPlaceholders: Partial<Record<string, string>> = {
  cbam: createImagePlaceholder('CBAM 合规机制', { width: 1920, height: 1080 }),
  energy: createImagePlaceholder('能碳管理机制', { width: 1920, height: 1080 }),
  'supply-chain': createImagePlaceholder('供应链管理机制', { width: 1920, height: 1080 }),
  esg: createImagePlaceholder('ESG 管理机制', { width: 1920, height: 1080 }),
  'carbon-assets': createImagePlaceholder('碳资产管理机制', { width: 1920, height: 1080 }),
}

const resultValuePlaceholder = createImagePlaceholder('价值提供', { width: 1920, height: 1080 })

const schemeTwoSections: Array<{
  key: AbilitySectionKey
  label: string
  className: string
  children?: Array<{
    label: string
    className: string
  }>
}> = [
  {
    key: 'understand',
    label: '能力简介',
    className: 'h-[125vw]',
    children: [
      { label: '首屏', className: 'h-[56.25vw]' },
      { label: '解决问题&应用场景', className: 'h-[68.75vw]' },
    ],
  },
  { key: 'mechanism', label: '如何运转', className: 'h-[56.25vw] min-h-screen' },
  { key: 'value', label: '价值提供', className: 'h-[56.25vw] min-h-screen' },
]

function ContentBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[#0B0B0F]" />
  )
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] opacity-[0.08] mix-blend-screen"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '6px 6px' }}
    />
  )
}

function HeroSection({ ability }: { ability: Ability }) {
  return (
    <div className="relative flex h-full overflow-hidden bg-[#0B0B0F] text-center">
      <ContentBackground />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_42%,rgba(76,205,153,0.28),transparent_36%),radial-gradient(circle_at_70%_64%,rgba(85,207,255,0.16),transparent_32%)]" />
      <NoiseOverlay />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-[80px] font-semibold leading-[1.5] text-white">{ability.name}</h1>
        <p
          className="mt-10 w-[940px] max-w-[calc(100vw-160px)] text-[24px] font-normal leading-[1.5] text-[#898CA9]"
          style={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            display: '-webkit-box',
            overflow: 'hidden',
          }}
        >
          {abilityDescriptions[ability.id] ?? ability.description}
        </p>
      </div>
    </div>
  )
}

function ProblemScenarioSection() {
  return (
    <div className="relative h-full overflow-hidden">
      <ContentBackground />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none relative z-[1] block h-auto w-screen max-w-none select-none"
        draggable={false}
        src={problemScenarioPlaceholder}
      />
      <NoiseOverlay />
    </div>
  )
}

function ResultValueSection() {
  return (
    <div className="relative h-full overflow-hidden">
      <ContentBackground />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none relative z-[1] block h-auto w-screen max-w-none select-none"
        draggable={false}
        src={resultValuePlaceholder}
      />
      <NoiseOverlay />
    </div>
  )
}

function MechanismSection({ ability }: { ability: Ability }) {
  if (ability.id === 'carbon-accounting') {
    return (
      <div className="relative h-full overflow-hidden">
        <ContentBackground />
        <NoiseOverlay />
        <CarbonAccountingExperienceSection abilityName={ability.name} className="min-h-0 h-full" />
      </div>
    )
  }

  const placeholder = mechanismPlaceholders[ability.id]

  if (!placeholder) {
    return null
  }

  return (
    <div className="relative h-full overflow-hidden">
      <ContentBackground />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none relative z-[1] block h-auto w-screen max-w-none select-none"
        draggable={false}
        src={placeholder}
      />
      <NoiseOverlay />
    </div>
  )
}

export function AbilitySchemeTwoDraft({ ability }: { ability: Ability }) {
  return (
    <>
      {schemeTwoSections.map((section) => (
        <section
          key={section.key}
          aria-label={section.label}
          className={`relative z-10 snap-start ${section.className}`}
          data-section={section.key}
        >
          {section.children?.map((child, index) => (
            <div
              key={child.label}
              aria-label={child.label}
              className={child.className}
              data-scheme-two-subsection={section.key === 'understand' && index === 1 ? 'problem-scenario' : undefined}
            >
              {section.key === 'understand' && index === 0 ? <HeroSection ability={ability} /> : null}
              {section.key === 'understand' && index === 1 ? <ProblemScenarioSection /> : null}
            </div>
          ))}
          {section.key === 'mechanism' ? <MechanismSection ability={ability} /> : null}
          {section.key === 'value' ? <ResultValueSection /> : null}
        </section>
      ))}
    </>
  )
}
