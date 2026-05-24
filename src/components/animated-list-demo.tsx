import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/Marquee"
import { AnimatedList } from "@/components/ui/animated-list"
import type { CSSProperties } from "react"
import enterpriseCarouselOne from "@/assets/ChatGPT Image 2026年5月22日 14_56_49 (1).png"
import enterpriseCarouselTwo from "@/assets/ChatGPT Image 2026年5月22日 14_56_49 (2).png"
import enterpriseCarouselThree from "@/assets/ChatGPT Image 2026年5月22日 14_56_51 (3).png"
import enterpriseCarouselFour from "@/assets/ChatGPT Image 2026年5月22日 14_56_51 (4).png"
import enterpriseCarouselFive from "@/assets/ChatGPT Image 2026年5月22日 14_56_51 (5).png"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",

    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
]

notifications = Array.from({ length: 10 }, () => notifications).flat()

const enterpriseCarouselImages = [
  enterpriseCarouselOne,
  enterpriseCarouselTwo,
  enterpriseCarouselThree,
  enterpriseCarouselFour,
  enterpriseCarouselFive,
]

const Notification = ({
  className,
  color,
  description,
  disableHover = false,
  hideContent = false,
  icon,
  imageSrc,
  name,
  style,
  time,
}: Item & { className?: string; disableHover?: boolean; hideContent?: boolean; imageSrc?: string; style?: CSSProperties }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        disableHover ? "cursor-default transition-none hover:scale-100" : "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]",
        className,
      )}
      style={style}
    >
      {imageSrc ? (
        <>
          <img alt="" className="absolute inset-0 h-full w-full object-cover opacity-100" src={imageSrc} />
        </>
      ) : null}
      {hideContent ? null : (
        <div className="flex flex-row items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: color,
            }}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
              <span className="text-sm sm:text-lg">{name}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">{time}</span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              {description}
            </p>
          </div>
        </div>
      )}
    </figure>
  )
}

export default function AnimatedListDemo({
  className,
  itemClassName,
  orientation = "vertical",
}: {
  className?: string
  itemClassName?: string
  orientation?: "horizontal" | "vertical"
}) {
  if (orientation === "horizontal") {
    return (
      <div
        className={cn(
          "relative flex w-full overflow-hidden p-2 [container-type:inline-size]",
          className
        )}
      >
        <Marquee className="h-full items-end [--duration:28s] [--gap:clamp(18px,1.5vw,30px)] [&>div]:h-full [&>div]:items-end">
          {enterpriseCarouselImages.map((image, idx) => (
            <Notification
              color="transparent"
              description=""
              disableHover
              hideContent
              icon=""
              name=""
              time=""
              className={cn("mx-0 !aspect-auto h-full w-[70cqw] min-w-[70cqw] max-w-none rounded-[6cqw] border-white/5 !bg-transparent shadow-[0_24px_90px_rgba(0,0,0,0.18)] dark:!bg-transparent dark:[box-shadow:0_24px_90px_rgba(0,0,0,0.18)]", itemClassName)}
              key={idx}
              imageSrc={image}
            />
          ))}
        </Marquee>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
    </div>
  )
}
