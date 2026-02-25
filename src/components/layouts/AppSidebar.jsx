import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

export function AppSidebar({ items }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded hover:bg-gray-100 ${
                          isActive ? "bg-gray-200 font-semibold" : ""
                        }`
                      }
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}