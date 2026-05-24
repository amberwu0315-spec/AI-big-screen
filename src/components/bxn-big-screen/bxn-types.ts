export interface BxnHomepageMeta {
  pageTitle: string
  brandName: string
  organizationName: string
  yearLabel: string
  weatherLabel: string
}

export interface BxnKpiItem {
  id: string
  label: string
  value: string
  unit?: string
  hint?: string
  emphasis?: 'metric' | 'status'
}

export interface BxnRankingItem {
  name: string
  value: number
}

export interface BxnEmissionStructureItem {
  category: string
  value: number
  percent: number
}

export interface BxnSceneMarker {
  label: string
  top: string
  left: string
}

export interface BxnHomepageData {
  pageMeta: BxnHomepageMeta
  overviewKpis: Array<BxnKpiItem>
  productFootprintRanking: Array<BxnRankingItem>
  organizationFootprintShare: Array<BxnEmissionStructureItem>
  projectTypeShare: Array<BxnEmissionStructureItem>
  scene: {
    markers: Array<BxnSceneMarker>
  }
}
