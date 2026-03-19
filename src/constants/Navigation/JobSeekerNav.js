import { Home, FileText, Settings, User, Briefcase, ClipboardList } from 'lucide-react';

export const JobSeekerNav = [
  { title: 'Dashboard',        url: '/jobseeker/dashboard',    icon: Home },
  { title: 'My Profile',       url: '/jobseeker/profile',      icon: User },
  { title: 'My Resumes',       url: '/jobseeker/resumes',      icon: FileText },
  { title: 'Jobs',             url: '/jobseeker/jobs',         icon: Briefcase },
  { title: 'My Applications',  url: '/jobseeker/applications', icon: ClipboardList },
  { title: 'Settings',         url: '/jobseeker/settings',     icon: Settings },
];