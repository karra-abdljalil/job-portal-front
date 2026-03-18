import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";

export function AppSidebar({ items }) {
  const { logout } = useAuth();
  const location = useLocation();

  const isItemActive = (item) => {
    if (!item.matchPaths || item.matchPaths.length === 0) {
      return location.pathname === item.url;
    }

    return item.matchPaths.some((path) => {
      return (
        location.pathname === path ||
        location.pathname.startsWith(`${path}/`)
      );
    });
  };

  return (
    <Sidebar className="border-r border-[#e0dfdc] bg-white">
      <SidebarContent>
        <div className="border-b border-[#e0dfdc] px-4 py-5">
          <h2 className="text-xl font-bold text-[#0a66c2]">JobPortal</h2>
          <p className="mt-1 text-xs text-gray-500">Employer Workspace</p>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isItemActive(item);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? "bg-[#e8f3ff] text-[#0a66c2] shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* ✅ Logout */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}