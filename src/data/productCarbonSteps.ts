export type ProductCarbonStep = {
  step: string
  title: string
  subtitle: string
  mode: 'ai-process' | 'showcase'
}

export const productCarbonSteps: ProductCarbonStep[] = [
  {
    step: 'step1',
    title: 'Step 1 选择核算产品（页面开发中）',
    subtitle: '选择本次需要演示核算的产品对象。',
    mode: 'ai-process',
  },
  {
    step: 'step2',
    title: 'Step 2 识别核算产品（页面开发中）',
    subtitle: 'AI 识别产品结构、物料与生命周期边界。',
    mode: 'ai-process',
  },
  {
    step: 'step3',
    title: 'Step 3 数据解构（页面开发中）',
    subtitle: '拆解生产、能源、运输与包装相关活动数据。',
    mode: 'ai-process',
  },
  {
    step: 'step4',
    title: 'Step 4 建模 & 映射数据（页面开发中）',
    subtitle: '建立核算模型并映射排放因子。',
    mode: 'ai-process',
  },
  {
    step: 'step5',
    title: 'Step 5 生成核算结果（页面开发中）',
    subtitle: '汇总产品碳足迹结果与关键贡献项。',
    mode: 'ai-process',
  },
  {
    step: 'step6',
    title: 'Step 6 生成核算报告（页面开发中）',
    subtitle: '生成可用于展示和内部审核的核算报告。',
    mode: 'ai-process',
  },
  {
    step: 'step7',
    title: 'Step 7 送审认证展示（页面开发中）',
    subtitle: '展示第三方认证送审材料、状态与结果。',
    mode: 'showcase',
  },
]

export const getProductCarbonStep = (step: string | undefined) =>
  productCarbonSteps.find((item) => item.step === step)
