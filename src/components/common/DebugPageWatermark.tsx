type DebugPageWatermarkProps = {
  label: string
}

export function DebugPageWatermark({ label }: DebugPageWatermarkProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-10 text-center">
      <div className="max-w-[80vw] select-none text-[clamp(40px,5vw,104px)] font-semibold tracking-normal text-current opacity-20">
        {label}
      </div>
    </div>
  )
}
