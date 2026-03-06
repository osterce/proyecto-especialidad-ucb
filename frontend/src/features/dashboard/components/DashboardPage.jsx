import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import data from '@/app/dashboard/data.json'

/**
 * Solo contenido del dashboard.
 * El sidebar y header viven en AppLayout (router).
 */
const DashboardPage = () => {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </div>
  )
}

export default DashboardPage
