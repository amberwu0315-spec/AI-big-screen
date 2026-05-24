import { backgroundConfig } from './backgroundConfig'

export function ArcPath() {
  const arc = backgroundConfig.arcPath

  return (
    <svg
      className={arc.className}
      viewBox={arc.viewBox}
      preserveAspectRatio={arc.preserveAspectRatio}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={arc.arcHaloFilter.id}
          x={arc.arcHaloFilter.x}
          y={arc.arcHaloFilter.y}
          width={arc.arcHaloFilter.width}
          height={arc.arcHaloFilter.height}
        >
          <feGaussianBlur stdDeviation={arc.arcHaloFilter.stdDeviation} result={arc.arcHaloFilter.result} />
          <feMerge>
            <feMergeNode in={arc.arcHaloFilter.result} />
          </feMerge>
        </filter>

        <linearGradient
          id={arc.arcHaloGradient.id}
          x1={arc.arcHaloGradient.x1}
          y1={arc.arcHaloGradient.y1}
          x2={arc.arcHaloGradient.x2}
          y2={arc.arcHaloGradient.y2}
        >
          {arc.arcHaloGradient.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.stopColor} />
          ))}
        </linearGradient>

        <filter
          id={arc.arcSoftFilter.id}
          x={arc.arcSoftFilter.x}
          y={arc.arcSoftFilter.y}
          width={arc.arcSoftFilter.width}
          height={arc.arcSoftFilter.height}
        >
          <feGaussianBlur stdDeviation={arc.arcSoftFilter.stdDeviation} result={arc.arcSoftFilter.result} />
          <feMerge>
            <feMergeNode in={arc.arcSoftFilter.result} />
          </feMerge>
        </filter>

        <linearGradient
          id={arc.arcSoftGradient.id}
          x1={arc.arcSoftGradient.x1}
          y1={arc.arcSoftGradient.y1}
          x2={arc.arcSoftGradient.x2}
          y2={arc.arcSoftGradient.y2}
        >
          {arc.arcSoftGradient.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.stopColor} />
          ))}
        </linearGradient>

        <filter id={arc.filterId} x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation={arc.glowBlur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={arc.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {arc.gradientStops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.stopColor} />
          ))}
        </linearGradient>
      </defs>

      <path
        d={arc.arcHaloPath.d}
        fill={arc.arcHaloPath.fill}
        stroke={`url(#${arc.arcHaloGradient.id})`}
        strokeWidth={arc.arcHaloPath.strokeWidth}
        filter={`url(#${arc.arcHaloFilter.id})`}
        strokeLinecap={arc.arcHaloPath.strokeLinecap}
        opacity={arc.arcHaloPath.opacity}
      />

      <path
        d={arc.arcSoftPath.d}
        fill={arc.arcSoftPath.fill}
        stroke={`url(#${arc.arcSoftGradient.id})`}
        strokeWidth={arc.arcSoftPath.strokeWidth}
        filter={`url(#${arc.arcSoftFilter.id})`}
        strokeLinecap={arc.arcSoftPath.strokeLinecap}
        opacity={arc.arcSoftPath.opacity}
      />

      <path
        d={arc.primaryPath}
        fill="none"
        stroke={`url(#${arc.gradientId})`}
        strokeWidth={arc.primaryStrokeWidth}
        filter={`url(#${arc.filterId})`}
        strokeLinecap="round"
      />
    </svg>
  )
}
