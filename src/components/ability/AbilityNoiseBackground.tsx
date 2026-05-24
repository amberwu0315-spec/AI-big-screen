import { NoiseTexture } from '@/components/ui/noise-texture'

export function AbilityNoiseBackground({ className = 'z-[1]' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <NoiseTexture className="absolute inset-0" />
    </div>
  )
}
