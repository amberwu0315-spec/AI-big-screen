import * as React from 'react'
import type { AppLocale } from '@/lib/locale'

const PRODUCT_CARBON_TRANSLATIONS: Record<string, string> = {
  产品碳足迹: 'Product Carbon Footprint',
  产品碳核算: 'Product Carbon Accounting',
  产品碳核算工作台: 'Product Carbon Workbench',
  基本信息: 'Basic Information',
  模型配置: 'Model Configuration',
  计算分析: 'Calculation Analysis',
  活动数据: 'Activity Data',
  因子数据: 'Factor Data',
  报告信息: 'Report Information',
  导出数值: 'Export Values',
  报告: 'Report',
  核算: 'Accounting',
  透视: 'Insights',
  生成报告: 'Generate Report',
  '按阶段分类录入原材料、能源等活动数据':
    'Capture raw material, energy, and other activity data by lifecycle stage.',
  支持批量导入和数据质量评分: 'Support bulk imports and data quality scoring.',
  自动关联对应排放因子:
    'Automatically link the corresponding emission factors.',
  '内置国家/行业因子数据库': 'Built-in national and industry factor libraries.',
  支持自定义因子并追踪来源: 'Support custom factors with source traceability.',
  与活动数据自动匹配和校验:
    'Automatically match and validate against activity data.',
  '按方法学导出 GWP 数值明细': 'Export detailed GWP values by methodology.',
  '支持 Excel / CSV 格式': 'Support Excel and CSV exports.',
  可配置导出字段与精度: 'Configurable export fields and precision.',
  '基于报告信息自动生成 PDF':
    'Generate PDFs automatically from report information.',
  '支持 ISO 14067 标准格式': 'Support ISO 14067 report formatting.',
  多语言报告一键导出: 'Export bilingual reports in one click.',
  '功能正在开发中，敬请期待': 'This feature is under development.',
  '保存中…': 'Saving...',
  未保存: 'Not saved',
  刚刚保存: 'Saved just now',
  ' 分钟前保存': ' min ago',
  另存为版本: 'Save as Version',
  '产品：': 'Product: ',
  '核算周期：': 'Accounting Period: ',
  '定义核算模型的基本参数和系统范围。':
    'Define the core parameters and system scope of the accounting model.',
  模型名称: 'Model Name',
  系统边界: 'System Boundary',
  核算周期: 'Accounting Period',
  地理边界: 'Geographical Boundary',
  从摇篮到大门: 'Cradle to Gate',
  摇篮到大门: 'Cradle to Gate',
  摇篮到坟墓: 'Cradle to Grave',
  大门到大门: 'Gate to Gate',
  演示门厂生产地: 'Demo plant production site',
  输出产品设置: 'Output Product Settings',
  '配置功能单位和核算产量基准。':
    'Configure the functional unit and production reference for accounting.',
  核算单位: 'Accounting Unit',
  核算产量: 'Accounting Output',
  产量数值: 'Output Value',
  产量不确定性: 'Output Uncertainty',
  产品分类: 'Product Category',
  核算设置: 'Accounting Settings',
  '选择核算执行标准、报告模板和评分方法。':
    'Choose the execution standard, report template, and scoring methodology.',
  项目执行标准: 'Execution Standard',
  适用报告模板: 'Applicable Report Template',
  通用产品碳足迹报告: 'General Product Carbon Footprint Report',
  'CBAM 合规报告': 'CBAM Compliance Report',
  质量打分体系: 'Quality Scoring Method',
  蒙特卡洛法: 'Monte Carlo Method',
  谱系矩阵法: 'Pedigree Matrix Method',
  多语言报告: 'Multilingual Report',
  分析设置: 'Analysis Settings',
  '配置排除计算、敏感性分析和温室气体量化方法。':
    'Configure cut-off calculations, sensitivity analysis, and greenhouse gas quantification methods.',
  设置分析方法: 'Analysis Methods',
  排除计算: 'Cut-off Calculation',
  数据质量打分: 'Data Quality Scoring',
  敏感性分析: 'Sensitivity Analysis',
  重要问题识别: 'Hotspot Identification',
  不确定性分析: 'Uncertainty Analysis',
  按重要数据波动区间分析: 'Analyze by key data fluctuation ranges',
  按重要数据不确定性分析: 'Analyze by key data uncertainty',
  温室气体量化方法: 'GHG Quantification Method',
  排放因子法: 'Emission Factor Method',
  质量守恒法: 'Mass Balance Method',
  高级设置: 'Advanced Settings',
  新建核算任务: 'Create Accounting Task',
  '创建产品碳足迹核算任务，填写基本配置后进入工作台完成详细设置。':
    'Create a product carbon footprint accounting task and continue configuration in the workbench.',
  '核算模型名称 *': 'Accounting Model Name *',
  '产品名称 *': 'Product Name *',
  产品编码: 'Product Code',
  执行标准: 'Execution Standard',
  取消: 'Cancel',
  创建并进入工作台: 'Create and Open Workbench',
  '例如：铝合金板材 PCF 核算 2024': 'e.g. Aluminium Plate PCF Accounting 2024',
  '例如：铝合金板材 6061': 'e.g. Aluminium Plate 6061',
  '例如：ALU-SHEET-001': 'e.g. ALU-SHEET-001',
  草稿: 'Draft',
  计算中: 'Calculating',
  已完成: 'Completed',
  审核中: 'In Review',
  全部状态: 'All Statuses',
  '搜索模型名称、产品名称...': 'Search model or product names...',
  新建核算: 'New Accounting',
  核算任务: 'Accounting Task',
  'GWP 排放结果': 'GWP Result',
  不确定性: 'Uncertainty',
  状态: 'Status',
  更新时间: 'Updated At',
  操作: 'Actions',
  无匹配结果: 'No Matching Results',
  '尝试清除筛选条件后重新查看。': 'Clear the current filters and try again.',
  清空过滤条件: 'Clear Filters',
  暂无核算任务: 'No Accounting Tasks',
  '可直接创建一个新的产品碳足迹核算任务。':
    'Create a new product carbon footprint accounting task to get started.',
  进入工作台: 'Open Workbench',
  删除: 'Delete',
  确认删除: 'Confirm Deletion',
  '删除后无法恢复，确定要删除核算任务「':
    'This action cannot be undone. Delete accounting task "',
  '」吗？': '"?',
  排放详情: 'Emission Details',
  '单位：kgCO₂e': 'Unit: kgCO₂e',
  阶段: 'Stage',
  模块: 'Module',
  单元过程: 'Unit Process',
  占产品排放比: 'Share of Product Emissions',
  'GWP 数值': 'GWP Value',
  全阶段合计: 'All-stage Total',
  '搜索...': 'Search...',
  '共 ': 'Total ',
  ' 项': ' items',
  ' · 过滤自 ': ' · filtered from ',
  阶段视图: 'Stage View',
  搜索节点: 'Search nodes',
  筛选节点: 'Filter nodes',
  单位评估结果: 'Unit Evaluation Result',
  评估结果波动范围: 'Estimated result range',
  '折叠全部评估结果 ▲': 'Collapse Full Results ▲',
  '展开全部评估结果 ▼': 'Expand Full Results ▼',
  方法学简称: 'Method',
  数值: 'Value',
  单位: 'Unit',
  排放结构概览: 'Emission Structure Overview',
  结果图表: 'Result Charts',
  'LCI 结果': 'LCI Results',
  '生命周期清单数据，功能开发中':
    'Life cycle inventory data is under development.',
  排放贡献分析: 'Emission Contribution Analysis',
  占比: 'Share',
  流向: 'Flow',
  展示不确定性: 'Show Uncertainty',
  排放量: 'Emissions',
  多方法学对比: 'Multi-method Comparison',
  与当前方法学无关: 'Not tied to the current method',
  波动影响: 'Fluctuation Impact',
  不确定性影响: 'Uncertainty Impact',
  频率密度: 'Frequency Density',
  '区间: ': 'Range: ',
  关键指标: 'Key Metrics',
  'GWP 总量': 'Total GWP',
  'kgCO₂e / 功能单位': 'kgCO₂e / functional unit',
  不确定性区间: 'Uncertainty Range',
  最大贡献阶段: 'Largest Contributing Stage',
  '主要排放源 TOP 3': 'Top 3 Emission Sources',
  核算标准: 'Accounting Standard',
  节点: 'Node',
  报告写作属性: 'Report Writing Attributes',
  报告复核人名称: 'Report Reviewer',
  报告复核人名称示例: 'Reviewer Name Example',
  核算负责人: 'Accounting Owner',
  核算负责人名称示例: 'Accounting Owner Example',
  报告编辑日期: 'Report Edited On',
  有效期: 'Valid Until',
  报告编辑目的: 'Report Purpose',
  '本产品碳足迹报告的核算主体为演示门厂有限公司的特定型号的产品。报告通过计算和分析该产品的年度温室气体（GHG）排放量，主要以以下目的服务：\n（1）为本厂管理者进行决策提供支持；\n（2）为下游生产商提供相对准确的上游供应链数据。':
    'This product carbon footprint report covers a specific product model manufactured by the demo plant. The report quantifies and analyzes the annual greenhouse gas (GHG) emissions of the product for the following purposes:\n(1) support decision-making by plant management;\n(2) provide downstream manufacturers with relatively accurate upstream supply chain data.',
  报告研究范围: 'Study Scope',
  投入产出图: 'Input/Output Diagram',
  添加文档: 'Add Document',
  '研究依据的标准和 PCR': 'Applicable Standards and PCR',
  '本研究所依据的标准为 ISO 14067:2018《温室气体-产品碎足迹-量化要求和指南》。根据 ISO 14067:2018 标准的要求，若存在产品种类规则（PCR），则应当参照使用。经查询，中国政府部门、行业协会暂未发布型材的 PCR。':
    'This study is based on ISO 14067:2018, Greenhouse gases - Carbon footprint of products - Requirements and guidelines for quantification. In line with ISO 14067:2018, product category rules (PCR) should be referenced when available. No PCR specific to profiles has been published by Chinese authorities or industry associations at this time.',
  系统及功能: 'System and Function',
  '本研究所研究的系统范围为演示门厂有限公司所生产的特定"型材"（型号："ABC"）。产品简介如下：/\n产品主材料为 xxxx，本次研究和计算包含了成品的包装。':
    'The system scope of this study covers a specific profile product (model: "ABC") manufactured by the demo plant. Product overview:/\nThe main material is xxxx, and this study includes final product packaging.',
  定义描述: 'Definition',
  '本研究所研究的对象为演示门厂有限公司所生产的特定"型材"产品（型号："ABC"）"从摇篮到大门"的整个过程。':
    'The object of this study is the full cradle-to-gate lifecycle of a specific profile product (model: "ABC") manufactured by the demo plant.',
  假设: 'Assumptions',
  '本报告在评价过程中不涉及假设。':
    'No assumptions were used in this assessment.',
  研究局限性: 'Study Limitations',
  '依据 ISO 14067:2018 标准附录 A 的要求，本报告对目标产品碎足迹边界研究的局限性做如下说明：...':
    'In accordance with Annex A of ISO 14067:2018, the limitations of the target product carbon footprint boundary study are described as follows: ...',
  特殊排放分析: 'Special Emission Analysis',
  已启用特殊排放分析: 'Special emission analysis enabled',
  暂未配置特殊排放分析: 'Special emission analysis not configured',
  '请在此处填写特殊排放场景描述...':
    'Describe special emission scenarios here...',
  研究结论与改进建议: 'Conclusions and Improvement Suggestions',
  '报告遵循温室气体核算协议标准 ISO 14067，并遵循以下原则：准确性、完整性、一致性、相关性和透明度。':
    'The report follows ISO 14067 and the principles of accuracy, completeness, consistency, relevance, and transparency.',
  改进建议: 'Improvement Suggestions',
  '根据分析结果，填写改进建议...':
    'Provide improvement suggestions based on the analysis...',
  '暂无改进建议。': 'No improvement suggestions at this time.',
  模型不确定性描述: 'Model Uncertainty Description',
  添加: 'Add',
  不确定性因素: 'Uncertainty Factor',
  不确定性因素说明: 'Uncertainty Description',
  不确定性因素名称: 'Uncertainty factor name',
  '详细说明...': 'Detailed description...',
  特殊说明: 'Special Notes',
  出现在报告附注部分: 'Shown in the report notes section',
  '填写需要在报告中特别说明的内容，例如数据来源、特殊处理方式、与标准的差异等...':
    'Enter any notes that should be highlighted in the report, such as data sources, special treatments, or deviations from the standard...',
  导出设置: 'Export Settings',
  活动数据展示数值: 'Activity Data Display Values',
  原始数值: 'Original Values',
  单位产品对应数值: 'Per-unit Product Values',
  温室气体范围设置: 'GHG Scope Settings',
  是否导出分配规则: 'Export Allocation Rules',
  是否导出: 'Export',
  分配规则: 'Allocation Rule',
  公式: 'Formula',
  来自参数的不确定性: 'Parameter Uncertainty',
  '在目标产品的碳足迹核算过程中，活动数据和因子数据由于获取方式、统计方法等问题可能存在不确定性，这些不确定性会通过计算模型传导到最终结果，导致结果存在不确定性。':
    'During the target product carbon footprint assessment, uncertainty may exist in activity data and factor data because of acquisition methods and statistical approaches. These uncertainties propagate through the calculation model and affect the final result.',
  来自场景的不确定性: 'Scenario Uncertainty',
  '在目标产品的碳足迹核算过程中，由于生产制造阶段产生的废弃物的处置、使用阶段和最终废弃处置的场景未能明确。':
    'During the target product carbon footprint assessment, the disposal scenarios for waste generated in manufacturing, use-stage scenarios, and end-of-life treatment scenarios are not fully defined.',
  全厂产品间按重量分配: 'Allocate by Weight Across Plant Products',
  按经济价值分配: 'Allocate by Economic Value',
  'E本产品 = E总量 × (Q本产品 / Q总量)':
    'E(product) = E(total) × (Q(product) / Q(total))',
  'E本产品 = E总量 × (V本产品 / V总量)':
    'E(product) = E(total) × (V(product) / V(total))',
  原辅料获取: 'Raw Material Acquisition',
  生产制造: 'Manufacturing',
  材料获取: 'Material Acquisition',
  原料运输: 'Raw Material Transport',
  能源使用: 'Energy Use',
  危废处理: 'Hazardous Waste Treatment',
  温室气体: 'Greenhouse Gases',
  土地利用: 'Land Use',
  生物碳: 'Biogenic Carbon',
  '化石（非航空）': 'Fossil (non-aviation)',
  航空: 'Aviation',
  运输配送: 'Transport & Distribution',
  '型材 ABC': 'Profile ABC',
  '铝粉 9→10': 'Aluminium Powder 9→10',
  'UPVC 颗粒': 'UPVC Granules',
  无萘溶剂油: 'Non-naphthalene Solvent Oil',
  灰桶: 'Ash Drum',
  '铝粉 9→10 运输': 'Aluminium Powder 9→10 Transport',
  用电: 'Electricity',
  'GWP100 · 从摇篮到大门': 'GWP100 · Cradle to Gate',
  '热轧钢板 Q235B': 'Hot-rolled Steel Plate Q235B',
  '电解铜 Cu-CATH-1': 'Electrolytic Copper Cu-CATH-1',
  '普通硅酸盐水泥 P.O 42.5': 'Ordinary Portland Cement P.O 42.5',
  '铝合金板材 6061-T6': 'Aluminium Plate 6061-T6',
  '铝合金板材 PCF 核算 2024': 'Aluminium Plate PCF Accounting 2024',
  '型材 PCF 核算 2024': 'Profile PCF Accounting 2024',
  '钢铁板材碳足迹 2024': 'Steel Plate Carbon Footprint 2024',
  '电解铜碳核算 2024': 'Electrolytic Copper Carbon Accounting 2024',
  水泥熟料年度核算: 'Cement Clinker Annual Accounting',
  '柴油-厂内运输': 'Diesel - In-plant Transport',
  柴油的燃烧: 'Diesel Combustion',
  废弃物处理: 'Waste Treatment',
  无萘溶剂油运输: 'Non-naphthalene Solvent Oil Transport',
  '油酸 AT 运输': 'Oleic Acid AT Transport',
  灰桶运输: 'Ash Drum Transport',
  '油酸 AT': 'Oleic Acid AT',
  'GWP100 - 温室气体': 'GWP100 - Greenhouse Gases',
  'GWP100 - 化石（除航空）': 'GWP100 - Fossil (excl. aviation)',
  'GWP100 - 生物': 'GWP100 - Biogenic',
  'GWP100 - 土地': 'GWP100 - Land Use',
  'GWP100 - 航空': 'GWP100 - Aviation',
  'GWP100 - 温室气体·单位评估…':
    'GWP100 - Greenhouse Gases · Unit Evaluation...',
  '2022年': '2022',
  '2023年': '2023',
  '2024年': '2024',
  '2025年': '2025',
}

const PRODUCT_CARBON_PATTERN_KEYS = Object.keys(
  PRODUCT_CARBON_TRANSLATIONS,
).sort((left, right) => right.length - left.length)

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function translateProductCarbonString(
  locale: AppLocale,
  value: string,
): string {
  if (locale !== 'en-US') return value

  let next = value
  for (const key of PRODUCT_CARBON_PATTERN_KEYS) {
    if (!next.includes(key)) continue
    next = next.split(key).join(PRODUCT_CARBON_TRANSLATIONS[key])
  }

  return next
}

export function localizeProductCarbonValue<T>(locale: AppLocale, value: T): T {
  if (locale !== 'en-US') return value
  if (typeof value === 'string') {
    return translateProductCarbonString(locale, value) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeProductCarbonValue(locale, item)) as T
  }
  if (React.isValidElement(value)) return value
  if (!isPlainObject(value)) return value

  const entries = Object.entries(value).map(([key, currentValue]) => [
    key,
    localizeProductCarbonValue(locale, currentValue),
  ])

  return Object.fromEntries(entries) as T
}

const LOCALIZED_PROP_NAMES = new Set([
  'label',
  'title',
  'description',
  'placeholder',
  'aria-label',
  'ariaLabel',
  'alt',
  'defaultValue',
  'badge',
  'options',
])

export function localizeProductCarbonNode(
  locale: AppLocale,
  node: React.ReactNode,
): React.ReactNode {
  if (locale !== 'en-US') return node
  if (typeof node === 'string')
    return translateProductCarbonString(locale, node)
  if (typeof node === 'number' || node == null || typeof node === 'boolean') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map((item) => localizeProductCarbonNode(locale, item))
  }
  if (!React.isValidElement(node)) return node

  const element = node as React.ReactElement<
    {
      children?: React.ReactNode
    } & Record<string, unknown>
  >
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(element.props ?? {})) {
    if (key === 'children') continue
    if (LOCALIZED_PROP_NAMES.has(key)) {
      props[key] = localizeProductCarbonValue(locale, value)
    } else {
      props[key] = value
    }
  }

  props.children = React.Children.map(element.props.children, (child) =>
    localizeProductCarbonNode(locale, child),
  )

  return React.cloneElement(element, props)
}

export function formatProductCarbonYear(
  locale: AppLocale,
  year: number,
): string {
  return locale === 'en-US' ? String(year) : String(year) + '年'
}

export function formatProductCarbonDate(
  locale: AppLocale,
  value: string,
): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed)
}

export function isProductCarbonRawStageLabel(value: string) {
  return value.includes('原') || value.toLowerCase().includes('raw')
}

export function isProductCarbonManufacturingStageLabel(value: string) {
  const normalized = value.toLowerCase()
  return (
    value.includes('生产') ||
    value.includes('制造') ||
    normalized.includes('manufacturing')
  )
}

export function isProductCarbonTransportLabel(value: string) {
  return value.includes('运输') || value.toLowerCase().includes('transport')
}

export function isProductCarbonHazardLabel(value: string) {
  const normalized = value.toLowerCase()
  return (
    value.includes('危') ||
    value.includes('废') ||
    normalized.includes('hazard') ||
    normalized.includes('waste')
  )
}
