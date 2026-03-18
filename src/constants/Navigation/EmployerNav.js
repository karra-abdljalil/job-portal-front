import {
  LayoutDashboard,
  Building2,
  Briefcase,
} from "lucide-react";

export const EmployerNav = [
  {
    title: "Dashboard",
    url: "/employer/dashboard",
    icon: LayoutDashboard,
    matchPaths: ["/employer/dashboard"],
  },
  {
    title: "Company Profile",
    url: "/employer/company/profile",
    icon: Building2,
    matchPaths: [
      "/employer/company/profile",
      "/employer/company/profile/edit",
    ],
  },
  {
    title: "My Jobs",
    url: "/employer/jobs",
    icon: Briefcase,
    matchPaths: ["/employer/jobs"],
  },
];