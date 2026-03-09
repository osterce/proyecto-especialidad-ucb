"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Package } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A bar chart showing top moved products"

const chartConfig = {
  total_movements: {
    label: "Movimientos",
    color: "var(--primary)",
  }
}

export function ChartAreaInteractive({ data = [] }) {
  // Configurar los datos para el gráfico
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      name: item.name,
      total_movements: parseInt(item.total_moved, 10) || 0
    }))
  }, [data])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          Productos con Mayor Movimiento
        </CardTitle>
        <CardDescription>
          Top 5 productos con más entradas y salidas
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey="total_movements" 
                fill="var(--color-total_movements)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No hay datos suficientes para mostrar
          </div>
        )}
      </CardContent>
    </Card>
  )
}
