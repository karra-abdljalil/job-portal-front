import { LayoutDashboard, Home, BriefcaseBusiness, Users,Cog,Building2   } from "lucide-react";
export const AdminNav = [
  { title: "dashboard", url: "/admin", icon: LayoutDashboard },
  {title : "companies", url:"/admin/companies",icon:Building2 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "jobs", url: "/admin/jobs", icon: BriefcaseBusiness },
  { title: "moderations", url: "/admin/moderations", icon: Cog },
];
