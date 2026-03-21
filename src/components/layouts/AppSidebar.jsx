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
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarContent className="bg-white">
        <div className="border-b border-slate-200 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a66c2] text-lg font-bold text-white shadow-sm">
              JP
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                JobPortal
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Employer Workspace
              </p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const active = isItemActive(item);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-[#e8f3ff] text-[#0a66c2] shadow-sm"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {item.icon && (
                          <div
                            className={`mr-3 flex h-9 w-9 items-center justify-center rounded-xl transition ${
                              active
                                ? "bg-white text-[#0a66c2] shadow-sm"
                                : "bg-slate-100 text-slate-500 group-hover:bg-white"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                        )}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <div className="my-3 border-t border-slate-200" />

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="flex w-full items-center rounded-2xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <LogOut className="h-4 w-4" />
                  </div>
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