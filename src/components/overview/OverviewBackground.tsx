import { LightRays } from '@/components/magicui/LightRays'
import { Spotlight } from '@/components/ui/spotlight-new'

const rings = [
  { size: 520, opacity: 0.18 },
  { size: 760, opacity: 0.14 },
  { size: 1020, opacity: 0.1 },
  { size: 1320, opacity: 0.07 },
  { size: 1680, opacity: 0.04 },
]

type OverviewBackgroundProps = {
  ringsActive?: boolean
  ringsPlayKey?: number
}

export function OverviewBackground(_: OverviewBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_50%_62%,#12161B_0%,#0F1216_42%,#0B0D10_100%)]">
      <div className="absolute left-1/2 top-[62%] h-[720px] w-[1040px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A2128] opacity-35 blur-[180px]" />
      <div
        className="pointer-events-none absolute left-1/2 top-[72%] h-[10%] w-[38%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(18,171,185,0.44)_0%,rgba(18,171,185,0.12)_42%,rgba(10,10,10,0)_100%)] opacity-[0.36] blur-[42px]"
        aria-hidden="true"
      />
      <Spotlight />
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays opacity-45"
      />
      {rings.map((ring) => (
        <div
          key={ring.size}
          className="absolute left-1/2 top-1/2 rounded-full border border-[#5F7A99]"
          style={{
            width: ring.size,
            height: ring.size,
            opacity: ring.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}
