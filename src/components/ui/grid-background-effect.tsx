import { cn } from '@/lib/utils'
import { NoiseTexture } from '@/components/ui/noise-texture'

const backgroundClassName = 'bg-white'
const gridBackgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='%23D9D2C4' stroke-opacity='0.34'/%3E%3C/svg%3E")`
const dotBackgroundImage = `radial-gradient(circle, rgba(86, 78, 66, 0.18) 0 1px, transparent 1.35px)`

export function GridBackgroundEffect() {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', backgroundClassName)}>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: gridBackgroundImage }}
      />
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: dotBackgroundImage,
          backgroundPosition: '20px 20px',
          backgroundSize: '40px 40px',
        }}
      />
      <NoiseTexture
        className="opacity-[0.18] mix-blend-multiply"
        frequency={0.72}
        noiseOpacity={0.42}
        octaves={4}
        slope={0.2}
      />
    </div>
  )
}
