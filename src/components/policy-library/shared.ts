import type { AppLocale, LocalizedText } from '@/lib/locale'
import { defineLocalizedText, localizeText } from '@/lib/locale'
import { STATUS_BADGE } from '@/lib/status-colors'

export const POLICY_USER_ID = 'user-001'

export const text = defineLocalizedText

export const STANDARD_STATUS_LABEL = {
  PUBLISHED: text('现行', 'Published'),
  DRAFT: text('草稿', 'Draft'),
  DEPRECATED: text('已废弃', 'Deprecated'),
  ARCHIVED: text('归档', 'Archived'),
  PROPOSED: text('征求意见', 'Public Consultation'),
} as const

export const STANDARD_STATUS_BADGE = {
  PUBLISHED: STATUS_BADGE.success,
  DRAFT: STATUS_BADGE.neutral,
  DEPRECATED: STATUS_BADGE.orange,
  ARCHIVED: STATUS_BADGE.danger,
  PROPOSED: STATUS_BADGE.info,
} as const

export const STANDARD_CATEGORY_LABEL = {
  INTERNATIONAL: text('国际标准', 'International Standard'),
  NATIONAL: text('国家标准', 'National Standard'),
  INDUSTRY: text('行业标准', 'Industry Standard'),
  LOCAL: text('地方标准', 'Local Standard'),
  GROUP: text('团体标准', 'Association Standard'),
} as const

export const ACCOUNTING_SCENE_LABEL = {
  COMBUSTION: text('燃烧排放', 'Combustion Emissions'),
  FUGITIVE: text('逸散排放', 'Fugitive Emissions'),
  ELECTRICITY: text('用电排放', 'Electricity Emissions'),
  OTHER: text('其他', 'Other'),
} as const

export const ALERT_TYPE_LABEL = {
  STATUS_CHANGE: text('状态变更', 'Status Change'),
  NEW_VERSION: text('新版本发布', 'New Version'),
  DEPRECATION: text('标准废止', 'Withdrawal'),
} as const

export const ALERT_TYPE_BADGE = {
  STATUS_CHANGE: STATUS_BADGE.warning,
  NEW_VERSION: STATUS_BADGE.success,
  DEPRECATION: STATUS_BADGE.danger,
} as const

export const ATTACHMENT_ACCESS_LABEL = {
  PUBLIC: text('公开', 'Public'),
  PREVIEW: text('预览', 'Preview'),
  PURCHASE: text('购买获取', 'Purchase'),
  REFERENCE: text('仅参考', 'Reference'),
} as const

export const FACTOR_FIELD_LABEL = {
  value: text('数值', 'Value'),
  formula: text('公式', 'Formula'),
  unit: text('单位', 'Unit'),
} as const

export const BOOLEAN_TEXT = {
  yes: text('是', 'Yes'),
  no: text('否', 'No'),
  required: text('强制', 'Required'),
  optional: text('可选', 'Optional'),
  unset: text('—', '—'),
} as const

export function localizePolicyText(
  value: string | LocalizedText | null | undefined,
  locale?: AppLocale,
) {
  return localizeText(value, locale)
}

export function formatDate(value: string | undefined, locale?: AppLocale) {
  if (!value) return localizePolicyText(BOOLEAN_TEXT.unset, locale)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatDateTime(value: string | undefined, locale?: AppLocale) {
  if (!value) return localizePolicyText(BOOLEAN_TEXT.unset, locale)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatNumber(value: number, locale?: AppLocale) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 4,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 0,
  }).format(value)
}
