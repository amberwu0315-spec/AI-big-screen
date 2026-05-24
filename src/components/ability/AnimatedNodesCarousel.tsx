import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/Marquee"
import productCarbonNode1 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (1).png"
import productCarbonNode2 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (2).png"
import productCarbonNode3 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (3).png"
import productCarbonNode4 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (4).png"
import productCarbonNode5 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (5).png"
import productCarbonNode6 from "@/assets/ChatGPT Image 2026年5月22日 15_26_23 (6).png"
import { forwardRef } from "react"

const baseNodes = [
  productCarbonNode1,
  productCarbonNode2,
  productCarbonNode3,
  productCarbonNode4,
  productCarbonNode5,
  productCarbonNode6,
]

// Double the nodes to ensure enough cards for seamless marquee and higher density
const nodes = [...baseNodes, ...baseNodes]

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; style?: React.CSSProperties }
>(({ className, children, style }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-[8px] border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"

export function AnimatedNodesCarousel({ className }: { className?: string }) {
  // Using the same node size as the beam demo
  const nodeStyle = {
    height: 89,
    width: 89,
  }

  return (
    <div className={cn("relative flex flex-col justify-center items-center h-full w-full", className)}>
      <Marquee pauseOnHover className="w-full shrink-0 py-4 [--duration:112s] [--gap:32px]">
        {nodes.map((src, idx) => (
          <Circle key={`top-${idx}`} className="overflow-hidden p-0" style={nodeStyle}>
            <img alt="" className="w-full h-full object-cover" draggable={false} src={src} />
          </Circle>
        ))}
      </Marquee>
      <Marquee pauseOnHover reverse className="w-full shrink-0 py-4 [--duration:100s] [--gap:32px]">
        {nodes.map((src, idx) => (
          <Circle key={`bottom-${idx}`} className="overflow-hidden p-0" style={nodeStyle}>
            <img alt="" className="w-full h-full object-cover" draggable={false} src={src} />
          </Circle>
        ))}
      </Marquee>
    </div>
  )
}
