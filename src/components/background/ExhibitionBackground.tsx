import { motion } from 'framer-motion'

import { ArcPath } from './ArcPath'
import { BaseArc } from './BaseArc'
import { backgroundConfig } from './backgroundConfig'
import { GradientBlobs } from './GradientBlobs'
import { WhiteParticles } from './WhiteParticles'

export function ExhibitionBackground() {
  const {
    colors,
    layers,
    radial,
    centerHorizonGlow,
    centerArcBloom,
    centerUpGlow,
    particles,
    blur,
    linear,
    fade,
  } = backgroundConfig

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: backgroundConfig.root.appearDuration,
        ease: 'easeOut',
      }}
      style={{ backgroundColor: colors.base }}
      aria-hidden="true"
    >
      {/* Base + Elipse: bottom arc body and its thin glowing horizon edge. */}
      <BaseArc />

      {/* Layer 3: soft horizontal light band above the bottom arc. */}
      {layers.radial ? (
        <div
          className="absolute"
          style={{
            position: radial.position,
            left: radial.left,
            top: radial.top,
            width: radial.width,
            height: radial.height,
            opacity: radial.opacity,
            filter: radial.filter,
            background: radial.background,
            zIndex: radial.zIndex,
          }}
        />
      ) : null}

      {/* CenterHorizonGlow: broad white lift behind the arc center. */}
      {layers.centerHorizonGlow ? (
        <div
          className="absolute"
          style={{
            position: centerHorizonGlow.position,
            left: centerHorizonGlow.left,
            top: centerHorizonGlow.top,
            width: centerHorizonGlow.width,
            height: centerHorizonGlow.height,
            transform: centerHorizonGlow.transform,
            zIndex: centerHorizonGlow.zIndex,
            opacity: centerHorizonGlow.opacity,
            pointerEvents: centerHorizonGlow.pointerEvents,
            background: centerHorizonGlow.background,
            filter: centerHorizonGlow.filter,
          }}
        />
      ) : null}

      {/* CenterArcBloom: tighter bloom directly under the SVG arc center. */}
      {layers.centerArcBloom ? (
        <div
          className="absolute"
          style={{
            position: centerArcBloom.position,
            left: centerArcBloom.left,
            top: centerArcBloom.top,
            width: centerArcBloom.width,
            height: centerArcBloom.height,
            transform: centerArcBloom.transform,
            zIndex: centerArcBloom.zIndex,
            opacity: centerArcBloom.opacity,
            pointerEvents: centerArcBloom.pointerEvents,
            background: centerArcBloom.background,
            filter: centerArcBloom.filter,
          }}
        />
      ) : null}

      {/* CenterUpGlow: weak upward white lift at the arc center, separate from the full-arc SVG halo. */}
      {layers.centerUpGlow ? (
        <div
          className="absolute"
          style={{
            position: centerUpGlow.position,
            left: centerUpGlow.left,
            top: centerUpGlow.top,
            width: centerUpGlow.width,
            height: centerUpGlow.height,
            transform: centerUpGlow.transform,
            zIndex: centerUpGlow.zIndex,
            opacity: centerUpGlow.opacity,
            pointerEvents: centerUpGlow.pointerEvents,
            background: centerUpGlow.background,
            filter: centerUpGlow.filter,
          }}
        />
      ) : null}

      {/* Layer 4: explicit SVG path arc. The horizon shape is controlled by path data, not ellipse clipping. */}
      {layers.arcPath ? <ArcPath /> : null}

      {/* Layer 4: five very soft blue/green/purple atmosphere blobs. */}
      {layers.gradient ? <GradientBlobs /> : null}

      {/* Layer 5: weak white data particles limited to the upper 73.5% of the canvas. */}
      {layers.particles ? (
        <div
          className="absolute"
          style={{
            position: particles.position,
            left: particles.left,
            top: particles.top,
            width: particles.width,
            height: particles.height,
            zIndex: particles.zIndex,
            opacity: particles.opacity,
            pointerEvents: particles.pointerEvents,
          }}
        >
          <WhiteParticles />
        </div>
      ) : null}

      {/* Layer 6: upper softening and dark falloff; background color is the fallback if blur is unsupported. */}
      {layers.blur ? (
        <div
          className="absolute"
          style={{
            position: blur.position,
            left: blur.left,
            top: blur.top,
            width: blur.width,
            height: blur.height,
            zIndex: blur.zIndex,
            opacity: blur.opacity,
            pointerEvents: blur.pointerEvents,
            WebkitBackdropFilter: blur.WebkitBackdropFilter,
            backdropFilter: blur.backdropFilter,
            background: blur.background,
          }}
        />
      ) : null}

      {/* Layer 7: top dark mask that keeps the upper edge quiet. */}
      {layers.linear ? (
        <div
          className="absolute left-0 top-0 w-full"
          style={{
            position: linear.position,
            top: linear.top,
            left: linear.left,
            width: linear.width,
            height: linear.height,
            opacity: linear.opacity,
            background: linear.background,
            zIndex: linear.zIndex,
          }}
        />
      ) : null}

      {/* Layer 8: left and right fades to focus attention toward the center. */}
      {layers.fade ? (
        <div
          className="absolute"
          style={{
            position: fade.position,
            top: fade.top,
            left: fade.left,
            width: fade.width,
            height: fade.height,
            zIndex: fade.zIndex,
          }}
        >
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              position: fade.leftLayer.position,
              left: fade.leftLayer.left,
              top: fade.leftLayer.top,
              width: fade.leftLayer.width,
              height: fade.leftLayer.height,
              background: fade.leftLayer.background,
            }}
          />
          <div
            className="absolute right-0 top-0 h-full"
            style={{
              position: fade.rightLayer.position,
              right: fade.rightLayer.right,
              top: fade.rightLayer.top,
              width: fade.rightLayer.width,
              height: fade.rightLayer.height,
              background: fade.rightLayer.background,
            }}
          />
        </div>
      ) : null}
    </motion.div>
  )
}
