import { lazy, Suspense } from 'react'
import { LayoutGroup } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { productCarbonSteps } from '@/data/productCarbonSteps'
import { OverviewPage } from '@/pages/OverviewPage'

const AbilitySectionPage = lazy(() => import('@/pages/AbilitySectionPage').then((module) => ({ default: module.AbilitySectionPage })))
const CbamCarbonTaxPage = lazy(() => import('@/pages/CbamCarbonTaxPage').then((module) => ({ default: module.CbamCarbonTaxPage })))
const CarbonAccountingMechanismPage = lazy(() => import('@/pages/CarbonAccountingMechanismPage').then((module) => ({ default: module.CarbonAccountingMechanismPage })))
const CarouselPage = lazy(() => import('@/pages/CarouselPage').then((module) => ({ default: module.CarouselPage })))
const CompanyCarbonDashboardPage = lazy(() => import('@/pages/CompanyCarbonDashboardPage').then((module) => ({ default: module.CompanyCarbonDashboardPage })))
const EnterpriseCarbonDashboardPage = lazy(() => import('@/pages/EnterpriseCarbonDashboardPage').then((module) => ({ default: module.EnterpriseCarbonDashboardPage })))
const ProductCarbonFlowPage = lazy(() => import('@/pages/ProductCarbonFlowPage').then((module) => ({ default: module.ProductCarbonFlowPage })))

function RouteFallback({ pathname }: { pathname: string }) {
  const isDarkAbilityRoute = pathname.startsWith('/ability/') && pathname !== '/ability/cbam/carbon-tax'
  const isDarkRoute = pathname === '/' || pathname === '/carousel' || isDarkAbilityRoute

  return <div className={isDarkRoute ? 'min-h-screen bg-[#030405]' : 'min-h-screen bg-[#f7f9fb]'} />
}

function App() {
  const location = useLocation()

  return (
    <LayoutGroup id="app-route-layout">
      <Suspense fallback={<RouteFallback pathname={location.pathname} />}>
        <div className="relative grid min-h-screen w-full bg-[#0b0b0f] [&>*]:[grid-area:1/1]">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/carousel" element={<CarouselPage />} />
            <Route path="/dashboard-config" element={<Navigate to="/company-carbon-dashboard" replace />} />
            <Route path="/company-carbon-dashboard" element={<CompanyCarbonDashboardPage />} />
            <Route path="/enterprise-carbon-dashboard" element={<EnterpriseCarbonDashboardPage />} />
            <Route path="/ability/cbam/carbon-tax" element={<CbamCarbonTaxPage />} />
            <Route path="/ability/:abilityId" element={<Navigate to="understand" replace />} />
            <Route path="/ability/carbon-accounting/:section" element={<CarbonAccountingMechanismPage />} />
            <Route path="/ability/:abilityId/:section" element={<AbilitySectionPage />} />
            {productCarbonSteps.map((step) => (
              <Route
                key={step.step}
                path={`/product-carbon-flow/${step.step}`}
                element={<ProductCarbonFlowPage step={step.step} />}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
    </LayoutGroup>
  )
}

export default App
