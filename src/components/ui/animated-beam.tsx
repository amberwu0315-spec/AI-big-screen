import { useEffect, useId, useRef, type RefObject } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null> // Container ref
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  gradientOpacity?: number
  delay?: number
  duration?: number
  repeat?: number
  repeatDelay?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false, // Include the reverse prop
  duration = 5,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  gradientOpacity = 1,
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef1 = useRef<SVGPathElement>(null)
  const pathRef2 = useRef<SVGPathElement>(null)

  // Calculate the gradient coordinates based on the reverse prop
  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRef.current.offsetWidth
        const svgHeight = containerRef.current.offsetHeight
        
        if (svgRef.current) {
          svgRef.current.setAttribute("width", svgWidth.toString())
          svgRef.current.setAttribute("height", svgHeight.toString())
          svgRef.current.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        }

        const scaleX = containerRect.width / svgWidth || 1
        const scaleY = containerRect.height / svgHeight || 1

        const startX =
          (rectA.left - containerRect.left + rectA.width / 2) / scaleX + startXOffset
        const startY =
          (rectA.top - containerRect.top + rectA.height / 2) / scaleY + startYOffset
        const endX =
          (rectB.left - containerRect.left + rectB.width / 2) / scaleX + endXOffset
        const endY =
          (rectB.top - containerRect.top + rectB.height / 2) / scaleY + endYOffset

        const createRoundedPolyline = (sx: number, sy: number, ex: number, ey: number, radius: number) => {
          if (Math.abs(sy - ey) < 2) {
            return `M ${sx},${sy} L ${ex},${ey}`
          }
          const mx = (sx + ex) / 2
          const dx = ex > sx ? 1 : -1
          const dy = ey > sy ? 1 : -1
          const maxRx = Math.abs(mx - sx)
          const maxRy = Math.abs(ey - sy) / 2
          const r = Math.min(radius, maxRx, maxRy)
          
          return `M ${sx},${sy} L ${mx - r * dx},${sy} Q ${mx},${sy} ${mx},${sy + r * dy} L ${mx},${ey - r * dy} Q ${mx},${ey} ${mx + r * dx},${ey} L ${ex},${ey}`
        }

        const d = createRoundedPolyline(startX, startY, endX, endY, 16)
        if (pathRef1.current) pathRef1.current.setAttribute("d", d)
        if (pathRef2.current) pathRef2.current.setAttribute("d", d)
      }
    }

    let animationFrameId = 0
    const loop = () => {
      updatePath()
      animationFrameId = window.requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  return (
    <svg
      ref={svgRef}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2 overflow-visible",
        className
      )}
    >
      <path
        ref={pathRef1}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        ref={pathRef2}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity={gradientOpacity}
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={{
            x1: gradientCoordinates.x1,
            x2: gradientCoordinates.x2,
            y1: gradientCoordinates.y1,
            y2: gradientCoordinates.y2,
          }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1], // https://easings.net/#easeOutExpo
            repeat,
            repeatDelay,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          ></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  )
}
