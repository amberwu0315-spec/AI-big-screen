import AnimatedBeamDemo from '@/components/animated-beam-demo'
import { BlurReveal } from '@/components/magicui/BlurReveal'
import { RainbowButton } from '@/registry/magicui/rainbow-button'
import { ArrowDown, BellIcon, Share2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { AbilityGridBackground } from './AbilityGridBackground'
import { AnimatedNodesCarousel } from './AnimatedNodesCarousel'
import { ScaledContent, SectionTitleBlock } from './AbilitySchemeOneLanding'
const experienceEntryFeatures = [
  {
    Icon: Share2Icon,
    name: '产品碳核算',
    description: '对产品全生命周期碳足迹进行识别、建模与核算，输出可追溯的产品级排放结果，支撑产品低碳设计、绿色采购与碳标识申请。',
    cta: '立即体验，查看完整流程',
    href: '/product-carbon-flow/step1',
    background: (
      <AnimatedBeamDemo className="absolute inset-0 h-full min-h-0 origin-center -translate-y-[20px] items-end border-none" />
    ),
  },
  {
    Icon: BellIcon,
    name: '企业碳核算',
    description: '对企业范围一、范围二及范围三排放进行系统化核算，输出可被第三方核查的组织级温室气体盘查结果，支持企业碳数据披露、减排目标设定与对外报告。',
    cta: '查看示例',
    href: '/enterprise-carbon-dashboard',
    background: (
      <AnimatedNodesCarousel className="absolute inset-0 h-full min-h-0 translate-y-[45px] border-none" />
    ),
  },
]

export const LinkifyHeroGridBackground = AbilityGridBackground

function ExperienceEntryCard({
  background,
  cta,
  description,
  href,
  Icon: _Icon,
  name,
}: (typeof experienceEntryFeatures)[number]) {
  return (
    <div
      className={cn(
        'relative grid h-[620px] w-[640px] min-h-0 grid-rows-[minmax(0,0.9fr)_minmax(0,1.1fr)] overflow-hidden rounded-[18px] bg-transparent px-[48px] pt-[10px] pb-[70px]',
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      <div className="relative min-h-0 overflow-visible">
        {background}
      </div>
      <div className="relative z-10 flex min-h-0 min-w-0 flex-col justify-end gap-[13px]">
        <h3 className="text-[30px] font-semibold leading-tight text-white">{name}</h3>
        <p className="min-h-[76px] max-w-full break-words text-[18px] leading-[1.38] text-neutral-400">{description}</p>
        <RainbowButton asChild className="mt-[12px] h-auto w-fit self-start px-[18px] py-[10px] text-[16px]">
          <Link state={{ entryTransition: 'slide-up' }} to={href}>
            <span>{cta}</span>
            <ArrowDown className="ml-1 size-[1em]" />
          </Link>
        </RainbowButton>
      </div>
    </div>
  )
}

export function ExperienceEntryCards() {
  return (
    <BlurReveal className="relative z-10 w-full" delay={0.28} duration={0.72} inView>
      <div className="flex w-full justify-center gap-[54px] text-left">
        {experienceEntryFeatures.map((feature, index) => (
          <ExperienceEntryCard {...feature} key={index} />
        ))}
      </div>
    </BlurReveal>
  )
}

export function CarbonAccountingExperienceSection({
  abilityName,
  className,
  contentScale = 1,
  summary = '围绕企业与产品两类核心核算场景，沉淀可审计、可追溯、可复用的碳数据结果。',
  showBackground = true,
  title = '如何运行',
}: {
  abilityName: string
  className?: string
  contentScale?: number
  summary?: string
  showBackground?: boolean
  title?: string
}) {
  return (
    <div
      className={cn('relative z-20 flex h-full w-full items-center justify-center text-center text-white', className)}
      data-carbon-accounting-experience
    >
      {showBackground ? <LinkifyHeroGridBackground /> : null}
      <ScaledContent height={720} scale={contentScale} width={1920}>
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <SectionTitleBlock
            abilityName={abilityName}
            summary={summary}
            title={title}
          />
          <div className="mt-[60px] flex w-full flex-1 justify-center px-20">
            <ExperienceEntryCards />
          </div>
        </div>
      </ScaledContent>
    </div>
  )
}
