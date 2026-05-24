import { backgroundConfig } from './backgroundConfig'

export function GradientBlobs() {
  const gradient = backgroundConfig.gradientBlobs

  return (
    <div
      className="absolute"
      style={{
        position: gradient.position,
        inset: gradient.inset,
        zIndex: gradient.zIndex,
        opacity: gradient.opacity,
        pointerEvents: gradient.pointerEvents,
      }}
    >
      {gradient.blobs.map((blob) => (
        <div
          key={`${blob.color}-${blob.left}-${blob.top}`}
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: blob.left,
            top: blob.top,
            width: blob.width,
            height: blob.height,
            opacity: blob.opacity,
            transform: 'translate(-50%, -50%)',
            filter: `blur(${blob.blur})`,
            background: `radial-gradient(circle at 50% 50%, ${blob.color} 0%, rgba(10,10,10,0) 72%)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}
