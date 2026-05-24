import * as React from 'react'
import type { AppLocale } from '@/lib/locale'
import { useAppLocale } from '@/components/layout/app-locale-provider'
import { resolveApiLocale } from '@/api/i18n'
import { defineLocalizedText, localizeText } from '@/lib/locale'

const CARBON_SCREEN_TRANSLATIONS: Record<string, string> = {
  报喜鸟大屏: 'Saint Angelo Screen',
  某某集团全景碳驾驶舱: 'Group Panoramic Carbon Cockpit',
  报喜鸟大屏数据加载失败请稍后刷新重试: 'Saint Angelo screen data failed to load. Refresh and try again later.',
  '报喜鸟大屏数据加载失败，请稍后刷新重试。': 'Saint Angelo screen data failed to load. Refresh and try again later.',
  页面数据加载失败: 'Page Data Failed to Load',
  当前页面暂时无法加载请稍后重试: 'This page cannot be loaded right now. Please try again later.',
  '当前页面暂时无法加载，请稍后重试。': 'This page cannot be loaded right now. Please try again later.',
  暂无数据: 'No Data',
  关闭: 'Close',
  晴: 'Sunny',
  全屏: 'Fullscreen',
  退出全屏: 'Exit Fullscreen',
  组织碳: 'Organizational Carbon',
  产品碳: 'Product Carbon',
  查看详情: 'View Details',
  组织主体: 'Organization Entity',
  选择工厂: 'Select Factory',
  选择年份: 'Select Year',
  政策标准库: 'Policy Standards Library',
  风险及机遇分析: 'Risks & Opportunities Analysis',
  资讯标题占位: 'Insight Title Placeholder',
  资讯副标题或部分正文占位后续再填真实内容: 'Insight subtitle or excerpt placeholder. Real content will be filled later.',
  '资讯副标题或部分正文占位，后续再填真实内容。': 'Insight subtitle or excerpt placeholder. Real content will be filled later.',
  AI助手: 'AI Assistant',
  AI助理: 'AI Assistant',
  '不懂就问，AI助理': 'Ask anytime with AI Assistant',
  标准列表: 'Standards List',
  原文下载: 'Download Original',
  发布机构: 'Publisher',
  发布日期: 'Publish Date',
  最近更新: 'Last Updated',
  当前版本: 'Current Version',
  因子数量: 'Factor Count',
  组织映射: 'Organization Mapping',
  条: 'items',
  年度核心指标概览: 'Annual Core Metrics Overview',
  年度碳排总量: 'Annual Carbon Emissions',
  年度能源消耗总量: 'Annual Energy Consumption',
  综合碳排放强度: 'Composite Carbon Intensity',
  清洁能源占比: 'Clean Energy Share',
  't/万元': 't/10k CNY',
  组织碳足迹范围明细: 'Organizational Carbon Footprint Scope Details',
  组织碳足迹范围占比: 'Organizational Carbon Footprint Scope Share',
  排放排行TOP5: 'Emission Ranking TOP 5',
  '排放排行 TOP 5': 'Emission Ranking TOP 5',
  供应商等级分布: 'Supplier Tier Distribution',
  领先者: 'Leaders',
  合格: 'Qualified',
  落后: 'Lagging',
  待审核: 'Pending Review',
  家: 'suppliers',
  风险预警: 'Risk Alerts',
  风险: 'Risk',
  提醒: 'Reminder',
  关注: 'Attention',
  刚刚: 'Just now',
  小时前: 'h ago',
  天前: 'd ago',
  暂无更新: 'No updates',
  节点名称: 'Node Name',
  占比: 'Share',
  排放量: 'Emissions',
  直接排放: 'Direct Emissions',
  外购能源: 'Purchased Energy',
  固定源燃烧: 'Stationary Combustion',
  移动源燃烧: 'Mobile Combustion',
  范围一: 'Scope 1',
  范围二: 'Scope 2',
  范围三: 'Scope 3',
  范围一直接排放: 'Scope 1: Direct Emissions',
  范围二外购能源: 'Scope 2: Purchased Energy',
  '范围一：直接排放': 'Scope 1: Direct Emissions',
  '范围二：外购能源': 'Scope 2: Purchased Energy',
  '范围三：': 'Scope 3:',
  边界视图: 'Boundary View',
  搜索节点: 'Search Nodes',
  模型视图设置: 'Model View Settings',
  汇总: 'Summary',
  共: 'Total',
  个类别: 'categories',
  总排放量: 'Total Emissions',
  展开全部温室气体排放量结果: 'Expand all GHG emission results',
  排放详情: 'Emission Details',
  单位: 'Unit',
  类别: 'Category',
  子类别: 'Subcategory',
  排放源: 'Emission Source',
  类别占比图: 'Category Share Chart',
  类别子类别占比图: 'Category-Subcategory Share Chart',
  '类别-子类别占比图': 'Category-Subcategory Share Chart',
  暂无可视化数据: 'No visualization data',
  搜索类别子类别或排放源: 'Search category, subcategory, or emission source',
  '搜索类别、子类别或排放源...': 'Search category, subcategory, or emission source...',
  总排放占比: 'Total Emission Share',
  当前筛选条件下暂无排放数据: 'No emission data under the current filters',
  项: 'items',
  结果图表: 'Result Chart',
  模型结果: 'Model Result',
  产品碳足迹: 'Product Carbon Footprint',
  组织碳足迹: 'Organizational Carbon Footprint',
  '组织碳足迹 - 某甲工厂': 'Organizational Carbon Footprint - Factory A',
  '产品碳足迹 - 羊毛纤维': 'Product Carbon Footprint - Wool Fiber',
  某甲工厂: 'Factory A',
  某乙工厂: 'Factory B',
  某丙工厂: 'Factory C',
  '2025年': '2025',
  '2024年': '2024',
  '2023年': '2023',
  总碳排量: 'Total Carbon Emissions',
  总碳排目标: 'Total Carbon Emission Target',
  总减排量: 'Total Reduction',
  总减排目标: 'Total Reduction Target',
  碳排强度: 'Carbon Intensity',
  目标碳排强度: 'Target Carbon Intensity',
  碳排水平: 'Carbon Emission Level',
  优秀: 'Excellent',
  较行业平均碳排强度更优: 'Better than the industry average carbon intensity',
  能源替代: 'Energy Substitution',
  工艺优化: 'Process Optimization',
  管理措施: 'Management Measures',
  其他: 'Other',
  市政供电: 'Municipal Power Supply',
  外购电力与传输损耗合并核算: 'Purchased power and transmission losses combined',
  '市政供电（外购电力与传输损耗合并核算）': 'Municipal Power Supply (Purchased Power and Transmission Losses)',
  蒸汽热力: 'Steam Heat',
  生产与生活供热系统: 'Production and domestic heating systems',
  '蒸汽热力（生产与生活供热系统）': 'Steam Heat (Production and Domestic Heating Systems)',
  天然气消耗: 'Natural Gas Consumption',
  柴油燃料: 'Diesel Fuel',
  外购冷量: 'Purchased Cooling',
  'HAZZYS 碳中和 POLO 衫': 'HAZZYS Carbon-neutral Polo Shirt',
  定制西服: 'Custom Suit',
  商务系列: 'Business Series',
  '定制西服（商务系列）': 'Custom Suit (Business Series)',
  婚庆西服: 'Wedding Suit',
  巫绣工艺款: 'Wuxiu Craft Edition',
  '婚庆西服（巫绣工艺款）': 'Wedding Suit (Wuxiu Craft Edition)',
  可运动西服: 'Performance Suit',
  弹力抗皱款: 'Stretch Wrinkle-resistant Edition',
  '可运动西服（弹力抗皱款）': 'Performance Suit (Stretch Wrinkle-resistant Edition)',
  羊绒纤维衬衣: 'Cashmere Fiber Shirt',
  羊毛纤维: 'Wool Fiber',
  原材料获取: 'Raw Material Acquisition',
  生产制造: 'Manufacturing',
  原料的生产: 'Raw Material Production',
  辅料的生产: 'Auxiliary Material Production',
  水处理化学品的生产: 'Water Treatment Chemical Production',
  能源使用: 'Energy Use',
  废水处理: 'Wastewater Treatment',
  包装与入库: 'Packaging and Warehousing',
  羊毛原料的生产: 'Wool Raw Material Production',
  用电: 'Electricity Use',
  蒸汽: 'Steam',
  双氧水的生产: 'Hydrogen Peroxide Production',
  中和剂: 'Neutralizer',
  浓碱: 'Concentrated Alkali',
  '中和剂（浓碱）的生产': 'Neutralizer (Concentrated Alkali) Production',
  温室气体: 'Greenhouse Gases',
  土地利用: 'Land Use',
  生物碳: 'Biogenic Carbon',
  化石: 'Fossil',
  非航空: 'Non-aviation',
  '化石（非航空）': 'Fossil (Non-aviation)',
  航空: 'Aviation',
  从摇篮到大门: 'Cradle to Gate',
  类别1: 'Category 1',
  类别2: 'Category 2',
  类别3: 'Category 3',
  类别4: 'Category 4',
  GHG直接排放和清除: 'Direct GHG emissions and removals',
  输入能源产生的GHG间接排放: 'Indirect GHG emissions from imported energy',
  运输产生的间接GHG排放: 'Indirect GHG emissions from transport',
  组织所用产品产生的间接GHG排放: 'Indirect GHG emissions from products used by the organization',
  移动燃烧源的排放: 'Mobile combustion emissions',
  工业过程排放和清除: 'Industrial process emissions and removals',
  来自人类活动的逸散排放: 'Fugitive emissions from human activities',
  输入电力产生的间接排放: 'Indirect emissions from imported electricity',
  输入能源产生的间接排放: 'Indirect emissions from imported energy',
  货物上游运输和配送产生的排放: 'Emissions from upstream freight transport and distribution',
  货物下游运输和配送产生的排放: 'Emissions from downstream freight transport and distribution',
  采购商品和服务: 'Purchased goods and services',
  商务车使用燃料: 'Business vehicle fuel use',
  乙炔的燃烧: 'Acetylene combustion',
  二氧化碳灭火器的逸散: 'CO2 fire extinguisher fugitive emissions',
  化粪池的逸散: 'Septic tank fugitive emissions',
  使用R134a的空调制冷设备: 'Air-conditioning refrigeration equipment using R134a',
  使用R32的空调制冷设备: 'Air-conditioning refrigeration equipment using R32',
  使用R410a的空调制冷设备: 'Air-conditioning refrigeration equipment using R410a',
  使用R410A的制冷机组: 'Refrigeration unit using R410A',
  市政用电: 'Municipal Electricity',
  外购蒸汽: 'Purchased Steam',
  外购货物上游运输: 'Upstream Transport of Purchased Goods',
  成品下游运输配送: 'Downstream Finished Goods Transport and Distribution',
  组织所用产品采购: 'Procurement of Products Used by the Organization',
  毛用活性染料的生产: 'Wool Reactive Dye Production',
  酸性染料的生产: 'Acid Dye Production',
  匀染剂的生产: 'Leveling Agent Production',
  纯碱的生产: 'Soda Ash Production',
  冰醋酸的生产: 'Glacial Acetic Acid Production',
  保险粉的生产: 'Sodium Hydrosulfite Production',
  皂洗剂的生产: 'Soaping Agent Production',
  柔软剂的生产: 'Softener Production',
  固色剂的生产: 'Fixing Agent Production',
  漂白助剂的生产: 'Bleaching Auxiliary Production',
  脱色助剂的生产: 'Decolorizing Auxiliary Production',
  PAC的生产: 'PAC Production',
  PAM的生产: 'PAM Production',
  水软化剂: 'Water Softener',
  工业盐: 'Industrial Salt',
  '水软化剂（工业盐）的生产': 'Water Softener (Industrial Salt) Production',
  聚铝的生产: 'Polyaluminum Production',
  硫酸: 'Sulfuric Acid',
  污水: 'Wastewater',
  '硫酸（污水）的生产': 'Sulfuric Acid (Wastewater) Production',
  次氯酸钠的生产: 'Sodium Hypochlorite Production',
  除臭剂的生产: 'Deodorant Production',
  絮凝剂的生产: 'Flocculant Production',
  污泥处置: 'Sludge Disposal',
  包装袋: 'Packaging Bags',
  叉车作业: 'Forklift Operations',
  多项认证即将到期: 'Multiple certifications expiring soon',
  多份合规申报数据待审核: 'Multiple compliance declaration datasets pending review',
  某合作方合规评分低于阈值: 'A partner compliance score is below threshold',
  供应链主体碳核算边界说明待补充: 'Supply chain entity carbon accounting boundary description pending completion',
  生产单元数据采集频次异常需复核: 'Production unit data collection frequency anomaly requires review',
  占位: 'placeholder',
  还原窗口: 'Restore Window',
  最大化窗口: 'Maximize Window',
  关闭窗口: 'Close Window',
  缩放窗口: 'Resize Window',
  报喜鸟静态园区主视觉: 'Saint Angelo static campus visual',
  报喜鸟logo: 'Saint Angelo logo',
  '报喜鸟 logo': 'Saint Angelo logo',
}

export function localizeCarbonScreenString(
  value: string,
  locale: AppLocale = resolveApiLocale(),
) {
  return localizeText(
    defineLocalizedText(value, CARBON_SCREEN_TRANSLATIONS[value] ?? value),
    locale,
  )
}

function translateCarbonScreenText(value: string, locale: AppLocale) {
  if (locale === 'zh-CN' || !/[\u4e00-\u9fff]/.test(value)) return value

  return Object.entries(CARBON_SCREEN_TRANSLATIONS)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [zhCN, enUS]) => text.split(zhCN).join(enUS), value)
}

function translateElementAttributes(element: Element, locale: AppLocale) {
  for (const name of ['aria-label', 'title', 'label', 'placeholder', 'alt']) {
    const current = element.getAttribute(name)
    if (!current) continue

    const sourceName = `data-carbon-screen-i18n-${name}`
    const source = element.getAttribute(sourceName) ?? current
    const translated = translateCarbonScreenText(source, locale)

    if (element.getAttribute(sourceName) !== source) {
      element.setAttribute(sourceName, source)
    }
    if (current !== translated) {
      element.setAttribute(name, translated)
    }
  }
}

function translateCarbonScreenDom(root: HTMLElement, locale: AppLocale) {
  translateElementAttributes(root, locale)

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes: Array<Text> = []
  while (textWalker.nextNode()) {
    textNodes.push(textWalker.currentNode as Text)
  }

  textNodes.forEach((node) => {
    const parent = node.parentElement
    if (!parent) return

    const source = parent.dataset.carbonScreenI18nText ?? node.nodeValue ?? ''
    const translated = translateCarbonScreenText(source, locale)

    if (parent.dataset.carbonScreenI18nText !== source) {
      parent.dataset.carbonScreenI18nText = source
    }
    if (node.nodeValue !== translated) {
      node.nodeValue = translated
    }
  })

  root.querySelectorAll('*').forEach((element) => {
    translateElementAttributes(element, locale)
  })
}

export function localizeCarbonScreenData<T>(
  value: T,
  locale: AppLocale = resolveApiLocale(),
): T {
  if (typeof value === 'string') {
    return localizeCarbonScreenString(value, locale) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeCarbonScreenData(item, locale)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        localizeCarbonScreenData(entry, locale),
      ]),
    ) as T
  }

  return value
}

export function useCarbonScreenDomI18n<TElement extends HTMLElement>() {
  const { locale } = useAppLocale()
  const rootRef = React.useRef<TElement>(null)

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    translateCarbonScreenDom(root, locale)

    const observer = new MutationObserver(() => {
      translateCarbonScreenDom(root, locale)
    })
    observer.observe(root, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [locale])

  return rootRef
}
