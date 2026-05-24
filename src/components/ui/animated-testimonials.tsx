import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { BlurReveal } from '@/components/magicui/BlurReveal'
import { cn } from '@/lib/utils'

export type AnimatedTestimonial = {
  quote: string
  name: string
  designation: string
  src?: string
}

type AnimatedTestimonialsProps = {
  autoplay?: boolean
  className?: string
  contentPanelClassName?: string
  imagePanelClassName?: string
  testimonials: AnimatedTestimonial[]
}

const imageRotations = [-6, 4, -2, 7, -4, 5]
const trailingPunctuationPattern = /^[，。！？；：、,.!?;:)）】》」』”’]$/

function splitQuoteIntoAnimatedChunks(quote: string) {
  return quote.split('').reduce<string[]>((chunks, character) => {
    if (trailingPunctuationPattern.test(character) && chunks.length > 0) {
      chunks[chunks.length - 1] += character
      return chunks
    }

    chunks.push(character)
    return chunks
  }, [])
}

export function AnimatedTestimonials({ autoplay = false, className, contentPanelClassName, imagePanelClassName, testimonials }: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0)
  const activeTestimonial = testimonials[active]
  const activeChunks = useMemo(() => splitQuoteIntoAnimatedChunks(activeTestimonial?.quote ?? ''), [activeTestimonial])

  useEffect(() => {
    setActive(0)
  }, [testimonials])

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [autoplay, testimonials.length])

  if (!activeTestimonial) {
    return null
  }

  const handleNext = () => {
    setActive((current) => (current + 1) % testimonials.length)
  }

  const handlePrevious = () => {
    setActive((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const isActive = (index: number) => index === active

  return (
    <div className={cn('w-full px-4 py-20 font-sans antialiased md:px-8 lg:px-12', className)}>
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div className={imagePanelClassName}>
          <div className="relative h-[440px] w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + testimonial.name}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    rotate: isActive(index) ? 0 : imageRotations[index % imageRotations.length],
                    scale: isActive(index) ? 1 : 0.95,
                    y: isActive(index) ? 0 : 10,
                    zIndex: isActive(index) ? testimonials.length + 1 : testimonials.length - index,
                  }}
                  className="absolute inset-0 origin-bottom rounded-[26px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] overflow-hidden flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.42, ease: 'easeInOut' }}
                >
                  {testimonial.src ? (
                    <img
                      alt={testimonial.name}
                      className="h-[90%] w-[90%] rounded-[18px] object-cover object-center"
                      draggable={false}
                      src={testimonial.src}
                    />
                  ) : (
                    <div aria-label={testimonial.name} className="h-[90%] w-[90%] rounded-[18px]" role="img" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className={cn('flex flex-col justify-between py-4', contentPanelClassName)}>
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: 'easeInOut' }}>
            <BlurReveal delay={0.06} duration={0.6} inView>
              <h3 className="text-[34px] font-bold leading-[1.25] text-white">{activeTestimonial.name}</h3>
            </BlurReveal>
            <BlurReveal delay={0.12} duration={0.6} inView>
              <p className="mt-2 text-[20px] leading-[1.4] text-white/45">{activeTestimonial.designation}</p>
            </BlurReveal>
            <BlurReveal delay={0.18} duration={0.6} inView>
              <motion.p className="mt-8 min-h-[190px] text-[28px] font-normal leading-[1.6] text-white/70">
                {activeChunks.map((chunk, index) => (
                  <motion.span
                    key={`${activeTestimonial.name}-${index}-${chunk}`}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    className="inline-block"
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                    transition={{ delay: 0.006 * index, duration: 0.18, ease: 'easeInOut' }}
                  >
                    {chunk}
                  </motion.span>
                ))}
              </motion.p>
            </BlurReveal>
          </motion.div>
          <div className="flex origin-left scale-[1.25] items-center gap-4 pt-12">
            <button
              aria-label="上一条"
              className="flex size-11 items-center justify-center rounded-[0.5em] bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={testimonials.length <= 1}
              type="button"
              onClick={handlePrevious}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <span className="min-w-[58px] text-center text-[22px] font-semibold tabular-nums leading-none text-white/70" aria-live="polite">
              {active + 1}/{testimonials.length}
            </span>
            <button
              aria-label="下一条"
              className="flex size-11 items-center justify-center rounded-[0.5em] bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={testimonials.length <= 1}
              type="button"
              onClick={handleNext}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
