import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  IconHelp,
  IconSearch,
  IconSettings,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { useMenuConfig } from "@/context/MenuConfigContext"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navSecondary = [
  {
    title: "Ajustes",
    url: "/ajustes",
    icon: IconSettings,
  },
  {
    title: "Obtener ayuda",
    url: "#",
    icon: IconHelp,
  },
  {
    title: "Buscar",
    url: "#",
    icon: IconSearch,
  },
]

export function AppSidebar({
  user,
  ...props
}) {
  const { visibleItems } = useMenuConfig()
  const navigate = useNavigate()
  const location = useLocation()

  // Mapear visibleItems al formato que espera NavMain
  const navMainItems = visibleItems.map((item) => ({
    title: item.title,
    url: item.url,
    icon: item.icon,
    isActive: location.pathname === item.url || (item.items && item.items.some(sub => location.pathname === sub.url)),
    items: item.items,
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? { name: 'Usuario', email: '', avatar: '' }} />
      </SidebarFooter>
    </Sidebar>
  )
}
