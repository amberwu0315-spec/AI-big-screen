import { useEffect } from 'react'
import { ArrowDown, GalleryHorizontalEnd } from 'lucide-react'
import { Link } from 'react-router-dom'

import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'
import { ScreenShell } from '@/components/common/ScreenShell'
import Galaxy from '@/components/magicui/Galaxy'
import { SchemeThreeAbilityEntries } from '@/components/overview/SchemeThreeAbilityEntries'
import { Button } from '@/components/ui/button'
import { GradientButton } from '@/components/magicui/GradientButton'
import overviewPageBackground from '@/assets/overview-page-background.png'

function preloadAbilityRoutes() {
  void import('@/pages/CarouselPage')
  void import('@/pages/AbilitySectionPage')
  void import('@/pages/CarbonAccountingMechanismPage')
}

function OverviewSchemeThreeWithParticles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        backgroundColor: '#020707',
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src={overviewPageBackground}
      />
      <Galaxy
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: 'screen' }}
        autoCenterRepulsion={0}
        density={1}
        glowIntensity={0.3}
        hueShift={140}
        mouseInteraction
        mouseRepulsion
        particleOpacity={1}
        repulsionStrength={2}
        rotationSpeed={-0.225}
        saturation={0}
        speed={0.25}
        starAmount={0.5}
        starSizeScale={0.7}
        starSpeed={2.8}
        twinkleIntensity={0.3}
      />
    </div>
  )
}

type OverviewSchemeThreeForegroundProps = {
  centerGradient?: 'brand' | 'white'
  centerLogoScale?: number
  centerScale?: number
  connectionVariant?: 'diagonal' | 'rightAngleShort'
  showTextureRings?: boolean
}

function OverviewSchemeThreeForeground({
  centerGradient = 'brand',
  centerLogoScale = 1,
  centerScale = 1,
  connectionVariant = 'rightAngleShort',
  showTextureRings = true,
}: OverviewSchemeThreeForegroundProps) {
  return (
    <>
      {showTextureRings ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] aspect-square max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{ width: 'calc(max(125.3125vw, 222.87vh) * 0.975)' }}
        >
          {[0.109, 0.247, 0.385, 0.523, 0.66, 0.798, 0.935].map((scale) => (
            <span
              key={scale}
              className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                border: '2px solid rgba(255,255,255,0.04)',
                height: `${scale * 100}%`,
                width: `${scale * 100}%`,
              }}
            />
          ))}
        </div>
      ) : null}
      <SchemeThreeAbilityEntries
        centerGradient={centerGradient}
        centerLogoScale={centerLogoScale}
        centerScale={centerScale}
        leftTopConnectionVariant={connectionVariant}
      />
      <Link
        className="absolute bottom-[clamp(46px,8.33vh,90px)] left-1/2 z-40 -translate-x-1/2"
        to="/company-carbon-dashboard"
      >
        <GradientButton
          bgColor="#000"
          blur={0}
          borderRadius={12}
          borderWidth={3}
          className="min-h-[clamp(40px,5.33vh,64px)] min-w-[clamp(112px,11.67vw,224px)] text-[clamp(14px,1.67vh,20px)] font-medium text-white"
          colors={['#00D084', '#19F2C5', '#00C6FB', '#1677FF', '#6EE7F9', '#34D399', '#A3E635', '#00D084']}
        >
          <span className="inline-flex items-center gap-[clamp(8px,0.93vh,12px)]">
            配置驾驶舱
            <ArrowDown className="size-[clamp(16px,1.85vh,22px)]" />
          </span>
        </GradientButton>
      </Link>
    </>
  )
}

export function OverviewPage() {
  useEffect(() => {
    const timeoutId = window.setTimeout(preloadAbilityRoutes, 600)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <PageTransition>
      <ScreenShell className="bg-[#020707]" contentClassName="relative" variant="dark">
        <NavControl
          actions={(
            <Button
              asChild
              aria-label="自动轮播"
              className="!size-[clamp(48px,5.19vh,56px)] text-white/80 hover:bg-white/10 hover:text-white [&_svg]:!size-[clamp(24px,2.78vh,30px)]"
              size="icon-lg"
              title="自动轮播"
              variant="ghost"
            >
              <Link to="/carousel">
                <GalleryHorizontalEnd />
              </Link>
            </Button>
          )}
          actionsClassName="gap-[clamp(10px,0.93vh,12px)]"
          brandClassName="!h-[clamp(48px,5.19vh,56px)] [&_img]:!h-[clamp(28px,3.33vh,36px)]"
          brandVariant="dark"
          actionButtonClassName="!size-[clamp(48px,5.19vh,56px)] [&_svg]:!size-[clamp(24px,2.78vh,30px)]"
          className="absolute z-[100] !h-[clamp(64px,9.26vh,100px)] !px-[clamp(16px,2.08vw,40px)] !py-[clamp(18px,2.78vh,30px)] w-full"
          ghostActions
          showBack={false}
          showHome={false}
        />

        <div className="absolute inset-0">
          <OverviewSchemeThreeWithParticles />
          <OverviewSchemeThreeForeground
            centerGradient="brand"
            centerLogoScale={1.1}
            centerScale={1.2}
            showTextureRings
          />
        </div>
      </ScreenShell>
    </PageTransition>
  )
}
