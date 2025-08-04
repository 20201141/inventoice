import { AppSidebar } from "@/components/AppSidebar"
import SectionCards from "@/components/SectionCards"
import { WebHeader } from "@/components/WebHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <WebHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid xl:grid-cols-5 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
            <SectionCards />
            <SectionCards />
            <SectionCards />
            <SectionCards />
            <SectionCards />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}