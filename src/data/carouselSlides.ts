export type CarouselSlide = {
  id: string
  title: string
  summary: string
}

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'overview',
    title: 'AI 碳管理互动 Demo',
    summary: '展会大屏轮播首页占位。',
  },
  {
    id: 'abilities',
    title: '六大碳管理能力',
    summary: '从合规、能耗、供应链、ESG、碳资产到碳核算。',
  },
  {
    id: 'accounting',
    title: '碳核算连续演示',
    summary: '支持企业驾驶舱与产品碳足迹流程下钻。',
  },
]
