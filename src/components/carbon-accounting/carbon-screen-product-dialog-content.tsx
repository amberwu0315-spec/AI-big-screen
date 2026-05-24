'use client'

import * as React from 'react'
import type { CarbonScreenProductRankingDialogConfig } from '@/api/carbon-screen'
import type { CarbonAccountingTask } from '@/components/carbon-accounting/product-carbon.types'
import type {
  ProductCarbonProcessUnit,
  ProductCarbonVisualizationPalette,
} from '@/lib/product-carbon-visualization'
import { ProductCarbonAnalysis } from '@/components/carbon-accounting/product-carbon-analysis'
import { ProductCarbonResult } from '@/components/carbon-accounting/product-carbon-result'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ProductCarbonDialogProfile = {
  code: string
  gwp: number
  uncertainty: string
  processUnits: Array<Omit<ProductCarbonProcessUnit, 'id' | 'gwp'>>
}

const PRODUCT_DIALOG_PROFILES: Record<string, ProductCarbonDialogProfile> = {
  男士商务西服套装: {
    code: 'BXN-SUIT-SET-001',
    gwp: 64.9996205,
    uncertainty: '-24.62% ~ 27.84%',
    processUnits: [
      { name: '羊毛精纺面料', stage: '原材料获取', module: '主面料生产', percentage: 38.6 },
      { name: '涤纶里布', stage: '原材料获取', module: '辅料生产', percentage: 10.8 },
      { name: '纽扣与拉链', stage: '原材料获取', module: '辅料生产', percentage: 4.7 },
      { name: '面料裁剪', stage: '生产制造', module: '裁剪工序', percentage: 8.4 },
      { name: '西服缝制整烫', stage: '生产制造', module: '缝制与整烫', percentage: 18.5 },
      { name: '生产用电', stage: '生产制造', module: '能源使用', percentage: 8.2 },
      { name: '包装材料', stage: '包装入库', module: '包装材料', percentage: 5.6 },
      { name: '成衣运输', stage: '运输配送', module: '运输配送', percentage: 5.2 },
    ],
  },
  男士西服上衣: {
    code: 'BXN-SUIT-JACKET-002',
    gwp: 41.0895289,
    uncertainty: '-22.18% ~ 25.36%',
    processUnits: [
      { name: '羊毛混纺外层面料', stage: '原材料获取', module: '主面料生产', percentage: 42.4 },
      { name: '西服里布', stage: '原材料获取', module: '辅料生产', percentage: 12.2 },
      { name: '纽扣与垫肩', stage: '原材料获取', module: '辅料生产', percentage: 5.4 },
      { name: '上衣裁剪', stage: '生产制造', module: '裁剪工序', percentage: 9.1 },
      { name: '上衣缝制整烫', stage: '生产制造', module: '缝制与整烫', percentage: 18.7 },
      { name: '生产用电', stage: '生产制造', module: '能源使用', percentage: 6.4 },
      { name: '包装材料', stage: '包装入库', module: '包装材料', percentage: 3.5 },
      { name: '成衣运输', stage: '运输配送', module: '运输配送', percentage: 2.3 },
    ],
  },
  男士西服裤装: {
    code: 'BXN-SUIT-TROUSERS-003',
    gwp: 23.9100915,
    uncertainty: '-20.44% ~ 23.12%',
    processUnits: [
      { name: '西裤精纺面料', stage: '原材料获取', module: '主面料生产', percentage: 48.2 },
      { name: '腰衬与口袋布', stage: '原材料获取', module: '辅料生产', percentage: 8.8 },
      { name: '拉链与纽扣', stage: '原材料获取', module: '辅料生产', percentage: 4.1 },
      { name: '裤装裁剪', stage: '生产制造', module: '裁剪工序', percentage: 8.3 },
      { name: '裤装缝制整烫', stage: '生产制造', module: '缝制与整烫', percentage: 16.6 },
      { name: '生产用电', stage: '生产制造', module: '能源使用', percentage: 6.9 },
      { name: '包装材料', stage: '包装入库', module: '包装材料', percentage: 4.1 },
      { name: '成衣运输', stage: '运输配送', module: '运输配送', percentage: 3 },
    ],
  },
  男士衬衫: {
    code: 'BXN-SHIRT-004',
    gwp: 7.0017115,
    uncertainty: '-18.35% ~ 21.08%',
    processUnits: [
      { name: '棉涤衬衫面料', stage: '原材料获取', module: '主面料生产', percentage: 44.8 },
      { name: '纽扣与缝线', stage: '原材料获取', module: '辅料生产', percentage: 7.6 },
      { name: '领衬与袖衬', stage: '原材料获取', module: '辅料生产', percentage: 5.2 },
      { name: '衬衫裁剪', stage: '生产制造', module: '裁剪工序', percentage: 9.5 },
      { name: '衬衫缝制', stage: '生产制造', module: '缝制与整烫', percentage: 14.4 },
      { name: '洗水与整烫', stage: '生产制造', module: '缝制与整烫', percentage: 8.5 },
      { name: '包装材料', stage: '包装入库', module: '包装材料', percentage: 5.4 },
      { name: '成衣运输', stage: '运输配送', module: '运输配送', percentage: 4.6 },
    ],
  },
  户外T恤: {
    code: 'BXN-TSHIRT-005',
    gwp: 3.2174358,
    uncertainty: '-16.72% ~ 19.45%',
    processUnits: [
      { name: '功能针织面料', stage: '原材料获取', module: '主面料生产', percentage: 51.6 },
      { name: '弹力纤维', stage: '原材料获取', module: '辅料生产', percentage: 8.1 },
      { name: '织标与缝线', stage: '原材料获取', module: '辅料生产', percentage: 3.8 },
      { name: 'T恤裁剪', stage: '生产制造', module: '裁剪工序', percentage: 7.6 },
      { name: 'T恤缝制', stage: '生产制造', module: '缝制与整烫', percentage: 12.8 },
      { name: '生产用电', stage: '生产制造', module: '能源使用', percentage: 6.2 },
      { name: '包装材料', stage: '包装入库', module: '包装材料', percentage: 4.9 },
      { name: '成衣运输', stage: '运输配送', module: '运输配送', percentage: 5 },
    ],
  },
}

function sumBy<T extends string>(units: ProductCarbonProcessUnit[], key: T) {
  return units.reduce<Record<string, number>>((result, unit) => {
    const group = String(unit[key as keyof ProductCarbonProcessUnit])
    result[group] = (result[group] ?? 0) + unit.gwp
    return result
  }, {})
}

function buildBreakdownItems(
  units: ProductCarbonProcessUnit[],
  groupKey: 'stage' | 'module',
  totalGwp: number,
  palette: ProductCarbonVisualizationPalette,
) {
  const colors = [
    palette.raw,
    palette.rawLight,
    palette.manufacturing,
    palette.manufacturingLight,
    palette.transport,
    palette.hazard,
  ]
  return Object.entries(sumBy(units, groupKey)).map(([name, gwp], index) => ({
    name,
    value: Number(((gwp / totalGwp) * 100).toFixed(2)),
    gwp: Number(gwp.toFixed(6)),
    color: colors[index % colors.length],
  }))
}

function deriveProductDialogData(
  data: CarbonScreenProductRankingDialogConfig,
  productName: string,
  productCode: string,
): CarbonScreenProductRankingDialogConfig {
  const profile = PRODUCT_DIALOG_PROFILES[productName] ?? PRODUCT_DIALOG_PROFILES.男士商务西服套装
  const totalGwp = profile.gwp
  const palette = data.modelResult.palette ?? {
    raw: '#0E7A5A',
    rawLight: '#DDF3EB',
    manufacturing: '#11906A',
    manufacturingLight: '#EAF7F2',
    transport: '#10C38D',
    hazard: '#5EC2A4',
  }
  const processUnits: ProductCarbonProcessUnit[] = profile.processUnits.map((unit, index) => ({
    ...unit,
    id: `${profile.code}-unit-${String(index + 1).padStart(2, '0')}`,
    gwp: Number(((unit.percentage / 100) * totalGwp).toFixed(6)),
  }))
  const stageBreakdown = buildBreakdownItems(processUnits, 'stage', totalGwp, palette)
  const moduleBreakdown = buildBreakdownItems(processUnits, 'module', totalGwp, palette)
  const topSources = [...processUnits].sort((left, right) => right.gwp - left.gwp).slice(0, 5)
  const rawStage = stageBreakdown.find((item) => item.name === '原材料获取')?.value ?? 0
  const manufacturingStage = stageBreakdown.find((item) => item.name === '生产制造')?.value ?? 0
  const transportStage = stageBreakdown.find((item) => item.name === '运输配送')?.value ?? 0

  return {
    ...data,
    title: `产品碳足迹 - ${productName}`,
    summary: {
      ...data.summary,
      productName,
      productCode: productCode || profile.code,
      gwpResult: totalGwp,
      uncertainty: profile.uncertainty,
    },
    modelResult: {
      ...data.modelResult,
      methodResults: data.modelResult.methodResults.map((method, index) => ({
        ...method,
        value: index === 0
          ? totalGwp
          : Number((totalGwp * ([0.982, 0.011, 0.007, 0][index - 1] ?? 0)).toFixed(6)),
      })),
      processUnits,
    },
    analysis: {
      ...data.analysis,
      breakdowns: {
        stage: stageBreakdown,
        module: moduleBreakdown,
      },
      allMethodsData: [
        { name: '温室气体', raw: rawStage, manufacturing: manufacturingStage, transport: transportStage },
        { name: '土地利用', raw: Math.min(100, rawStage + 4), manufacturing: Math.max(0, manufacturingStage - 3), transport: transportStage },
        { name: '生物碳', raw: Math.max(0, rawStage - 2), manufacturing: manufacturingStage + 1, transport: transportStage + 1 },
        { name: '化石（非航空）', raw: rawStage, manufacturing: manufacturingStage + 2, transport: Math.max(0, transportStage - 1) },
        { name: '航空', raw: Math.max(0, rawStage - 5), manufacturing: manufacturingStage + 3, transport: transportStage + 2 },
      ],
      sensitivityData: topSources.map((source, index) => ({
        name: source.name,
        value: Number((source.gwp * 0.42).toFixed(2)),
        color: [palette.raw, palette.manufacturing, palette.transport, palette.rawLight, palette.hazard][index],
      })),
      uncertaintyData: topSources.map((source, index) => ({
        name: source.name,
        value: Number((source.gwp * 0.31).toFixed(2)),
        color: [palette.raw, palette.manufacturingLight, palette.manufacturing, palette.transport, palette.hazard][index],
      })),
      monteCarlo: {
        uncertaintyRange: profile.uncertainty,
        nodes: [
          { name: productName, mean: Number(totalGwp.toFixed(4)), std: Number((totalGwp * 0.13).toFixed(4)) },
          ...topSources.slice(0, 3).map((source) => ({
            name: source.name,
            mean: Number(source.gwp.toFixed(4)),
            std: Number((source.gwp * 0.14).toFixed(4)),
          })),
        ],
      },
      keyMetrics: {
        ...data.analysis.keyMetrics,
        totalGwp,
        uncertainty: profile.uncertainty,
        maxContributionStage: {
          name: stageBreakdown[0]?.name ?? '原材料获取',
          pct: stageBreakdown[0]?.value ?? 0,
        },
        topSources: topSources.slice(0, 3).map((source) => ({
          name: source.name,
          pct: source.percentage,
        })),
      },
    },
  }
}

export function CarbonScreenProductDialogContent({
  data,
  productCode,
  productName,
}: {
  data: CarbonScreenProductRankingDialogConfig
  productCode?: string
  productName?: string
}) {
  const resolvedProductName = productName ?? data.summary.productName
  const resolvedProductCode = productCode ?? data.summary.productCode
  const resolvedData = React.useMemo(
    () => deriveProductDialogData(data, resolvedProductName, resolvedProductCode),
    [data, resolvedProductCode, resolvedProductName],
  )

  const dialogTask = React.useMemo<CarbonAccountingTask>(
    () => ({
      id: 'carbon-screen-product-ranking-dialog',
      modelName: `${resolvedData.summary.productName} 产品碳足迹`,
      productName: resolvedData.summary.productName,
      productCode: resolvedData.summary.productCode,
      systemBoundary: 'CRADLE_TO_GATE',
      accountingPeriod: '2025年',
      executionStandard: 'ISO_14067',
      gwpResult: resolvedData.summary.gwpResult,
      uncertainty: resolvedData.summary.uncertainty,
      status: 'COMPLETED',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    }),
    [
      resolvedData.summary.gwpResult,
      resolvedData.summary.productCode,
      resolvedData.summary.productName,
      resolvedData.summary.uncertainty,
    ],
  )

  return (
    <Tabs
      defaultValue="result-chart"
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      <div className="sticky top-0 z-10 shrink-0 border-b bg-background px-5">
        <TabsList variant="line" className="justify-start">
          <TabsTrigger value="result-chart">结果图表</TabsTrigger>
          <TabsTrigger value="model-result">模型结果</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="result-chart" className="m-0 min-h-0 flex-1 overflow-y-auto">
        <ProductCarbonAnalysis
          task={dialogTask}
          data={resolvedData.analysis}
          resultChartOnly
          showKeyMetrics={false}
          displayMode="dialog"
        />
      </TabsContent>

      <TabsContent value="model-result" className="m-0 min-h-0 flex-1 overflow-hidden">
        <ProductCarbonResult
          task={dialogTask}
          data={resolvedData.modelResult}
          displayMode="dialog"
        />
      </TabsContent>
    </Tabs>
  )
}
