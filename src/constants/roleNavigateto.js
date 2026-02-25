import { AdminNav } from "./Navigation/AdminNav";
import { EmployerNav } from "./Navigation/EmployerNav";
import { JobSeekerNav } from "./Navigation/JobSeekerNav";

export const roleNavigateTo = {
    admin: AdminNav,
    employer: EmployerNav,
    job_seeker: JobSeekerNav,
}

export const roleRedirect = {
  admin: "/admin",
  employer: "/employer",
  jobseeker: "/jobseeker",
};