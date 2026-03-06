import { ALL_NAV_ITEMS } from '@/config/navItems'
import { useMenuConfig } from '@/context/MenuConfigContext'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SettingsPage = () => {
  const { config, toggleItem } = useMenuConfig()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground mt-1">
          Configura qué módulos aparecen en el menú de navegación.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visibilidad del menú</CardTitle>
          <CardDescription>
            Activa o desactiva los módulos que deseas mostrar en la barra lateral.
            Los cambios se aplican inmediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {ALL_NAV_ITEMS.map((item) => {
            const configItem = config.find((c) => c.id === item.id)
            const isVisible = configItem ? configItem.visible : item.defaultVisible

            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-5 text-muted-foreground" />
                  <Label htmlFor={`toggle-${item.id}`} className="text-sm font-medium cursor-pointer">
                    {item.title}
                  </Label>
                </div>
                <Switch
                  id={`toggle-${item.id}`}
                  checked={isVisible}
                  onCheckedChange={() => toggleItem(item.id)}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
