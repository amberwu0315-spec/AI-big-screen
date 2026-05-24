import { resolveApiLocale } from '../i18n'
import { POLICY_LIBRARY_CRAWLED_STANDARD_SEED } from './policy-library.seed'
import type { ApiI18nOptions } from '../i18n'
import type {
  AlertRecord,
  AlertSubscription,
  EmissionFactor,
  IndicatorParamRevision,
  OrgMapping,
  OrgMappingCreateInput,
  PDFParseResult,
  PolicyLibraryApi,
  PolicyOrganization,
  SearchOrgMappingsInput,
  SearchStandardsInput,
  StandardDocument,
} from './policy-library.types'
import type { AppLocale, LocalizedText } from '@/lib/locale'
import { defineLocalizedText, localizeText } from '@/lib/locale'

const PREFIX = 'cyacle-x:policy-library'
const VERSION = 'v4'

const STANDARDS_KEY = `${PREFIX}:standards:${VERSION}`
const FACTORS_KEY = `${PREFIX}:factors:${VERSION}`
const ORGANIZATIONS_KEY = `${PREFIX}:organizations:${VERSION}`
const MAPPINGS_KEY = `${PREFIX}:mappings:${VERSION}`
const SUBSCRIPTIONS_KEY = `${PREFIX}:subscriptions:${VERSION}`
const ALERTS_KEY = `${PREFIX}:alerts:${VERSION}`
const REVISIONS_KEY = `${PREFIX}:revisions:${VERSION}`
const STANDARD_SEQ_KEY = `${PREFIX}:standards:seq:${VERSION}`
const FACTOR_SEQ_KEY = `${PREFIX}:factors:seq:${VERSION}`
const MAPPING_SEQ_KEY = `${PREFIX}:mappings:seq:${VERSION}`
const SUBSCRIPTION_SEQ_KEY = `${PREFIX}:subscriptions:seq:${VERSION}`

const UPLOAD_STANDARD_PDF = '/mock/pdfs/product-cfp-general.pdf'

const BASE_STANDARD_SEED: Array<StandardDocument> = [
  {
    id: 'std-24067',
    code: 'GB/T 24067-2024',
    title: '温室气体 产品碳足迹 量化要求和指南',
    category: 'NATIONAL',
    status: 'PUBLISHED',
    publisher: '国家市场监督管理总局 / 国家标准化管理委员会',
    publishDate: '2024-08-23',
    updateTime: '2024-10-01',
    version: '1.0',
    tags: ['碳足迹', '核算指南', '国家标准'],
    description:
      '本标准填补了国内产品碳足迹核算通则标准的空白，主要参考 ISO 14067:2018 制定，规定了产品碳足迹量化的原则、范围及方法。',
    pdfUrl: '/mock/pdfs/gbt-24067-2024.pdf',
    region: '全国',
  },
  {
    id: 'std-32150',
    code: 'GB/T 32150-2015',
    title: '工业企业温室气体排放核算和报告通则',
    category: 'NATIONAL',
    status: 'PUBLISHED',
    publisher: '国家标准化管理委员会',
    publishDate: '2015-11-19',
    updateTime: '2016-01-01',
    version: '2015',
    tags: ['企业核算', '通则', '温室气体'],
    description:
      '规定了工业企业温室气体排放核算与报告的术语、基本原则、工作流程、边界确定及核算步骤，是国内企业核算的通用准则。',
    pdfUrl: '/mock/pdfs/gbt-32150-2015.pdf',
    region: '全国',
  },
  {
    id: 'std-ghg-corp',
    code: 'GHG Protocol',
    title: '温室气体核算体系：企业核算与报告标准',
    category: 'INTERNATIONAL',
    status: 'PUBLISHED',
    publisher: 'WRI / WBCSD',
    publishDate: '2015-03-01',
    updateTime: '2024-04-19',
    version: 'Revised',
    tags: ['国际标准', 'Scope 1-3', '企业报告'],
    description:
      '全球公认的企业温室气体排放核算标准，定义了范围 1、2、3 的分类及核算逻辑，是企业报告的重要依据。',
    pdfUrl: '/mock/pdfs/ghg-protocol-revised.pdf',
    region: '全球',
  },
  {
    id: 'std-45540',
    code: 'GB/T 45540-2025',
    title: '温室气体 产品碳足迹 量化方法与要求 化学纤维',
    category: 'NATIONAL',
    status: 'PUBLISHED',
    publisher: '国家市场监督管理总局 / 国家标准化管理委员会',
    publishDate: '2025-03-28',
    updateTime: '2025-10-01',
    version: '1.0',
    tags: ['化纤行业', '产品碳足迹', '国家标准'],
    description:
      '规定了化学纤维产品碳足迹量化的范围、核算方法及报告要求，适用于涤纶、锦纶、粘胶等化纤产品。',
    pdfUrl: '/mock/pdfs/chemical-fiber-standard.pdf',
    region: '全国',
  },
  {
    id: 'std-jjf-251',
    code: 'JJF(冀) 251-2026',
    title: '火力发电企业碳排放计量器具配备及管理技术规范',
    category: 'LOCAL',
    status: 'PUBLISHED',
    publisher: '河北省市场监督管理局',
    publishDate: '2026-01-06',
    updateTime: '2026-01-06',
    version: '1.0',
    tags: ['火力发电', '碳计量', '地方标准'],
    description:
      '规定了火力发电企业碳排放计量器具的配备和管理要求，涵盖燃料属性、烟气流量等关键监测点的计量设备覆盖率。',
    pdfUrl: '/mock/pdfs/thermal-power-metering.pdf',
    region: '河北省',
  },
  {
    id: 'std-jsgt-018',
    code: 'T/JSGT 018—2024',
    title: '产品碳足迹量化方法 钢铁',
    category: 'GROUP',
    status: 'PUBLISHED',
    publisher: '江苏省钢铁行业协会',
    publishDate: '2024-06-30',
    updateTime: '2024-07-01',
    version: '1.0',
    tags: ['钢铁行业', '江苏省', '团体标准'],
    description:
      '规范了江苏省钢铁产品碳足迹量化的边界、数据收集及核算规则，助力绿色低碳钢铁转型。',
    pdfUrl: '/mock/pdfs/steel-product-carbon-footprint.pdf',
    region: '江苏省',
  },
  {
    id: 'std-ccpia-260',
    code: 'T/CCPIA 260—2024',
    title: '产品碳足迹量化方法与要求 草甘膦原药',
    category: 'GROUP',
    status: 'PUBLISHED',
    publisher: '中国农药工业协会',
    publishDate: '2024-12-25',
    updateTime: '2024-12-25',
    version: '1.0',
    tags: ['农药行业', '草甘膦', '团体标准'],
    description:
      '规范了草甘膦原药生产过程中的碳足迹核算，涵盖系统边界划定、原辅料数据收集及分配规则。',
    pdfUrl: '/mock/pdfs/product-cfp-general.pdf',
    region: '全国',
  },
  {
    id: 'std-32151-1',
    code: 'GB/T 32151.1-2015',
    title: '温室气体排放核算与报告要求 第1部分：发电企业',
    category: 'NATIONAL',
    status: 'PUBLISHED',
    publisher: '国家标准化管理委员会',
    publishDate: '2015-11-19',
    updateTime: '2015-11-19',
    version: '2015',
    tags: ['电力行业', '发电企业', '国家标准'],
    description:
      '针对电力生产企业的专项核算要求，包含燃煤、燃气发电的排放因子推荐值。',
    pdfUrl: '/mock/pdfs/gbt-32150-2015.pdf',
    region: '全国',
  },
]

const STANDARD_SEED: Array<StandardDocument> = [
  ...POLICY_LIBRARY_CRAWLED_STANDARD_SEED.filter(
    (candidate) =>
      !BASE_STANDARD_SEED.some((standard) => standard.id === candidate.id),
  ),
  ...BASE_STANDARD_SEED,
]

const PINNED_STANDARD_ID = 'std-prc-eco-environment-code-2026'

const FACTOR_SEED: Array<EmissionFactor> = [
  {
    id: 'fac-elec-2024',
    standardId: 'std-32151-1',
    name: '全国电网平均排放因子 (2024最新)',
    type: 'FACTOR',
    category: 'Electricity',
    value: 0.5568,
    unit: 'tCO2e/MWh',
    pageNo: 12,
    updateTime: '2024-04-12',
  },
  {
    id: 'fac-coal-bit',
    standardId: 'std-32151-1',
    name: '烟煤 (Bituminous Coal) 单位热值含碳量',
    type: 'FACTOR',
    category: 'Fuel',
    value: 26.1,
    unit: 'tC/TJ',
    pageNo: 14,
    updateTime: '2015-11-19',
  },
  {
    id: 'fac-coal-ant',
    standardId: 'std-32151-1',
    name: '无烟煤 (Anthracite Coal) 氧化率',
    type: 'FACTOR',
    category: 'Fuel',
    value: 0.94,
    unit: 'Ratio',
    pageNo: 15,
    updateTime: '2015-11-19',
  },
  {
    id: 'fac-glyph-main',
    standardId: 'std-ccpia-260',
    name: '草甘膦原药典型生产排放强度',
    type: 'FACTOR',
    category: 'Chemical',
    value: 13.03,
    unit: 'kgCO2e/kg',
    pageNo: 8,
    updateTime: '2024-12-25',
  },
  {
    id: 'fac-glyph-raw',
    standardId: 'std-ccpia-260',
    name: '原料磷矿石开采碳足迹 (摇篮到大门)',
    type: 'FACTOR',
    category: 'Raw Material',
    value: 0.45,
    unit: 'kgCO2e/kg',
    pageNo: 21,
    updateTime: '2024-12-25',
  },
  {
    id: 'fac-global-methane',
    standardId: 'std-ghg-corp',
    name: '甲烷 (CH4) 全球变暖潜势 (GWP100 - AR5)',
    type: 'FACTOR',
    category: 'Characterization',
    value: 28,
    unit: 'CO2e',
    pageNo: 45,
    updateTime: '2015-03-01',
  },
  {
    id: 'fac-global-n2o',
    standardId: 'std-ghg-corp',
    name: '一氧化二氮 (N2O) 全球变暖潜势 (GWP100 - AR5)',
    type: 'FACTOR',
    category: 'Characterization',
    value: 265,
    unit: 'CO2e',
    pageNo: 45,
    updateTime: '2015-03-01',
  },
  {
    id: 'fac-diesel-trans',
    standardId: 'std-32150',
    name: '柴油燃烧排放因子 (Mobile Combustion)',
    type: 'FACTOR',
    category: 'Transport',
    value: 3.16,
    unit: 'kgCO2/L',
    pageNo: 33,
    updateTime: '2015-11-19',
  },
  {
    id: 'fac-petrol-trans',
    standardId: 'std-32150',
    name: '汽油燃烧排放因子 (Mobile Combustion)',
    type: 'FACTOR',
    category: 'Transport',
    value: 2.31,
    unit: 'kgCO2/L',
    pageNo: 33,
    updateTime: '2015-11-19',
  },
  {
    id: 'fac-fiber-polyester',
    standardId: 'std-45540',
    name: '原生聚酯纤维碳足迹因子',
    type: 'FACTOR',
    category: 'Fiber',
    value: 3.85,
    unit: 'kgCO2e/kg',
    pageNo: 15,
    updateTime: '2025-03-28',
  },
  {
    id: 'fac-fiber-nylon',
    standardId: 'std-45540',
    name: '锦纶 6 切片生产碳足迹',
    type: 'FACTOR',
    category: 'Fiber',
    value: 7.21,
    unit: 'kgCO2e/kg',
    pageNo: 18,
    updateTime: '2025-03-28',
  },
  {
    id: 'fac-steel-crude',
    standardId: 'std-jsgt-018',
    name: '粗钢长流程产品碳排放强度',
    type: 'FACTOR',
    category: 'Steel',
    value: 1.85,
    unit: 'tCO2e/t',
    pageNo: 22,
    updateTime: '2024-06-30',
  },
  {
    id: 'fac-steel-slab',
    standardId: 'std-jsgt-018',
    name: '连铸坯生产工序碳因子',
    type: 'FACTOR',
    category: 'Steel',
    value: 0.42,
    unit: 'tCO2e/t',
    pageNo: 25,
    updateTime: '2024-06-30',
  },
  {
    id: 'fac-power-meter-eff',
    standardId: 'std-jjf-251',
    name: '燃煤发电机组排放强度基准值 (河北省)',
    type: 'FACTOR',
    category: 'Power',
    value: 0.812,
    unit: 'tCO2/MWh',
    pageNo: 15,
    updateTime: '2026-01-06',
  },
  {
    id: 'fac-power-coal-cons',
    standardId: 'std-jjf-251',
    name: '供电标准煤耗量限值 (300MW级)',
    type: 'FACTOR',
    category: 'Power',
    value: 315,
    unit: 'gce/kWh',
    pageNo: 19,
    updateTime: '2026-01-06',
  },
]

const ORGANIZATION_SEED: Array<PolicyOrganization> = [
  { id: 'org-001', name: '南京工厂', type: 'FACTORY' },
  { id: 'org-002', name: '武汉工厂', type: 'FACTORY' },
  { id: 'org-003', name: '上海工厂', type: 'FACTORY' },
  { id: 'org-004', name: '北京总部', type: 'HEADQUARTER' },
  { id: 'org-005', name: '深圳工厂', type: 'FACTORY' },
]

const MAPPING_SEED: Array<OrgMapping> = [
  {
    id: 'map-001',
    standardId: 'std-32150',
    standardName: '工业企业温室气体排放核算和报告通则',
    standardCode: 'GB/T 32150-2015',
    orgId: 'org-001',
    orgName: '南京工厂',
    scene: 'COMBUSTION',
    isMandatory: true,
    factorIds: ['fac-diesel-trans', 'fac-petrol-trans'],
    createdAt: '2024-01-15',
    createdBy: 'admin',
  },
  {
    id: 'map-002',
    standardId: 'std-32150',
    standardName: '工业企业温室气体排放核算和报告通则',
    standardCode: 'GB/T 32150-2015',
    orgId: 'org-002',
    orgName: '武汉工厂',
    scene: 'COMBUSTION',
    isMandatory: false,
    createdAt: '2024-02-10',
    createdBy: 'admin',
  },
  {
    id: 'map-003',
    standardId: 'std-32151-1',
    standardName: '温室气体排放核算与报告要求 第1部分：发电企业',
    standardCode: 'GB/T 32151.1-2015',
    orgId: 'org-001',
    orgName: '南京工厂',
    scene: 'ELECTRICITY',
    isMandatory: true,
    createdAt: '2024-03-01',
    createdBy: 'admin',
  },
]

const SUBSCRIPTION_SEED: Array<AlertSubscription> = [
  {
    id: 'sub-001',
    userId: 'user-001',
    standardId: 'std-32150',
    standardCode: 'GB/T 32150-2015',
    standardName: '工业企业温室气体排放核算和报告通则',
    alertTypes: ['STATUS_CHANGE', 'NEW_VERSION', 'DEPRECATION'],
    isActive: true,
    subscribedAt: '2024-01-20',
  },
  {
    id: 'sub-002',
    userId: 'user-001',
    standardId: 'std-24067',
    standardCode: 'GB/T 24067-2024',
    standardName: '温室气体 产品碳足迹 量化要求和指南',
    alertTypes: ['NEW_VERSION'],
    isActive: true,
    subscribedAt: '2024-08-25',
  },
]

const ALERT_SEED: Array<AlertRecord> = [
  {
    id: 'alert-001',
    userId: 'user-001',
    standardId: 'std-32150',
    standardCode: 'GB/T 32150-2015',
    standardName: '工业企业温室气体排放核算和报告通则',
    alertType: 'STATUS_CHANGE',
    message: '该标准状态已更新为现行版本',
    isRead: false,
    createdAt: '2024-01-22',
  },
  {
    id: 'alert-002',
    userId: 'user-001',
    standardId: 'std-24067',
    standardCode: 'GB/T 24067-2024',
    standardName: '温室气体 产品碳足迹 量化要求和指南',
    alertType: 'NEW_VERSION',
    message: '该标准有新版本发布：GB/T 24067-2025',
    isRead: true,
    createdAt: '2024-10-15',
  },
]

const REVISION_SEED: Array<IndicatorParamRevision> = [
  {
    id: 'rev-001',
    paramId: 'fac-elec-2024',
    standardId: 'std-32151-1',
    fieldName: 'value',
    oldValue: '0.5701',
    newValue: '0.5568',
    reason: '根据国家发改委 2024 年最新电网排放因子更新',
    revisedBy: 'admin',
    revisedAt: '2024-04-12',
  },
  {
    id: 'rev-002',
    paramId: 'fac-coal-bit',
    standardId: 'std-32151-1',
    fieldName: 'value',
    oldValue: '26.3',
    newValue: '26.1',
    reason: '根据实测数据修正',
    revisedBy: 'expert-01',
    revisedAt: '2024-03-15',
  },
]

function loadArray<T>(key: string, seed: Array<T>): Array<T> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed))
      return [...seed]
    }
    const parsed = JSON.parse(raw) as Array<T>
    if (!Array.isArray(parsed) || parsed.length === 0) return [...seed]
    const parsedById = new Map(
      parsed
        .map((item) => {
          const id = (item as { id?: string }).id
          return id ? ([id, item] as const) : null
        })
        .filter((entry): entry is readonly [string, T] => Boolean(entry)),
    )
    const seededIds = new Set(
      seed
        .map((item) => (item as { id?: string }).id)
        .filter((id): id is string => Boolean(id)),
    )
    const merged = [
      ...seed.map((item) => {
        const id = (item as { id?: string }).id
        return id ? (parsedById.get(id) ?? item) : item
      }),
      ...parsed.filter((item) => {
        const id = (item as { id?: string }).id
        return id ? !seededIds.has(id) : true
      }),
    ]
    localStorage.setItem(key, JSON.stringify(merged))
    return merged
  } catch {
    return [...seed]
  }
}

function saveArray<T>(key: string, data: Array<T>) {
  localStorage.setItem(key, JSON.stringify(data))
}

function loadStore() {
  return {
    standards: loadArray(STANDARDS_KEY, STANDARD_SEED),
    factors: loadArray(FACTORS_KEY, FACTOR_SEED),
    organizations: loadArray(ORGANIZATIONS_KEY, ORGANIZATION_SEED),
    mappings: loadArray(MAPPINGS_KEY, MAPPING_SEED),
    subscriptions: loadArray(SUBSCRIPTIONS_KEY, SUBSCRIPTION_SEED),
    alerts: loadArray(ALERTS_KEY, ALERT_SEED),
    revisions: loadArray(REVISIONS_KEY, REVISION_SEED),
  }
}

function sortStandardsByPriority(
  standards: Array<StandardDocument>,
  factorCounts: Map<string, number>,
  orderIndex: Map<string, number>,
) {
  return [...standards].sort((left, right) => {
    if (left.id === PINNED_STANDARD_ID && right.id !== PINNED_STANDARD_ID) {
      return -1
    }
    if (right.id === PINNED_STANDARD_ID && left.id !== PINNED_STANDARD_ID) {
      return 1
    }

    const leftHasFactors = (factorCounts.get(left.id) ?? 0) > 0
    const rightHasFactors = (factorCounts.get(right.id) ?? 0) > 0
    if (leftHasFactors !== rightHasFactors) {
      return leftHasFactors ? -1 : 1
    }

    return (orderIndex.get(left.id) ?? 0) - (orderIndex.get(right.id) ?? 0)
  })
}

function initializeStore() {
  loadStore()
}

function nextId(seqKey: string, prefix: string, existingIds: Array<string>) {
  const current = parseInt(localStorage.getItem(seqKey) ?? '0', 10)
  const maxExisting = existingIds.reduce((max, id) => {
    const matched = id.match(/(\d+)(?!.*\d)/)
    if (!matched) return max
    const value = parseInt(matched[1], 10)
    return Number.isNaN(value) ? max : Math.max(max, value)
  }, 0)
  const next = Math.max(current, maxExisting) + 1
  localStorage.setItem(seqKey, String(next))
  return `${prefix}-${String(next).padStart(3, '0')}`
}

function pageResult<T>(
  items: Array<T>,
  page = 1,
  pageSize = 10,
): { items: Array<T>; total: number; page: number; pageSize: number } {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

function findOrgMappingDuplicate(
  mappings: Array<OrgMapping>,
  input: Pick<OrgMappingCreateInput, 'orgId' | 'standardId' | 'scene'>,
) {
  return (
    mappings.find(
      (mapping) =>
        mapping.orgId === input.orgId &&
        mapping.standardId === input.standardId &&
        mapping.scene === input.scene,
    ) ?? null
  )
}

const REGION_I18N: Record<string, LocalizedText> = {
  全国: defineLocalizedText('全国', 'China'),
  全球: defineLocalizedText('全球', 'Global'),
  河北省: defineLocalizedText('河北省', 'Hebei Province'),
  江苏省: defineLocalizedText('江苏省', 'Jiangsu Province'),
}

const TAG_I18N: Record<string, LocalizedText> = {
  碳足迹: defineLocalizedText('碳足迹', 'Carbon Footprint'),
  核算指南: defineLocalizedText('核算指南', 'Accounting Guide'),
  国家标准: defineLocalizedText('国家标准', 'National Standard'),
  企业核算: defineLocalizedText('企业核算', 'Corporate Accounting'),
  通则: defineLocalizedText('通则', 'General Rules'),
  温室气体: defineLocalizedText('温室气体', 'Greenhouse Gas'),
  国际标准: defineLocalizedText('国际标准', 'International Standard'),
  现行: defineLocalizedText('现行', 'Published'),
  归档: defineLocalizedText('归档', 'Archived'),
  'Scope 1-3': defineLocalizedText('Scope 1-3', 'Scope 1-3'),
  企业报告: defineLocalizedText('企业报告', 'Corporate Reporting'),
  化纤行业: defineLocalizedText('化纤行业', 'Chemical Fiber'),
  产品碳足迹: defineLocalizedText('产品碳足迹', 'Product Carbon Footprint'),
  火力发电: defineLocalizedText('火力发电', 'Thermal Power'),
  碳计量: defineLocalizedText('碳计量', 'Carbon Metering'),
  地方标准: defineLocalizedText('地方标准', 'Local Standard'),
  钢铁行业: defineLocalizedText('钢铁行业', 'Steel Industry'),
  团体标准: defineLocalizedText('团体标准', 'Association Standard'),
  农药行业: defineLocalizedText('农药行业', 'Pesticide Industry'),
  草甘膦: defineLocalizedText('草甘膦', 'Glyphosate'),
  电力行业: defineLocalizedText('电力行业', 'Power Industry'),
  发电企业: defineLocalizedText('发电企业', 'Power Generators'),
  生态环境法典: defineLocalizedText(
    '生态环境法典',
    'Eco-Environment Code',
  ),
  国家法律: defineLocalizedText('国家法律', 'National Law'),
  生态环境: defineLocalizedText('生态环境', 'Ecology and Environment'),
  绿色低碳发展: defineLocalizedText(
    '绿色低碳发展',
    'Green and Low-Carbon Development',
  ),
  'WRI / WBCSD': defineLocalizedText('WRI / WBCSD', 'WRI / WBCSD'),
  'International Organization for Standardization': defineLocalizedText(
    'International Organization for Standardization',
    'International Organization for Standardization',
  ),
}

const PUBLISHER_I18N: Record<string, LocalizedText> = {
  '国家市场监督管理总局 / 国家标准化管理委员会': defineLocalizedText(
    '国家市场监督管理总局 / 国家标准化管理委员会',
    'State Administration for Market Regulation / Standardization Administration of China',
  ),
  国家标准化管理委员会: defineLocalizedText(
    '国家标准化管理委员会',
    'Standardization Administration of China',
  ),
  'WRI / WBCSD': defineLocalizedText('WRI / WBCSD', 'WRI / WBCSD'),
  河北省市场监督管理局: defineLocalizedText(
    '河北省市场监督管理局',
    'Hebei Administration for Market Regulation',
  ),
  江苏省钢铁行业协会: defineLocalizedText(
    '江苏省钢铁行业协会',
    'Jiangsu Iron and Steel Industry Association',
  ),
  中国农药工业协会: defineLocalizedText(
    '中国农药工业协会',
    'China Crop Protection Industry Association',
  ),
  中国标准化协会: defineLocalizedText(
    '中国标准化协会',
    'China Association for Standardization',
  ),
  全国人民代表大会: defineLocalizedText(
    '全国人民代表大会',
    'National People\'s Congress',
  ),
}

const STANDARD_I18N: Partial<
  Record<
    string,
    {
      title?: LocalizedText
      description?: LocalizedText
      publisher?: LocalizedText
      region?: LocalizedText
    }
  >
> = {
  'std-prc-eco-environment-code-2026': {
    title: defineLocalizedText(
      '中华人民共和国生态环境法典',
      'Eco-Environment Code of the People\'s Republic of China',
    ),
    description: defineLocalizedText(
      '《中华人民共和国生态环境法典》是我国继民法典之后第二部以“法典”命名的法律，也是我国生态环境保护进入法典化阶段的标志性立法。公开报道显示，法典共 5 编、1242 条，各编依次为总则、污染防治、生态保护、绿色低碳发展、法律责任和附则，通过对现行生态环境法律制度进行系统整合、编订纂修和集成升华，形成覆盖污染防治、生态保护与绿色低碳发展的系统性法律框架。',
      'The Eco-Environment Code of the People\'s Republic of China is the country\'s second law formally titled a code after the Civil Code and marks a milestone in the codification of ecological and environmental protection. Public reports indicate that it contains 5 parts and 1,242 articles covering general provisions, pollution prevention and control, ecological conservation, green and low-carbon development, legal liability, and supplementary provisions, forming an integrated legal framework for pollution control, ecological protection, and green low-carbon development.',
    ),
    publisher: PUBLISHER_I18N['全国人民代表大会'],
    region: REGION_I18N['全国'],
  },
  'std-24067': {
    title: defineLocalizedText(
      '温室气体 产品碳足迹 量化要求和指南',
      'Greenhouse Gases Product Carbon Footprint Quantification Requirements and Guidelines',
    ),
    description: defineLocalizedText(
      '本标准填补了国内产品碳足迹核算通则标准的空白，主要参考 ISO 14067:2018 制定，规定了产品碳足迹量化的原则、范围及方法。',
      'This standard fills the gap in China for general product carbon footprint accounting and defines the principles, scope, and methods for quantification with reference to ISO 14067:2018.',
    ),
    region: REGION_I18N['全国'],
  },
  'std-32150': {
    title: defineLocalizedText(
      '工业企业温室气体排放核算和报告通则',
      'General Rules for Accounting and Reporting Greenhouse Gas Emissions of Industrial Enterprises',
    ),
    description: defineLocalizedText(
      '规定了工业企业温室气体排放核算与报告的术语、基本原则、工作流程、边界确定及核算步骤，是国内企业核算的通用准则。',
      'Defines terms, principles, workflow, boundary setting, and accounting steps for greenhouse gas accounting and reporting by industrial enterprises, serving as a common rule for domestic corporate accounting.',
    ),
    region: REGION_I18N['全国'],
  },
  'std-ghg-corp': {
    title: defineLocalizedText(
      '温室气体核算体系：企业核算与报告标准',
      'Greenhouse Gas Protocol: Corporate Accounting and Reporting Standard',
    ),
    description: defineLocalizedText(
      '全球公认的企业温室气体排放核算标准，定义了范围 1、2、3 的分类及核算逻辑，是企业报告的重要依据。',
      'A globally recognized standard for corporate greenhouse gas accounting that defines Scope 1, 2, and 3 classification and accounting logic, forming an important basis for corporate reporting.',
    ),
    region: REGION_I18N['全球'],
  },
  'std-45540': {
    title: defineLocalizedText(
      '温室气体 产品碳足迹 量化方法与要求 化学纤维',
      'Greenhouse Gases Product Carbon Footprint Quantification Methods and Requirements for Chemical Fibers',
    ),
    description: defineLocalizedText(
      '规定了化学纤维产品碳足迹量化的范围、核算方法及报告要求，适用于涤纶、锦纶、粘胶等化纤产品。',
      'Defines quantification scope, accounting methods, and reporting requirements for chemical fiber product carbon footprints, covering polyester, nylon, viscose, and related fibers.',
    ),
    region: REGION_I18N['全国'],
  },
  'std-jjf-251': {
    title: defineLocalizedText(
      '火力发电企业碳排放计量器具配备及管理技术规范',
      'Technical Specification for Carbon Emission Metering Equipment Allocation and Management in Thermal Power Enterprises',
    ),
    description: defineLocalizedText(
      '规定了火力发电企业碳排放计量器具的配备和管理要求，涵盖燃料属性、烟气流量等关键监测点的计量设备覆盖率。',
      'Specifies allocation and management requirements for carbon emission metering equipment in thermal power enterprises, including coverage of key monitoring points such as fuel properties and flue gas flow.',
    ),
    region: REGION_I18N['河北省'],
  },
  'std-jsgt-018': {
    title: defineLocalizedText(
      '产品碳足迹量化方法 钢铁',
      'Product Carbon Footprint Quantification Method for Steel',
    ),
    description: defineLocalizedText(
      '规范了江苏省钢铁产品碳足迹量化的边界、数据收集及核算规则，助力绿色低碳钢铁转型。',
      'Standardizes the boundary, data collection, and accounting rules for steel product carbon footprints in Jiangsu, supporting greener steel transformation.',
    ),
    region: REGION_I18N['江苏省'],
  },
  'std-ccpia-260': {
    title: defineLocalizedText(
      '产品碳足迹量化方法与要求 草甘膦原药',
      'Product Carbon Footprint Quantification Method and Requirements for Technical Glyphosate',
    ),
    description: defineLocalizedText(
      '规范了草甘膦原药生产过程中的碳足迹核算，涵盖系统边界划定、原辅料数据收集及分配规则。',
      'Defines carbon footprint accounting for the production of technical glyphosate, including system boundary setting, data collection for inputs, and allocation rules.',
    ),
    region: REGION_I18N['全国'],
  },
  'std-32151-1': {
    title: defineLocalizedText(
      '温室气体排放核算与报告要求 第1部分：发电企业',
      'Requirements for Accounting and Reporting Greenhouse Gas Emissions Part 1: Power Generation Enterprises',
    ),
    description: defineLocalizedText(
      '针对电力生产企业的专项核算要求，包含燃煤、燃气发电的排放因子推荐值。',
      'Provides sector-specific accounting requirements for power producers, including recommended emission factors for coal-fired and gas-fired generation.',
    ),
    region: REGION_I18N['全国'],
  },
  'std-upload-001': {
    title: defineLocalizedText(
      '产品碳足迹 评价技术通则',
      'General Technical Rules for Product Carbon Footprint Evaluation',
    ),
    description: defineLocalizedText(
      '本文件规定了产品碳足迹评价的术语和定义、原则、核算边界、核算方法及评价报告等内容。',
      'This document defines terminology, principles, accounting boundaries, methods, and reporting requirements for product carbon footprint evaluation.',
    ),
  },
}

const FACTOR_I18N: Partial<
  Record<string, { name?: LocalizedText; category?: LocalizedText }>
> = {
  'fac-elec-2024': {
    name: defineLocalizedText(
      '全国电网平均排放因子 (2024最新)',
      'Average Grid Emission Factor (2024)',
    ),
    category: defineLocalizedText('Electricity', 'Electricity'),
  },
  'fac-coal-bit': {
    name: defineLocalizedText(
      '烟煤 (Bituminous Coal) 单位热值含碳量',
      'Bituminous Coal Carbon Content per Unit Calorific Value',
    ),
    category: defineLocalizedText('Fuel', 'Fuel'),
  },
  'fac-coal-ant': {
    name: defineLocalizedText(
      '无烟煤 (Anthracite Coal) 氧化率',
      'Anthracite Coal Oxidation Rate',
    ),
    category: defineLocalizedText('Fuel', 'Fuel'),
  },
  'fac-glyph-main': {
    name: defineLocalizedText(
      '草甘膦原药典型生产排放强度',
      'Typical Emission Intensity of Technical Glyphosate Production',
    ),
    category: defineLocalizedText('Chemical', 'Chemical'),
  },
  'fac-glyph-raw': {
    name: defineLocalizedText(
      '原料磷矿石开采碳足迹 (摇篮到大门)',
      'Carbon Footprint of Phosphate Ore Mining (Cradle-to-Gate)',
    ),
    category: defineLocalizedText('Raw Material', 'Raw Material'),
  },
  'fac-global-methane': {
    name: defineLocalizedText(
      '甲烷 (CH4) 全球变暖潜势 (GWP100 - AR5)',
      'Methane (CH4) Global Warming Potential (GWP100 - AR5)',
    ),
    category: defineLocalizedText('Characterization', 'Characterization'),
  },
  'fac-global-n2o': {
    name: defineLocalizedText(
      '一氧化二氮 (N2O) 全球变暖潜势 (GWP100 - AR5)',
      'Nitrous Oxide (N2O) Global Warming Potential (GWP100 - AR5)',
    ),
    category: defineLocalizedText('Characterization', 'Characterization'),
  },
  'fac-diesel-trans': {
    name: defineLocalizedText(
      '柴油燃烧排放因子 (Mobile Combustion)',
      'Diesel Combustion Emission Factor (Mobile Combustion)',
    ),
    category: defineLocalizedText('Transport', 'Transport'),
  },
  'fac-petrol-trans': {
    name: defineLocalizedText(
      '汽油燃烧排放因子 (Mobile Combustion)',
      'Gasoline Combustion Emission Factor (Mobile Combustion)',
    ),
    category: defineLocalizedText('Transport', 'Transport'),
  },
  'fac-fiber-polyester': {
    name: defineLocalizedText(
      '原生聚酯纤维碳足迹因子',
      'Virgin Polyester Fiber Carbon Footprint Factor',
    ),
    category: defineLocalizedText('Fiber', 'Fiber'),
  },
  'fac-fiber-nylon': {
    name: defineLocalizedText(
      '锦纶 6 切片生产碳足迹',
      'Carbon Footprint of Nylon 6 Chips Production',
    ),
    category: defineLocalizedText('Fiber', 'Fiber'),
  },
  'fac-steel-crude': {
    name: defineLocalizedText(
      '粗钢长流程产品碳排放强度',
      'Carbon Emission Intensity of Long-process Crude Steel',
    ),
    category: defineLocalizedText('Steel', 'Steel'),
  },
  'fac-steel-slab': {
    name: defineLocalizedText(
      '连铸坯生产工序碳因子',
      'Carbon Factor for Continuous Casting Slab Production',
    ),
    category: defineLocalizedText('Steel', 'Steel'),
  },
  'fac-power-meter-eff': {
    name: defineLocalizedText(
      '燃煤发电机组排放强度基准值 (河北省)',
      'Coal-fired Unit Emission Intensity Baseline (Hebei)',
    ),
    category: defineLocalizedText('Power', 'Power'),
  },
  'fac-power-coal-cons': {
    name: defineLocalizedText(
      '供电标准煤耗量限值 (300MW级)',
      'Standard Coal Consumption Limit for Power Supply (300 MW Class)',
    ),
    category: defineLocalizedText('Power', 'Power'),
  },
}

const ORGANIZATION_I18N: Record<string, LocalizedText> = {
  'org-001': defineLocalizedText('南京工厂', 'Nanjing Plant'),
  'org-002': defineLocalizedText('武汉工厂', 'Wuhan Plant'),
  'org-003': defineLocalizedText('上海工厂', 'Shanghai Plant'),
  'org-004': defineLocalizedText('北京总部', 'Beijing Headquarters'),
  'org-005': defineLocalizedText('深圳工厂', 'Shenzhen Plant'),
}

const CREATED_BY_I18N: Record<string, LocalizedText> = {
  admin: defineLocalizedText('admin', 'admin'),
  'user-001': defineLocalizedText('user-001', 'user-001'),
  'expert-01': defineLocalizedText('expert-01', 'expert-01'),
}

const ALERT_MESSAGE_I18N: Record<string, LocalizedText> = {
  'alert-001': defineLocalizedText(
    '该标准状态已更新为现行版本',
    'This standard status has been updated to Published.',
  ),
  'alert-002': defineLocalizedText(
    '该标准有新版本发布：GB/T 24067-2025',
    'A new version is available for this standard: GB/T 24067-2025.',
  ),
}

const REVISION_REASON_I18N: Record<string, LocalizedText> = {
  'rev-001': defineLocalizedText(
    '根据国家发改委 2024 年最新电网排放因子更新',
    'Updated according to the latest 2024 grid emission factor released by NDRC.',
  ),
  'rev-002': defineLocalizedText(
    '根据实测数据修正',
    'Adjusted according to measured data.',
  ),
}

function resolveLocale(options?: ApiI18nOptions): AppLocale {
  return resolveApiLocale(options)
}

function splitBilingual(value: string, locale: AppLocale) {
  if (!value.includes(' / ')) return value
  const [zh, en] = value.split(' / ')
  return locale === 'en-US' ? en?.trim() || value : zh?.trim() || value
}

function localizeByMap(
  value: string | undefined,
  locale: AppLocale,
  mapping?: Record<string, LocalizedText>,
) {
  if (!value) return value
  const localized = mapping?.[value]
  if (localized) return localizeText(localized, locale)
  return splitBilingual(value, locale)
}

function localizeStandard(
  standard: StandardDocument,
  options?: ApiI18nOptions,
): StandardDocument {
  const locale = resolveLocale(options)
  const override = STANDARD_I18N[standard.id]
  return {
    ...standard,
    title: override?.title
      ? localizeText(override.title, locale)
      : splitBilingual(standard.title, locale),
    publisher: override?.publisher
      ? localizeText(override.publisher, locale)
      : (localizeByMap(standard.publisher, locale, PUBLISHER_I18N) ??
        standard.publisher),
    description: override?.description
      ? localizeText(override.description, locale)
      : (localizeByMap(standard.description, locale) ?? standard.description),
    region: override?.region
      ? localizeText(override.region, locale)
      : localizeByMap(standard.region, locale, REGION_I18N),
    tags: standard.tags.map(
      (tag) => localizeByMap(tag, locale, TAG_I18N) ?? tag,
    ),
    sourceAuthority:
      localizeByMap(standard.sourceAuthority, locale) ??
      standard.sourceAuthority,
    sourceNote:
      localizeByMap(standard.sourceNote, locale) ?? standard.sourceNote,
    lifecycleNote:
      localizeByMap(standard.lifecycleNote, locale) ?? standard.lifecycleNote,
    attachments: standard.attachments?.map((attachment) => ({
      ...attachment,
      title: splitBilingual(attachment.title, locale),
      note: localizeByMap(attachment.note, locale) ?? attachment.note,
    })),
  }
}

function localizeFactor(
  factor: EmissionFactor,
  options?: ApiI18nOptions,
): EmissionFactor {
  const locale = resolveLocale(options)
  const override = FACTOR_I18N[factor.id]
  return {
    ...factor,
    name: override?.name
      ? localizeText(override.name, locale)
      : splitBilingual(factor.name, locale),
    category: override?.category
      ? localizeText(override.category, locale)
      : (localizeByMap(factor.category, locale) ?? factor.category),
  }
}

function localizeOrganization(
  organization: PolicyOrganization,
  options?: ApiI18nOptions,
): PolicyOrganization {
  const locale = resolveLocale(options)
  return {
    ...organization,
    name: localizeText(
      ORGANIZATION_I18N[organization.id] ??
        defineLocalizedText(organization.name, organization.name),
      locale,
    ),
  }
}

function localizeMapping(
  mapping: OrgMapping,
  options?: ApiI18nOptions,
): OrgMapping {
  const locale = resolveLocale(options)
  const store = loadStore()
  const standard = store.standards.find(
    (item) => item.id === mapping.standardId,
  )
  const organization = store.organizations.find(
    (item) => item.id === mapping.orgId,
  )
  return {
    ...mapping,
    standardName: standard
      ? localizeStandard(standard, options).title
      : splitBilingual(mapping.standardName, locale),
    orgName: organization
      ? localizeOrganization(organization, options).name
      : (localizeByMap(mapping.orgName, locale, ORGANIZATION_I18N) ??
        mapping.orgName),
    createdBy:
      localizeByMap(mapping.createdBy, locale, CREATED_BY_I18N) ??
      mapping.createdBy,
  }
}

function localizeSubscription(
  subscription: AlertSubscription,
  options?: ApiI18nOptions,
): AlertSubscription {
  const store = loadStore()
  const standard = store.standards.find(
    (item) => item.id === subscription.standardId,
  )
  return {
    ...subscription,
    standardName: standard
      ? localizeStandard(standard, options).title
      : subscription.standardName,
  }
}

function localizeAlert(
  alert: AlertRecord,
  options?: ApiI18nOptions,
): AlertRecord {
  const store = loadStore()
  const standard = store.standards.find((item) => item.id === alert.standardId)
  const locale = resolveLocale(options)
  return {
    ...alert,
    standardName: standard
      ? localizeStandard(standard, options).title
      : alert.standardName,
    message: localizeText(
      ALERT_MESSAGE_I18N[alert.id] ??
        defineLocalizedText(alert.message, alert.message),
      locale,
    ),
  }
}

function localizeRevision(
  revision: IndicatorParamRevision,
  options?: ApiI18nOptions,
): IndicatorParamRevision {
  const locale = resolveLocale(options)
  return {
    ...revision,
    reason: localizeText(
      REVISION_REASON_I18N[revision.id] ??
        defineLocalizedText(revision.reason, revision.reason),
      locale,
    ),
    revisedBy:
      localizeByMap(revision.revisedBy, locale, CREATED_BY_I18N) ??
      revision.revisedBy,
  }
}

function localizePdfParseResult(
  result: PDFParseResult,
  options?: ApiI18nOptions,
): PDFParseResult {
  const locale = resolveLocale(options)
  if (locale === 'zh-CN') return result
  return {
    ...result,
    tables: result.tables.map((table, index) => ({
      ...table,
      rows:
        index === 0
          ? [
              ['Factor Name', 'Value', 'Unit', 'Uncertainty'],
              ['Average Grid Emission Factor', '0.5568', 'tCO2e/MWh', '+/-5%'],
              ['Coal Carbon Content', '26.1', 'tC/TJ', '+/-3%'],
              ['Gasoline Combustion Factor', '2.31', 'kgCO2/L', '+/-5%'],
            ]
          : [
              ['Formula Name', 'Expression'],
              ['CO2 Emissions', 'E = A x EF x (1 - R)'],
              ['Correction Factor', 'R = 0.02 x eta'],
            ],
    })),
    metadata: {
      ...result.metadata,
      title: splitBilingual(result.metadata.title, locale),
      publisher: localizeByMap(
        result.metadata.publisher,
        locale,
        PUBLISHER_I18N,
      ),
    },
  }
}

export function createPolicyLibraryMockApi(
  options?: ApiI18nOptions,
): PolicyLibraryApi {
  initializeStore()

  return {
    listStandards() {
      const store = loadStore()
      const factorCounts = new Map<string, number>()
      store.factors.forEach((factor) => {
        factorCounts.set(
          factor.standardId,
          (factorCounts.get(factor.standardId) ?? 0) + 1,
        )
      })
      const orderIndex = new Map(
        store.standards.map((item, index) => [item.id, index] as const),
      )

      return sortStandardsByPriority(
        store.standards.map((item) => localizeStandard(item, options)),
        factorCounts,
        orderIndex,
      )
    },
    searchStandards(params: SearchStandardsInput) {
      const store = loadStore()
      const factorCounts = new Map<string, number>()
      store.factors.forEach((factor) => {
        factorCounts.set(
          factor.standardId,
          (factorCounts.get(factor.standardId) ?? 0) + 1,
        )
      })
      const orderIndex = new Map(
        store.standards.map((item, index) => [item.id, index] as const),
      )
      const standards = sortStandardsByPriority(
        store.standards.map((item) => localizeStandard(item, options)),
        factorCounts,
        orderIndex,
      )
      const keyword = params.keyword.trim().toLowerCase()
      const filtered = standards.filter((standard) => {
        const matchKeyword =
          keyword.length === 0 ||
          standard.title.toLowerCase().includes(keyword) ||
          standard.code.toLowerCase().includes(keyword) ||
          standard.publisher.toLowerCase().includes(keyword) ||
          standard.tags.some((tag) => tag.toLowerCase().includes(keyword))
        const matchStatus =
          !params.status ||
          params.status.length === 0 ||
          params.status.includes(standard.status)
        const matchCategory =
          !params.category ||
          params.category.length === 0 ||
          params.category.includes(standard.category)
        return matchKeyword && matchStatus && matchCategory
      })
      return pageResult(filtered, params.page ?? 1, params.pageSize ?? 8)
    },
    getStandardById(id: string) {
      const standard = loadStore().standards.find((item) => item.id === id)
      return standard ? localizeStandard(standard, options) : null
    },
    getFactorsByStandardId(standardId: string) {
      return loadStore()
        .factors.filter((item) => item.standardId === standardId)
        .map((item) => localizeFactor(item, options))
    },
    getFactorRevisions(factorId: string) {
      return loadStore()
        .revisions.filter((item) => item.paramId === factorId)
        .map((item) => localizeRevision(item, options))
    },
    parsePDF() {
      const standard = localizeStandard(loadStore().standards[0], options)
      return localizePdfParseResult(
        {
          tables: [
            {
              pageNo: 12,
              rows: [
                ['因子名称', '数值', '单位', '不确定度'],
                ['全国电网排放因子', '0.5568', 'tCO2e/MWh', '±5%'],
                ['烟煤含碳量', '26.1', 'tC/TJ', '±3%'],
                ['汽油燃烧因子', '2.31', 'kgCO2/L', '±5%'],
              ],
              confidence: 0.92,
              bbox: { x: 50, y: 200, width: 400, height: 200 },
            },
            {
              pageNo: 15,
              rows: [
                ['公式名称', '表达式'],
                ['CO2排放', 'E = A × EF × (1 - R)'],
                ['修正系数', 'R = 0.02 × η'],
              ],
              confidence: 0.88,
              bbox: { x: 80, y: 300, width: 350, height: 150 },
            },
          ],
          metadata: {
            title: standard.title,
            code: standard.code,
            publisher: standard.publisher,
            publishDate: standard.publishDate,
          },
        },
        options,
      ) satisfies PDFParseResult
    },
    uploadStandardPDF(_file: File | null) {
      const { standards } = loadStore()
      const standard: StandardDocument = {
        id: nextId(
          STANDARD_SEQ_KEY,
          'std-upload',
          standards.map((item) => item.id),
        ),
        title: '产品碳足迹 评价技术通则',
        code: 'T/CAS 616-2022',
        version: '2022',
        status: 'PUBLISHED',
        category: 'GROUP',
        publishDate: '2022-09-01',
        updateTime: new Date().toISOString().slice(0, 10),
        publisher: '中国标准化协会',
        tags: ['碳足迹', '评价通则', '演示解析'],
        pdfUrl: UPLOAD_STANDARD_PDF,
        description:
          '本文件规定了产品碳足迹评价的术语和定义、原则、核算边界、核算方法及评价报告等内容。',
      }
      standards.unshift(standard)
      saveArray(STANDARDS_KEY, standards)
      return localizeStandard(standard, options)
    },
    createFactorsFromParse(standardId, factors) {
      const store = loadStore()
      const created = factors.reduce<Array<EmissionFactor>>(
        (result, factor) => {
          const name = factor.name?.trim()
          const unit = factor.unit?.trim()
          const value = Number(factor.value)
          if (!name || !unit || Number.isNaN(value)) return result
          result.push({
            id: nextId(
              FACTOR_SEQ_KEY,
              'fac-parse',
              store.factors.map((item) => item.id),
            ),
            standardId,
            name,
            type: factor.type ?? 'FACTOR',
            value,
            unit,
            pageNo: factor.pageNo ?? 1,
            category: factor.category,
            formula: factor.formula,
            updateTime: new Date().toISOString().slice(0, 10),
          } satisfies EmissionFactor)
          return result
        },
        [],
      )
      saveArray(FACTORS_KEY, [...created, ...store.factors])
      return created.map((item) => localizeFactor(item, options))
    },
    listOrganizations() {
      return loadStore().organizations.map((item) =>
        localizeOrganization(item, options),
      )
    },
    getOrgMappings(params: SearchOrgMappingsInput) {
      const mappings = loadStore().mappings.map((item) =>
        localizeMapping(item, options),
      )
      const keyword = params.keyword?.trim().toLowerCase() ?? ''
      const filtered = mappings.filter((mapping) => {
        const matchKeyword =
          keyword.length === 0 ||
          mapping.standardName.toLowerCase().includes(keyword) ||
          mapping.standardCode.toLowerCase().includes(keyword) ||
          mapping.orgName.toLowerCase().includes(keyword)
        const matchOrg = !params.orgId || mapping.orgId === params.orgId
        const matchStandard =
          !params.standardId || mapping.standardId === params.standardId
        const matchScene = !params.scene || mapping.scene === params.scene
        return matchKeyword && matchOrg && matchStandard && matchScene
      })
      return pageResult(filtered, params.page ?? 1, params.pageSize ?? 10)
    },
    getMappingsByStandardId(standardId: string) {
      return loadStore()
        .mappings.filter((item) => item.standardId === standardId)
        .map((item) => localizeMapping(item, options))
    },
    createOrgMapping(input: OrgMappingCreateInput) {
      const store = loadStore()
      const standard = store.standards.find(
        (item) => item.id === input.standardId,
      )
      const organization = store.organizations.find(
        (item) => item.id === input.orgId,
      )
      if (!standard || !organization) {
        throw new Error(
          resolveLocale(options) === 'en-US'
            ? 'Standard or organization does not exist'
            : '标准或组织不存在',
        )
      }
      if (findOrgMappingDuplicate(store.mappings, input)) {
        throw new Error(
          resolveLocale(options) === 'en-US'
            ? 'A mapping for this organization, standard, and scenario already exists'
            : '当前组织已存在该标准在此场景下的映射',
        )
      }
      const mapping: OrgMapping = {
        id: nextId(
          MAPPING_SEQ_KEY,
          'map',
          store.mappings.map((item) => item.id),
        ),
        standardId: standard.id,
        standardName: standard.title,
        standardCode: standard.code,
        orgId: organization.id,
        orgName: organization.name,
        scene: input.scene,
        isMandatory: input.isMandatory,
        factorIds: input.factorIds,
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: 'user-001',
      }
      saveArray(MAPPINGS_KEY, [mapping, ...store.mappings])
      return localizeMapping(mapping, options)
    },
    updateOrgMapping(id: string, updates: Partial<OrgMapping>) {
      const store = loadStore()
      const index = store.mappings.findIndex((item) => item.id === id)
      if (index < 0) return null
      const mapping = { ...store.mappings[index], ...updates, id }
      store.mappings[index] = mapping
      saveArray(MAPPINGS_KEY, store.mappings)
      return localizeMapping(mapping, options)
    },
    deleteOrgMapping(id: string) {
      const store = loadStore()
      const next = store.mappings.filter((item) => item.id !== id)
      if (next.length === store.mappings.length) return false
      saveArray(MAPPINGS_KEY, next)
      return true
    },
    getAlertSubscriptions(userId: string) {
      return loadStore()
        .subscriptions.filter((item) => item.userId === userId && item.isActive)
        .map((item) => localizeSubscription(item, options))
    },
    subscribeAlert(userId, standardId, alertTypes) {
      const store = loadStore()
      const standard = store.standards.find((item) => item.id === standardId)
      if (!standard) {
        throw new Error(
          resolveLocale(options) === 'en-US'
            ? 'Standard does not exist'
            : '标准不存在',
        )
      }
      const existing = store.subscriptions.find(
        (item) => item.userId === userId && item.standardId === standardId,
      )
      if (existing) {
        const updated = {
          ...existing,
          alertTypes,
          isActive: true,
        }
        saveArray(
          SUBSCRIPTIONS_KEY,
          store.subscriptions.map((item) =>
            item.id === existing.id ? updated : item,
          ),
        )
        return localizeSubscription(updated, options)
      }
      const created: AlertSubscription = {
        id: nextId(
          SUBSCRIPTION_SEQ_KEY,
          'sub',
          store.subscriptions.map((item) => item.id),
        ),
        userId,
        standardId: standard.id,
        standardCode: standard.code,
        standardName: standard.title,
        alertTypes,
        isActive: true,
        subscribedAt: new Date().toISOString().slice(0, 10),
      }
      saveArray(SUBSCRIPTIONS_KEY, [created, ...store.subscriptions])
      return localizeSubscription(created, options)
    },
    unsubscribeAlert(userId: string, standardId: string) {
      const store = loadStore()
      const target = store.subscriptions.find(
        (item) => item.userId === userId && item.standardId === standardId,
      )
      if (!target) return false
      saveArray(
        SUBSCRIPTIONS_KEY,
        store.subscriptions.map((item) =>
          item.id === target.id ? { ...item, isActive: false } : item,
        ),
      )
      return true
    },
    getAlerts(userId: string, unreadOnly = false) {
      const alerts = loadStore()
        .alerts.filter((item) => item.userId === userId)
        .map((item) => localizeAlert(item, options))
      return unreadOnly ? alerts.filter((item) => !item.isRead) : alerts
    },
    markAlertAsRead(userId: string, alertId: string) {
      const store = loadStore()
      const index = store.alerts.findIndex(
        (item) => item.userId === userId && item.id === alertId,
      )
      if (index < 0) return false
      store.alerts[index] = { ...store.alerts[index], isRead: true }
      saveArray(ALERTS_KEY, store.alerts)
      return true
    },
    markAllAlertsAsRead(userId: string) {
      const store = loadStore()
      saveArray(
        ALERTS_KEY,
        store.alerts.map((item) =>
          item.userId === userId ? { ...item, isRead: true } : item,
        ),
      )
    },
  }
}
