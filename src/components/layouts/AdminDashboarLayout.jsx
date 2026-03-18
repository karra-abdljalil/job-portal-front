import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { roleNavigateTo } from "@/constants/roleNavigateto"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { Button } from "@/components/ui/button"

export const Dashboard = ({children}) => {
  const { user } = useAuth()
  
  const { logout } = useAuth()

 
  const navigateto = roleNavigateTo[user?.role] || []
  return (
   <SidebarProvider>
      <div className="flex min-h-screen w-full">
       
        <AppSidebar items={navigateto} />
    
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
            <SidebarTrigger />
          </div>
          <div className="p-6">
            {children}
          </div>

        </main>
      </div>
    </SidebarProvider>

  )
}