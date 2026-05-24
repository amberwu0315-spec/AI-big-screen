import type {
  ProductCarbonAnalysisDataset,
  ProductCarbonResultDataset,
} from '@/lib/product-carbon-visualization'

export interface CarbonScreenSelectOption {
  value: string
  label: string
}

export interface CarbonScreenWeather {
  condition: string
  temperatureRange: string
}

export interface CarbonScreenMetric {
  id: string
  label: string
  value: number
  unit: string
  decimals?: number
}

export interface CarbonScreenGrade {
  label: string
  value: string
  description: string
}

export interface CarbonScreenPieDatum {
  name: string
  value: number
}

export interface CarbonScreenProductDatum {
  name: string
  value: number
}

export interface CarbonScreenDialogConfig {
  title: string
}

export interface CarbonScreenScopeDistributionSourceRow {
  id: string
  category: string
  subCategory: string
  source: string
  co2e: number
  share: number | null
}

export interface CarbonScreenScopeDistributionDialogConfig extends CarbonScreenDialogConfig {
  summary: {
    totalEmission: number
    unit: 'tCO2e'
    gwpVersion: 'AR5' | 'AR6'
  }
  rows: Array<CarbonScreenScopeDistributionSourceRow>
}

export interface CarbonScreenProductRankingDialogConfig extends CarbonScreenDialogConfig {
  summary: {
    productName: string
    productCode: string
    gwpResult: number
    uncertainty: string
  }
  modelResult: ProductCarbonResultDataset
  analysis: ProductCarbonAnalysisDataset
}

export interface CarbonScreenDashboard {
  header: {
    title: string
    siteOptions: Array<CarbonScreenSelectOption>
    yearOptions: Array<CarbonScreenSelectOption>
    weather: CarbonScreenWeather
  }
  metrics: Array<CarbonScreenMetric>
  grade: CarbonScreenGrade
  dialogs: {
    scopeDistribution: CarbonScreenScopeDistributionDialogConfig
    productRanking: CarbonScreenProductRankingDialogConfig
  }
  charts: {
    scopeDistribution: Array<CarbonScreenPieDatum>
    reductionProjectDistribution: Array<CarbonScreenPieDatum>
    productRanking: Array<CarbonScreenProductDatum>
  }
}

export interface CarbonScreenApi {
  getDashboard: () => CarbonScreenDashboard
}
