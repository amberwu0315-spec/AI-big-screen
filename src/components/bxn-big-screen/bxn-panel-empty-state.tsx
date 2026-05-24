import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

interface BxnPanelEmptyStateProps {
  title: string
  description: string
  className?: string
}

export function BxnPanelEmptyState({
  title,
  description,
  className,
}: BxnPanelEmptyStateProps) {
  return (
    <Empty
      className={cn(
        'min-h-0 flex-1 rounded-lg border border-dashed border-border/60 bg-muted/20 py-5',
        className,
      )}
    >
      <EmptyHeader className="max-w-60 gap-1.5">
        <EmptyTitle className="text-sm font-medium text-foreground">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-xs leading-5 text-muted-foreground">
          {description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
