'use client'

import * as React from 'react'
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/** 每层缩进量（px） */
const INDENT_PER_LEVEL = 18
/** 起始偏移（px） */
const INDENT_BASE = 8
/** 连接线左偏移 = INDENT_BASE + chevron 中心 */
const guideLeft = (depth: number) =>
  `${INDENT_BASE + depth * INDENT_PER_LEVEL + 6}px`

/** 根据百分比数值返回分档样式（使用系统 plant 语义色） */
function valueTierClass(value: number, selected: boolean): string {
  if (selected) return 'bg-primary/15 text-primary'
  if (value >= 50) return 'bg-plant-soft-red text-plant-accent-red'
  if (value >= 30) return 'bg-plant-soft-amber text-plant-accent-amber'
  if (value >= 10) return 'bg-plant-soft-cyan text-plant-accent-cyan'
  if (value >= 1) return 'bg-plant-soft-teal text-plant-accent-teal'
  return 'text-muted-foreground/60'
}

export interface CarbonTreeNavNode<TPath> {
  id: string
  label: string
  /** 百分比数值（0-100），用于分档着色和格式化显示 */
  value: number
  path: TPath
  children?: Array<CarbonTreeNavNode<TPath>>
}

interface TreeNodeRowProps<TPath> {
  node: CarbonTreeNavNode<TPath>
  depth: number
  selected: boolean
  expandedIds: Set<string>
  formatValue: (value: number) => string
  isNodeSelected: (path: TPath) => boolean
  onNodeClick: (node: CarbonTreeNavNode<TPath>) => void
  onToggleNode: (id: string) => void
}

function TreeNodeRow<TPath>({
  node,
  depth,
  selected,
  expandedIds,
  formatValue,
  isNodeSelected,
  onNodeClick,
  onToggleNode,
}: TreeNodeRowProps<TPath>) {
  const hasChildren = !!node.children?.length
  const expanded = expandedIds.has(node.id)

  return (
    <div>
      <button
        type="button"
        className={cn(
          'group relative flex w-full cursor-pointer items-center gap-1.5 rounded-[0.5em] py-2 pr-2 text-left text-xs transition-colors hover:bg-muted/50',
          depth === 0 && 'font-semibold text-foreground',
          depth === 1 && 'font-medium text-foreground/80',
          depth >= 2 && 'text-muted-foreground',
          selected && 'bg-primary/10 text-primary hover:bg-primary/10',
        )}
        style={{ paddingLeft: `${INDENT_BASE + depth * INDENT_PER_LEVEL}px` }}
        onClick={() => onNodeClick(node)}
      >
        {/* ── 展开/折叠按钮 或 叶子圆点 ── */}
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
          {hasChildren ? (
            <span
              role="button"
              tabIndex={-1}
              className="flex size-4 items-center justify-center rounded-sm hover:bg-muted"
              aria-label={expanded ? '收起节点' : '展开节点'}
              onClick={(event) => {
                event.stopPropagation()
                onToggleNode(node.id)
              }}
            >
              {expanded ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </span>
          ) : (
            <span className="size-1.5 rounded-full bg-muted-foreground/35" />
          )}
        </span>

        {/* ── 标签 + 数值 ── */}
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="flex-1 truncate">{node.label}</span>
          <span
            className={cn(
              'ml-1 shrink-0 rounded-sm px-1 font-mono text-xs tabular-nums',
              valueTierClass(node.value, selected),
            )}
          >
            {formatValue(node.value)}
          </span>
        </span>
      </button>

      {/* ── 子节点（含竖向连接线） ── */}
      {hasChildren && expanded && (
        <div className="relative">
          {/* 竖向 guide line */}
          <span
            className="absolute top-0 bottom-2 w-px bg-border"
            style={{ left: guideLeft(depth) }}
          />
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={isNodeSelected(child.path)}
              expandedIds={expandedIds}
              formatValue={formatValue}
              isNodeSelected={isNodeSelected}
              onNodeClick={onNodeClick}
              onToggleNode={onToggleNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CarbonTreeNavProps<TPath> {
  title: string
  headerStart?: React.ReactNode
  headerActions?: React.ReactNode
  className?: string
  defaultCollapsed?: boolean
  rootLabel: string
  rootDescription?: string
  rootSelected: boolean
  nodes: Array<CarbonTreeNavNode<TPath>>
  expandedIds: Set<string>
  isNodeSelected: (path: TPath) => boolean
  formatValue: (value: number) => string
  onSelectRoot: () => void
  onNodeClick: (node: CarbonTreeNavNode<TPath>) => void
  onToggleNode: (id: string) => void
}

export function CarbonTreeNav<TPath>({
  title,
  headerStart,
  headerActions,
  className,
  defaultCollapsed = false,
  rootLabel,
  rootDescription,
  rootSelected,
  nodes,
  expandedIds,
  isNodeSelected,
  formatValue,
  onSelectRoot,
  onNodeClick,
  onToggleNode,
}: CarbonTreeNavProps<TPath>) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200',
        collapsed ? 'w-10' : 'w-[248px]',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between border-b py-2.5',
          collapsed ? 'px-1.5' : 'px-4',
        )}
      >
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {headerStart ?? (
              <span className="pl-1 text-xs font-semibold">{title}</span>
            )}
          </div>
        )}
        <div className={cn('flex items-center gap-1', collapsed && 'mx-auto')}>
          {!collapsed && headerActions}
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6"
            aria-label={collapsed ? '展开树状导航' : '折叠树状导航'}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-3 text-muted-foreground" />
            ) : (
              <PanelLeftClose className="size-3 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {!collapsed ? (
        <ScrollArea className="min-h-0 flex-1">
          <div className="p-4">
            {/* ── 根节点 ── */}
            <button
              type="button"
              className={cn(
                'relative flex w-full cursor-pointer items-center gap-2 rounded-[0.625em] px-3 py-2 text-left transition-colors',
                rootSelected
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/25 hover:bg-primary/15'
                  : 'bg-muted/55 text-foreground ring-1 ring-border/70 hover:bg-muted/75 hover:ring-border hover:shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
              )}
              onClick={onSelectRoot}
            >
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-[0.5em] text-xs font-bold',
                  rootSelected
                    ? 'bg-primary/20 text-primary'
                    : 'bg-background text-foreground/70 ring-1 ring-border/70',
                )}
              >
                {rootLabel.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{rootLabel}</p>
                {rootDescription ? (
                  <p
                    className={cn(
                      'truncate text-xs',
                      rootSelected
                        ? 'text-primary/60'
                        : 'text-muted-foreground/80',
                    )}
                  >
                    {rootDescription}
                  </p>
                ) : null}
              </div>
              <ChevronRight
                className={cn(
                  'size-3 shrink-0',
                  rootSelected ? 'text-primary/70' : 'text-muted-foreground/70',
                )}
              />
            </button>

            {/* ── 根节点与树体之间的分隔 ── */}
            <Separator className="my-2" />

            {/* ── 树节点 ── */}
            {nodes.map((node) => (
              <TreeNodeRow
                key={node.id}
                node={node}
                depth={0}
                selected={isNodeSelected(node.path)}
                expandedIds={expandedIds}
                formatValue={formatValue}
                isNodeSelected={isNodeSelected}
                onNodeClick={onNodeClick}
                onToggleNode={onToggleNode}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        /* ── 折叠态：头像 + tooltip ── */
        <div className="flex flex-1 flex-col items-center py-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    'flex size-6 items-center justify-center rounded-[0.5em] text-xs font-bold',
                    rootSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground ring-1 ring-border',
                  )}
                />
              }
              onClick={() => setCollapsed(false)}
            >
              {rootLabel.slice(0, 1)}
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {rootLabel}
              {rootDescription ? (
                <span className="ml-1 text-muted-foreground">
                  · {rootDescription}
                </span>
              ) : null}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </aside>
  )
}
