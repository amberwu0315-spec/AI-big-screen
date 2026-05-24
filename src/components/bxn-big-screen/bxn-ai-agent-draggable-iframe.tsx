import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Expand, Minimize2, X } from 'lucide-react'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

type DragResizeMode = 'drag' | 'resize' | null

type DragResizeState = {
  mode: DragResizeMode
  pointerId: number | null
  offsetX: number
  offsetY: number
  startX: number
  startY: number
  originPosition: FloatingPosition
  originSize: FloatingSize
}

const WINDOW_MARGIN = 20
const MIN_WIDTH = 360
const MIN_HEIGHT = 240

function getViewportSize() {
  if (typeof window === 'undefined') {
    return {
      width: 1280,
      height: 720,
    }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getDefaultSize(): FloatingSize {
  const viewport = getViewportSize()

  return {
    width: Math.min(Math.max(MIN_WIDTH, Math.floor(viewport.width * 0.5)), 960),
    height: Math.min(Math.max(MIN_HEIGHT, Math.floor(viewport.height * 0.62)), 760),
  }
}

function getDefaultPosition(size: FloatingSize): FloatingPosition {
  const viewport = getViewportSize()

  return {
    x: Math.max(0, viewport.width - size.width - WINDOW_MARGIN),
    y: Math.max(0, viewport.height - size.height - WINDOW_MARGIN),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function BxnAiAgentDraggableIframe({
  visible,
  iframeSrc,
  title,
  onClose,
  portalContainer,
}: {
  visible: boolean
  iframeSrc: string
  title: string
  onClose: () => void
  portalContainer?: HTMLElement | null
}) {
  const [size, setSize] = useState<FloatingSize>(() => getDefaultSize())
  const [position, setPosition] = useState<FloatingPosition>(() =>
    getDefaultPosition(getDefaultSize()),
  )
  const [isMaximized, setIsMaximized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const previousFrameRef = useRef<{
    size: FloatingSize
    position: FloatingPosition
  } | null>(null)

  const interactionRef = useRef<DragResizeState>({
    mode: null,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    originPosition: { x: 0, y: 0 },
    originSize: { width: 0, height: 0 },
  })

  useEffect(() => {
    if (!visible) {
      return
    }

    const defaultSize = getDefaultSize()
    const defaultPosition = getDefaultPosition(defaultSize)
    setSize(defaultSize)
    setPosition(defaultPosition)
    setIsMaximized(false)
    previousFrameRef.current = null
  }, [visible])

  useEffect(() => {
    if (!visible || typeof window === 'undefined') {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const current = interactionRef.current

      if (
        current.mode === null ||
        current.pointerId === null ||
        current.pointerId !== event.pointerId
      ) {
        return
      }

      if (current.mode === 'drag') {
        const viewport = getViewportSize()
        const boundedX = clamp(
          event.clientX - current.offsetX,
          0,
          Math.max(0, viewport.width - size.width),
        )
        const boundedY = clamp(
          event.clientY - current.offsetY,
          0,
          Math.max(0, viewport.height - size.height),
        )

        setPosition({ x: boundedX, y: boundedY })
        return
      }

      if (current.mode === 'resize') {
        const viewport = getViewportSize()
        const deltaX = event.clientX - current.startX
        const deltaY = event.clientY - current.startY

        const maxWidth = Math.max(MIN_WIDTH, viewport.width - current.originPosition.x)
        const maxHeight = Math.max(MIN_HEIGHT, viewport.height - current.originPosition.y)

        const nextWidth = clamp(
          current.originSize.width + deltaX,
          MIN_WIDTH,
          maxWidth,
        )
        const nextHeight = clamp(
          current.originSize.height + deltaY,
          MIN_HEIGHT,
          maxHeight,
        )

        setSize({ width: nextWidth, height: nextHeight })
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      const current = interactionRef.current
      if (current.pointerId !== event.pointerId) {
        return
      }

      interactionRef.current = {
        ...interactionRef.current,
        mode: null,
        pointerId: null,
      }
      setIsDragging(false)
      setIsResizing(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [visible, size.height, size.width])

  useEffect(() => {
    if (!visible || typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      const viewport = getViewportSize()

      if (isMaximized) {
        setSize({ width: viewport.width, height: viewport.height })
        setPosition({ x: 0, y: 0 })
        return
      }

      setSize((current) => {
        const width = clamp(current.width, MIN_WIDTH, viewport.width)
        const height = clamp(current.height, MIN_HEIGHT, viewport.height)

        return {
          width,
          height,
        }
      })

      setPosition((current) => ({
        x: clamp(current.x, 0, Math.max(0, viewport.width - size.width)),
        y: clamp(current.y, 0, Math.max(0, viewport.height - size.height)),
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMaximized, size.height, size.width, visible])

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isMaximized) {
      return
    }

    interactionRef.current = {
      ...interactionRef.current,
      mode: 'drag',
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    }

    setIsDragging(true)
  }

  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || isMaximized) {
      return
    }

    event.stopPropagation()
    interactionRef.current = {
      ...interactionRef.current,
      mode: 'resize',
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originPosition: position,
      originSize: size,
    }

    setIsResizing(true)
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      const previous = previousFrameRef.current
      if (previous) {
        setSize(previous.size)
        setPosition(previous.position)
      }
      setIsMaximized(false)
      return
    }

    previousFrameRef.current = {
      size,
      position,
    }

    const viewport = getViewportSize()
    setSize({ width: viewport.width, height: viewport.height })
    setPosition({ x: 0, y: 0 })
    setIsMaximized(true)
  }

  if (!visible || typeof document === 'undefined') {
    return null
  }

  const targetContainer = portalContainer ?? document.body

  return createPortal(
    <div
      className="fixed z-[1300] overflow-hidden border border-border/70 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.28)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        borderRadius: isMaximized ? '0px' : '8px',
      }}
    >
      <div
        className="drag-handle flex h-10 items-center justify-between border-b border-border/70 bg-white/95 px-3"
        onPointerDown={startDrag}
        style={{ cursor: isMaximized ? 'default' : 'move' }}
      >
        <span className="truncate text-[14px] font-medium text-[#131313]">{title}</span>
        <div className="ml-3 flex items-center gap-1">
          <button
            type="button"
            onClick={toggleMaximize}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[0.5em] text-[#131313] hover:bg-black/5"
            aria-label={isMaximized ? '还原窗口' : '最大化窗口'}
          >
            {isMaximized ? (
              <Minimize2 className="h-[16px] w-[16px]" strokeWidth={2.1} />
            ) : (
              <Expand className="h-[16px] w-[16px]" strokeWidth={2.1} />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[0.5em] text-[#131313] hover:bg-black/5"
            aria-label="关闭窗口"
          >
            <X className="h-[16px] w-[16px]" strokeWidth={2.1} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-40px)] w-full bg-white">
        <iframe
          src={iframeSrc}
          title={title}
          className="h-full w-full border-0"
          style={{
            pointerEvents: isDragging || isResizing ? 'none' : 'auto',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media *; gyroscope; picture-in-picture; microphone *"
          allowFullScreen
        />
      </div>

      {!isMaximized ? (
        <button
          type="button"
          onPointerDown={startResize}
          aria-label="缩放窗口"
          className="absolute right-0 bottom-0 h-4 w-4 !cursor-se-resize bg-transparent"
        >
          <span className="pointer-events-none absolute right-[2px] bottom-[2px] h-[8px] w-[8px] border-r-2 border-b-2 border-[#8C8C8C]" />
        </button>
      ) : null}
    </div>,
    targetContainer,
  )
}
