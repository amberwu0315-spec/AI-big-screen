import { PageTransition } from '@/components/common/PageTransition'
import { CarbonAccountingBigScreenPage } from '@/components/bxn-big-screen/bxn-big-screen-page'

export function EnterpriseCarbonDashboardPage() {
  return (
    <PageTransition variant="slide-up">
      <div className="flex h-svh min-h-0 flex-col overflow-hidden">
        <CarbonAccountingBigScreenPage />
      </div>
    </PageTransition>
  )
}
