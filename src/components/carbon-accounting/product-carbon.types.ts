export type SystemBoundary =
  | 'CRADLE_TO_GATE'
  | 'CRADLE_TO_GRAVE'
  | 'GATE_TO_GATE'

export type AccountingStatus =
  | 'DRAFT'
  | 'CALCULATING'
  | 'COMPLETED'
  | 'REVIEWING'

export type ExecutionStandard = 'ISO_14067' | 'GHG_PROTOCOL' | 'PAS_2050'

export interface CarbonAccountingTask {
  id: string
  modelName: string
  productName: string
  productCode: string
  systemBoundary: SystemBoundary
  accountingPeriod: string
  executionStandard: ExecutionStandard
  gwpResult: number | null
  uncertainty: string
  status: AccountingStatus
  createdAt: string
  updatedAt: string
}
