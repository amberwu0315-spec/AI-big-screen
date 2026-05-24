type RippleProps = {
  circleCount?: number
  duration?: number
}

export function Ripple({ circleCount = 3, duration = 1.45 }: RippleProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex size-[1120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible">
      {Array.from({ length: circleCount }).map((_, index) => (
        <span
          key={index}
          className="absolute aspect-square w-56 rounded-full bg-[radial-gradient(circle,rgba(165,243,252,0.18)_0%,rgba(165,243,252,0.09)_46%,rgba(165,243,252,0)_72%)] opacity-0 ring-1 ring-cyan-100/15 [animation-name:ai-center-ripple] [animation-timing-function:ease-out] [animation-fill-mode:forwards]"
          style={{
            animationDelay: `${index * 0.18}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  )
}
