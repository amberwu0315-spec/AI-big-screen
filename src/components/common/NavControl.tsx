import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FullscreenButton } from '@/components/common/FullscreenButton'
import { Button } from '@/components/ui/button'
import brandLogoDark from '@/assets/brand-logo-dark.svg'
import brandLogoLight from '@/assets/brand-logo-light.svg'
import { cn } from '@/lib/utils'

type NavControlProps = {
  backTo?: string
  nextTo?: string
  homeTo?: string
  className?: string
  actionsClassName?: string
  brandClassName?: string
  brandVariant?: 'dark' | 'light'
  actions?: ReactNode
  children?: ReactNode
  showBack?: boolean
  showFullscreen?: boolean
  fullscreenDisplay?: 'icon' | 'text'
  showHome?: boolean
  ghostActions?: boolean
  actionButtonClassName?: string
  glassOnScroll?: boolean
  glassOnScrollClassName?: string
}

export function NavControl({
  backTo,
  nextTo,
  homeTo = '/',
  className,
  actionsClassName,
  brandClassName,
  brandVariant = 'light',
  actions,
  children,
  showBack = true,
  showFullscreen = true,
  fullscreenDisplay = 'icon',
  showHome = true,
  ghostActions = false,
  actionButtonClassName,
  glassOnScroll = false,
  glassOnScrollClassName,
}: NavControlProps) {
  const navigate = useNavigate()
  const actionVariant = ghostActions ? 'ghost' : 'outline'
  const defaultActionClassName = ghostActions
    ? brandVariant === 'dark'
      ? 'text-white/80 hover:bg-white/10 hover:text-white'
      : 'hover:bg-slate-900/8'
    : undefined
  const actionClassName = cn(defaultActionClassName, actionButtonClassName)
  const logo = brandVariant === 'dark' ? brandLogoLight : brandLogoDark

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex h-[100px] items-center justify-between border-b border-transparent px-10 py-[30px] transition-colors duration-200',
        glassOnScroll && cn('border-white/10 bg-[#0B0B0F]/40 backdrop-blur-md', glassOnScrollClassName),
        className,
      )}
    >
      <Link className={cn('flex h-9 items-center', brandClassName)} to="/">
        <img
          alt="青钥 Cyacle"
          className="h-9 w-auto shrink-0 select-none"
          draggable={false}
          src={logo}
        />
      </Link>

      {children ? <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">{children}</div> : null}

      <nav className={cn('flex items-center gap-2', actionsClassName)}>
        {actions}
        {showBack ? (
          <Button
            aria-label="返回"
            className={actionClassName}
            size="icon-lg"
            variant={actionVariant}
            title="返回"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          >
            <ArrowLeft />
          </Button>
        ) : null}
        {showHome ? (
          <Button
            asChild
            aria-label="回首页"
            className={actionClassName}
            size="icon-lg"
            variant={actionVariant}
            title="回首页"
          >
            <Link to={homeTo}>
              <Home />
            </Link>
          </Button>
        ) : null}
        {showFullscreen ? (
          <FullscreenButton className={actionClassName} display={fullscreenDisplay} variant={actionVariant} />
        ) : null}
        {nextTo ? (
          <Button
            asChild
            aria-label="下一步"
            className={actionClassName}
            size="icon-lg"
            variant={actionVariant}
            title="下一步"
          >
            <Link to={nextTo}>
              <ArrowRight />
            </Link>
          </Button>
        ) : null}
      </nav>
    </header>
  )
}
