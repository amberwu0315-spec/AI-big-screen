import { Link } from 'react-router-dom'

import type { ProductCarbonStep } from '@/data/productCarbonSteps'
import { cn } from '@/lib/utils'

type ProcessStepperProps = {
  steps: ProductCarbonStep[]
  activeStep: string
}

export function ProcessStepper({ steps, activeStep }: ProcessStepperProps) {
  return (
    <div className="grid grid-cols-7 gap-3">
      {steps.map((item, index) => (
        <Link
          key={item.step}
          to={`/product-carbon-flow/${item.step}`}
          className={cn(
            'flex min-h-24 flex-col justify-between rounded-lg border p-3 transition',
            item.step === activeStep
              ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400',
          )}
        >
          <span className="text-xs font-semibold">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-sm font-medium leading-tight">{item.title}</span>
        </Link>
      ))}
    </div>
  )
}
