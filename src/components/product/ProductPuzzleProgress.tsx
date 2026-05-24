import { useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

type ProductPuzzleProgressProps = {
  activeStepNumber: number
  activeColor?: string
  animateOnComplete?: boolean
  className?: string
  placement?: 'absolute' | 'inline'
  style?: CSSProperties
}

export const puzzlePieces = [
  { col: 0, row: 0, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /></svg> },
  { col: 1, row: 0, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v5.5" /><path d="M9 17h2" /><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg> },
  { col: 2, row: 0, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.504 9.426l3 -1.714a1 1 0 0 1 .992 0l3 1.714a1 1 0 0 1 .504 .868v3.411a1 1 0 0 1 -.504 .868l-3 1.715a1 1 0 0 1 -.992 0l-3 -1.715a1 1 0 0 1 -.504 -.868v-3.41a1 1 0 0 1 .504 -.869" /><path d="M15.75 9.964l-3.75 2.036" /><path d="M12 12l-3.75 -2.036" /><path d="M12 12v4.071" /><path d="M3 7v-2a2 2 0 0 1 2 -2h2" /><path d="M3 17v2a2 2 0 0 0 2 2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M17 21h2a2 2 0 0 0 2 -2v-2" /></svg> },
  { col: 0, row: 1, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M7 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M21 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M14 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M12 8v8" /><path d="M6.316 12.496l4.368 -4.992" /><path d="M17.684 12.496l-4.366 -4.99" /></svg> },
  { col: 1, row: 1, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" /><path d="M18 14v4h4" /><path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" /><path d="M8 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M8 11h4" /><path d="M8 15h3" /></svg> },
  { col: 2, row: 1, icon: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 5.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M11 7h5" /><path d="M11 10h6" /><path d="M11 13h3" /></svg> },
  { col: 3, row: 1, icon: ShieldCheck },
]

const puzzleSize = 344

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function ProductPuzzleProgress({
  activeColor = '#22D3EE',
  activeStepNumber,
  animateOnComplete = true,
  className,
  placement = 'absolute',
  style,
}: ProductPuzzleProgressProps) {
  const [viewportSize, setViewportSize] = useState(getViewportSize)
  const isComplete = animateOnComplete && activeStepNumber >= 7
  const highlightedPieceCount = Math.min(
    puzzlePieces.length,
    Math.max(0, activeStepNumber >= 6 ? activeStepNumber : activeStepNumber - 1),
  )
  const centerX = (viewportSize.width - puzzleSize) / 2
  const centerY = (viewportSize.height - puzzleSize) / 2
  const animationTarget = isComplete
    ? {
        opacity: [1, 0],
        x: [0, centerX - 40],
        y: [0, -(centerY - 7)],
        scale: [1, 2.625],
      }
    : {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }

  useEffect(() => {
    const handleResize = () => setViewportSize(getViewportSize())

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      className={cn(
        'pointer-events-none z-30 h-11 w-[344px]',
        placement === 'absolute' ? 'absolute' : 'relative shrink-0',
        className,
      )}
      animate={animationTarget}
      initial={
        isComplete
          ? {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }
          : false
      }
      style={{
        ...(placement === 'absolute'
          ? { left: 40, bottom: 40, transformOrigin: 'left bottom' }
          : { transformOrigin: 'left center' }),
        ...style,
      }}
      transition={{ duration: 0.86, ease: 'linear', times: isComplete ? [0, 1] : undefined }}
    >
      <div className="flex h-full w-full items-center gap-1.5">
        {puzzlePieces.map((piece, index) => {
          const pieceNumber = index + 1
          const isHighlighted = pieceNumber <= highlightedPieceCount
          const isCurrent = pieceNumber === activeStepNumber
          const Icon = piece.icon

          return (
            <motion.div
              key={pieceNumber}
              className={cn(
                'flex items-center justify-center h-11 w-11 rounded-lg',
                isHighlighted && 'border border-white/65',
                isCurrent && 'border-2 bg-white',
                !isHighlighted && !isCurrent && 'border border-transparent bg-white'
              )}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              style={{
                backgroundColor: isHighlighted ? activeColor : undefined,
                borderColor: isCurrent && !isHighlighted ? activeColor : undefined,
              }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <Icon 
                className={cn(
                  "h-6 w-6 transition-colors", 
                  isHighlighted ? "text-white" : 
                  !isCurrent ? "text-[#9AA8BF]" : undefined
                )} 
                style={isCurrent && !isHighlighted ? { color: activeColor } : undefined}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
