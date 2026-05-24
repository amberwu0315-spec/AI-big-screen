export type ProductCarbonDetailView = 'stage' | 'module' | 'unit'

export interface ProductCarbonVisualizationPalette {
  raw: string
  rawLight: string
  manufacturing: string
  manufacturingLight: string
  transport: string
  hazard: string
}

export interface ProductCarbonProcessUnit {
  id: string
  name: string
  stage: string
  module: string
  percentage: number
  gwp: number
}

export interface ProductCarbonMethodResult {
  label: string
  full?: string
  value: number
}

export interface ProductCarbonResultDataset {
  processUnits: Array<ProductCarbonProcessUnit>
  methodResults: Array<ProductCarbonMethodResult>
  defaultDetailView?: ProductCarbonDetailView
  palette?: ProductCarbonVisualizationPalette
}

export type ProductCarbonBreakdownView = 'stage' | 'module'

export interface ProductCarbonBreakdownItem {
  name: string
  value: number
  gwp: number
  color: string
}

export interface ProductCarbonMultiMethodRow {
  name: string
  raw: number
  manufacturing: number
  transport: number
}

export interface ProductCarbonSensitivityItem {
  name: string
  value: number
  color: string
}

export interface ProductCarbonMonteCarloNode {
  name: string
  mean: number
  std: number
}

export interface ProductCarbonKeyMetricSource {
  name: string
  pct: number
}

export interface ProductCarbonAnalysisDataset {
  breakdowns: Record<
    ProductCarbonBreakdownView,
    Array<ProductCarbonBreakdownItem>
  >
  allMethodsData: Array<ProductCarbonMultiMethodRow>
  sensitivityData: Array<ProductCarbonSensitivityItem>
  uncertaintyData: Array<ProductCarbonSensitivityItem>
  monteCarlo: {
    uncertaintyRange: string
    nodes: Array<ProductCarbonMonteCarloNode>
  }
  keyMetrics: {
    totalGwp: number
    uncertainty: string
    maxContributionStage: {
      name: string
      pct: number
    }
    topSources: Array<ProductCarbonKeyMetricSource>
    standard: string
    scope: string
  }
}
