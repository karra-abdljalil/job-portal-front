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
import jobIcon from "@/assets/searchjob.png";

export function AppSidebar({ items }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isItemActive = (item) => {
    if (!item.matchPaths || item.matchPaths.length === 0) {
      return location.pathname === item.url;
    }
    return item.matchPaths.some((path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <Sidebar className="border-r border-slate-100 bg-white">
      <SidebarContent className="bg-white flex flex-col h-full">

        {/* ── Logo ── */}
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <img src={jobIcon} alt="logo" className="h-5 w-5 object-contain brightness-0 invert" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Job<span className="text-blue-600">Portal</span>
              </h2>
              <p className="text-xs text-slate-400 capitalize">
                {user?.role?.replace("_", " ") || "Workspace"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Nav Items ── */}
        <SidebarGroup className="px-3 py-4 flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isItemActive(item);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {item.icon && (
                          <div className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                            active
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                        )}
                        <span>{item.title}</span>
                        {active && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── User Info + Logout ── */}
        <div className="border-t border-slate-100 px-3 py-4 space-y-1">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                {user?.full_name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}