import { motion } from 'framer-motion'

type CardScanOverlayProps = {
  color?: string
  delay?: number
  duration?: number
  lineColor?: string
}

function hexToRgb(hex: string) {
  const normalizedHex = hex.replace('#', '')
  const value = Number.parseInt(normalizedHex, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)

  return `rgba(${r},${g},${b},${alpha})`
}

export function CardScanOverlay({ color = '#54E8FF', delay = 0, duration = 5, lineColor = color }: CardScanOverlayProps) {
  const scanLineColor = lineColor

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[28px]">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${rgba(color, 0.05)} 0%, ${rgba(color, 0.02)} 100%)` }}
      />

      <motion.div
        animate={{ y: ['-110%', '110%'] }}
        className="absolute left-0 right-0 h-[52%]"
        style={{
          background: `linear-gradient(180deg, ${rgba(scanLineColor, 0)} 0%, ${rgba(scanLineColor, 0.1)} 42%, ${rgba(scanLineColor, 0.3)} 100%)`,
        }}
        transition={{ delay, duration, ease: 'linear', repeat: Infinity }}
      />

      <motion.div
        animate={{ y: ['-110%', '110%'] }}
        className="absolute left-0 right-0 h-[52%]"
        style={{
          background: `linear-gradient(180deg, ${rgba(color, 0)} calc(100% - 6px), ${scanLineColor} calc(100% - 2px), ${scanLineColor} 100%)`,
        }}
        transition={{ delay, duration, ease: 'linear', repeat: Infinity }}
      />

      <div className="absolute left-0 top-0 h-[48px] w-[48px] rounded-tl-[28px] border-l-[6px] border-t-[6px]" style={{ borderColor: color }} />
      <div className="absolute right-0 top-0 h-[48px] w-[48px] rounded-tr-[28px] border-r-[6px] border-t-[6px]" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 h-[48px] w-[48px] rounded-bl-[28px] border-b-[6px] border-l-[6px]" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 h-[48px] w-[48px] rounded-br-[28px] border-b-[6px] border-r-[6px]" style={{ borderColor: color }} />
    </div>
  )
}
