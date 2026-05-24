import { Maximize, Minimize } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

type FullscreenButtonProps = {
  variant?: 'outline' | 'ghost'
  className?: string
  display?: 'icon' | 'text'
  iconClassName?: string
}

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void
  webkitFullscreenElement?: Element | null
  mozCancelFullScreen?: () => Promise<void> | void
  mozFullScreenElement?: Element | null
  msExitFullscreen?: () => Promise<void> | void
  msFullscreenElement?: Element | null
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  mozRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

function getFullscreenElement() {
  const fullscreenDocument = document as FullscreenDocument

  return (
    document.fullscreenElement ??
    fullscreenDocument.webkitFullscreenElement ??
    fullscreenDocument.mozFullScreenElement ??
    fullscreenDocument.msFullscreenElement ??
    null
  )
}

function getIsAppFullscreen() {
  return document.body.dataset.appFullscreen === 'true'
}

function setAppFullscreen(nextValue: boolean) {
  if (nextValue) {
    document.body.dataset.appFullscreen = 'true'
    document.documentElement.dataset.appFullscreen = 'true'
  } else {
    delete document.body.dataset.appFullscreen
    delete document.documentElement.dataset.appFullscreen
  }

  document.dispatchEvent(new Event('appfullscreenchange'))
  window.dispatchEvent(new Event('resize'))
}

function syncViewportAfterFullscreenChange() {
  window.dispatchEvent(new Event('resize'))

  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'))
  })
}

async function exitFullscreen() {
  const fullscreenDocument = document as FullscreenDocument

  if (document.exitFullscreen) {
    await document.exitFullscreen()
    return
  }

  if (fullscreenDocument.webkitExitFullscreen) {
    await fullscreenDocument.webkitExitFullscreen()
    return
  }

  if (fullscreenDocument.mozCancelFullScreen) {
    await fullscreenDocument.mozCancelFullScreen()
    return
  }

  await fullscreenDocument.msExitFullscreen?.()
}

async function requestFullscreen() {
  const fullscreenTarget = document.documentElement as FullscreenElement

  if (fullscreenTarget.requestFullscreen) {
    await fullscreenTarget.requestFullscreen()
    return
  }

  if (fullscreenTarget.webkitRequestFullscreen) {
    await fullscreenTarget.webkitRequestFullscreen()
    return
  }

  if (fullscreenTarget.mozRequestFullScreen) {
    await fullscreenTarget.mozRequestFullScreen()
    return
  }

  await fullscreenTarget.msRequestFullscreen?.()
}

export function FullscreenButton({ variant = 'outline', className, display = 'icon', iconClassName }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const hasNativeFullscreen = Boolean(getFullscreenElement())

      if (hasNativeFullscreen && getIsAppFullscreen()) {
        setAppFullscreen(false)
      }

      setIsFullscreen(hasNativeFullscreen || getIsAppFullscreen())
      syncViewportAfterFullscreenChange()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && getIsAppFullscreen() && !getFullscreenElement()) {
        setAppFullscreen(false)
      }
    }

    handleFullscreenChange()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    document.addEventListener('appfullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
      document.removeEventListener('appfullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleFullscreen = async () => {
    const hasNativeFullscreen = Boolean(getFullscreenElement())

    if (hasNativeFullscreen || getIsAppFullscreen()) {
      setAppFullscreen(false)

      if (hasNativeFullscreen) {
        await exitFullscreen()
      }

      return
    }

    try {
      await requestFullscreen()
    } catch {
      setAppFullscreen(true)
    }
  }

  const Icon = isFullscreen ? Minimize : Maximize

  return (
    <Button
      aria-label={isFullscreen ? '退出全屏' : '全屏'}
      className={className}
      size={display === 'text' ? 'lg' : 'icon-lg'}
      variant={variant}
      title={isFullscreen ? '退出全屏' : '全屏'}
      type="button"
      onClick={toggleFullscreen}
    >
      {display === 'text' ? (
        <>
          <Icon className={iconClassName} />
          <span>{isFullscreen ? '退出全屏' : '全屏'}</span>
        </>
      ) : (
        <Icon className={iconClassName} />
      )}
    </Button>
  )
}
