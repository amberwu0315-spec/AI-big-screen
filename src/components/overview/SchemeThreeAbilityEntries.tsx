import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { SpinningText } from '@/components/magicui/SpinningText'
import schemeThreeCenterLogo from '@/assets/scheme-three-center-logo.svg'
import schemeThreeAbilityTempIcon from '@/assets/scheme-three-ability-temp-icon.svg'
import cbamIcon from '@/assets/ability-icon-cbam.png'
import carbonAccountingIcon from '@/assets/ability-icon-carbon-accounting.png'
import carbonAssetsIcon from '@/assets/ability-icon-carbon-assets.png'
import energyIcon from '@/assets/ability-icon-energy.png'
import esgIcon from '@/assets/ability-icon-esg.png'
import supplyChainIcon from '@/assets/ability-icon-supply-chain.png'
import { overviewAbilities } from '@/data/abilities'

function preloadAbilityRoute(abilityId: string | undefined) {
  if (!abilityId) return

  if (abilityId === 'carbon-accounting') {
    void import('@/pages/CarbonAccountingMechanismPage')
    return
  }

  void import('@/pages/AbilitySectionPage')
}

type AbilityEntryPosition = {
  size: 'large' | 'small'
  sizePx: number
  x: number
  y: number
}

type SchemeThreeAbilityEntriesProps = {
  centerGradient?: 'brand' | 'white'
  centerLogoScale?: number
  centerScale?: number
  leftTopConnectionVariant?: 'diagonal' | 'rightAngleShort'
}

const baseWidth = 1920
const baseHeight = 1080
const centerX = baseWidth / 2
const centerY = baseHeight / 2
const centerBorderSize = 200
const centerLogoWidth = 121
const centerLogoHeight = 108.4
const centerSpinningTextSize = 230
const centerSpinningTextRadius = 108
const centerConnectionRadius = centerSpinningTextSize / 2

const schemeThreeSpinningText = Array.from({ length: 6 }, () => 'CYACLE').join(' • ') + ' •'

const abilityEntryIcons: Record<string, string> = {
  cbam: cbamIcon,
  energy: energyIcon,
  esg: esgIcon,
  'carbon-accounting': carbonAccountingIcon,
  'carbon-assets': carbonAssetsIcon,
  'supply-chain': supplyChainIcon,
}

const abilityEntryLightColor = '#FFFFFF'
const abilityEntryCoreGlowColor = 'rgba(255, 255, 255, 0.16)'
const abilityEntryOuterGlowColor = 'rgba(255, 255, 255, 0.06)'

const abilityEntryIconScale: Record<string, number> = {
  cbam: 0.95,
  'carbon-assets': 1.05,
  esg: 0.95,
}

const leftEntries: AbilityEntryPosition[] = [
  { size: 'large', sizePx: 160, x: 339.07, y: 183.21 },
  { size: 'large', sizePx: 160, x: 172.38, y: 458.88 },
  { size: 'large', sizePx: 160, x: 339.07, y: 731.79 },
]

const entries = [
  ...leftEntries,
  ...leftEntries.map((entry) => ({
    ...entry,
    x: baseWidth - entry.x - entry.sizePx,
  })),
]

const leftMiddleEntry = leftEntries[1]
const leftMiddleConnectionLine = {
  endX: centerX - centerConnectionRadius,
  startX: leftMiddleEntry.x + leftMiddleEntry.sizePx + 20,
  y: leftMiddleEntry.y + leftMiddleEntry.sizePx / 2,
}
const rightMiddleConnectionLine = {
  endX: baseWidth - leftMiddleConnectionLine.endX,
  startX: baseWidth - leftMiddleConnectionLine.startX,
  y: leftMiddleConnectionLine.y,
}
const leftTopEntry = leftEntries[0]
const leftTopHorizontalLength = 60
const schemeTwoLeftTopScale = 1.5
const schemeTwoLeftTopHorizontalLength = leftTopHorizontalLength * 2 * schemeTwoLeftTopScale
const schemeTwoLeftTopTerminalHorizontalLength = schemeTwoLeftTopHorizontalLength - 30
const schemeTwoLeftTopVerticalLength = (leftTopHorizontalLength * 2 + 20) * schemeTwoLeftTopScale + 30
const schemeTwoLeftTopCornerRadius = 30 * schemeTwoLeftTopScale
const leftTopConnectionAngle = 83 * (Math.PI / 180)
const leftTopConnectionLandingOffset = 20
const leftTopPreviousHorizontalLength = 100
const leftTopConnectionLine = {
  bendX: leftTopEntry.x + leftTopEntry.sizePx + leftTopHorizontalLength,
  endY: leftMiddleConnectionLine.y,
  startX: leftTopEntry.x + leftTopEntry.sizePx + 20,
  startY: leftTopEntry.y + leftTopEntry.sizePx / 2,
}
const leftTopConnectionEndX = leftTopEntry.x + leftTopEntry.sizePx + leftTopPreviousHorizontalLength
  + (leftTopConnectionLine.endY - leftTopConnectionLine.startY) / Math.tan(leftTopConnectionAngle)
  + leftTopConnectionLandingOffset
const leftTopConnectionPath = [
  `M ${leftTopConnectionLine.startX} ${leftTopConnectionLine.startY}`,
  `H ${leftTopConnectionLine.bendX}`,
  `L ${leftTopConnectionEndX} ${leftTopConnectionLine.endY}`,
].join(' ')
const schemeTwoLeftTopConnectionLine = {
  bendX: leftTopEntry.x + leftTopEntry.sizePx + schemeTwoLeftTopHorizontalLength,
  endX: leftTopEntry.x + leftTopEntry.sizePx + schemeTwoLeftTopHorizontalLength + schemeTwoLeftTopTerminalHorizontalLength,
  endY: leftTopConnectionLine.startY + schemeTwoLeftTopVerticalLength,
  startX: leftTopConnectionLine.startX,
  startY: leftTopConnectionLine.startY,
}
const schemeTwoLeftTopConnectionPath = [
  `M ${schemeTwoLeftTopConnectionLine.startX} ${schemeTwoLeftTopConnectionLine.startY}`,
  `H ${schemeTwoLeftTopConnectionLine.bendX - schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoLeftTopConnectionLine.bendX} ${schemeTwoLeftTopConnectionLine.startY} ${schemeTwoLeftTopConnectionLine.bendX} ${schemeTwoLeftTopConnectionLine.startY + schemeTwoLeftTopCornerRadius}`,
  `V ${schemeTwoLeftTopConnectionLine.endY - schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoLeftTopConnectionLine.bendX} ${schemeTwoLeftTopConnectionLine.endY} ${schemeTwoLeftTopConnectionLine.bendX + schemeTwoLeftTopCornerRadius} ${schemeTwoLeftTopConnectionLine.endY}`,
  `H ${schemeTwoLeftTopConnectionLine.endX}`,
].join(' ')
const leftBottomEntry = leftEntries[2]
const leftBottomConnectionLine = {
  bendX: leftBottomEntry.x + leftBottomEntry.sizePx + leftTopHorizontalLength,
  endX: leftTopConnectionEndX + 80,
  endY: leftMiddleConnectionLine.y,
  startX: leftBottomEntry.x + leftBottomEntry.sizePx + 20,
  startY: leftBottomEntry.y + leftBottomEntry.sizePx / 2,
}
const leftBottomConnectionPath = [
  `M ${leftBottomConnectionLine.startX} ${leftBottomConnectionLine.startY}`,
  `H ${leftBottomConnectionLine.bendX}`,
  `L ${leftBottomConnectionLine.endX} ${leftBottomConnectionLine.endY}`,
].join(' ')
const schemeTwoLeftBottomConnectionLine = {
  bendX: leftBottomEntry.x + leftBottomEntry.sizePx + schemeTwoLeftTopHorizontalLength,
  endX: leftBottomEntry.x + leftBottomEntry.sizePx + schemeTwoLeftTopHorizontalLength + schemeTwoLeftTopTerminalHorizontalLength,
  endY: leftBottomConnectionLine.startY - schemeTwoLeftTopVerticalLength,
  startX: leftBottomConnectionLine.startX,
  startY: leftBottomConnectionLine.startY,
}
const schemeTwoLeftBottomConnectionPath = [
  `M ${schemeTwoLeftBottomConnectionLine.startX} ${schemeTwoLeftBottomConnectionLine.startY}`,
  `H ${schemeTwoLeftBottomConnectionLine.bendX - schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoLeftBottomConnectionLine.bendX} ${schemeTwoLeftBottomConnectionLine.startY} ${schemeTwoLeftBottomConnectionLine.bendX} ${schemeTwoLeftBottomConnectionLine.startY - schemeTwoLeftTopCornerRadius}`,
  `V ${schemeTwoLeftBottomConnectionLine.endY + schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoLeftBottomConnectionLine.bendX} ${schemeTwoLeftBottomConnectionLine.endY} ${schemeTwoLeftBottomConnectionLine.bendX + schemeTwoLeftTopCornerRadius} ${schemeTwoLeftBottomConnectionLine.endY}`,
  `H ${schemeTwoLeftBottomConnectionLine.endX}`,
].join(' ')
const rightBottomConnectionLine = {
  bendX: baseWidth - leftBottomConnectionLine.bendX,
  endX: baseWidth - leftBottomConnectionLine.endX,
  endY: leftBottomConnectionLine.endY,
  startX: baseWidth - leftBottomConnectionLine.startX,
  startY: leftBottomConnectionLine.startY,
}
const rightBottomConnectionPath = [
  `M ${rightBottomConnectionLine.startX} ${rightBottomConnectionLine.startY}`,
  `H ${rightBottomConnectionLine.bendX}`,
  `L ${rightBottomConnectionLine.endX} ${rightBottomConnectionLine.endY}`,
].join(' ')
const rightTopConnectionLine = {
  bendX: baseWidth - leftTopConnectionLine.bendX,
  endX: baseWidth - leftTopConnectionEndX,
  endY: leftTopConnectionLine.endY,
  startX: baseWidth - leftTopConnectionLine.startX,
  startY: leftTopConnectionLine.startY,
}
const rightTopConnectionPath = [
  `M ${rightTopConnectionLine.startX} ${rightTopConnectionLine.startY}`,
  `H ${rightTopConnectionLine.bendX}`,
  `L ${rightTopConnectionLine.endX} ${rightTopConnectionLine.endY}`,
].join(' ')
const schemeTwoRightTopConnectionLine = {
  bendX: rightTopConnectionLine.startX - schemeTwoLeftTopHorizontalLength,
  endX: rightTopConnectionLine.startX - schemeTwoLeftTopHorizontalLength - schemeTwoLeftTopTerminalHorizontalLength,
  endY: rightTopConnectionLine.startY + schemeTwoLeftTopVerticalLength,
  startX: rightTopConnectionLine.startX,
  startY: rightTopConnectionLine.startY,
}
const schemeTwoRightTopConnectionPath = [
  `M ${schemeTwoRightTopConnectionLine.startX} ${schemeTwoRightTopConnectionLine.startY}`,
  `H ${schemeTwoRightTopConnectionLine.bendX + schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoRightTopConnectionLine.bendX} ${schemeTwoRightTopConnectionLine.startY} ${schemeTwoRightTopConnectionLine.bendX} ${schemeTwoRightTopConnectionLine.startY + schemeTwoLeftTopCornerRadius}`,
  `V ${schemeTwoRightTopConnectionLine.endY - schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoRightTopConnectionLine.bendX} ${schemeTwoRightTopConnectionLine.endY} ${schemeTwoRightTopConnectionLine.bendX - schemeTwoLeftTopCornerRadius} ${schemeTwoRightTopConnectionLine.endY}`,
  `H ${schemeTwoRightTopConnectionLine.endX}`,
].join(' ')
const schemeTwoRightBottomConnectionLine = {
  bendX: rightBottomConnectionLine.startX - schemeTwoLeftTopHorizontalLength,
  endX: rightBottomConnectionLine.startX - schemeTwoLeftTopHorizontalLength - schemeTwoLeftTopTerminalHorizontalLength,
  endY: rightBottomConnectionLine.startY - schemeTwoLeftTopVerticalLength,
  startX: rightBottomConnectionLine.startX,
  startY: rightBottomConnectionLine.startY,
}
const schemeTwoRightBottomConnectionPath = [
  `M ${schemeTwoRightBottomConnectionLine.startX} ${schemeTwoRightBottomConnectionLine.startY}`,
  `H ${schemeTwoRightBottomConnectionLine.bendX + schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoRightBottomConnectionLine.bendX} ${schemeTwoRightBottomConnectionLine.startY} ${schemeTwoRightBottomConnectionLine.bendX} ${schemeTwoRightBottomConnectionLine.startY - schemeTwoLeftTopCornerRadius}`,
  `V ${schemeTwoRightBottomConnectionLine.endY + schemeTwoLeftTopCornerRadius}`,
  `Q ${schemeTwoRightBottomConnectionLine.bendX} ${schemeTwoRightBottomConnectionLine.endY} ${schemeTwoRightBottomConnectionLine.bendX - schemeTwoLeftTopCornerRadius} ${schemeTwoRightBottomConnectionLine.endY}`,
  `H ${schemeTwoRightBottomConnectionLine.endX}`,
].join(' ')
const leftMiddleConnectionPath = `M ${leftMiddleConnectionLine.startX} ${leftMiddleConnectionLine.y} L ${leftMiddleConnectionLine.endX} ${leftMiddleConnectionLine.y}`
const rightMiddleConnectionPath = `M ${rightMiddleConnectionLine.startX} ${rightMiddleConnectionLine.y} L ${rightMiddleConnectionLine.endX} ${rightMiddleConnectionLine.y}`

const beamDuration = 2.4
const connectionEndpointRadius = 5
const abilityLabelGap = 20
const abilityIconScale = 1.1

function renderBeamAnimate() {
  return (
    <animate
      attributeName="stroke-dashoffset"
      dur={`${beamDuration}s`}
      from="510"
      repeatCount="indefinite"
      to="0"
    />
  )
}

export function SchemeThreeAbilityEntries({
  centerGradient = 'brand',
  centerLogoScale = 1,
  centerScale = 1,
  leftTopConnectionVariant = 'diagonal',
}: SchemeThreeAbilityEntriesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isMeasured, setIsMeasured] = useState(false)
  const centerBorderGradient = centerGradient === 'white'
    ? 'linear-gradient(90deg, #FFFFFF 0%, #DCE7EC 100%) border-box'
    : 'linear-gradient(90deg, #4CCD99 0%, #55CFFF 100%) border-box'
  const centerLogoGradient = centerGradient === 'white'
    ? 'linear-gradient(45deg, #FFFFFF 0%, #DCE7EC 100%)'
    : 'linear-gradient(45deg, #4CCD99 0%, #55CFFF 100%)'
  const centerTextGradientFrom = centerGradient === 'white' ? '#FFFFFF' : '#4CCD99'
  const centerTextGradientTo = centerGradient === 'white' ? '#DCE7EC' : '#55CFFF'
  const activeLeftTopConnectionLine = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoLeftTopConnectionLine
    : leftTopConnectionLine
  const activeLeftTopConnectionEndX = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoLeftTopConnectionLine.endX
    : leftTopConnectionEndX
  const activeLeftTopConnectionPath = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoLeftTopConnectionPath
    : leftTopConnectionPath
  const activeLeftBottomConnectionLine = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoLeftBottomConnectionLine
    : leftBottomConnectionLine
  const activeLeftBottomConnectionPath = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoLeftBottomConnectionPath
    : leftBottomConnectionPath
  const activeRightTopConnectionLine = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoRightTopConnectionLine
    : rightTopConnectionLine
  const activeRightTopConnectionPath = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoRightTopConnectionPath
    : rightTopConnectionPath
  const activeRightBottomConnectionLine = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoRightBottomConnectionLine
    : rightBottomConnectionLine
  const activeRightBottomConnectionPath = leftTopConnectionVariant === 'rightAngleShort'
    ? schemeTwoRightBottomConnectionPath
    : rightBottomConnectionPath

  useLayoutEffect(() => {
    const updateScale = () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      setScale(Math.min(container.clientWidth / baseWidth, container.clientHeight / baseHeight))
      setIsMeasured(true)
    }

    updateScale()
    const resizeObserver = new ResizeObserver(updateScale)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-[3] select-none"
      style={{ visibility: isMeasured ? 'visible' : 'hidden' }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          height: baseHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          width: baseWidth,
        }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
        >
          <defs>
            <linearGradient
              id="scheme-three-left-middle-connection"
              x1={leftMiddleConnectionLine.endX}
              x2={leftMiddleConnectionLine.startX}
              y1={leftMiddleConnectionLine.y}
              y2={leftMiddleConnectionLine.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-middle-connection"
              x1={rightMiddleConnectionLine.endX}
              x2={rightMiddleConnectionLine.startX}
              y1={rightMiddleConnectionLine.y}
              y2={rightMiddleConnectionLine.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-left-top-connection"
              x1={activeLeftTopConnectionEndX}
              x2={leftTopConnectionLine.startX}
              y1={activeLeftTopConnectionLine.endY}
              y2={leftTopConnectionLine.startY}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-top-connection"
              x1={activeRightTopConnectionLine.endX}
              x2={rightTopConnectionLine.startX}
              y1={activeRightTopConnectionLine.endY}
              y2={rightTopConnectionLine.startY}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-left-bottom-connection"
              x1={activeLeftBottomConnectionLine.endX}
              x2={leftBottomConnectionLine.startX}
              y1={activeLeftBottomConnectionLine.endY}
              y2={leftBottomConnectionLine.startY}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-bottom-connection"
              x1={activeRightBottomConnectionLine.endX}
              x2={rightBottomConnectionLine.startX}
              y1={activeRightBottomConnectionLine.endY}
              y2={rightBottomConnectionLine.startY}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="scheme-three-connection-flow-gradient">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="scheme-three-left-top-flow"
              gradientUnits="userSpaceOnUse"
              x1={activeLeftTopConnectionEndX}
              x2={leftTopConnectionLine.startX}
              y1={activeLeftTopConnectionLine.endY}
              y2={leftTopConnectionLine.startY}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-top-flow"
              gradientUnits="userSpaceOnUse"
              x1={activeRightTopConnectionLine.endX}
              x2={rightTopConnectionLine.startX}
              y1={activeRightTopConnectionLine.endY}
              y2={rightTopConnectionLine.startY}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="scheme-three-left-bottom-flow"
              gradientUnits="userSpaceOnUse"
              x1={activeLeftBottomConnectionLine.endX}
              x2={leftBottomConnectionLine.startX}
              y1={activeLeftBottomConnectionLine.endY}
              y2={leftBottomConnectionLine.startY}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-bottom-flow"
              gradientUnits="userSpaceOnUse"
              x1={activeRightBottomConnectionLine.endX}
              x2={rightBottomConnectionLine.startX}
              y1={activeRightBottomConnectionLine.endY}
              y2={rightBottomConnectionLine.startY}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="scheme-three-left-middle-flow"
              gradientUnits="userSpaceOnUse"
              x1={leftMiddleConnectionLine.endX}
              x2={leftMiddleConnectionLine.startX}
              y1={leftMiddleConnectionLine.y}
              y2={leftMiddleConnectionLine.y}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="scheme-three-right-middle-flow"
              gradientUnits="userSpaceOnUse"
              x1={rightMiddleConnectionLine.endX}
              x2={rightMiddleConnectionLine.startX}
              y1={rightMiddleConnectionLine.y}
              y2={rightMiddleConnectionLine.y}
            >
              <stop offset="0%" stopColor="#55CFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#55CFFF" />
              <stop offset="58%" stopColor="#4CCD99" />
              <stop offset="100%" stopColor="#4CCD99" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={activeLeftTopConnectionPath}
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <path
            d={activeRightTopConnectionPath}
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <path
            d={activeLeftBottomConnectionPath}
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <path
            d={activeRightBottomConnectionPath}
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <line
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
            x1={leftMiddleConnectionLine.startX}
            x2={leftMiddleConnectionLine.endX}
            y1={leftMiddleConnectionLine.y}
            y2={leftMiddleConnectionLine.y}
          />
          <line
            opacity="0.3"
            stroke="#FFFFFF"
            strokeWidth="3"
            x1={rightMiddleConnectionLine.startX}
            x2={rightMiddleConnectionLine.endX}
            y1={rightMiddleConnectionLine.y}
            y2={rightMiddleConnectionLine.y}
          />
          <circle
            cx={activeLeftTopConnectionLine.startX}
            cy={activeLeftTopConnectionLine.startY}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <circle
            cx={leftMiddleConnectionLine.startX}
            cy={leftMiddleConnectionLine.y}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <circle
            cx={activeLeftBottomConnectionLine.startX}
            cy={activeLeftBottomConnectionLine.startY}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <circle
            cx={activeRightTopConnectionLine.startX}
            cy={activeRightTopConnectionLine.startY}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <circle
            cx={rightMiddleConnectionLine.startX}
            cy={rightMiddleConnectionLine.y}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <circle
            cx={activeRightBottomConnectionLine.startX}
            cy={activeRightBottomConnectionLine.startY}
            fill="#FFFFFF"
            opacity="1"
            r={connectionEndpointRadius}
          />
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={activeLeftTopConnectionPath}
            stroke="url(#scheme-three-left-top-flow)"
          >
            {renderBeamAnimate()}
          </path>
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={activeRightTopConnectionPath}
            stroke="url(#scheme-three-right-top-flow)"
          >
            {renderBeamAnimate()}
          </path>
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={activeLeftBottomConnectionPath}
            stroke="url(#scheme-three-left-bottom-flow)"
          >
            {renderBeamAnimate()}
          </path>
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={activeRightBottomConnectionPath}
            stroke="url(#scheme-three-right-bottom-flow)"
          >
            {renderBeamAnimate()}
          </path>
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={leftMiddleConnectionPath}
            stroke="url(#scheme-three-left-middle-flow)"
          >
            {renderBeamAnimate()}
          </path>
          <path
            className="scheme-three-connection-flow scheme-three-connection-flow--core"
            d={rightMiddleConnectionPath}
            stroke="url(#scheme-three-right-middle-flow)"
          >
            {renderBeamAnimate()}
          </path>
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full select-none"
          style={{
            background: centerBorderGradient,
            border: '6px solid transparent',
            height: centerBorderSize,
            left: centerX - centerBorderSize / 2,
            maskComposite: 'exclude',
            top: centerY - centerBorderSize / 2,
            transform: `scale(${centerScale})`,
            transformOrigin: 'center center',
            WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            width: centerBorderSize,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute select-none"
          style={{
            background: centerLogoGradient,
            height: centerLogoHeight,
            left: centerX - centerLogoWidth / 2,
            maskImage: `url(${schemeThreeCenterLogo})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            top: centerY - centerLogoHeight / 2,
            transform: `scale(${centerScale * centerLogoScale})`,
            transformOrigin: 'center center',
            WebkitMaskImage: `url(${schemeThreeCenterLogo})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            width: centerLogoWidth,
          }}
        />
        <SpinningText
          className="pointer-events-none absolute"
          duration={28}
          gradientFrom={centerTextGradientFrom}
          gradientTo={centerTextGradientTo}
          radius={centerSpinningTextRadius}
          size={centerSpinningTextSize}
          style={{
            height: centerSpinningTextSize,
            left: centerX - centerSpinningTextSize / 2,
            top: centerY - centerSpinningTextSize / 2,
            transform: `scale(${centerScale})`,
            transformOrigin: 'center center',
            width: centerSpinningTextSize,
          }}
        >
          {schemeThreeSpinningText}
        </SpinningText>
        {entries.map((entry, index) => {
          const baseIconSize = entry.size === 'large' ? 140 : 100
          const labelFontSize = entry.size === 'large' ? 26.4 : 24
          const ability = overviewAbilities[index]
          const iconSize = baseIconSize * abilityIconScale * (ability ? abilityEntryIconScale[ability.id] ?? 1 : 1)
          const iconSrc = ability ? abilityEntryIcons[ability.id] ?? schemeThreeAbilityTempIcon : schemeThreeAbilityTempIcon
          const iconOffsetX = entry.x < centerX ? 50 - iconSize / 2 : iconSize / 2 - 50

          return (
            <Link
              key={`${entry.size}-${entry.x}-${entry.y}-${index}`}
              aria-label={ability ? `进入${ability.name}` : undefined}
              className="absolute cursor-pointer outline-none"
              style={{
                height: entry.sizePx,
                left: entry.x,
                top: entry.y,
                transformOrigin: 'center center',
                width: entry.sizePx,
              }}
              to={ability ? `/ability/${ability.id}/understand` : '/'}
              onFocus={() => preloadAbilityRoute(ability?.id)}
              onMouseEnter={() => preloadAbilityRoute(ability?.id)}
              onTouchStart={() => preloadAbilityRoute(ability?.id)}
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[92px] w-[92px] rounded-full opacity-45 blur-[18px]"
                style={{
                  backgroundColor: abilityEntryOuterGlowColor,
                  transform: `translate(calc(-50% + ${iconOffsetX}px), 4px)`,
                }}
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[68px] w-[68px] rounded-full opacity-22 blur-[10px]"
                style={{
                  background: `radial-gradient(circle, ${abilityEntryLightColor} 0%, ${abilityEntryCoreGlowColor} 34%, transparent 70%)`,
                  mixBlendMode: 'screen',
                  transform: `translate(calc(-50% + ${iconOffsetX}px), -50%)`,
                }}
              />
              <img
                alt=""
                className="absolute left-1/2 top-1/2 text-[#EAFBFF]/90"
                draggable={false}
                src={iconSrc}
                style={{
                  filter: `drop-shadow(0 0 6px ${abilityEntryCoreGlowColor}) drop-shadow(0 0 12px ${abilityEntryOuterGlowColor})`,
                  height: iconSize,
                  transform: `translate(calc(-50% + ${iconOffsetX}px), -50%)`,
                  width: iconSize,
                }}
              />
              <div
                className="absolute left-1/2 whitespace-nowrap text-center font-medium leading-none text-white"
                style={{
                  fontSize: labelFontSize,
                  top: `calc(50% + ${iconSize / 2 + abilityLabelGap}px)`,
                  transform: `translateX(calc(-50% + ${iconOffsetX}px))`,
                }}
              >
                {ability?.name}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
