import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDownRight, ArrowUpRight, History } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function DataTable({ data = [] }) {
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "created_at",
        header: "Fecha",
        cell: ({ row }) => {
          const date = new Date(row.original.created_at)
          return (
            <div className="font-medium text-muted-foreground">
              {format(date, "dd MMM yyyy HH:mm", { locale: es })}
            </div>
          )
        },
      },
      {
        accessorKey: "type",
        header: "Movimiento",
        cell: ({ row }) => {
          const type = row.getValue("type")
          if (type === "ENTRADA") {
            return (
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <ArrowDownRight className="h-4 w-4" />
                <span>Entrada</span>
              </div>
            )
          }
          if (type === "SALIDA") {
            return (
              <div className="flex items-center gap-2 text-rose-600 font-medium">
                <ArrowUpRight className="h-4 w-4" />
                <span>Salida</span>
              </div>
            )
          }
          return type
        },
      },
      {
        accessorKey: "product_name",
        header: "Producto",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("product_name")}</div>
        ),
      },
      {
        accessorKey: "warehouse_name",
        header: "Almacén",
      },
      {
        accessorKey: "quantity",
        header: () => <div className="text-right">Cantidad</div>,
        cell: ({ row }) => {
          const type = row.getValue("type")
          const qty = parseInt(row.getValue("quantity"), 10)
          return (
            <div className={`text-right font-mono font-semibold ${type === 'ENTRADA' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {type === 'ENTRADA' ? '+' : '-'}{qty}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          Movimientos Recientes
        </h3>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No hay movimientos recientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginación simple si hay más de 5 items */}
      {data.length > 5 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
