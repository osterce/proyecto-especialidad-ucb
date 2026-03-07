import * as React from "react"
import logo from "@/assets/logo.png";
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
    items: item.items?.map(sub => ({
      ...sub,
      isActive: location.pathname === sub.url
    })),
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <div className="flex items-center justify-center mt-6 gap-3 overflow-visible p-1">
                  <img src={logo} alt="Textiles logo" className="w-12 h-12 object-contain" />
                  <span className="font-semibold font-inspiration text-5xl leading-none">Textiles</span>
                </div>
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
