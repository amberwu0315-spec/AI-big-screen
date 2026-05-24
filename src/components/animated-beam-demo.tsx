"use client"

import React, { forwardRef, useEffect, useRef, useState } from "react"
import { Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import productCarbonNode1 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (1).png"
import productCarbonNode2 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (2).png"
import productCarbonNode3 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (3).png"
import productCarbonNode4 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (4).png"
import productCarbonNode5 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (5).png"
import productCarbonNode6 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (6).png"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; style?: React.CSSProperties }
>(({ className, children, style }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-[4px] border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

function NodeImage({ alt, src }: { alt: string; src: string }) {
  return <img alt={alt} className="w-[90.9%] h-[90.9%] rounded-[4px] object-cover" draggable={false} src={src} />
}

const beamGradientProps = {
  gradientStartColor: "#10b981", // emerald-500
  gradientStopColor: "#059669",  // emerald-600
  pathColor: "#FFFFFF",
  pathOpacity: 0.2,
  gradientOpacity: 1.0,
  duration: 4,
}

function useResponsiveBeamMetrics(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 })
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth))

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    const updateSize = () => {
      setContainerSize({ 
        height: container.offsetHeight, 
        width: container.offsetWidth 
      })
    }

    updateSize()

    const updateViewportWidth = () => setViewportWidth(window.innerWidth)
    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateViewportWidth)
    }
  }, [containerRef])

  const containerScale = containerSize.width > 0 && containerSize.height > 0
    ? Math.min(
        Math.max((containerSize.width - 24) / 560, 0),
        Math.max((containerSize.height - 24) / 300, 0),
        1.35
      )
    : 0.85
  const contentMatchedScale = Math.min(Math.max(viewportWidth / 1920, 0.78), 1)
  const scale = Math.min(containerScale, contentMatchedScale)

  return {
    curvature: Math.min(Math.max(92 * scale, 24), 120),
    endOffset: Math.min(Math.max(16 * scale, 4), 20),
    pathWidth: Math.min(Math.max(3 * scale, 1.2), 4),
    scale,
  }
}

export default function AnimatedBeamDemo({
  className,
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)
  const beamMetrics = useResponsiveBeamMetrics(containerRef)
  const visualScale = beamMetrics.scale * 0.9 * 1.2
  const beamCurvature = Math.min(Math.max(92 * visualScale, 24), 120)
  const beamEndOffset = Math.min(Math.max(16 * visualScale, 4), 20)
  const beamPathWidth = Math.min(Math.max(3 * visualScale, 1.2), 4)
  const groupStyle = {
    gap: 26 * visualScale,
    height: 240 * visualScale,
    width: "68%",
  }
  const nodeStyle = {
    height: 88 * visualScale,
    width: 88 * visualScale,
  }
  const centerStyle = {
    height: 92 * 1.32 * visualScale,
    padding: 0,
    width: 92 * 1.32 * visualScale,
  }

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full items-center justify-center overflow-visible", className)}
      ref={containerRef}
    >
      <div
        className="flex shrink-0 flex-col items-stretch justify-between"
        style={groupStyle}
      >
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref} className="overflow-hidden p-0 -translate-x-[50px]" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 1" src={productCarbonNode1} />
          </Circle>
          <Circle ref={div5Ref} className="overflow-hidden p-0 translate-x-[50px]" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 4" src={productCarbonNode4} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} className="overflow-hidden p-0" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 2" src={productCarbonNode2} />
          </Circle>
          {/* center logo */}
        <div className="flex flex-col justify-center">
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="package-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#12E1C5" />
                <stop offset="50%" stopColor="#18C7E5" />
                <stop offset="100%" stopColor="#0771FC" />
              </linearGradient>
            </defs>
          </svg>
          <Circle ref={div4Ref} style={centerStyle} className="rounded-[6px] bg-white">
            <Package className="w-[80%] h-[80%]" stroke="url(#package-gradient)" strokeWidth={1.5} />
          </Circle>
        </div>
          <Circle ref={div6Ref} className="overflow-hidden p-0" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 5" src={productCarbonNode5} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} className="overflow-hidden p-0 -translate-x-[50px]" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 3" src={productCarbonNode3} />
          </Circle>
          <Circle ref={div7Ref} className="overflow-hidden p-0 translate-x-[50px]" style={nodeStyle}>
            <NodeImage alt="产品碳核算资料节点 6" src={productCarbonNode6} />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-beamCurvature}
        endYOffset={-beamEndOffset}
        pathWidth={beamPathWidth}
      />
      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        pathWidth={beamPathWidth}
      />
      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={beamCurvature}
        endYOffset={beamEndOffset}
        pathWidth={beamPathWidth}
      />
      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-beamCurvature}
        endYOffset={-beamEndOffset}
        pathWidth={beamPathWidth}
        reverse
      />
      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        pathWidth={beamPathWidth}
        reverse
      />
      <AnimatedBeam
        {...beamGradientProps}
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={beamCurvature}
        endYOffset={beamEndOffset}
        pathWidth={beamPathWidth}
        reverse
      />
    </div>
  )
}
