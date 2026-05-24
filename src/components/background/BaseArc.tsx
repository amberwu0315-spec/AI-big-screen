import { backgroundConfig } from './backgroundConfig'

export function BaseArc() {
  const { base } = backgroundConfig.baseArc
  const { layers } = backgroundConfig

  return (
    <>
      {/* Layer 1: bottom dark ellipse ambience; it no longer generates the visible arc highlight. */}
      {layers.base ? (
        <div
          className="absolute left-1/2 rounded-full"
          style={{
            position: base.position,
            top: base.top,
            left: base.left,
            width: base.width,
            height: base.height,
            transform: base.transform,
            borderRadius: base.borderRadius,
            background: base.background,
            opacity: base.opacity,
            boxShadow: base.boxShadow.join(', '),
            zIndex: base.zIndex,
          }}
        />
      ) : null}
    </>
  )
}
