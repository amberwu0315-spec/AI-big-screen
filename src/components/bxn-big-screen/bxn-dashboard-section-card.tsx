import type { ReactNode } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface BxnDashboardSectionCardProps {
  title: ReactNode
  description?: string
  children: ReactNode
  className?: string
  cardUnstyled?: boolean
  variant?: 'default' | 'judgment' | 'list' | 'module'
  density?: 'default' | 'compact'
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  headerAside?: ReactNode
}

export function BxnDashboardSectionCard({
  title,
  description,
  children,
  className,
  cardUnstyled = false,
  variant = 'default',
  density = 'default',
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
  headerAside,
}: BxnDashboardSectionCardProps) {
  const headerBaseClassName =
    variant === 'module'
      ? 'border-b border-border/50 !flex !items-center !gap-2 !py-0'
      : variant === 'list'
        ? 'border-b border-border/50 pb-2'
        : variant === 'judgment'
          ? 'border-b border-border/50 pb-2'
          : 'border-b border-border/60 pb-2.5'

  const contentBaseClassName =
    variant === 'module'
      ? 'flex-1 min-h-0 px-5 pb-4 pt-3.5'
      : variant === 'list'
        ? 'flex-1 px-3 py-2.5'
        : variant === 'judgment'
          ? 'flex-1 px-3 py-2.5'
          : 'flex-1 px-3 py-3'

  const densityHeaderClassName =
    variant === 'module'
      ? ''
      : density === 'compact'
        ? 'pb-2.5 pt-2'
        : 'pb-3 pt-3'

  const moduleHeaderStyle =
    variant === 'module'
      ? {
          height: 52,
          minHeight: 52,
          paddingTop: 0,
          paddingBottom: 0,
        }
      : undefined

  const densityContentClassName =
    variant === 'module' && density === 'compact' ? 'px-4 pb-3 pt-2.5' : ''

  return (
    <Card
      data-density={density}
      className={cn(
        cardUnstyled
          ? 'rounded-lg !gap-0 bg-transparent !py-0 ring-0 shadow-none'
          : 'stack-card rounded-lg border border-border bg-card/88 !gap-0 !py-0 text-card-foreground shadow-sm',
        className,
      )}
      size="sm"
    >
      <CardHeader
        style={moduleHeaderStyle}
        className={cn(
          headerBaseClassName,
          densityHeaderClassName,
          headerClassName,
        )}
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-2',
            variant === 'module' && 'h-full flex-1',
          )}
        >
          <CardTitle
            className={cn(
              'text-sm leading-none font-semibold text-foreground',
              titleClassName,
            )}
          >
            {title}
          </CardTitle>
          {description ? (
            <p
              className={cn(
                'min-w-0 text-xs leading-4 text-muted-foreground',
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {headerAside ? (
          variant === 'module' ? (
            <div className="ml-2 shrink-0 self-center">{headerAside}</div>
          ) : (
            <CardAction className="shrink-0 self-center">
              {headerAside}
            </CardAction>
          )
        ) : null}
      </CardHeader>

      <CardContent
        className={cn(
          contentBaseClassName,
          densityContentClassName,
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
