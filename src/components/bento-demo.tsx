import { BellIcon, Share2Icon } from "lucide-react"

import AnimatedBeamDemo from "@/components/animated-beam-demo"
import AnimatedListDemo from "@/components/animated-list-demo"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

export const bentoDemoFeatures = [
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
    ),
  },
  {
    Icon: Share2Icon,
    name: "Integrations",
    description: "Supports 100+ integrations and counting.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamDemo className="absolute inset-x-0 top-4 h-[300px] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
    ),
  },
]

export default function BentoDemo() {
  return (
    <BentoGrid>
      {bentoDemoFeatures.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
