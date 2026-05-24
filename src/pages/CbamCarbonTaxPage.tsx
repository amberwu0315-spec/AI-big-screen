import { CBAMTaxEstimator } from '@/components/cbam/tax-estimator'
import { NavControl } from '@/components/common/NavControl'
import { PageTransition } from '@/components/common/PageTransition'

export function CbamCarbonTaxPage() {
  return (
    <PageTransition variant="slide-up">
      <main className="relative h-screen max-h-screen overflow-y-auto bg-[#F7F8FA] px-8 pb-16 pt-[112px] supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          style={{ backgroundColor: '#F7F8FA' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #9AA8BF 0 2px, transparent 2.7px)',
              backgroundSize: '22px 22px',
              opacity: 0.1,
            }}
          />
        </div>
        <NavControl
          actionButtonClassName="!size-[clamp(32px,5vh,54px)] border-0 bg-transparent text-[#0F172A] shadow-none hover:bg-[#0F172A]/8 hover:text-[#0F172A] [&_svg]:!size-[clamp(18px,2.78vh,30px)]"
          actionsClassName="gap-[clamp(6px,0.74vh,8px)]"
          backTo="/ability/cbam/understand"
          brandClassName="!h-[clamp(28px,3.33vh,36px)] [&_img]:!h-[clamp(28px,3.33vh,36px)]"
          brandVariant="light"
          className="!h-[clamp(64px,9.26vh,100px)] !px-[clamp(16px,2.08vw,40px)] !py-[clamp(18px,2.78vh,30px)]"
          ghostActions
          showHome={false}
        />
        <div className="relative z-10">
          <CBAMTaxEstimator />
        </div>
      </main>
    </PageTransition>
  )
}
