import type { PageResult } from '@/api/core/types'

export const STANDARD_STATUS = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
  DEPRECATED: 'DEPRECATED',
  ARCHIVED: 'ARCHIVED',
  PROPOSED: 'PROPOSED',
} as const
export type StandardStatus =
  (typeof STANDARD_STATUS)[keyof typeof STANDARD_STATUS]

export const STANDARD_CATEGORY = {
  INTERNATIONAL: 'INTERNATIONAL',
  NATIONAL: 'NATIONAL',
  INDUSTRY: 'INDUSTRY',
  LOCAL: 'LOCAL',
  GROUP: 'GROUP',
} as const
export type StandardCategory =
  (typeof STANDARD_CATEGORY)[keyof typeof STANDARD_CATEGORY]

export const INDICATOR_PARAM_TYPE = {
  FACTOR: 'FACTOR',
  FORMULA: 'FORMULA',
  LIMIT: 'LIMIT',
} as const
export type IndicatorParamType =
  (typeof INDICATOR_PARAM_TYPE)[keyof typeof INDICATOR_PARAM_TYPE]

export const ALERT_TYPE = {
  STATUS_CHANGE: 'STATUS_CHANGE',
  NEW_VERSION: 'NEW_VERSION',
  DEPRECATION: 'DEPRECATION',
} as const
export type AlertType = (typeof ALERT_TYPE)[keyof typeof ALERT_TYPE]

export const ACCOUNTING_SCENE = {
  COMBUSTION: 'COMBUSTION',
  FUGITIVE: 'FUGITIVE',
  ELECTRICITY: 'ELECTRICITY',
  OTHER: 'OTHER',
} as const
export type AccountingScene =
  (typeof ACCOUNTING_SCENE)[keyof typeof ACCOUNTING_SCENE]

export interface StandardDocument {
  id: string
  title: string
  code: string
  version: string
  status: StandardStatus
  category: StandardCategory
  publishDate: string
  updateTime: string
  publisher: string
  pdfUrl?: string
  description?: string
  tags: Array<string>
  region?: string
  effectiveDate?: string
  ics?: string
  sourceUrl?: string
  sourceAuthority?: string
  sourceNote?: string
  lifecycleNote?: string
  attachments?: Array<StandardAttachment>
}

export interface StandardAttachment {
  id: string
  title: string
  type: 'PDF' | 'HTML' | 'DOC' | 'XLSX' | 'NOTICE' | 'SOURCE'
  url: string
  access: 'PUBLIC' | 'PREVIEW' | 'PURCHASE' | 'REFERENCE'
  language?: string
  size?: string
  note?: string
}

export interface EmissionFactor {
  id: string
  standardId: string
  name: string
  type: IndicatorParamType
  value: number
  unit: string
  pageNo: number
  uncertainty?: number
  category?: string
  formula?: string
  updateTime: string
}

export interface PolicyOrganization {
  id: string
  name: string
  type: 'FACTORY' | 'HEADQUARTER'
}

export interface OrgMapping {
  id: string
  standardId: string
  standardName: string
  standardCode: string
  orgId: string
  orgName: string
  scene: AccountingScene
  isMandatory: boolean
  factorIds?: Array<string>
  createdAt: string
  createdBy: string
}

export interface OrgMappingCreateInput {
  standardId: string
  orgId: string
  scene: AccountingScene
  isMandatory: boolean
  factorIds?: Array<string>
}

export interface AlertSubscription {
  id: string
  userId: string
  standardId: string
  standardCode: string
  standardName: string
  alertTypes: Array<AlertType>
  isActive: boolean
  subscribedAt: string
}

export interface AlertRecord {
  id: string
  userId: string
  standardId: string
  standardCode: string
  standardName: string
  alertType: AlertType
  message: string
  isRead: boolean
  createdAt: string
}

export interface IndicatorParamRevision {
  id: string
  paramId: string
  standardId: string
  fieldName: 'value' | 'formula' | 'unit'
  oldValue: string
  newValue: string
  reason: string
  revisedBy: string
  revisedAt: string
}

export interface PDFTable {
  pageNo: number
  rows: Array<Array<string>>
  confidence: number
  bbox: { x: number; y: number; width: number; height: number }
}

export interface PDFMetadata {
  title: string
  code?: string
  publisher?: string
  publishDate?: string
}

export interface PDFParseResult {
  tables: Array<PDFTable>
  metadata: PDFMetadata
}

export interface SearchStandardsInput {
  keyword: string
  status?: Array<StandardStatus>
  category?: Array<StandardCategory>
  page?: number
  pageSize?: number
}

export interface SearchOrgMappingsInput {
  keyword?: string
  orgId?: string
  standardId?: string
  scene?: AccountingScene
  page?: number
  pageSize?: number
}

export interface PolicyLibraryApi {
  listStandards: () => Array<StandardDocument>
  searchStandards: (
    params: SearchStandardsInput,
  ) => PageResult<StandardDocument>
  getStandardById: (id: string) => StandardDocument | null
  getFactorsByStandardId: (standardId: string) => Array<EmissionFactor>
  getFactorRevisions: (factorId: string) => Array<IndicatorParamRevision>
  parsePDF: (file: File) => PDFParseResult
  uploadStandardPDF: (file: File | null) => StandardDocument
  createFactorsFromParse: (
    standardId: string,
    factors: Array<Partial<EmissionFactor>>,
  ) => Array<EmissionFactor>

  listOrganizations: () => Array<PolicyOrganization>
  getOrgMappings: (params: SearchOrgMappingsInput) => PageResult<OrgMapping>
  getMappingsByStandardId: (standardId: string) => Array<OrgMapping>
  createOrgMapping: (input: OrgMappingCreateInput) => OrgMapping
  updateOrgMapping: (
    id: string,
    updates: Partial<OrgMapping>,
  ) => OrgMapping | null
  deleteOrgMapping: (id: string) => boolean

  getAlertSubscriptions: (userId: string) => Array<AlertSubscription>
  subscribeAlert: (
    userId: string,
    standardId: string,
    alertTypes: Array<AlertType>,
  ) => AlertSubscription
  unsubscribeAlert: (userId: string, standardId: string) => boolean
  getAlerts: (userId: string, unreadOnly?: boolean) => Array<AlertRecord>
  markAlertAsRead: (userId: string, alertId: string) => boolean
  markAllAlertsAsRead: (userId: string) => void
}
