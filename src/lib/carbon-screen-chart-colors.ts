import type { ProductCarbonVisualizationPalette } from '@/lib/product-carbon-visualization'

export const CARBON_SCREEN_SCOPE_COLORS = [
  'var(--chart-palette-1)',
  'var(--chart-palette-9)',
  'var(--chart-palette-11)',
] as const

export const CARBON_SCREEN_REDUCTION_COLORS = [
  'var(--chart-palette-1)',
  'var(--chart-palette-9)',
  'var(--chart-palette-5)',
  'var(--chart-palette-11)',
] as const

export const CARBON_SCREEN_PRODUCT_COLOR = 'var(--primary)'

export const CARBON_SCREEN_DIALOG_COLORS = [
  'var(--chart-palette-1)',
  'var(--chart-palette-9)',
  'var(--chart-palette-11)',
  'var(--chart-palette-5)',
  'var(--primary)',
] as const

export const CARBON_SCREEN_PRODUCT_DIALOG_PALETTE: ProductCarbonVisualizationPalette =
  {
    raw: 'var(--chart-palette-1)',
    rawLight: 'var(--chart-palette-9)',
    manufacturing: 'var(--chart-palette-11)',
    manufacturingLight: 'var(--chart-palette-5)',
    transport: 'var(--primary)',
    hazard: 'var(--chart-palette-9)',
  }
