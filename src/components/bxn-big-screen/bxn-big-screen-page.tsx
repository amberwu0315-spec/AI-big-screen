import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  Award,
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Database,
  Flag,
  Frown,
  Newspaper,
  Percent,
  Search,
  Target,
  TriangleAlert,
  Wind,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { CSSProperties } from 'react'
import type { AppLocale } from '@/lib/locale'
import type {
  CarbonScreenProductRankingDialogConfig,
  CarbonScreenScopeDistributionDialogConfig,
  CarbonScreenSelectOption,
} from '@/api/carbon-screen'
import type { StandardStatus } from '@/api/policy-library/policy-library.types'
import { api } from '@/api'
import { BxnScopeDialogContent } from '@/components/bxn-big-screen/bxn-scope-dialog-content'
import { CarbonScreenProductDialogContent } from '@/components/carbon-accounting/carbon-screen-product-dialog-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  STANDARD_CATEGORY_LABEL,
  STANDARD_STATUS_BADGE,
  STANDARD_STATUS_LABEL,
  formatDate,
  localizePolicyText,
} from '@/components/policy-library/shared'
import { BxnAiAgentDraggableIframe } from '@/components/bxn-big-screen/bxn-ai-agent-draggable-iframe'
import { useAppLocale } from '@/components/layout/app-locale-provider'
import { cn } from '@/lib/utils'

const pageDialogContentClassName =
  'h-[calc(100vh-7rem)] w-[min(1120px,calc(100vw-4rem))] max-w-[min(1120px,calc(100vw-4rem))] min-h-0 flex flex-col gap-0 sm:!max-w-[min(1120px,calc(100vw-4rem))]'
const headerOrnamentHeight = 70
const headerTopLineWidth = 673.83
const headerTopLineSideShorten = 34
const headerTopLineSideWidth = '200vw'
const headerTrimWidth = 145
const headerTrimScale = 1.5
const borderAsset = '/carbon-screen/baoxiniao-biankuang.svg'
const titleBackdropAsset = '/carbon-screen/baoxiniao-biaotiqubeidi.svg'
const bxnDialogPaletteClassName =
  '[--primary:#11906A] [--carbon-raw:#0E7A5A] [--carbon-raw-light:#DDF3EB] [--carbon-manufacturing:#11906A] [--carbon-manufacturing-light:#EAF7F2] [--carbon-transport:#10C38D] [--carbon-hazard:#5EC2A4] [--chart-palette-1:#0E7A5A] [--chart-palette-2:#EAF7F2] [--chart-palette-3:#11906A] [--chart-palette-4:#DDF3EB] [--chart-palette-5:#10C38D] [--chart-palette-6:#CEECDD] [--chart-palette-7:#1FA678] [--chart-palette-8:#BFE6DA] [--chart-palette-9:#2CB087] [--chart-palette-10:#A8DEC9] [--chart-palette-11:#3AB997] [--chart-palette-12:#92D5BE]'

const aiAssistantRobotAsset = '/carbon-screen/ai-assistant-robot.png'
const AI_AGENT_BASE_URL = 'https://aiagent.baoxiniao.com/'
const AI_AGENT_TICKET_SOURCE =
  'userId=tanheng&platform=ESG&appId=8a1f1a42-9d31-4328-9e09-c22fd22f3c95'
const BXN_ARTICLE_SEARCH_URL = '/bxn-big-screen-api/articles/search'
const BXN_POLICY_PREVIEW_LIMIT = 10
const BXN_POLICY_DIALOG_PAGE_SIZE = 20
const BXN_POLICY_STATUS_ALL = '全部状态'
const BXN_POLICY_STATUS_OPTIONS = [
  { value: BXN_POLICY_STATUS_ALL, label: BXN_POLICY_STATUS_ALL },
  { value: 'PUBLISHED', label: '现行' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'DEPRECATED', label: '已废弃' },
  { value: 'ARCHIVED', label: '归档' },
  { value: 'PROPOSED', label: '征求意见' },
] as const

const BXN_BIG_SCREEN_TRANSLATIONS: Record<string, string> = {
  某某集团全景碳驾驶舱: 'Group Panoramic Carbon Cockpit',
  页面数据加载失败: 'Page Data Failed to Load',
  '当前页面暂时无法加载，请稍后重试。':
    'This page cannot be loaded right now. Please try again later.',
  '报喜鸟大屏数据加载失败，请稍后刷新重试。':
    'Saint Angelo screen data failed to load. Refresh and try again later.',
  暂无数据: 'No Data',
  关闭: 'Close',
  全屏: 'Fullscreen',
  退出全屏: 'Exit Fullscreen',
  组织主体: 'Organization Entity',
  组织碳: 'Organizational Carbon',
  产品碳: 'Product Carbon',
  AI助手: 'AI Assistant',
  '不懂就问，AI助理': 'Ask anytime with AI Assistant',
  AI助理: 'AI Assistant',
  查看详情: 'View Details',
  排放排行TOP5: 'Emission Ranking TOP 5',
  '排放排行 TOP 5': 'Emission Ranking TOP 5',
  年度核心指标概览: 'Annual Core Metrics Overview',
  年度碳排总量: 'Annual Carbon Emissions',
  年度能源消耗总量: 'Annual Energy Consumption',
  综合碳排放强度: 'Composite Carbon Intensity',
  清洁能源占比: 'Clean Energy Share',
  't/万元': 't/10k CNY',
  'tCO₂e/万元': 'tCO2e/10k CNY',
  组织碳足迹范围明细: 'Organizational Carbon Footprint Scope Details',
  节点名称: 'Node Name',
  占比: 'Share',
  '排放量(tCO₂e)': 'Emissions (tCO2e)',
  供应商等级分布: 'Supplier Tier Distribution',
  风险及机遇分析: 'Risks & Opportunities Analysis',
  领先者: 'Leaders',
  合格: 'Qualified',
  落后: 'Lagging',
  待审核: 'Pending Review',
  家: 'suppliers',
  风险预警: 'Risk Alerts',
  风险详情: 'Risk Details',
  风险: 'Risk',
  提醒: 'Reminder',
  关注: 'Attention',
  预警内容: 'Alert Content',
  风险等级: 'Risk Level',
  更新时间: 'Updated At',
  处置建议: 'Recommended Action',
  '请尽快核查责任主体与佐证材料，明确整改负责人并跟踪闭环。':
    'Review the accountable party and supporting materials promptly, assign an owner, and track closure.',
  '请安排业务负责人复核待办数据，确保申报或审核节点按期完成。':
    'Ask the business owner to review pending data and keep declaration or review milestones on schedule.',
  '请持续关注该事项变化，必要时补充说明材料或更新数据口径。':
    'Keep monitoring this item and add explanation materials or update data definitions when needed.',
  刚刚: 'Just now',
  小时前: 'h ago',
  天前: 'd ago',
  暂无更新: 'No updates',
  范围一: 'Scope 1',
  范围二: 'Scope 2',
  范围三: 'Scope 3',
  范围三上游: 'Scope 3 Upstream',
  范围三下游: 'Scope 3 Downstream',
  '范围一：直接排放': 'Scope 1: Direct Emissions',
  产品碳足迹: 'Product Carbon Footprint',
  政策标准库: 'Policy Standards Library',
  标准列表: 'Standards List',
  原文下载: 'Download Original',
  发布机构: 'Publisher',
  发布日期: 'Publish Date',
  最近更新: 'Last Updated',
  当前版本: 'Current Version',
  因子数量: 'Factor Count',
  组织映射: 'Organization Mapping',
  条: 'items',
  结果图表: 'Result Chart',
  模型结果: 'Model Result',
  发布时间: 'Published At',
  来源链接: 'Source URL',
  资讯标题占位: 'Insight Title Placeholder',
  '资讯副标题或部分正文占位，后续再填真实内容。':
    'Insight subtitle or excerpt placeholder. Real content will be filled later.',
  '范围二：外购能源间接排放':
    'Scope 2: Indirect Emissions from Purchased Energy',
  '范围三：价值链上游间接排放':
    'Scope 3: Upstream Value Chain Indirect Emissions',
  '范围三：价值链下游间接排放':
    'Scope 3: Downstream Value Chain Indirect Emissions',
  丝绸: 'Silk',
  梭织棉: 'Woven Cotton',
  针织棉: 'Knitted Cotton',
  市政供电: 'Municipal Power Supply',
  商品清洗耗电: 'Product Washing Electricity',
  外购梭织棉: 'Purchased Woven Cotton',
  商品清洗耗水: 'Product Washing Water',
  外购针织棉: 'Purchased Knitted Cotton',
  固定源燃烧: 'Stationary Combustion',
  移动源燃烧: 'Mobile Combustion',
  '外购电力（上游排放）': 'Purchased Electricity (Upstream Emissions)',
  'HAZZYS 碳中和 POLO 衫': 'HAZZYS Carbon-neutral Polo Shirt',
  定制西服: 'Custom Suit',
  商务系列: 'Business Series',
  '定制西服（商务系列）': 'Custom Suit (Business Series)',
  婚庆西服: 'Wedding Suit',
  巫绣工艺款: 'Wuxiu Craft Edition',
  '婚庆西服（巫绣工艺款）': 'Wedding Suit (Wuxiu Craft Edition)',
  可运动西服: 'Performance Suit',
  弹力抗皱款: 'Stretch Wrinkle-resistant Edition',
  '可运动西服（弹力抗皱款）':
    'Performance Suit (Stretch Wrinkle-resistant Edition)',
  羊绒纤维衬衣: 'Cashmere Fiber Shirt',
  男士商务西服套装: 'Men’s Business Suit Set',
  男士西服上衣: 'Men’s Suit Jacket',
  男士西服裤装: 'Men’s Suit Trousers',
  男士衬衫: 'Men’s Shirt',
  户外T恤: 'Outdoor T-shirt',
  羊毛纤维: 'Wool Fiber',
  '32家上市券商发布2025年ESG报告':
    '32 Listed Brokerages Released 2025 ESG Reports',
  '32家上市券商发布2025ESG报告':
    '32 Listed Brokerages Released 2025 ESG Reports',
  ESG理念日渐融入证券行业核心运营:
    'ESG principles are increasingly integrated into core operations of the securities industry.',
  ESG理念日渐融入券商发展战略:
    'ESG principles are increasingly integrated into brokerage development strategies.',
  '中国医药发布《2025年度环境、社会和公司治理(ESG)报告》':
    'China National Medicines released its 2025 Environmental, Social, and Governance (ESG) Report.',
  '作为国家医药战略储备核心承储单位，交出沉甸甸的责任答卷':
    'As a key national strategic pharmaceutical reserve carrier, it delivered a substantial responsibility report card.',
  国家医药战略储备单位交出责任答卷:
    'The national strategic pharmaceutical reserve unit delivered its responsibility report card.',
  '三维通信：ESG评级行业领跑，以责任担当筑牢可持续发展根基':
    'Sunwave Communications: Industry-leading ESG rating, strengthening the foundation of sustainable development through responsibility.',
  '获评Wind ESG AA级，综合评分位居行业第一':
    'Rated Wind ESG AA, ranking first in overall industry score.',
  '值得买发布《2025年可持续发展报告》：以AI赋能可持续发展':
    'Worth Buying released its 2025 Sustainability Report: Empowering sustainability with AI.',
  '推进“全面AI”战略与ESG理念深度融合':
    'Advancing deep integration of the "All-in AI" strategy with ESG principles.',
  '京东工业发布首份ESG报告 以数智供应链引领行业可持续发展':
    'JD Industrial released its first ESG report, leading sustainable industry development with a digital-intelligent supply chain.',
  '传承“正道成功”价值观，披露全链路实践成果':
    'Carrying forward the "Success through Integrity" values, it disclosed full-chain practice outcomes.',
  '多项认证即将到期': 'Multiple certifications expiring soon',
  '多份合规申报数据待审核': 'Multiple compliance declaration datasets pending review',
  '某合作方合规评分低于阈值': 'A partner compliance score is below threshold',
  '供应链主体碳核算边界说明待补充':
    'Supply chain entity carbon accounting boundary description pending completion',
  '生产单元数据采集频次异常需复核':
    'Production unit data collection frequency anomaly requires review',
  选择工厂: 'Select Factory',
  选择年份: 'Select Year',
  现行: 'Active',
  国家标准: 'National Standard',
  国际标准: 'International Standard',
  地方标准: 'Local Standard',
  行业标准: 'Industry Standard',
  辅助分析: 'Assisted Analysis',
  '不确定性 · 蒙特卡洛模拟': 'Uncertainty · Monte Carlo Simulation',
  均值: 'Mean',
  标准差: 'Standard Deviation',
  不确定性: 'Uncertainty',
  节点: 'Node',
  边界视图: 'Boundary View',
  搜索节点: 'Search Node',
  模型视图设置: 'Model View Settings',
  汇总: 'Summary',
  总排放量: 'Total Emissions',
  '总排放量（GWP：': 'Total Emissions (GWP: ',
  展开全部温室气体排放量结果: 'Expand All GHG Emission Results',
  排放详情: 'Emission Details',
  '排放详情（单位：': 'Emission Details (Unit: ',
  类别: 'Category',
  子类别: 'Subcategory',
  排放源: 'Emission Source',
  类别占比图: 'Category Share Chart',
  '类别-子类别占比图': 'Category-Subcategory Share Chart',
  暂无可视化数据: 'No Visualization Data',
  '搜索类别、子类别或排放源...':
    'Search category, subcategory, or emission source...',
  总排放占比: 'Total Emission Share',
  共: 'Total',
  类别1: 'Category 1',
  类别2: 'Category 2',
  类别3: 'Category 3',
  类别4: 'Category 4',
  '类别1:GHG直接排放和清除': 'Category 1: Direct GHG emissions and removals',
  '类别2:输入能源产生的GHG间接排放':
    'Category 2: Indirect GHG emissions from imported energy',
  '类别3:运输产生的间接GHG排放':
    'Category 3: Indirect GHG emissions from transport',
  '类别4:组织所用产品产生的间接GHG排放':
    'Category 4: Indirect GHG emissions from products used by the organization',
  '类别1：GHG直接排放和清除': 'Category 1: Direct GHG emissions and removals',
  '类别2：输入能源产生的GHG间接排放':
    'Category 2: Indirect GHG emissions from imported energy',
  '类别3：运输产生的间接GHG排放':
    'Category 3: Indirect GHG emissions from transport',
  '类别4：组织所用产品产生的间接GHG排放':
    'Category 4: Indirect GHG emissions from products used by the organization',
  GHG直接排放和清除: 'Direct GHG emissions and removals',
  输入能源产生的GHG间接排放: 'Indirect GHG emissions from imported energy',
  运输产生的间接GHG排放: 'Indirect GHG emissions from transport',
  组织所用产品产生的间接GHG排放:
    'Indirect GHG emissions from products used by the organization',
  移动燃烧源的排放: 'Mobile combustion emissions',
  工业过程排放和清除: 'Industrial process emissions and removals',
  来自人类活动的逸散排放: 'Fugitive emissions from human activities',
  输入能源产生的间接排放: 'Indirect emissions from imported energy',
  商务车使用燃料: 'Business vehicle fuel use',
  乙炔的燃烧: 'Acetylene combustion',
  二氧化碳灭火器的逸散: 'CO2 fire extinguisher fugitive emissions',
  化粪池的逸散: 'Septic tank fugitive emissions',
  市政用电: 'Municipal Electricity',
  外购蒸汽: 'Purchased Steam',
  外购货物上游运输: 'Upstream Transport of Purchased Goods',
  成品下游运输配送: 'Downstream Finished Goods Transport and Distribution',
  组织所用产品采购: 'Procurement of Products Used by the Organization',
  '共 4 个类别': '4 categories',
  共4个类别: '4 categories',
  个类别: 'categories',
  '（单位：': ' (Unit: ',
  '）': ')',
  占位: 'placeholder',
}

function localizeBxnBigScreenString(value: string, locale: AppLocale) {
  if (locale === 'zh-CN') return value

  return BXN_BIG_SCREEN_TRANSLATIONS[value] ?? value
}

function translateBxnBigScreenText(value: string, locale: AppLocale) {
  if (locale === 'zh-CN' || !/[\u4e00-\u9fff]/.test(value)) return value

  const exact = BXN_BIG_SCREEN_TRANSLATIONS[value]
  if (exact) return exact

  return Object.entries(BXN_BIG_SCREEN_TRANSLATIONS)
    .filter(([zhCN]) => zhCN.length >= 2)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [zhCN, enUS]) => text.split(zhCN).join(enUS), value)
}

function translateBxnElementAttributes(element: Element, locale: AppLocale) {
  for (const name of ['aria-label', 'title', 'label', 'placeholder', 'alt']) {
    const current = element.getAttribute(name)
    if (!current) continue

    const sourceName = `data-bxn-i18n-${name}`
    const source = element.getAttribute(sourceName) ?? current
    const translated = translateBxnBigScreenText(source, locale)

    if (element.getAttribute(sourceName) !== source) {
      element.setAttribute(sourceName, source)
    }
    if (current !== translated) {
      element.setAttribute(name, translated)
    }
  }
}

function translateBxnBigScreenDom(root: HTMLElement, locale: AppLocale) {
  translateBxnElementAttributes(root, locale)

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes: Array<Text> = []
  while (textWalker.nextNode()) {
    textNodes.push(textWalker.currentNode as Text)
  }

  textNodes.forEach((node) => {
    const parent = node.parentElement
    if (!parent) return
    if (parent.closest('[data-bxn-i18n-skip="true"]')) return

    const current = node.nodeValue ?? ''
    const cachedSource = parent.dataset.bxnI18nText
    const currentHasChinese = /[\u4e00-\u9fff]/.test(current)
    const cachedEnglish = cachedSource
      ? translateBxnBigScreenText(cachedSource, 'en-US')
      : ''
    const source = cachedSource
      ? locale === 'zh-CN'
        ? currentHasChinese && current !== cachedSource
          ? current
          : cachedSource
        : current === cachedSource || current === cachedEnglish
          ? cachedSource
          : current
      : current

    if (!/[\u4e00-\u9fff]/.test(source)) {
      if (parent.dataset.bxnI18nText) {
        delete parent.dataset.bxnI18nText
      }
      return
    }

    const translated = translateBxnBigScreenText(source, locale)

    if (parent.dataset.bxnI18nText !== source) {
      parent.dataset.bxnI18nText = source
    }
    if (node.nodeValue !== translated) {
      node.nodeValue = translated
    }
  })

  root.querySelectorAll('*').forEach((element) => {
    if (element.closest('[data-bxn-i18n-skip="true"]')) return
    translateBxnElementAttributes(element, locale)
  })
}

function useBxnBigScreenDomI18n<TElement extends HTMLElement>() {
  const { locale } = useAppLocale()
  const rootRef = useRef<TElement | null>(null)

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return

    let observer: MutationObserver | null = null
    let frame = 0
    let attempts = 0

    const attachObserver = () => {
      const root = rootRef.current
      if (!root) {
        attempts += 1
        if (attempts < 30) {
          frame = window.requestAnimationFrame(attachObserver)
        }
        return
      }

      translateBxnBigScreenDom(root, locale)

      observer = new MutationObserver(() => {
        translateBxnBigScreenDom(root, locale)
      })
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['aria-label', 'title', 'label', 'placeholder', 'alt'],
      })
    }

    attachObserver()

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      observer?.disconnect()
    }
  }, [locale])

  return rootRef
}

function createBxnStableSelectOptions(
  options: Array<CarbonScreenSelectOption>,
  prefix: string,
): Array<CarbonScreenSelectOption> {
  return options.map((option, index) => ({
    value: `${prefix}-${index}`,
    label: option.label,
  }))
}

function resolveBxnSelectOptionIndex(
  options: Array<CarbonScreenSelectOption>,
  value: string,
): number {
  return options.findIndex((option) => option.value === value)
}

interface BxnInsightCard {
  id: string
  title: string
  summary: string
  redirectUrl: string
  publishTime: string
  tags: Array<string>
}

function BxnPolicyStatusBadge({
  status,
  locale,
  className,
}: {
  status: StandardStatus
  locale: AppLocale
  className?: string
}) {
  return (
    <Badge
      className={cn(
        STANDARD_STATUS_BADGE[status],
        'border-transparent font-semibold',
        className,
      )}
    >
      {localizeBxnBigScreenString(
        localizePolicyText(STANDARD_STATUS_LABEL[status], locale),
        locale,
      )}
    </Badge>
  )
}

const BXN_POLICY_STATUS_DOT_CLASS: Record<StandardStatus, string> = {
  PUBLISHED: 'bg-[#11906A]',
  DRAFT: 'bg-[#8A8A8A]',
  DEPRECATED: 'bg-[#D97706]',
  ARCHIVED: 'bg-[#D64545]',
  PROPOSED: 'bg-[#2F7DD3]',
}

const BXN_POLICY_STATUS_TEXT_CLASS: Record<StandardStatus, string> = {
  PUBLISHED: 'text-[#11906A]',
  DRAFT: 'text-[#6F6F6F]',
  DEPRECATED: 'text-[#B45309]',
  ARCHIVED: 'text-[#C0392B]',
  PROPOSED: 'text-[#2563A8]',
}

function BxnPolicyStatusInline({
  status,
  locale,
  className,
}: {
  status: StandardStatus
  locale: AppLocale
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 text-[12px] leading-none font-medium',
        BXN_POLICY_STATUS_TEXT_CLASS[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          BXN_POLICY_STATUS_DOT_CLASS[status],
        )}
      />
      <span>
        {localizeBxnBigScreenString(
          localizePolicyText(STANDARD_STATUS_LABEL[status], locale),
          locale,
        )}
      </span>
    </span>
  )
}

function resolveBxnPolicyDialogPageRange(total: number, page: number) {
  if (total === 0) {
    return { start: 0, end: 0 }
  }

  const start = (page - 1) * BXN_POLICY_DIALOG_PAGE_SIZE + 1
  const end = Math.min(total, page * BXN_POLICY_DIALOG_PAGE_SIZE)
  return { start, end }
}

const BXN_INSIGHT_SNAPSHOT_FALLBACK: Array<BxnInsightCard> = [
  {
    id: 'QzitkpazeaLHPj9wZrwkLcYu',
    title: '32家上市券商发布2025年ESG报告',
    summary: 'ESG理念日渐融入证券行业核心运营',
    redirectUrl:
      'http://www.legaldaily.com.cn/Company/content/2026-04/27/content_9380239.html',
    publishTime: '2026-04-27T10:41:59+08:00',
    tags: ['ESG报告', '证券行业', '行业趋势'],
  },
  {
    id: 'sLSb8FK9yVBvCi21cvQVPkRg',
    title: '32家上市券商发布2025年ESG报告',
    summary: 'ESG理念日渐融入券商发展战略',
    redirectUrl:
      'http://www.legaldaily.com.cn/Company/content/2026-04/27/content_9380239.html',
    publishTime: '2026-04-27T10:41:59+08:00',
    tags: ['ESG', '券商', '行业报告'],
  },
  {
    id: 'T2dHeXTZAwUgBpZa3Z1Uq4jA',
    title: '中国医药发布《2025年度环境、社会和公司治理(ESG)报告》',
    summary: '作为国家医药战略储备核心承储单位，交出沉甸甸的责任答卷',
    redirectUrl: '百度',
    publishTime: '2026-04-27T06:09:50+08:00',
    tags: ['ESG报告', '医药行业', '社会责任'],
  },
  {
    id: 'UuLXrgq8QxZSkCBGFhps8a3M',
    title: '中国医药发布《2025年度环境、社会和公司治理(ESG)报告》',
    summary: '国家医药战略储备单位交出责任答卷',
    redirectUrl: '百度',
    publishTime: '2026-04-27T06:09:50+08:00',
    tags: ['ESG', '医药行业', '社会责任'],
  },
  {
    id: 'TKbPRhd3xgEnZwNr1a7omhLQ',
    title: '三维通信：ESG评级行业领跑，以责任担当筑牢可持续发展根基',
    summary: '获评Wind ESG AA级，综合评分位居行业第一',
    redirectUrl: '百度',
    publishTime: '2026-04-27T04:07:35+08:00',
    tags: ['ESG评级', '行业标杆', '可持续发展'],
  },
  {
    id: 'Nx7Z4bEFfmnGHUxKejTQipTi',
    title: '值得买发布《2025年可持续发展报告》：以AI赋能可持续发展',
    summary: '推进“全面AI”战略与ESG理念深度融合',
    redirectUrl: 'https://www.cet.com.cn/wzsy/kjzx/10348393.shtml',
    publishTime: '2026-04-27T00:00:00+08:00',
    tags: ['ESG', 'AI战略', '可持续发展'],
  },
  {
    id: 'fVckMw8yrfjkrRtJ5NoRjc1M',
    title: '京东工业发布首份ESG报告 以数智供应链引领行业可持续发展',
    summary: '传承“正道成功”价值观，披露全链路实践成果',
    redirectUrl: 'https://finance.stockstar.com/IG2026042700019556.shtml',
    publishTime: '2026-04-27T00:00:00+08:00',
    tags: ['ESG', '供应链', '科技企业'],
  },
]

function isVisibleBxnInsightCard(card: BxnInsightCard) {
  return card.title !== '资讯速递一' && card.summary !== '批量创建测试B'
}

function getDefaultInsightCards(): Array<BxnInsightCard> {
  return BXN_INSIGHT_SNAPSHOT_FALLBACK
}

async function fetchBxnInsightCards(): Promise<Array<BxnInsightCard>> {
  const response = await fetch(BXN_ARTICLE_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      articleType: 'news',
      offset: 0,
      limit: 20,
    }),
  })

  if (!response.ok) {
    throw new Error('加载资讯失败: HTTP ' + String(response.status))
  }

  const payload = (await response.json()) as {
    data?: Array<{
      articleId?: string
      title?: string
      subtitle?: string
      redirectUrl?: string
      publishTime?: string
      tags?: Array<string>
    }>
  }

  const cards = (payload.data ?? [])
    .map((item, index) => ({
      id: item.articleId ?? 'insight-' + String(index + 1),
      title: item.title?.trim() || '资讯标题占位',
      summary:
        item.subtitle?.trim() || '资讯副标题或部分正文占位，后续再填真实内容。',
      redirectUrl: item.redirectUrl ?? '',
      publishTime: item.publishTime ?? '',
      tags: Array.isArray(item.tags) ? item.tags : [],
    }))
    .slice(0, 8)

  return cards.length > 0 ? cards : getDefaultInsightCards()
}

function buildAiAgentIframeSrc() {
  if (typeof window === 'undefined') {
    return AI_AGENT_BASE_URL + '#ticket='
  }

  const ticket = encodeURIComponent(window.btoa(AI_AGENT_TICKET_SOURCE))
  return AI_AGENT_BASE_URL + '#ticket=' + ticket
}

const bxnLayout = {
  viewportMinHeight: 800,
  columns: {
    leftMinWidth: 300,
    leftMaxWidth: 400,
    middleMinWidth: 868,
    middleMaxWidth: 1296,
    rightMinWidth: 300,
    rightMaxWidth: 400,
    contentMaxWidth: 1920,
    superWideBreakpoint: 2560,
  },
  leftPanel: {
    orgFixedHeight: 248.33,
    policyMinHeight: 248.33,
    insightMinHeight: 248.33,
    assistantFixedHeight: 70,
  },
  middlePanel: {
    kpiMinHeight: 139,
    scopeMinHeight: 363,
    bottomMinHeight: 331,
  },
  rightPanel: {
    rankingCardMinHeight: 150,
    rankingCardMaxHeight: 170,
  },
}

function resolveBxnScale(width: number, height: number) {
  const widthScale = width / 1920
  const heightScale = height / 1080
  const rawScale = Math.min(widthScale, heightScale)

  return Math.min(1.12, Math.max(1, rawScale))
}

const withBaseAsset = (assetPath: string) =>
  `${import.meta.env.BASE_URL}${assetPath.replace(/^\//, '')}`

type BxnDetailDialogKey =
  | 'scopeDistribution'
  | 'productRanking'
  | 'policyLibrary'
  | 'insight'
  | 'riskWarning'
function resolveDialogFromSearch(): BxnDetailDialogKey | null {
  if (typeof window === 'undefined') {
    return null
  }

  const dialog = new URLSearchParams(window.location.search).get('dialog')

  if (
    dialog === 'scopeDistribution' ||
    dialog === 'productRanking' ||
    dialog === 'policyLibrary' ||
    dialog === 'insight' ||
    dialog === 'riskWarning'
  ) {
    return dialog
  }

  return null
}

function BxnModuleEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={
        'flex h-full min-h-0 w-full items-center justify-center rounded-[6px] bg-white/28 p-4 ' +
        (className ?? '')
      }
    >
      <div className="flex max-w-[320px] flex-col items-center text-center">
        <span className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#D6F1E8] text-[#11906A]">
          <Database className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <p
          className="mt-3 text-[14px] leading-[1.2] font-semibold text-[#4F4F4F]"
          style={{
            fontFamily:
              '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
          }}
        >
          暂无数据
        </p>
      </div>
    </div>
  )
}

function PageDialog({
  open,
  title,
  onClose,
  children,
  bodyClassName,
  overlayContainer,
  inlineInContainer = false,
  disableInitialFocus = false,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  bodyClassName?: string
  overlayContainer?: HTMLElement | null
  inlineInContainer?: boolean
  disableInitialFocus?: boolean
}) {
  void overlayContainer
  const dialogI18nRef = useBxnBigScreenDomI18n<HTMLDivElement>()
  const dialogBodyI18nRef = useBxnBigScreenDomI18n<HTMLDivElement>()

  useEffect(() => {
    if (!open || !inlineInContainer) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inlineInContainer, onClose, open])

  if (inlineInContainer) {
    if (!open) {
      return null
    }

    return (
      <div
        className="absolute inset-0 z-[80] flex items-center justify-center bg-black/35 p-4"
        onMouseDown={() => {
          onClose()
        }}
      >
        <div
          ref={dialogI18nRef}
          className={
            pageDialogContentClassName +
            ' overflow-hidden rounded-lg border border-border/60 bg-background/95 p-0 shadow-xl backdrop-blur-lg'
          }
          onMouseDown={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 className="text-[16px] leading-none font-semibold text-foreground">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-[0.429em] border border-border/70 px-2 py-1 text-[12px] leading-none text-muted-foreground hover:bg-muted/60"
            >
              关闭
            </button>
          </div>
          <div
            ref={dialogBodyI18nRef}
            className={
              'min-h-0 flex-1 bg-muted/50 ' +
              (bodyClassName ?? 'overflow-y-auto')
            }
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent
        ref={dialogI18nRef}
        initialFocus={disableInitialFocus ? false : undefined}
        className={
          pageDialogContentClassName +
          ' overflow-hidden rounded-lg border border-border/60 bg-background/95 p-0 shadow-xl backdrop-blur-lg'
        }
      >
        <DialogHeader className="border-b px-5 py-3.5">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div
          ref={dialogBodyI18nRef}
          className={
            'min-h-0 flex-1 bg-muted/50 ' + (bodyClassName ?? 'overflow-y-auto')
          }
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function BxnBigScreenErrorState({ message }: { message: string | null }) {
  const i18nRef = useBxnBigScreenDomI18n<HTMLElement>()

  return (
    <main
      ref={i18nRef}
      className="h-full min-w-0 flex-1 w-full text-foreground"
    >
      <div className="relative z-10 flex h-full min-h-0 w-full flex-col">
        <section className="flex min-h-0 w-full flex-1 overflow-auto px-6 pt-0 pb-5">
          <Empty className="h-full min-h-72 rounded-lg border border-dashed border-border/60 bg-muted/15">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TriangleAlert aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>页面数据加载失败</EmptyTitle>
              <EmptyDescription>
                {message ?? '当前页面暂时无法加载，请稍后重试。'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </section>
      </div>
    </main>
  )
}

function BxnBigScreenOrnaments({ locale }: { locale: AppLocale }) {
  const titleText = localizeBxnBigScreenString('某某集团全景碳驾驶舱', locale)
  const titleClassName =
    locale === 'zh-CN'
      ? 'bxn-fluid-page-title text-[34px] tracking-[4px]'
      : 'text-[28px] tracking-[1px]'

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div
        className="absolute -top-[5px] left-1/2 w-auto -translate-x-1/2 [aspect-ratio:684/64]"
        style={{ height: `${headerOrnamentHeight}px` }}
      >
        <div className="relative h-full w-full">
          <img
            src={borderAsset}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-fill drop-shadow-[0_0_8px_rgba(107,226,190,0.45)]"
          />
          <img
            src={titleBackdropAsset}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-fill"
          />
          <h1
            className={`absolute inset-0 flex -translate-y-[2px] items-center justify-center whitespace-nowrap leading-none font-semibold text-[#043D34] ${titleClassName}`}
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
          >
            {titleText}
          </h1>
          <span
            aria-hidden="true"
            className="absolute right-[calc(100%-16px)] bottom-[10px] h-[22.5px] scale-x-[-1] bg-white/80 [mask-image:url('/carbon-screen/baoxiniao-xiushixian.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:url('/carbon-screen/baoxiniao-xiushixian.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
            style={{ width: `${headerTrimWidth * headerTrimScale}px` }}
          />
          <span
            aria-hidden="true"
            className="absolute left-[calc(100%-16px)] bottom-[10px] h-[22.5px] bg-white/80 [mask-image:url('/carbon-screen/baoxiniao-xiushixian.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:url('/carbon-screen/baoxiniao-xiushixian.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
            style={{ width: `${headerTrimWidth * headerTrimScale}px` }}
          />
        </div>
      </div>
    </div>
  )
}

function BxnBigScreenControls({
  isFullscreen,
  onToggleFullscreen,
  overlayContainer,
}: {
  isFullscreen: boolean
  onToggleFullscreen: () => Promise<void>
  overlayContainer: HTMLElement | null
}) {
  void overlayContainer
  void isFullscreen
  void onToggleFullscreen

  return (
    <>
      <div className="pointer-events-auto absolute top-[24px] right-[24px] z-30 flex items-center gap-3 text-[#131313]">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/ability/carbon-accounting/mechanism"
                aria-label="返回详情"
                className="inline-flex h-[35px] items-center justify-center gap-[4px] rounded-[7px] bg-white/45 px-[9px] text-[14.3px] leading-none font-medium text-[#131313] shadow-[0_4px_14px_rgba(16,60,45,0.08)] backdrop-blur-sm transition-colors duration-200 ease-out hover:bg-white/60 hover:text-[#0A5942]"
              />
            }
          >
            <ChevronLeft className="h-[20px] w-[20px] shrink-0 translate-y-[0.5px]" strokeWidth={2.2} />
            <span className="translate-y-[1px]">返回详情</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">返回详情</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}

function BxnControlSelect({
  ariaLabel,
  icon,
  value,
  options,
  onValueChange,
  overlayContainer,
  triggerClassName,
  valueClassName,
}: {
  ariaLabel: string
  icon: React.ReactNode
  value: string
  options: Array<CarbonScreenSelectOption>
  onValueChange: (value: string) => void
  overlayContainer: HTMLElement | null
  triggerClassName?: string
  valueClassName?: string
}) {
  const { locale } = useAppLocale()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value
  const localizedSelectedLabel = localizeBxnBigScreenString(
    selectedLabel,
    locale,
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const updatePopupStyle = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) {
        return
      }

      setPopupStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 90,
      })
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (
        target &&
        (triggerRef.current?.contains(target) ||
          popupRef.current?.contains(target))
      ) {
        return
      }
      setOpen(false)
    }

    updatePopupStyle()
    window.addEventListener('resize', updatePopupStyle)
    window.addEventListener('scroll', updatePopupStyle, true)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('resize', updatePopupStyle)
      window.removeEventListener('scroll', updatePopupStyle, true)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  const popup = open ? (
    <div
      ref={popupRef}
      data-bxn-i18n-skip="true"
      role="listbox"
      aria-label={ariaLabel}
      className="rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
      style={popupStyle}
    >
      {options.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={selected}
            className={`flex w-full items-center justify-start rounded-[0.5em] px-2 py-1.5 text-left text-sm whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
              selected ? 'bg-accent/70 text-accent-foreground' : ''
            }`}
            onClick={() => {
              onValueChange(option.value)
              setOpen(false)
            }}
          >
            {localizeBxnBigScreenString(option.label, locale)}
          </button>
        )
      })}
    </div>
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-bxn-i18n-skip="true"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-8 min-w-0 items-center justify-start gap-2 border-none bg-transparent px-0 text-[#131313] shadow-none ring-0 [font-family:'PingFang_SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif] text-[16px] font-semibold tracking-[0] ${triggerClassName ?? 'w-full'}`}
        onClick={() => {
          setOpen((current) => !current)
        }}
      >
        <span className="shrink-0">{icon}</span>
        <span
          className={`min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left ${valueClassName ?? 'block'}`}
          title={localizedSelectedLabel}
        >
          {localizedSelectedLabel}
        </span>
        <span
          aria-hidden="true"
          className="ml-[4px] h-[6.43px] w-[10px] shrink-0 rounded-[1px] bg-[#131313] [clip-path:polygon(0_0,100%_0,50%_100%)]"
        />
      </button>
      {popup ? createPortal(popup, overlayContainer ?? document.body) : null}
    </>
  )
}

function BxnThumbnailImage({
  src,
  alt,
  fallbackSrc,
  className,
}: {
  src?: string
  alt: string
  fallbackSrc: string
  className?: string
}) {
  const [imgSrc, setImgSrc] = useState(src && src.trim() ? src : fallbackSrc)

  useEffect(() => {
    setImgSrc(src && src.trim() ? src : fallbackSrc)
  }, [src, fallbackSrc])

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}

type BxnRankingTabKey = 'organization' | 'product'
type BxnRankingCard = {
  title: string
  value: string
  unit: string
  percent: number
  thumbnailSrc?: string
  thumbnailAlt?: string
  productCode?: string
}
type BxnRiskLevel = 'attention' | 'remind' | 'risk'
type BxnRiskWarningCard = {
  id: string
  content: string
  level: BxnRiskLevel
  timestamp: string
}

function resolveBxnRiskTheme(level: BxnRiskLevel): {
  iconColor: string
  iconBg: string
  tagColor: string
} {
  if (level === 'risk') {
    return {
      iconColor: '#E04545',
      iconBg: '#FFEAEA',
      tagColor: '#E04545',
    }
  }
  if (level === 'remind') {
    return {
      iconColor: '#2F80D9',
      iconBg: '#EAF4FF',
      tagColor: '#2F80D9',
    }
  }
  return {
    iconColor: '#FF9300',
    iconBg: '#FFEED7',
    tagColor: '#FF9300',
  }
}

function resolveBxnRiskLabel(level: BxnRiskLevel) {
  if (level === 'risk') {
    return '风险'
  }
  if (level === 'remind') {
    return '提醒'
  }
  return '关注'
}

function resolveBxnRiskSuggestion(level: BxnRiskLevel) {
  if (level === 'risk') {
    return '请尽快核查责任主体与佐证材料，明确整改负责人并跟踪闭环。'
  }
  if (level === 'remind') {
    return '请安排业务负责人复核待办数据，确保申报或审核节点按期完成。'
  }
  return '请持续关注该事项变化，必要时补充说明材料或更新数据口径。'
}

function formatBxnRiskWarningUpdatedAt(
  timestamp: string,
  activeLocale: AppLocale,
) {
  return new Intl.DateTimeFormat(activeLocale === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function getBxnRiskWarnings(): Array<BxnRiskWarningCard> {
  return [
    {
      id: 'middle-risk-warning-1',
      content: '多项认证即将到期',
      level: 'attention',
      timestamp: '2026-04-08T10:45:00+08:00',
    },
    {
      id: 'middle-risk-warning-2',
      content: '多份合规申报数据待审核',
      level: 'remind',
      timestamp: '2026-04-08T08:20:00+08:00',
    },
    {
      id: 'middle-risk-warning-3',
      content: '某合作方合规评分低于阈值',
      level: 'risk',
      timestamp: '2026-04-07T13:10:00+08:00',
    },
    {
      id: 'middle-risk-warning-4',
      content: '某合作方合规评分低于阈值',
      level: 'risk',
      timestamp: '2026-04-07T13:10:00+08:00',
    },
    {
      id: 'middle-risk-warning-5',
      content: '供应链主体碳核算边界说明待补充',
      level: 'attention',
      timestamp: '2026-04-07T09:30:00+08:00',
    },
    {
      id: 'middle-risk-warning-6',
      content: '生产单元数据采集频次异常需复核',
      level: 'remind',
      timestamp: '2026-04-06T16:40:00+08:00',
    },
  ]
}

function sortBxnRiskWarnings(warnings: Array<BxnRiskWarningCard>) {
  return [...warnings].sort(
    (left, right) =>
      new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )
}

type BxnDonutSegment = {
  label: string
  value: number
  color: string
}
type BxnDonutCallout = {
  segmentIndex: number
  side: 'left' | 'right'
  labelOffsetY?: number
  horizontalLength?: number
}

type BxnParsedNumericValue = {
  numericValue: number
  fractionDigits: number
}

function parseBxnNumericValue(value: string | number): BxnParsedNumericValue {
  const normalizedValue = String(value).replace(/,/g, '').trim()
  const numericValue = Number(normalizedValue)
  const fractionDigits = normalizedValue.includes('.')
    ? normalizedValue.split('.')[1].length
    : 0

  return {
    numericValue: Number.isFinite(numericValue) ? numericValue : 0,
    fractionDigits,
  }
}

function formatBxnAnimatedNumber({
  value,
  minimumFractionDigits,
  maximumFractionDigits,
  useGrouping,
}: {
  value: number
  minimumFractionDigits: number
  maximumFractionDigits: number
  useGrouping: boolean
}) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  }).format(value)
}

function useBxnCountUp(target: number, duration = 900) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const finalValue = Number.isFinite(target) ? target : 0
    if (Math.abs(finalValue) < 1e-6) {
      setAnimatedValue(0)
      return
    }

    let frameId = 0
    let startTime: number | null = null

    setAnimatedValue(0)

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
      }
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setAnimatedValue(finalValue * easedProgress)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [duration, target])

  return animatedValue
}

function BxnAnimatedNumber({
  target,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  useGrouping = true,
  duration,
}: {
  target: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  useGrouping?: boolean
  duration?: number
}) {
  const animatedValue = useBxnCountUp(target, duration)

  return (
    <>
      {formatBxnAnimatedNumber({
        value: animatedValue,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
      })}
    </>
  )
}

function BxnAnimatedNumberFromRaw({
  value,
  duration,
}: {
  value: string | number
  duration?: number
}) {
  const parsed = useMemo(() => parseBxnNumericValue(value), [value])

  return (
    <BxnAnimatedNumber
      target={parsed.numericValue}
      minimumFractionDigits={parsed.fractionDigits}
      maximumFractionDigits={parsed.fractionDigits}
      duration={duration}
    />
  )
}

function BxnAnimatedProgressBar({
  targetPercent,
  className,
  duration,
}: {
  targetPercent: number
  className: string
  duration?: number
}) {
  const animatedPercent = useBxnCountUp(
    Math.max(0, Math.min(100, targetPercent)),
    duration,
  )

  return (
    <div
      className={className}
      style={{ width: `${Math.max(0, Math.min(100, animatedPercent))}%` }}
    />
  )
}

function isBxnTextActuallyTruncated(element: HTMLElement) {
  const widthOverflow = element.scrollWidth > element.clientWidth + 1
  const heightOverflow = element.scrollHeight > element.clientHeight + 1

  let clampOverflow = false
  const computedStyle = window.getComputedStyle(element)
  const lineClampValue = Number.parseInt(
    computedStyle.getPropertyValue('-webkit-line-clamp') ||
      computedStyle.getPropertyValue('line-clamp') ||
      '0',
    10,
  )

  if (lineClampValue > 0 && element.clientWidth > 0) {
    const clone = element.cloneNode(true) as HTMLElement
    clone.style.position = 'fixed'
    clone.style.left = '-99999px'
    clone.style.top = '0'
    clone.style.visibility = 'hidden'
    clone.style.pointerEvents = 'none'
    clone.style.zIndex = '-1'
    clone.style.width = `${element.clientWidth}px`
    clone.style.height = 'auto'
    clone.style.maxHeight = 'none'
    clone.style.overflow = 'visible'
    clone.style.textOverflow = 'clip'
    clone.style.display = 'block'
    clone.style.whiteSpace = 'normal'
    clone.style.removeProperty('-webkit-line-clamp')
    clone.style.removeProperty('line-clamp')
    clone.style.removeProperty('-webkit-box-orient')

    document.body.appendChild(clone)
    clampOverflow = clone.scrollHeight > element.clientHeight + 1
    clone.remove()
  }

  return widthOverflow || heightOverflow || clampOverflow
}

function useBxnOverflowDetection<T extends HTMLElement>(text: string) {
  const textRef = useRef<T | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const element = textRef.current
    if (!element) {
      return
    }

    const measure = () => {
      setIsTruncated(isBxnTextActuallyTruncated(element))
    }

    measure()

    const rafId = window.requestAnimationFrame(measure)
    const timeoutId = window.setTimeout(measure, 120)
    let isCancelled = false

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!isCancelled) {
          measure()
        }
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      measure()
    })

    resizeObserver.observe(element)
    window.addEventListener('resize', measure)

    return () => {
      isCancelled = true
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [text])

  return {
    textRef,
    isTruncated,
  }
}

function BxnTruncatedTitle({
  text,
  overlayContainer,
  className,
}: {
  text: string
  overlayContainer?: HTMLElement | null
  className: string
}) {
  void overlayContainer

  const { textRef, isTruncated } =
    useBxnOverflowDetection<HTMLHeadingElement>(text)

  if (!isTruncated) {
    return (
      <h3
        ref={textRef}
        className={className}
        title={text}
        style={{
          fontFamily:
            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
        }}
      >
        {text}
      </h3>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <h3
            ref={textRef}
            className={className}
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
            title={text}
          >
            {text}
          </h3>
        }
      />
      <TooltipContent side="top">{text}</TooltipContent>
    </Tooltip>
  )
}

function BxnTruncatedParagraph({
  text,
  overlayContainer,
  className,
}: {
  text: string
  overlayContainer?: HTMLElement | null
  className: string
}) {
  void overlayContainer

  const { textRef, isTruncated } =
    useBxnOverflowDetection<HTMLParagraphElement>(text)

  if (!isTruncated) {
    return (
      <p
        ref={textRef}
        className={className}
        title={text}
        style={{
          fontFamily:
            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
        }}
      >
        {text}
      </p>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <p
            ref={textRef}
            className={className}
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
            title={text}
          >
            {text}
          </p>
        }
      />
      <TooltipContent side="top">{text}</TooltipContent>
    </Tooltip>
  )
}

function BxnTruncatedSpan({
  text,
  overlayContainer,
  className,
}: {
  text: string
  overlayContainer?: HTMLElement | null
  className: string
}) {
  void overlayContainer

  const { textRef, isTruncated } =
    useBxnOverflowDetection<HTMLSpanElement>(text)

  if (!isTruncated) {
    return (
      <span
        ref={textRef}
        className={className}
        title={text}
        style={{
          fontFamily:
            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
        }}
      >
        {text}
      </span>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            ref={textRef}
            className={className}
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
            title={text}
          >
            {text}
          </span>
        }
      />
      <TooltipContent side="top">{text}</TooltipContent>
    </Tooltip>
  )
}

function BxnDonutWithCallouts({
  segments,
  callouts,
  onCalloutClick,
}: {
  segments: Array<BxnDonutSegment>
  callouts: Array<BxnDonutCallout>
  onCalloutClick?: (segmentIndex: number) => void
}) {
  const resolveCallout = (index?: number) =>
    callouts.find((callout) => callout.segmentIndex === index)

  const resolveCalloutGeometry = ({
    cx,
    x,
    y,
    index,
    points,
  }: {
    cx?: number | string
    x?: number | string
    y?: number | string
    index?: number
    points?: Array<{ x?: number | string; y?: number | string }>
  }) => {
    const naturalLabelPoint = points?.[1]
    const numericCx = Number(cx ?? 0)
    const naturalX = Number(x ?? naturalLabelPoint?.x ?? 0)
    const naturalY = Number(y ?? naturalLabelPoint?.y ?? 0)
    const callout = resolveCallout(index)
    const side = callout?.side ?? (naturalX >= numericCx ? 'right' : 'left')
    const direction = side === 'right' ? 1 : -1
    const labelY = Math.max(18, naturalY + (callout?.labelOffsetY ?? 0))
    const bendX = naturalX
    const bendY = labelY
    const endX = bendX + direction * (callout?.horizontalLength ?? 24)
    const textX = endX + direction * 6

    return {
      side,
      bendX,
      bendY,
      endX,
      textX,
      textY: labelY,
    }
  }

  const renderLabel = ({
    x,
    y,
    cx,
    value,
    index,
  }: {
    x?: number | string
    y?: number | string
    cx?: number | string
    value?: number | string
    index?: number
  }) => {
    const numericValue = Number(value ?? 0)
    const parsedValue = parseBxnNumericValue(numericValue)
    const geometry = resolveCalloutGeometry({ cx, x, y, index })

    return (
      <text
        x={geometry.textX}
        y={geometry.textY}
        fill="#4F4F4F"
        fontSize="14"
        fontWeight="500"
        textAnchor={geometry.side === 'right' ? 'start' : 'end'}
        dominantBaseline="central"
        style={{
          fontFamily:
            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
        }}
        className={onCalloutClick ? 'cursor-pointer' : undefined}
        onClick={() => {
          if (typeof index === 'number') {
            onCalloutClick?.(index)
          }
        }}
      >
        <BxnAnimatedNumber
          target={numericValue}
          minimumFractionDigits={parsedValue.fractionDigits}
          maximumFractionDigits={parsedValue.fractionDigits}
          useGrouping={false}
        />
        %
      </text>
    )
  }

  const renderLabelLine = ({
    points,
    cx,
    x,
    y,
    index,
    fill,
    stroke,
  }: {
    points?: Array<{ x?: number | string; y?: number | string }>
    cx?: number | string
    x?: number | string
    y?: number | string
    index?: number
    fill?: string
    stroke?: string
  }) => {
    const startPoint = points?.[0]
    const naturalLabelPoint = points?.[1]
    const startX = Number(startPoint?.x ?? 0)
    const startY = Number(startPoint?.y ?? 0)
    const geometry = resolveCalloutGeometry({
      cx,
      x: x ?? naturalLabelPoint?.x,
      y: y ?? naturalLabelPoint?.y,
      index,
      points,
    })

    const lineColor =
      typeof index === 'number' ? segments[index]?.color : undefined

    return (
      <polyline
        points={`${startX},${startY} ${geometry.bendX},${geometry.bendY} ${geometry.endX},${geometry.bendY}`}
        fill="none"
        stroke={lineColor ?? fill ?? stroke ?? '#4F4F4F'}
        strokeWidth="2"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        className={onCalloutClick ? 'cursor-pointer' : undefined}
        onClick={() => {
          if (typeof index === 'number') {
            onCalloutClick?.(index)
          }
        }}
      />
    )
  }

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius="43%"
            outerRadius="60%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive
            animationDuration={900}
            label={renderLabel}
            labelLine={renderLabelLine}
          >
            {segments.map((segment) => (
              <Cell key={segment.label} fill={segment.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function BxnFirstContentModuleShell({
  overlayContainer,
  onOpenProductDialog,
  isEmptyPreview = false,
}: {
  overlayContainer: HTMLElement | null
  onOpenProductDialog: (card: BxnRankingCard) => void
  isEmptyPreview?: boolean
}) {
  const { locale } = useAppLocale()
  void overlayContainer
  const [activeTab, setActiveTab] = useState<BxnRankingTabKey>('organization')
  const [rankingScrollbarWidth, setRankingScrollbarWidth] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const carouselTrackRef = useRef<HTMLDivElement | null>(null)
  const organizationCards: Array<BxnRankingCard> = [
    {
      title: '商品清洗耗电',
      value: '52,772.895',
      unit: 'tCO₂e',
      percent: 59.6,
    },
    {
      title: '外购梭织棉',
      value: '6,345.4998931',
      unit: 'tCO₂e',
      percent: 7.17,
    },
    {
      title: '商品清洗耗水',
      value: '5,396.2522096',
      unit: 'tCO₂e',
      percent: 6.09,
    },
    {
      title: '外购针织棉',
      value: '4,850.9524663',
      unit: 'tCO₂e',
      percent: 5.48,
    },
    { title: '市政供电', value: '4,592.82054', unit: 'tCO₂e', percent: 5.19 },
  ]
  const productCards: Array<BxnRankingCard> = [
    {
      title: '男士商务西服套装',
      productCode: 'BXN-SUIT-SET-001',
      value: '64.9996205',
      unit: 'kgCO₂e/件',
      percent: 46.36,
      thumbnailSrc: withBaseAsset('/carbon-screen/product-thumbs/polo.png'),
      thumbnailAlt: '男士商务西服套装',
    },
    {
      title: '男士西服上衣',
      productCode: 'BXN-SUIT-JACKET-002',
      value: '41.0895289',
      unit: 'kgCO₂e/件',
      percent: 29.3,
      thumbnailSrc: withBaseAsset('/carbon-screen/product-thumbs/suit.png'),
      thumbnailAlt: '男士西服上衣',
    },
    {
      title: '男士西服裤装',
      productCode: 'BXN-SUIT-TROUSERS-003',
      value: '23.9100915',
      unit: 'kgCO₂e/件',
      percent: 17.05,
      thumbnailSrc: withBaseAsset('/carbon-screen/product-thumbs/down.png'),
      thumbnailAlt: '男士西服裤装',
    },
    {
      title: '男士衬衫',
      productCode: 'BXN-SHIRT-004',
      value: '7.0017115',
      unit: 'kgCO₂e/件',
      percent: 4.99,
      thumbnailSrc: withBaseAsset('/carbon-screen/product-thumbs/coat.png'),
      thumbnailAlt: '男士衬衫',
    },
    {
      title: '户外T恤',
      productCode: 'BXN-TSHIRT-005',
      value: '3.2174358',
      unit: 'kgCO₂e/件',
      percent: 2.29,
      thumbnailSrc: withBaseAsset('/carbon-screen/product-thumbs/trousers.png'),
      thumbnailAlt: '户外T恤',
    },
  ]
  const sortedOrganizationCards = [...organizationCards].sort(
    (left, right) =>
      parseBxnNumericValue(right.value).numericValue -
      parseBxnNumericValue(left.value).numericValue,
  )
  const sortedProductCards = [...productCards].sort(
    (left, right) =>
      parseBxnNumericValue(right.value).numericValue -
      parseBxnNumericValue(left.value).numericValue,
  )
  const rankingCards = isEmptyPreview
    ? []
    : activeTab === 'organization'
      ? sortedOrganizationCards
      : sortedProductCards
  const rankingTrack = [...rankingCards, ...rankingCards]

  useEffect(() => {
    if (!carouselRef.current) {
      return
    }
    carouselRef.current.scrollTop = 0
  }, [activeTab])

  useEffect(() => {
    const container = carouselRef.current
    if (!container) {
      return
    }

    const measureScrollbarWidth = () => {
      setRankingScrollbarWidth(container.offsetWidth - container.clientWidth)
    }

    measureScrollbarWidth()
    window.addEventListener('resize', measureScrollbarWidth)
    return () => {
      window.removeEventListener('resize', measureScrollbarWidth)
    }
  }, [activeTab])

  useEffect(() => {
    const container = carouselRef.current
    const track = carouselTrackRef.current
    if (!container || !track || rankingCards.length === 0) {
      if (container) {
        container.scrollTop = 0
      }
      return
    }

    let animationFrameId = 0
    let lastTimestamp = 0
    const speed = 34

    const getLoopHeight = () => track.scrollHeight / 2

    const canLoop = () => {
      const maxScrollableDistance =
        container.scrollHeight - container.clientHeight
      return maxScrollableDistance > 1
    }

    const step = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp
      }

      const deltaSeconds = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      if (!isCarouselPaused && canLoop()) {
        const loopHeight = getLoopHeight()
        const nextScrollTop = container.scrollTop + speed * deltaSeconds
        container.scrollTop =
          nextScrollTop >= loopHeight
            ? nextScrollTop - loopHeight
            : nextScrollTop
      }

      animationFrameId = window.requestAnimationFrame(step)
    }

    animationFrameId = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [activeTab, isCarouselPaused, rankingCards.length])

  return (
    <section className="h-full w-full min-w-0 overflow-x-hidden flex flex-col gap-2">
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-[10px]">
          <h2
            className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
          >
            {localizeBxnBigScreenString('排放排行 TOP 5', locale)}
          </h2>
          <span
            aria-hidden="true"
            className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('organization')
            }}
            className={`[font-family:'PingFang_SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif] text-[16px] leading-none font-semibold tracking-[0] ${
              activeTab === 'organization' ? 'text-[#11906A]' : 'text-[#131313]'
            }`}
          >
            {localizeBxnBigScreenString('组织碳', locale)}
          </button>
          <span aria-hidden="true" className="h-[16px] w-[2px] bg-white/80" />
          <button
            type="button"
            onClick={() => {
              setActiveTab('product')
            }}
            className={`[font-family:'PingFang_SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif] text-[16px] leading-none font-semibold tracking-[0] ${
              activeTab === 'product' ? 'text-[#11906A]' : 'text-[#131313]'
            }`}
          >
            {localizeBxnBigScreenString('产品碳', locale)}
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {rankingCards.length === 0 ? (
          <BxnModuleEmptyState className="h-full" />
        ) : (
          <div
            ref={carouselRef}
            onMouseEnter={() => {
              setIsCarouselPaused(true)
            }}
            onMouseLeave={() => {
              setIsCarouselPaused(false)
            }}
            className="absolute inset-y-0 left-0 right-[-24px] box-border overflow-y-auto overflow-x-hidden pr-[24px] [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.8)_transparent] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/80"
          >
            <div
              ref={carouselTrackRef}
              className="grid min-w-0 gap-3 grid-rows-[repeat(10,minmax(150px,170px))]"
              style={{ width: `calc(100% + ${rankingScrollbarWidth}px)` }}
            >
              {rankingTrack.map((card, index) => {
                const rank = (index % rankingCards.length) + 1
                return (
                  <article
                    key={`ranking-card-${activeTab}-${index}-${card.title}`}
                    title={localizeBxnBigScreenString(card.title, locale)}
                    className="relative flex h-full min-w-[148px] w-full flex-col rounded-[6px] bg-white/40 px-4 py-[18px]"
                    style={{
                      minHeight: `${bxnLayout.rightPanel.rankingCardMinHeight}px`,
                      maxHeight: `${bxnLayout.rightPanel.rankingCardMaxHeight}px`,
                    }}
                  >
                    {activeTab === 'product' ? (
                      <div className="flex h-full items-start justify-center gap-4">
                        <div className="h-[clamp(110px,100%,130px)] w-[clamp(110px,100%,130px)] aspect-square shrink-0 overflow-hidden rounded-[6px] bg-white/60">
                          <BxnThumbnailImage
                            src={card.thumbnailSrc}
                            fallbackSrc={withBaseAsset(
                              '/carbon-screen/nanda.webp',
                            )}
                            alt={localizeBxnBigScreenString(
                              card.thumbnailAlt ?? card.title,
                              locale,
                            )}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="h-full max-h-[130px] min-w-0 flex-1 flex flex-col">
                          <div className="min-w-0 flex flex-col gap-2">
                            <span
                              className={`text-[14px] leading-[1.2] font-medium ${rank <= 3 ? 'text-[#11906A]' : 'text-[#5F5F5F]'}`}
                              style={{
                                fontFamily:
                                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                              }}
                            >
                              NO.{rank}
                            </span>
                            <BxnTruncatedTitle
                              text={localizeBxnBigScreenString(
                                card.title,
                                locale,
                              )}
                              className="min-w-0 truncate text-[14px] leading-[1.2] font-medium text-[#303030]"
                            />
                          </div>
                          <div className="mt-2 flex min-w-0 max-w-full flex-col overflow-hidden">
                            <span
                              title={card.value}
                              className="block min-w-0 max-w-full truncate text-[24px] leading-[1.1] font-semibold text-[#131313]"
                              style={{
                                fontFamily:
                                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                              }}
                            >
                              <BxnAnimatedNumberFromRaw value={card.value} />
                            </span>
                            <span
                              title={card.unit}
                              className="mt-[4px] block max-w-full truncate text-[14px] leading-[1.2] font-normal whitespace-nowrap text-[#131313]"
                              style={{
                                fontFamily:
                                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                              }}
                            >
                              {card.unit}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenProductDialog(card)
                            }}
                            className="mt-auto inline-flex items-center gap-1 text-[14px] leading-[1.2] font-medium text-[#11906A]"
                            style={{
                              fontFamily:
                                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                            }}
                          >
                            {localizeBxnBigScreenString('查看详情', locale)}
                            <ChevronRight
                              className="size-4"
                              strokeWidth={2.4}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0 flex flex-col gap-2">
                          <span
                            className={`text-[14px] leading-[1.2] font-medium ${rank <= 3 ? 'text-[#11906A]' : 'text-[#5F5F5F]'}`}
                            style={{
                              fontFamily:
                                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                            }}
                          >
                            NO.{rank}
                          </span>
                          <BxnTruncatedTitle
                            text={localizeBxnBigScreenString(
                              card.title,
                              locale,
                            )}
                            className="min-w-0 truncate text-[14px] leading-[1.2] font-medium text-[#303030]"
                          />
                        </div>
                        <div className="mt-2 flex items-baseline">
                          <span
                            className="bxn-fluid-metric text-[26px] leading-[1.1] font-semibold text-[#131313]"
                            style={{
                              fontFamily:
                                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                            }}
                          >
                            <BxnAnimatedNumberFromRaw value={card.value} />
                          </span>
                          <span
                            className="ml-[6px] text-[14px] leading-[1.2] font-semibold text-[#131313]"
                            style={{
                              fontFamily:
                                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                            }}
                          >
                            {card.unit}
                          </span>
                        </div>
                        <div className="mt-auto flex items-center gap-[10px]">
                          <div className="h-[8px] flex-1 rounded-full bg-[#E7FFF8]">
                            <BxnAnimatedProgressBar
                              targetPercent={card.percent}
                              className="h-full rounded-full bg-[#11906A]"
                            />
                          </div>
                          <span
                            className="shrink-0 text-[14px] leading-[1.2] font-medium text-[#131313]"
                            style={{
                              fontFamily:
                                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                            }}
                          >
                            <BxnAnimatedNumber
                              target={card.percent}
                              minimumFractionDigits={2}
                              maximumFractionDigits={2}
                              useGrouping={false}
                            />
                            %
                          </span>
                        </div>
                      </>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function BxnLeftContentModulesShell({
  siteOptions,
  yearOptions,
  selectedSite,
  selectedYear,
  insightCards,
  onSelectSite,
  onSelectYear,
  onOpenPolicyDialog,
  onOpenPolicyCard,
  onOpenAiAssistant,
  overlayContainer,
  isEmptyPreview = false,
}: {
  siteOptions: Array<CarbonScreenSelectOption>
  yearOptions: Array<CarbonScreenSelectOption>
  selectedSite: string
  selectedYear: string
  insightCards: Array<BxnInsightCard>
  onSelectSite: (value: string) => void
  onSelectYear: (value: string) => void
  onOpenPolicyDialog: () => void
  onOpenPolicyCard: (policyId: string) => void
  onOpenAiAssistant: () => void
  overlayContainer: HTMLElement | null
  isEmptyPreview?: boolean
}) {
  const { locale } = useAppLocale()
  const policyCards = useMemo(
    () =>
      api.policyLibrary
        .listStandards()
        .slice(0, BXN_POLICY_PREVIEW_LIMIT)
        .map((standard) => ({
          id: standard.id,
          title: standard.title,
          status: standard.status,
          tags: [
            standard.code,
            localizePolicyText(
              STANDARD_CATEGORY_LABEL[standard.category],
              locale,
            ),
          ],
        })),
    [locale],
  )
  const displayedPolicyCards = isEmptyPreview ? [] : policyCards
  const displayedInsightCards = isEmptyPreview
    ? []
    : insightCards.filter(isVisibleBxnInsightCard).slice(0, 7)

  return (
    <section className="grid h-full w-full min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_70px] gap-5">
      <div className="min-h-0 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col gap-5">
          <div
            className="shrink-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2"
            style={{
              height: `${bxnLayout.leftPanel.orgFixedHeight}px`,
              minHeight: `${bxnLayout.leftPanel.orgFixedHeight}px`,
            }}
          >
            <div className="flex flex-col gap-[10px]">
              <h2
                className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
                style={{
                  fontFamily:
                    '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                }}
              >
                组织主体
              </h2>
              <span
                aria-hidden="true"
                className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
              />
            </div>
            <article className="min-h-0 overflow-hidden rounded-[6px] bg-white/40 grid grid-rows-[minmax(0,1fr)_54px]">
              <div className="min-h-0 overflow-hidden bg-white/25">
                {isEmptyPreview ? (
                  <BxnModuleEmptyState />
                ) : (
                  <img
                    src="/carbon-screen/baoxiniao-campus-bg.png"
                    alt="组织主体"
                    className="h-full min-h-[120px] w-full object-cover"
                  />
                )}
              </div>
              <div className="grid h-full grid-cols-2 items-center gap-3 bg-white/50 px-4">
                <div className="min-w-0">
                  <BxnControlSelect
                    ariaLabel={localizeBxnBigScreenString('选择工厂', locale)}
                    icon={
                      <Building2
                        className="size-4 text-[#131313]"
                        strokeWidth={2.2}
                      />
                    }
                    value={selectedSite}
                    options={siteOptions}
                    onValueChange={onSelectSite}
                    overlayContainer={overlayContainer}
                    triggerClassName="w-full"
                    valueClassName="block max-w-full"
                  />
                </div>
                <div className="min-w-0 border-l border-white pl-3">
                  <BxnControlSelect
                    ariaLabel={localizeBxnBigScreenString('选择年份', locale)}
                    icon={
                      <CalendarDays
                        className="size-4 text-[#131313]"
                        strokeWidth={2.2}
                      />
                    }
                    value={selectedYear}
                    options={yearOptions}
                    onValueChange={onSelectYear}
                    overlayContainer={overlayContainer}
                    triggerClassName="w-full"
                    valueClassName="block max-w-full"
                  />
                </div>
              </div>
            </article>
          </div>

          <div className="flex-1 overflow-hidden grid grid-rows-[auto_minmax(0,1fr)] gap-2 min-h-0">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between gap-4">
                <h2
                  className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  政策标准库
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (!isEmptyPreview) {
                      onOpenPolicyDialog()
                    }
                  }}
                  className={
                    'inline-flex items-center gap-1 text-[14px] leading-[1.2] font-medium ' +
                    (isEmptyPreview ? 'text-[#8AAEA4]' : 'text-[#11906A]')
                  }
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  查看详情
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
              <span
                aria-hidden="true"
                className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
              />
            </div>
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-black/15">
              {isEmptyPreview ? <BxnModuleEmptyState /> : null}
              {displayedPolicyCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  title={card.title}
                  onClick={() => {
                    onOpenPolicyCard(card.id)
                  }}
                  className="rounded-[0.429em] bg-white/40 px-4 py-3 text-left transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/55 hover:shadow-[0_8px_18px_rgba(16,60,45,0.08)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <BxnTruncatedParagraph
                      text={card.title}
                      overlayContainer={overlayContainer}
                      className="min-w-0 flex-1 truncate text-[14px] leading-[1.2] font-semibold text-[#131313]"
                    />
                    <BxnPolicyStatusInline
                      status={card.status}
                      locale={locale}
                    />
                  </div>
                  <div className="mt-[6px] flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[0.429em] bg-white/50 px-2 py-1 text-[12px] leading-none text-[#7A7A7A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden grid grid-rows-[auto_minmax(0,1fr)] gap-2 min-h-0">
            <div className="flex flex-col gap-[10px]">
              <h2
                className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
                style={{
                  fontFamily:
                    '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                }}
              >
                {localizeBxnBigScreenString('风险及机遇分析', locale)}
              </h2>
              <span
                aria-hidden="true"
                className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
              />
            </div>
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-black/15">
              {isEmptyPreview ? <BxnModuleEmptyState /> : null}
              {displayedInsightCards.map((card) =>
                (() => {
                  const localizedTitle = localizeBxnBigScreenString(
                    card.title,
                    locale,
                  )
                  const localizedSummary = localizeBxnBigScreenString(
                    card.summary,
                    locale,
                  )

                  return (
                    <a
                      key={card.id}
                      href={card.redirectUrl || 'about:blank'}
                      target="_blank"
                      rel="noreferrer"
                      title={`${localizedTitle}\n${localizedSummary}`}
                      className="flex w-full items-start gap-3 rounded-[6px] bg-white/40 px-4 py-3 text-left transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/55 hover:shadow-[0_8px_18px_rgba(16,60,45,0.08)]"
                    >
                      <span className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#D6F1E8] text-[#11906A]">
                        <Newspaper
                          className="h-[18px] w-[18px]"
                          strokeWidth={2}
                        />
                      </span>
                      <div className="min-w-0">
                        <BxnTruncatedParagraph
                          text={localizedTitle}
                          overlayContainer={overlayContainer}
                          className="truncate text-[14px] leading-[1.2] font-semibold text-[#131313]"
                        />
                        <BxnTruncatedParagraph
                          text={localizedSummary}
                          overlayContainer={overlayContainer}
                          className="mt-[4px] truncate text-[12px] leading-[1.2] text-[#808080]"
                        />
                      </div>
                    </a>
                  )
                })(),
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-[6px] bg-white/40 bxn-fluid-pad p-4 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/55 hover:shadow-[0_10px_22px_rgba(16,60,45,0.1)]"
        style={{
          height: `${bxnLayout.leftPanel.assistantFixedHeight}px`,
          minHeight: `${bxnLayout.leftPanel.assistantFixedHeight}px`,
        }}
      >
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="group flex h-full w-full items-center gap-4 rounded-[0.429em] text-left transition-all duration-200 ease-out hover:bg-white/10"
        >
          <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-visible">
            <img
              src={withBaseAsset(aiAssistantRobotAsset)}
              alt="AI助理"
              className="h-[50.4px] w-[63px] max-w-none select-none object-contain drop-shadow-[0_8px_14px_rgba(17,144,106,0.24)] transition-transform duration-200 ease-out group-hover:scale-105"
              draggable={false}
            />
          </span>
          <p
            className="truncate text-[20.8px] leading-[150%] font-semibold text-[#0A5942]"
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
          >
            不懂就问，AI助理
          </p>
        </button>
      </div>
    </section>
  )
}

function BxnInsightDetailDialogContent({
  id,
  title,
  summary,
  redirectUrl,
}: {
  id: string
  title: string
  summary: string
  redirectUrl: string
}) {
  const iframeSrc = redirectUrl.trim()

  return (
    <div className="h-full min-h-0 p-4">
      <section className="h-full min-h-0 overflow-hidden rounded-[8px] border border-white/70 bg-white/40">
        <iframe
          key={id + '-' + iframeSrc}
          src={iframeSrc || 'about:blank'}
          title={title || summary}
          className="h-full w-full border-0 bg-white"
          referrerPolicy="no-referrer"
        />
      </section>
    </div>
  )
}

function BxnRiskWarningDetailDialogContent({
  warning,
  warnings,
  onSelectWarning,
}: {
  warning: BxnRiskWarningCard | null
  warnings: Array<BxnRiskWarningCard>
  onSelectWarning: (warning: BxnRiskWarningCard) => void
}) {
  const { locale } = useAppLocale()

  if (!warning) {
    return (
      <div className="h-full min-h-0 p-4">
        <BxnModuleEmptyState className="h-full" />
      </div>
    )
  }

  const activeWarning =
    warnings.find((item) => item.id === warning.id) ?? warning
  const theme = resolveBxnRiskTheme(activeWarning.level)
  const label = resolveBxnRiskLabel(activeWarning.level)
  const suggestion = resolveBxnRiskSuggestion(activeWarning.level)
  const updatedAt = formatBxnRiskWarningUpdatedAt(
    activeWarning.timestamp,
    locale,
  )

  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden bg-muted/50 p-4">
      <aside className="flex min-h-0 w-[320px] shrink-0 flex-col overflow-hidden rounded-[8px] border border-white/70 bg-white/35">
        <div className="border-b border-white/70 px-4 py-3">
          <h3 className="text-[16px] leading-none font-semibold text-[#131313]">
            {localizeBxnBigScreenString('风险预警', locale)}
          </h3>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {warnings.map((item) => {
              const itemTheme = resolveBxnRiskTheme(item.level)
              const itemLabel = resolveBxnRiskLabel(item.level)
              const isActive = item.id === activeWarning.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectWarning(item)
                  }}
                  className={cn(
                    'flex w-full flex-col gap-2 rounded-[0.429em] border p-3 text-left transition-colors',
                    isActive
                      ? 'border-[#11906A]/40 bg-[#EAF7F2]'
                      : 'border-transparent bg-white/45 hover:bg-white/65',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2 min-w-0 text-[14px] leading-[1.35] font-medium text-[#131313]">
                      {localizeBxnBigScreenString(item.content, locale)}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-1 text-[12px] leading-none font-medium"
                      style={{
                        color: itemTheme.tagColor,
                        backgroundColor: itemTheme.iconBg,
                      }}
                    >
                      {localizeBxnBigScreenString(itemLabel, locale)}
                    </span>
                  </div>
                  <span className="text-[12px] leading-none text-[#8A8A8A]">
                    {formatBxnRiskWarningUpdatedAt(item.timestamp, locale)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto rounded-[8px] border border-white/70 bg-white/45 p-5 px-px sm:px-5">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-[10px]"
            style={{ backgroundColor: theme.iconBg }}
          >
            {activeWarning.level === 'risk' ? (
              <TriangleAlert
                className="size-6"
                strokeWidth={2.6}
                style={{ color: theme.iconColor }}
              />
            ) : activeWarning.level === 'remind' ? (
              <Bell
                className="size-6"
                strokeWidth={2.6}
                style={{ color: theme.iconColor }}
              />
            ) : (
              <CircleAlert
                className="size-6"
                strokeWidth={2.6}
                style={{ color: theme.iconColor }}
              />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-none font-medium text-[#6F6F6F]">
              {localizeBxnBigScreenString('预警内容', locale)}
            </p>
            <h3
              className="mt-3 text-[26px] leading-[1.25] font-semibold text-[#131313]"
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {localizeBxnBigScreenString(activeWarning.content, locale)}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
            <p className="text-[12px] text-[#8A8A8A]">
              {localizeBxnBigScreenString('风险等级', locale)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: theme.tagColor }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{ color: theme.tagColor }}
              >
                {localizeBxnBigScreenString(label, locale)}
              </span>
            </div>
          </div>
          <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
            <p className="text-[12px] text-[#8A8A8A]">
              {localizeBxnBigScreenString('更新时间', locale)}
            </p>
            <p
              className="mt-2 text-[15px] font-semibold text-[#131313]"
              data-bxn-i18n-skip="true"
            >
              {updatedAt}
            </p>
          </div>
        </div>

        <div className="rounded-[8px] border border-white/70 bg-white/55 p-4">
          <p className="text-[12px] text-[#8A8A8A]">
            {localizeBxnBigScreenString('处置建议', locale)}
          </p>
          <p className="mt-3 text-[16px] leading-[1.6] text-[#4F4F4F]">
            {localizeBxnBigScreenString(suggestion, locale)}
          </p>
        </div>
      </section>
    </div>
  )
}

function BxnPolicyLibraryDetailDialogContent({
  initialPolicyId,
  overlayContainer,
  isEmptyPreview = false,
}: {
  initialPolicyId?: string | null
  overlayContainer?: HTMLElement | null
  isEmptyPreview?: boolean
}) {
  const { locale } = useAppLocale()
  const policyStandards = useMemo(() => api.policyLibrary.listStandards(), [])
  const [policySearchKeyword, setPolicySearchKeyword] = useState('')
  const [policyStatusFilter, setPolicyStatusFilter] = useState<
    StandardStatus | typeof BXN_POLICY_STATUS_ALL
  >(BXN_POLICY_STATUS_ALL)
  const [policyPage, setPolicyPage] = useState(1)

  const [activePolicyId, setActivePolicyId] = useState(
    policyStandards[0]?.id ?? '',
  )

  const filteredPolicyStandards = useMemo(() => {
    const keyword = policySearchKeyword.trim().toLowerCase()

    return policyStandards.filter((policy) => {
      const matchesStatus =
        policyStatusFilter === BXN_POLICY_STATUS_ALL ||
        policy.status === policyStatusFilter
      const matchesKeyword =
        keyword.length === 0 ||
        policy.title.toLowerCase().includes(keyword) ||
        policy.code.toLowerCase().includes(keyword)

      return matchesStatus && matchesKeyword
    })
  }, [policySearchKeyword, policyStandards, policyStatusFilter])

  const policyPageCount = Math.max(
    1,
    Math.ceil(filteredPolicyStandards.length / BXN_POLICY_DIALOG_PAGE_SIZE),
  )
  const safePolicyPage = Math.min(policyPage, policyPageCount)
  const pagedPolicyStandards = filteredPolicyStandards.slice(
    (safePolicyPage - 1) * BXN_POLICY_DIALOG_PAGE_SIZE,
    safePolicyPage * BXN_POLICY_DIALOG_PAGE_SIZE,
  )
  const pageRange = resolveBxnPolicyDialogPageRange(
    filteredPolicyStandards.length,
    safePolicyPage,
  )
  const paginationSummary =
    locale === 'zh-CN'
      ? `第 ${pageRange.start}-${pageRange.end} 条，共 ${filteredPolicyStandards.length} 条`
      : `${pageRange.start}-${pageRange.end} of ${filteredPolicyStandards.length}`

  useEffect(() => {
    setPolicyPage(1)
  }, [policySearchKeyword, policyStatusFilter])

  useEffect(() => {
    if (policyPage !== safePolicyPage) {
      setPolicyPage(safePolicyPage)
    }
  }, [policyPage, safePolicyPage])

  useEffect(() => {
    if (filteredPolicyStandards.length === 0) {
      if (activePolicyId !== '') {
        setActivePolicyId('')
      }
      return
    }

    const hasActivePolicy = filteredPolicyStandards.some(
      (policy) => policy.id === activePolicyId,
    )
    if (!hasActivePolicy) {
      setActivePolicyId(filteredPolicyStandards[0].id)
    }
  }, [activePolicyId, filteredPolicyStandards])

  useEffect(() => {
    if (!initialPolicyId) {
      return
    }

    const matched = policyStandards.find(
      (policy) => policy.id === initialPolicyId,
    )
    if (matched) {
      setActivePolicyId(matched.id)
    }
  }, [initialPolicyId, policyStandards])

  const activePolicy =
    policyStandards.find((policy) => policy.id === activePolicyId) ??
    filteredPolicyStandards[0]

  if (isEmptyPreview) {
    return (
      <div className="flex h-full min-h-0 overflow-hidden gap-4 bg-muted/50 p-4">
        <aside className="flex min-h-0 w-[320px] shrink-0 flex-col overflow-hidden rounded-[8px] border border-white/70 bg-white/35 p-3">
          <BxnModuleEmptyState />
        </aside>
        <section className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-[8px] border border-white/70 bg-white/40 bxn-fluid-pad p-4">
          <BxnModuleEmptyState />
        </section>
      </div>
    )
  }

  const factorCount = activePolicy
    ? api.policyLibrary.getFactorsByStandardId(activePolicy.id).length
    : 0
  const mappingCount = activePolicy
    ? api.policyLibrary.getMappingsByStandardId(activePolicy.id).length
    : 0

  return (
    <div className="flex h-full min-h-0 overflow-hidden gap-4 bg-muted/50 p-4">
      <aside className="flex min-h-0 w-[360px] shrink-0 flex-col overflow-hidden rounded-[8px] border border-white/70 bg-white/35">
        <div className="border-b border-white/70 px-4 py-3">
          <h3
            className="text-[16px] leading-none font-semibold text-[#131313]"
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
          >
            {localizeBxnBigScreenString('标准列表', locale)}
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#6F6F6F]" />
              <Input
                value={policySearchKeyword}
                onChange={(event) => {
                  setPolicySearchKeyword(event.target.value)
                }}
                placeholder="搜索政策名称"
                aria-label="搜索政策名称"
                className="h-8 border-white/70 bg-white/55 pl-8 text-[13px] text-[#131313] placeholder:text-[#8A8A8A]"
              />
            </div>
            <select
              value={policyStatusFilter}
              aria-label="状态筛选"
              onChange={(event) => {
                setPolicyStatusFilter(
                  event.target.value as
                    | StandardStatus
                    | typeof BXN_POLICY_STATUS_ALL,
                )
              }}
              className="h-8 w-full rounded-[8px] border border-white/70 bg-white/55 px-3 text-[13px] text-[#131313] outline-none transition focus-visible:border-[#11906A]/60 focus-visible:ring-2 focus-visible:ring-[#11906A]/20"
            >
              {BXN_POLICY_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {pagedPolicyStandards.length === 0 ? (
            <BxnModuleEmptyState className="h-full" />
          ) : (
            <div className="flex flex-col gap-3">
              {pagedPolicyStandards.map((policy) => {
                const isActive = policy.id === activePolicy?.id

                return (
                  <button
                    key={policy.id}
                    type="button"
                    onClick={() => {
                      setActivePolicyId(policy.id)
                    }}
                    className={`w-full rounded-[0.5em] border px-3 py-3 text-left transition ${
                      isActive
                        ? 'border-[#11906A]/40 bg-[#EAF7F2]'
                        : 'border-white/70 bg-white/45 hover:bg-white/65'
                    }`}
                  >
                    <BxnTruncatedParagraph
                      text={policy.title}
                      overlayContainer={overlayContainer}
                      className="line-clamp-2 text-[14px] leading-[1.35] font-semibold text-[#131313]"
                    />
                    <div className="mt-[8px] flex flex-wrap items-center gap-2">
                      <BxnPolicyStatusInline
                        status={policy.status}
                        locale={locale}
                      />
                      <span className="rounded-full bg-white/75 px-2 py-1 text-[12px] leading-none text-[#6F6F6F]">
                        {policy.code}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/70 px-3 py-2 text-[12px] text-[#6F6F6F]">
          <span className="whitespace-nowrap" data-bxn-i18n-skip="true">
            {paginationSummary}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label="上一页"
              disabled={safePolicyPage <= 1}
              onClick={() => {
                setPolicyPage((current) => Math.max(1, current - 1))
              }}
              className="border-white/70 bg-white/55"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="min-w-[52px] text-center">
              {safePolicyPage} / {policyPageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label="下一页"
              disabled={safePolicyPage >= policyPageCount}
              onClick={() => {
                setPolicyPage((current) =>
                  Math.min(policyPageCount, current + 1),
                )
              }}
              className="border-white/70 bg-white/55"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      <section className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-[8px] border border-white/70 bg-white/40 bxn-fluid-pad p-4">
        {!activePolicy ? (
          <BxnModuleEmptyState className="h-full min-h-[320px]" />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="bxn-fluid-dialog-title text-[28px] leading-[1.2] font-semibold text-[#131313]"
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  {activePolicy.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <BxnPolicyStatusBadge
                    status={activePolicy.status}
                    locale={locale}
                    className="h-6 px-3 text-[13px]"
                  />
                  <span className="rounded-full bg-white/60 px-3 py-1 text-[14px] leading-none font-medium text-[#4F4F4F]">
                    {localizePolicyText(
                      STANDARD_CATEGORY_LABEL[activePolicy.category],
                      locale,
                    )}
                  </span>
                  <span className="rounded-full bg-white/60 px-3 py-1 text-[14px] leading-none font-medium text-[#4F4F4F]">
                    {activePolicy.region ?? '—'}
                  </span>
                  <span className="text-[14px] leading-none font-medium text-[#6F6F6F]">
                    {activePolicy.code}
                  </span>
                </div>
              </div>
              <a
                href={activePolicy.pdfUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (!activePolicy.pdfUrl) {
                    event.preventDefault()
                  }
                }}
                className="rounded-[8px] border border-white/70 bg-white/70 px-3 py-2 text-[14px] font-medium text-[#131313]"
              >
                {localizeBxnBigScreenString('原文下载', locale)}
              </a>
            </div>

            <p
              className="mt-4 text-[16px] leading-[1.6] text-[#5F5F5F]"
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {activePolicy.description ?? '—'}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {activePolicy.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] bg-white/60 px-2 py-1 text-[12px] leading-none text-[#6F6F6F]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('发布机构', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {activePolicy.publisher}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('发布日期', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {formatDate(activePolicy.publishDate, locale)}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('最近更新', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {formatDate(activePolicy.updateTime, locale)}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('当前版本', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {activePolicy.version}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('因子数量', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {factorCount} {localizeBxnBigScreenString('条', locale)}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/70 bg-white/55 p-3">
                <p className="text-[12px] text-[#8A8A8A]">
                  {localizeBxnBigScreenString('组织映射', locale)}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#131313]">
                  {mappingCount} {localizeBxnBigScreenString('条', locale)}
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function BxnMiddleContentModulesShell({
  onOpenScopeDialog,
  onOpenRiskWarningDialog,
  overlayContainer,
  isEmptyPreview = false,
}: {
  onOpenScopeDialog: () => void
  onOpenRiskWarningDialog: (warning: BxnRiskWarningCard) => void
  overlayContainer?: HTMLElement | null
  isEmptyPreview?: boolean
}) {
  const { locale } = useAppLocale()
  const supplierLevelCards = [
    {
      id: 'leader',
      label: '领先者',
      count: 23,
      percent: 18,
      icon: <Award className="h-[18px] w-[18px] text-[#11906A]" />,
    },
    {
      id: 'qualified',
      label: '合格',
      count: 67,
      percent: 52,
      icon: <CircleCheck className="h-[18px] w-[18px] text-[#11906A]" />,
    },
    {
      id: 'lagging',
      label: '落后',
      count: 28,
      percent: 22,
      icon: <Frown className="h-[18px] w-[18px] text-[#11906A]" />,
    },
    {
      id: 'pending',
      label: '待审核',
      count: 10,
      percent: 8,
      icon: <Clock3 className="h-[18px] w-[18px] text-[#11906A]" />,
    },
  ]
  const annualKpiCards = [
    {
      id: 'annual-emission',
      title: '年度碳排总量',
      value: '6,243.6702621',
      unit: 'tCO₂e',
      icon: <Target className="h-6 w-6 text-[#11906A]" strokeWidth={2} />,
    },
    {
      id: 'annual-energy',
      title: '年度能源消耗总量',
      value: '18,599.47',
      unit: 'MWh',
      icon: <Wind className="h-6 w-6 text-[#11906A]" strokeWidth={2} />,
    },
    {
      id: 'annual-intensity',
      title: '综合碳排放强度',
      value: '0.03',
      unit: 'tCO₂e/万元',
      icon: <Flag className="h-6 w-6 text-[#11906A]" strokeWidth={2} />,
    },
    {
      id: 'clean-energy-ratio',
      title: '清洁能源占比',
      value: '16.8',
      unit: '%',
      icon: <Percent className="h-6 w-6 text-[#11906A]" strokeWidth={2} />,
    },
  ]
  const displayedAnnualKpiCards = isEmptyPreview
    ? annualKpiCards.map((card) => ({ ...card, value: '0', unit: '--' }))
    : annualKpiCards
  const scopeDistributionSegments: Array<BxnDonutSegment> = [
    { label: '范围一', value: 1.86, color: '#A8D4C9' },
    { label: '范围二', value: 5.19, color: '#5CBCA1' },
    { label: '范围三上游', value: 23.77, color: '#1B946D' },
    { label: '范围三下游', value: 69.18, color: '#0A5942' },
  ]
  const scopeDetails = [
    {
      id: 'scope-1',
      name: '范围一：直接排放',
      percent: 1.86,
      emission: '1,650.8497221',
      isChild: false,
    },
    {
      id: 'scope-2',
      name: '范围二：外购能源间接排放',
      percent: 5.19,
      emission: '4,592.8205400',
      isChild: false,
    },
    {
      id: 'scope-3',
      name: '范围三：价值链上游间接排放',
      percent: 23.77,
      emission: '21,046.3756266',
      isChild: false,
    },
    {
      id: 'scope-4',
      name: '范围三：价值链下游间接排放',
      percent: 69.18,
      emission: '61,254.5905918',
      isChild: false,
    },
  ]
  const sortedRiskWarnings = sortBxnRiskWarnings(getBxnRiskWarnings())
  const displayedSupplierLevelCards = isEmptyPreview
    ? supplierLevelCards.map((card) => ({ ...card, count: 0, percent: 0 }))
    : supplierLevelCards
  const displayedScopeDetails = isEmptyPreview ? [] : scopeDetails
  const displayedRiskWarnings = isEmptyPreview ? [] : sortedRiskWarnings
  const formatRelativeTime = (timestamp: string, activeLocale: AppLocale) => {
    const diffMs = Date.now() - new Date(timestamp).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
      return localizeBxnBigScreenString('刚刚', activeLocale)
    }
    if (diffHours < 24) {
      return activeLocale === 'zh-CN'
        ? `${diffHours}小时前`
        : `${diffHours}h ago`
    }
    const days = Math.floor(diffHours / 24)
    return activeLocale === 'zh-CN' ? `${days}天前` : `${days}d ago`
  }
  return (
    <section
      className="bxn-middle-shell grid h-full min-h-0 min-w-0 gap-5"
      style={{
        gridTemplateRows:
          'clamp(138px,calc(100%*0.155),158px) minmax(0,1fr) clamp(300px,calc(100%*0.325),320px)',
      }}
    >
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
        <div className="flex flex-col gap-[10px]">
          <h2
            className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
            style={{
              fontFamily:
                '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
            }}
          >
            {localizeBxnBigScreenString('年度核心指标概览', locale)}
          </h2>
          <span
            aria-hidden="true"
            className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
          />
        </div>
        <div className="bxn-kpi-cards grid min-h-0 w-full grid-cols-4 gap-3">
          {displayedAnnualKpiCards.map((card) => (
            <article
              key={card.id}
              className="min-h-[100px] rounded-[6px] bg-white/40 bxn-fluid-pad p-4 flex flex-col"
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  className="text-[14px] leading-[1.2] font-semibold text-[#131313]"
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  {localizeBxnBigScreenString(card.title, locale)}
                </h3>
                <span className="shrink-0">{card.icon}</span>
              </div>
              <div className="mt-auto flex min-w-0 max-w-full items-baseline overflow-hidden">
                <span
                  title={card.value}
                  className="bxn-fluid-metric block min-w-0 max-w-full truncate text-[26px] leading-[1.1] font-semibold text-[#131313]"
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  <BxnAnimatedNumberFromRaw value={card.value} />
                </span>
                <span
                  title={localizeBxnBigScreenString(card.unit, locale)}
                  className="ml-[6px] shrink-0 text-[14px] leading-[1.2] font-semibold text-[#131313]"
                  style={{
                    fontFamily:
                      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                  }}
                >
                  {localizeBxnBigScreenString(card.unit, locale)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between gap-4">
            <h2
              className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {localizeBxnBigScreenString('组织碳足迹范围明细', locale)}
            </h2>
            <button
              type="button"
              onClick={() => {
                if (!isEmptyPreview) {
                  onOpenScopeDialog()
                }
              }}
              className={
                'inline-flex items-center gap-1 text-[14px] leading-[1.2] font-medium ' +
                (isEmptyPreview ? 'text-[#8AAEA4]' : 'text-[#11906A]')
              }
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {localizeBxnBigScreenString('查看详情', locale)}
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </div>
          <span
            aria-hidden="true"
            className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
          />
        </div>
        {isEmptyPreview ? (
          <BxnModuleEmptyState className="h-full" />
        ) : (
          <div className="grid h-full min-h-0 grid-cols-[minmax(0,45fr)_minmax(0,55fr)] gap-3">
            <article className="h-full min-h-0 rounded-[6px] bg-white/40 bxn-fluid-pad p-4 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.8)_transparent] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/80">
              <div className="flex min-h-full flex-col justify-center">
                <div className="bxn-scope-donut-chart relative h-[240px] shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BxnDonutWithCallouts
                      segments={scopeDistributionSegments}
                      callouts={[
                        {
                          segmentIndex: 3,
                          side: 'left',
                          labelOffsetY: 8,
                          horizontalLength: 24,
                        },
                        {
                          segmentIndex: 2,
                          side: 'right',
                          labelOffsetY: 10,
                          horizontalLength: 24,
                        },
                        {
                          segmentIndex: 0,
                          side: 'left',
                          labelOffsetY: -34,
                          horizontalLength: 24,
                        },
                        {
                          segmentIndex: 1,
                          side: 'right',
                          labelOffsetY: -18,
                          horizontalLength: 24,
                        },
                      ]}
                      onCalloutClick={() => {
                        onOpenScopeDialog()
                      }}
                    />
                  </div>
                </div>
                <div className="bxn-scope-donut-legend mx-auto mt-2 grid w-fit grid-cols-[max-content_max-content] content-center justify-center gap-x-20 gap-y-3 px-1">
                  {scopeDistributionSegments.map((segment) => (
                    <button
                      key={segment.label}
                      type="button"
                      onClick={() => {
                        onOpenScopeDialog()
                      }}
                      className="inline-flex min-w-0 items-center justify-start gap-2 text-[14px] leading-none font-medium whitespace-nowrap text-[#4F4F4F]"
                      style={{
                        fontFamily:
                          '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                      }}
                    >
                      <span
                        className="bxn-scope-donut-legend-dot h-[14px] w-[14px] shrink-0 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      {localizeBxnBigScreenString(segment.label, locale)}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            <article className="h-full overflow-hidden rounded-[6px] bg-white/40 bxn-fluid-pad p-4">
              <div className="flex min-h-0 h-full flex-col">
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_minmax(140px,0.9fr)] gap-3 border-b border-white/70 px-2 pb-2">
                  <span
                    className="text-[14px] leading-[1.2] font-medium text-[#6F6F6F]"
                    style={{
                      fontFamily:
                        '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    {localizeBxnBigScreenString('节点名称', locale)}
                  </span>
                  <span
                    className="text-[14px] leading-[1.2] font-medium text-[#6F6F6F]"
                    style={{
                      fontFamily:
                        '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    {localizeBxnBigScreenString('占比', locale)}
                  </span>
                  <span
                    className="text-right text-[14px] leading-[1.2] font-medium text-[#6F6F6F]"
                    style={{
                      fontFamily:
                        '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    {localizeBxnBigScreenString('排放量(tCO₂e)', locale)}
                  </span>
                </div>
                <div
                  className="mt-3 grid min-h-0 flex-1 px-2"
                  style={{
                    gridTemplateRows: `repeat(${Math.max(displayedScopeDetails.length, 1)}, minmax(0,1fr))`,
                  }}
                >
                  {displayedScopeDetails.map((row) => (
                    <div
                      key={row.id}
                      className="grid h-full grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_minmax(140px,0.9fr)] items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onOpenScopeDialog()
                        }}
                        className="min-w-0 max-w-full text-left"
                      >
                        <BxnTruncatedSpan
                          text={localizeBxnBigScreenString(row.name, locale)}
                          overlayContainer={overlayContainer}
                          className="block w-full truncate whitespace-nowrap text-[16px] leading-[1.2] font-medium text-[#131313]"
                        />
                      </button>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-[8px] w-full rounded-full bg-[#D8F1EA]">
                          <BxnAnimatedProgressBar
                            targetPercent={row.percent}
                            className="h-full rounded-full bg-[#11906A]"
                          />
                        </div>
                        <span
                          className="w-[64px] shrink-0 text-[16px] leading-[1.2] font-medium text-[#303030]"
                          style={{
                            fontFamily:
                              '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                          }}
                        >
                          <>
                            <BxnAnimatedNumber
                              target={row.percent}
                              minimumFractionDigits={
                                parseBxnNumericValue(row.percent).fractionDigits
                              }
                              maximumFractionDigits={
                                parseBxnNumericValue(row.percent).fractionDigits
                              }
                              useGrouping={false}
                            />
                            %
                          </>
                        </span>
                      </div>
                      <span
                        className="text-right text-[16px] leading-[1.2] font-medium text-[#303030]"
                        style={{
                          fontFamily:
                            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                        }}
                      >
                        <BxnAnimatedNumberFromRaw value={row.emission} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        )}
      </div>

      <div className="bxn-middle-bottom-grid grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
          <div className="flex flex-col gap-[10px]">
            <h2
              className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {localizeBxnBigScreenString('供应商等级分布', locale)}
            </h2>
            <span
              aria-hidden="true"
              className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
            />
          </div>
          <div className="grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-3">
            {displayedSupplierLevelCards.map((card) => (
              <article
                key={card.id}
                className="h-full min-h-0 rounded-[6px] bg-white/40 bxn-fluid-pad p-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-[4px]">
                  <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                    {card.icon}
                  </span>
                  <span
                    className="text-[16px] leading-none font-semibold text-[#131313]"
                    style={{
                      fontFamily:
                        '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    {localizeBxnBigScreenString(card.label, locale)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                      <span
                        className="bxn-fluid-metric text-[26px] leading-[1.1] font-semibold text-[#131313]"
                        style={{
                          fontFamily:
                            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                        }}
                      >
                        <BxnAnimatedNumber target={card.count} />
                      </span>
                      <span
                        className="ml-[6px] text-[14px] leading-[1.2] font-semibold text-[#131313]"
                        style={{
                          fontFamily:
                            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                        }}
                      >
                        {localizeBxnBigScreenString('家', locale)}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span
                        className="bxn-fluid-metric text-[26px] leading-[1.1] font-semibold text-[#131313]"
                        style={{
                          fontFamily:
                            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                        }}
                      >
                        <BxnAnimatedNumber
                          target={card.percent}
                          useGrouping={false}
                        />
                      </span>
                      <span
                        className="ml-[6px] text-[14px] leading-[1.2] font-semibold text-[#131313]"
                        style={{
                          fontFamily:
                            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                        }}
                      >
                        %
                      </span>
                    </div>
                  </div>

                  <div className="h-[8px] w-full rounded-full bg-[#D8F1EA]">
                    <BxnAnimatedProgressBar
                      targetPercent={card.percent}
                      className="h-full rounded-full bg-[#11906A]"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="bxn-middle-risk-panel grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
          <div className="flex flex-col gap-[10px]">
            <h2
              className="bxn-fluid-panel-title text-[18px] leading-none font-semibold tracking-[0] text-[#0A5942]"
              style={{
                fontFamily:
                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
              }}
            >
              {localizeBxnBigScreenString('风险预警', locale)}
            </h2>
            <span
              aria-hidden="true"
              className="h-[3px] w-[40px] rounded-full bg-[#0A5942]"
            />
          </div>
          {displayedRiskWarnings.length === 0 ? (
            <BxnModuleEmptyState className="h-full" />
          ) : (
            <div className="bxn-risk-list flex h-full min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.8)_transparent] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/80">
              {displayedRiskWarnings.map((item) => {
                const theme = resolveBxnRiskTheme(item.level)
                const label = resolveBxnRiskLabel(item.level)
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${localizeBxnBigScreenString('查看详情', locale)}：${localizeBxnBigScreenString(item.content, locale)}`}
                    onClick={() => {
                      onOpenRiskWarningDialog(item)
                    }}
                    className="min-w-[148px] w-full shrink-0 rounded-[0.429em] bg-white/40 px-4 py-[14px] text-left transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/55 hover:shadow-[0_8px_18px_rgba(16,60,45,0.08)] focus-visible:ring-2 focus-visible:ring-[#11906A]/35 focus-visible:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.5em]"
                            style={{ backgroundColor: theme.iconBg }}
                          >
                            {item.level === 'risk' ? (
                              <TriangleAlert
                                className="h-[18px] w-[18px]"
                                strokeWidth={2.6}
                                style={{ color: theme.iconColor }}
                              />
                            ) : item.level === 'remind' ? (
                              <Bell
                                className="h-[18px] w-[18px]"
                                strokeWidth={2.6}
                                style={{ color: theme.iconColor }}
                              />
                            ) : (
                              <CircleAlert
                                className="h-[18px] w-[18px]"
                                strokeWidth={2.6}
                                style={{ color: theme.iconColor }}
                              />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[14px] leading-[1.2] font-medium text-[#131313] break-words whitespace-normal"
                              style={{
                                fontFamily:
                                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                              }}
                            >
                              {localizeBxnBigScreenString(item.content, locale)}
                            </p>
                            <p
                              className="mt-[4px] text-[12px] leading-[1.2] font-normal text-[#B3B3B3]"
                              style={{
                                fontFamily:
                                  '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                              }}
                            >
                              {item.timestamp
                                ? formatRelativeTime(item.timestamp, locale)
                                : localizeBxnBigScreenString(
                                    '暂无更新',
                                    locale,
                                  )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: theme.tagColor }}
                        />
                        <span
                          className="text-[14px] leading-[1.2] font-medium"
                          style={{
                            color: theme.tagColor,
                            fontFamily:
                              '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                          }}
                        >
                          {localizeBxnBigScreenString(label, locale)}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function CarbonAccountingBigScreenPage() {
  const pageRef = useRef<HTMLElement | null>(null)
  const i18nRef = useBxnBigScreenDomI18n<HTMLElement>()
  const [activeDialog, setActiveDialog] = useState<BxnDetailDialogKey | null>(
    () => resolveDialogFromSearch(),
  )
  const isEmptyPreview = false
  const [isSmallViewport, setIsSmallViewport] = useState(false)
  const [layoutScale, setLayoutScale] = useState(1)
  const [selectedProductDialog, setSelectedProductDialog] = useState<{
    name: string
    code: string
  } | null>(null)
  const [isAiAgentVisible, setIsAiAgentVisible] = useState(false)
  const [selectedPolicyStandardId, setSelectedPolicyStandardId] = useState<
    string | null
  >(null)
  const [selectedRiskWarning, setSelectedRiskWarning] =
    useState<BxnRiskWarningCard | null>(null)
  const [insightCards, setInsightCards] = useState<Array<BxnInsightCard>>(() =>
    getDefaultInsightCards(),
  )
  const [selectedInsightCard] = useState<BxnInsightCard | null>(null)
  const { locale } = useAppLocale()

  const aiAgentIframeSrc = useMemo(() => buildAiAgentIframeSrc(), [])

  const { header, dialogs, error } = useMemo<{
    header: {
      siteOptions: Array<CarbonScreenSelectOption>
      yearOptions: Array<CarbonScreenSelectOption>
    } | null
    dialogs: {
      scopeDistribution: CarbonScreenScopeDistributionDialogConfig
      productRanking: CarbonScreenProductRankingDialogConfig
    } | null
    error: string | null
  }>(() => {
    try {
      const dashboard = api.carbonScreen.getDashboard()

      return {
        header: {
          siteOptions: createBxnStableSelectOptions(
            dashboard.header.siteOptions,
            'site',
          ),
          yearOptions: createBxnStableSelectOptions(
            dashboard.header.yearOptions,
            'year',
          ),
        },
        dialogs: dashboard.dialogs,
        error: null,
      }
    } catch {
      return {
        header: null,
        dialogs: null,
        error: '报喜鸟大屏数据加载失败，请稍后刷新重试。',
      }
    }
  }, [locale])
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0)
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [overlayContainer, setOverlayContainer] = useState<HTMLElement | null>(
    null,
  )

  useEffect(() => {
    if (!header?.siteOptions.length) {
      return
    }

    const safeIndex = Math.min(selectedSiteIndex, header.siteOptions.length - 1)
    if (safeIndex !== selectedSiteIndex) {
      setSelectedSiteIndex(safeIndex)
    }
  }, [header?.siteOptions.length, selectedSiteIndex])

  useEffect(() => {
    if (!header?.yearOptions.length) {
      return
    }

    const safeIndex = Math.min(selectedYearIndex, header.yearOptions.length - 1)
    if (safeIndex !== selectedYearIndex) {
      setSelectedYearIndex(safeIndex)
    }
  }, [header?.yearOptions.length, selectedYearIndex])

  useEffect(() => {
    setOverlayContainer(pageRef.current)
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchBxnInsightCards()
      .then((cards) => {
        if (cancelled) {
          return
        }
        setInsightCards(cards)
      })
      .catch((insightLoadError: unknown) => {
        console.error(
          '[bxn-big-screen] failed to load insights',
          insightLoadError,
        )
        if (cancelled) {
          return
        }
        setInsightCards(getDefaultInsightCards())
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === pageRef.current)
    }

    updateFullscreen()
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreen)
    }
  }, [])

  useEffect(() => {
    const updateViewportState = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setIsSmallViewport(height < bxnLayout.viewportMinHeight)
      setLayoutScale(resolveBxnScale(width, height))
    }

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => {
      window.removeEventListener('resize', updateViewportState)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === pageRef.current) {
      await document.exitFullscreen()
      return
    }
    await pageRef.current?.requestFullscreen()
  }
  if (!header || !dialogs || error) {
    return <BxnBigScreenErrorState message={error} />
  }

  const selectedSite = header.siteOptions[selectedSiteIndex]?.value ?? ''
  const selectedYear = header.yearOptions[selectedYearIndex]?.value ?? ''

  return (
    <main
      ref={(element) => {
        pageRef.current = element
        i18nRef.current = element
      }}
      className={`bxn-big-screen-page relative h-full min-w-0 flex-1 w-full text-foreground ${
        isFullscreen ? 'bxn-big-screen-page-fullscreen ' : ''
      }${
        isSmallViewport
          ? 'overflow-y-auto overflow-x-hidden'
          : 'overflow-hidden'
      }`}
    >
      <div
        className="relative isolate h-full w-full overflow-hidden border-r-[4px] border-b-[4px] border-l-[4px] border-white shadow-[0_0_8px_rgba(107,226,190,0.45)]"
        style={
          {
            minHeight: isSmallViewport
              ? `${bxnLayout.viewportMinHeight}px`
              : undefined,
            '--bxn-layout-scale': layoutScale,
          } as CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 scale-105 bg-[url('/carbon-screen/baoxiniao-campus-bg.png')] bg-cover bg-center blur-[10px]" />
          <div className="absolute inset-0 bg-white/20" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[256px] bg-[linear-gradient(180deg,rgba(139,171,209,0.48)_0%,rgba(204,216,234,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center">
          <div
            className="relative h-[4px]"
            style={{ width: `${headerTopLineWidth}px` }}
          >
            <span
              className="absolute top-0 h-[4px] bg-white"
              style={{
                width: headerTopLineSideWidth,
                right: `calc(100% + ${headerTopLineSideShorten}px)`,
              }}
            />
            <span
              className="absolute top-0 h-[4px] bg-white"
              style={{
                width: headerTopLineSideWidth,
                left: `calc(100% + ${headerTopLineSideShorten}px)`,
              }}
            />
          </div>
        </div>

        <BxnBigScreenOrnaments locale={locale} />
        <BxnBigScreenControls
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          overlayContainer={overlayContainer}
        />
        <section className="absolute top-[96px] right-[24px] bottom-[24px] left-[24px] z-20 flex items-stretch">
          <div className="h-full w-full">
            <div
              className="bxn-dashboard-grid grid h-full min-h-0 w-full gap-3"
              style={{
                gridTemplateColumns: `clamp(${bxnLayout.columns.leftMinWidth}px, calc((100% - ${bxnLayout.columns.middleMinWidth}px) / 3), ${bxnLayout.columns.leftMaxWidth}px) minmax(0,1fr) clamp(${bxnLayout.columns.rightMinWidth}px, calc((100% - ${bxnLayout.columns.middleMinWidth}px) / 3), ${bxnLayout.columns.rightMaxWidth}px)`,
              }}
            >
              <div className="h-full min-h-0 overflow-hidden pr-1">
                <BxnLeftContentModulesShell
                  siteOptions={header.siteOptions}
                  yearOptions={header.yearOptions}
                  selectedSite={selectedSite}
                  selectedYear={selectedYear}
                  insightCards={insightCards}
                  onSelectSite={(value) => {
                    const nextIndex = resolveBxnSelectOptionIndex(
                      header.siteOptions,
                      value,
                    )
                    if (nextIndex >= 0) {
                      setSelectedSiteIndex(nextIndex)
                    }
                  }}
                  onSelectYear={(value) => {
                    const nextIndex = resolveBxnSelectOptionIndex(
                      header.yearOptions,
                      value,
                    )
                    if (nextIndex >= 0) {
                      setSelectedYearIndex(nextIndex)
                    }
                  }}
                  onOpenPolicyDialog={() => {
                    setSelectedPolicyStandardId(null)
                    setActiveDialog('policyLibrary')
                  }}
                  onOpenPolicyCard={(policyId) => {
                    setSelectedPolicyStandardId(policyId)
                    setActiveDialog('policyLibrary')
                  }}
                  onOpenAiAssistant={() => {
                    setIsAiAgentVisible(true)
                  }}
                  overlayContainer={overlayContainer}
                  isEmptyPreview={isEmptyPreview}
                />
              </div>
              <div className="h-full min-h-0 overflow-hidden pr-1">
                <div className="h-full w-full">
                  <BxnMiddleContentModulesShell
                    onOpenScopeDialog={() => {
                      setActiveDialog('scopeDistribution')
                    }}
                    onOpenRiskWarningDialog={(warning) => {
                      setSelectedRiskWarning(warning)
                      setActiveDialog('riskWarning')
                    }}
                    overlayContainer={overlayContainer}
                    isEmptyPreview={isEmptyPreview}
                  />
                </div>
              </div>
              <div className="h-full min-h-0 overflow-hidden pr-0">
                <BxnFirstContentModuleShell
                  overlayContainer={overlayContainer}
                  onOpenProductDialog={(card) => {
                    setSelectedProductDialog({
                      name: card.title,
                      code: card.productCode ?? 'BXN-PRODUCT-000',
                    })
                    setActiveDialog('productRanking')
                  }}
                  isEmptyPreview={isEmptyPreview}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <PageDialog
        open={activeDialog !== null}
        inlineInContainer={isFullscreen}
        overlayContainer={overlayContainer}
        disableInitialFocus={activeDialog === 'policyLibrary'}
        title={
          activeDialog === 'scopeDistribution'
            ? dialogs.scopeDistribution.title
            : activeDialog === 'productRanking'
              ? `${localizeBxnBigScreenString('产品碳足迹', locale)} - ${localizeBxnBigScreenString(selectedProductDialog?.name ?? dialogs.productRanking.summary.productName, locale)}`
              : activeDialog === 'policyLibrary'
                ? localizeBxnBigScreenString('政策标准库', locale)
                : activeDialog === 'insight'
                  ? localizeBxnBigScreenString(
                      selectedInsightCard?.title ?? '资讯标题占位',
                      locale,
                    )
                  : activeDialog === 'riskWarning'
                    ? localizeBxnBigScreenString('风险详情', locale)
                    : ''
        }
        onClose={() => {
          setActiveDialog(null)
        }}
        bodyClassName={
          activeDialog === 'scopeDistribution'
            ? 'overflow-y-auto'
            : activeDialog === 'policyLibrary'
              ? 'overflow-hidden'
              : undefined
        }
      >
        <div
          className={
            activeDialog === 'scopeDistribution'
              ? `${bxnDialogPaletteClassName} min-h-0`
              : `${bxnDialogPaletteClassName} flex h-full min-h-0 flex-col`
          }
        >
          {activeDialog === 'scopeDistribution' ? (
            isEmptyPreview ? (
              <div className="h-full min-h-0 p-4">
                <BxnModuleEmptyState />
              </div>
            ) : (
              <BxnScopeDialogContent data={dialogs.scopeDistribution} />
            )
          ) : null}
          {activeDialog === 'policyLibrary' ? (
            <BxnPolicyLibraryDetailDialogContent
              initialPolicyId={selectedPolicyStandardId}
              overlayContainer={overlayContainer}
              isEmptyPreview={isEmptyPreview}
            />
          ) : null}
          {activeDialog === 'productRanking' ? (
            isEmptyPreview ? (
              <div className="h-full min-h-0 p-4">
                <BxnModuleEmptyState />
              </div>
            ) : (
              <div className="bxn-product-dialog-scroll-local h-full min-h-0">
                <CarbonScreenProductDialogContent
                  data={dialogs.productRanking}
                  productCode={selectedProductDialog?.code}
                  productName={selectedProductDialog?.name}
                />
              </div>
            )
          ) : null}
          {activeDialog === 'insight' ? (
            <BxnInsightDetailDialogContent
              id={selectedInsightCard?.id ?? 'insight-placeholder'}
              title={selectedInsightCard?.title ?? '资讯标题占位'}
              summary={
                selectedInsightCard?.summary ??
                '资讯副标题或部分正文占位，后续再填真实内容。'
              }
              redirectUrl={selectedInsightCard?.redirectUrl ?? ''}
            />
          ) : null}
          {activeDialog === 'riskWarning' ? (
            <BxnRiskWarningDetailDialogContent
              warning={selectedRiskWarning}
              warnings={sortBxnRiskWarnings(getBxnRiskWarnings())}
              onSelectWarning={setSelectedRiskWarning}
            />
          ) : null}
        </div>
      </PageDialog>

      <BxnAiAgentDraggableIframe
        visible={isAiAgentVisible}
        iframeSrc={aiAgentIframeSrc}
        title="AI助理"
        portalContainer={overlayContainer}
        onClose={() => {
          setIsAiAgentVisible(false)
        }}
      />

      <style>{`
        .bxn-big-screen-page {
          --bxn-layout-scale: 1;
          font-weight: 500;
        }

        .bxn-big-screen-page .bxn-fluid-page-title,
        .bxn-big-screen-page .bxn-fluid-panel-title,
        .bxn-big-screen-page h1,
        .bxn-big-screen-page h2,
        .bxn-big-screen-page h3 {
          font-weight: 700;
        }

        .bxn-big-screen-page [class*="font-semibold"],
        .bxn-big-screen-page [class*="font-bold"] {
          font-weight: 700;
        }

        .bxn-big-screen-page [class*="font-medium"] {
          font-weight: 600;
        }

        .bxn-big-screen-page [class*="text-[#808080]"],
        .bxn-big-screen-page [class*="text-[#8A8A8A]"],
        .bxn-big-screen-page [class*="text-[#6F6F6F]"],
        .bxn-big-screen-page [class*="text-[#5F5F5F]"],
        .bxn-big-screen-page [class*="text-[#4F4F4F]"],
        .bxn-big-screen-page [class*="text-[#B3B3B3]"] {
          font-weight: 500;
        }

        .bxn-big-screen-page [class*="text-[#808080]"],
        .bxn-big-screen-page [class*="text-[#8A8A8A]"] {
          color: #666f6b;
        }

        .bxn-big-screen-page [class*="text-[#6F6F6F]"],
        .bxn-big-screen-page [class*="text-[#5F5F5F]"],
        .bxn-big-screen-page [class*="text-[#4F4F4F]"] {
          color: #3f4a46;
        }

        .bxn-big-screen-page [class*="text-[#B3B3B3]"] {
          color: #7a8580;
        }

        .bxn-big-screen-page button:not(:disabled),
        .bxn-big-screen-page a:not([aria-disabled="true"]),
        .bxn-big-screen-page [role="button"]:not([aria-disabled="true"]) {
          cursor: pointer;
        }

        .bxn-big-screen-page .bxn-dashboard-grid {
          gap: calc(12px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-middle-shell {
          gap: calc(20px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-middle-bottom-grid {
          gap: calc(12px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-kpi-cards {
          gap: calc(10px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-fluid-pad {
          padding: calc(16px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-fluid-page-title {
          font-size: calc(34px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-fluid-weather,
        .bxn-big-screen-page .bxn-fluid-panel-title {
          font-size: calc(18px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-fluid-dialog-title {
          font-size: calc(28px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-fluid-metric {
          font-size: calc(26px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-scope-donut-chart {
          height: calc(240px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-scope-donut-chart text {
          font-size: calc(14px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-scope-donut-chart polyline {
          stroke-width: calc(2px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-scope-donut-legend {
          column-gap: calc(80px * var(--bxn-layout-scale));
          row-gap: calc(12px * var(--bxn-layout-scale));
          font-size: calc(14px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-scope-donut-legend-dot {
          height: calc(14px * var(--bxn-layout-scale));
          width: calc(14px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page.bxn-big-screen-page-fullscreen .bxn-scope-donut-chart {
          height: calc(310px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page.bxn-big-screen-page-fullscreen .bxn-scope-donut-chart text {
          font-size: calc(16px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page.bxn-big-screen-page-fullscreen .bxn-scope-donut-chart polyline {
          stroke-width: calc(2.4px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page.bxn-big-screen-page-fullscreen .bxn-scope-donut-legend {
          column-gap: calc(112px * var(--bxn-layout-scale));
          row-gap: calc(14px * var(--bxn-layout-scale));
          font-size: calc(16px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page.bxn-big-screen-page-fullscreen .bxn-scope-donut-legend-dot {
          height: calc(16px * var(--bxn-layout-scale));
          width: calc(16px * var(--bxn-layout-scale));
        }

        .bxn-big-screen-page .bxn-product-dialog-scroll-local [data-slot="tabs"] {
          height: 100%;
          min-height: 0;
        }

        .bxn-big-screen-page .bxn-product-dialog-scroll-local [data-slot="tabs-content"] {
          min-height: 0;
        }

        .bxn-big-screen-page .bxn-product-dialog-scroll-local [data-slot="tabs-content"]:not([hidden]) {
          overflow-y: auto;
          overflow-x: hidden;
        }

      `}</style>
    </main>
  )
}
