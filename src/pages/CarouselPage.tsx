import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'
import { ScreenShell } from '@/components/common/ScreenShell'
import { AbilityNoiseBackground } from '@/components/ability/AbilityNoiseBackground'
import { TestimonialSlider } from '@/components/carousel/TestimonialSlider'
import cbamIcon from '@/assets/ability-icon-cbam.png'
import carbonAccountingIcon from '@/assets/ability-icon-carbon-accounting.png'
import carbonAssetsIcon from '@/assets/ability-icon-carbon-assets.png'
import energyIcon from '@/assets/ability-icon-energy.png'
import esgIcon from '@/assets/ability-icon-esg.png'
import supplyChainIcon from '@/assets/ability-icon-supply-chain.png'
import { overviewAbilities } from '@/data/abilities'

const abilityImages: Record<string, string> = {
  cbam: cbamIcon,
  energy: energyIcon,
  esg: esgIcon,
  'carbon-accounting': carbonAccountingIcon,
  'carbon-assets': carbonAssetsIcon,
  'supply-chain': supplyChainIcon,
}

const reviews = overviewAbilities.map((ability) => ({
  id: ability.id,
  name: ability.name,
  affiliation: '',
  quote: ability.description,
  imageSrc: abilityImages[ability.id],
  thumbnailSrc: abilityImages[ability.id],
}))

export function CarouselPage() {
  return (
    <PageTransition>
      <ScreenShell className="bg-[#0B0B0F]" contentClassName="relative px-0 py-0" variant="dark">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#131415]" />
        <AbilityNoiseBackground className="z-[1]" />
        <NavControl
          actionButtonClassName="!size-[clamp(48px,5.19vh,56px)] [&_svg]:!size-[clamp(24px,2.78vh,30px)]"
          actionsClassName="gap-[clamp(10px,0.93vh,12px)]"
          brandClassName="!h-[clamp(48px,5.19vh,56px)] [&_img]:!h-[clamp(28px,3.33vh,36px)]"
          brandVariant="dark"
          className="absolute z-[100] !h-[clamp(64px,9.26vh,100px)] !px-[clamp(16px,2.08vw,40px)] !py-[clamp(18px,2.78vh,30px)] w-full"
          ghostActions
          showBack={false}
        />
        <div className="relative z-10 flex h-screen w-full overflow-hidden items-center justify-center pt-[100px]">
          <TestimonialSlider className="bg-transparent text-white w-full" reviews={reviews} />
        </div>
      </ScreenShell>
    </PageTransition>
  )
}
