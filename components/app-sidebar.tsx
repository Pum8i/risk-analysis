"use client";

import {
  IconAlertCircle,
  IconDashboard,
  IconMeteor,
  IconUserQuestion,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    // Taking far too long to load with large datasets - can put back with proper data loading. See README.md recommendations.
    // {
    //   title: "All Data",
    //   url: "/all-data",
    //   icon: IconBriefcase,
    // },
    {
      title: "At Risk Users",
      url: "/at-risk-users",
      icon: IconUserQuestion,
    },
    {
      title: "All Users",
      url: "/users",
      icon: IconUsers,
    },
    {
      title: "Errors",
      url: "/errors",
      icon: IconMeteor,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex align-middle gap-2">
                <IconAlertCircle className="!size-5" />
                <span className="text-base font-semibold">Risk Analysis</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
