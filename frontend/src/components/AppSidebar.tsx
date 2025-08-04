import * as React from "react"
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  FileText,
  Package,
  Settings,
  ShoppingBag,
  ToolCase,
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavUser } from "@/components/NavUser"
import { NavDocuments } from "./NavDocuments"
import { NavSecondary } from "./NavSecondary"
import { TeamSwitcher } from "@/components/TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Rhee",
    email: "rheesales@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Rhee Sales LLC",
      logo: Package,
      plan: "Wholesale",
    }
  ],
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: ToolCase,
      isActive: true,
      items: [
        {
          title: "Items",
          url: "#",
        },
        {
          title: "Companies",
          url: "#",
        },
      ],
    },
    {
      title: "Sales",
      url: "#",
      icon: CircleDollarSign,
      items: [
        {
          title: "Orders",
          url: "#",
        },
        {
          title: "Invoice",
          url: "#",
        },
      ],
    },
    {
      title: "Purchases",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "Expenses",
          url: "#",
        },
        {
          title: "Stock Orders",
          url: "#",
        },
      ],
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "#",
      icon: FileText,
    },
    {
      name: "Analytics",
      url: "#",
      icon: ChartNoAxesCombined,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments documents={data.documents} />
        <NavSecondary navSecondary={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
