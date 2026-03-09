import { useEffect, useState } from 'react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { dashboardService } from '../services/dashboardService'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Solo contenido del dashboard.
 * El sidebar y header viven en AppLayout (router).
 */
const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    kpis: {},
    recentMovements: [],
    topMovedProducts: []
  })

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getDashboardData()
        setData(response)
      } catch (error) {
        toast.error('Error al cargar dashboard', {
          description: error.message
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-3" />
        <span className="text-muted-foreground">Cargando panel de control...</span>
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards kpis={data.kpis} />
      <ChartAreaInteractive data={data.topMovedProducts} />
      <DataTable data={data.recentMovements} />
    </div>
  )
}

export default DashboardPage
