import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Link, useLocation } from "react-router-dom"
import SvgComponent from "@/components/logo-notesapp"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        { title: "Home", url: "/" },
        { title: "About", url: "/about" },
        { title: "Contact Us", url: "/contact-us" },
      ],
    },
    {
      title: "Create",
      items: [
        { title: "Write Notes", url: "/write-page" },
        { title: "View Notes", url: "/view-notes" },
        { title: "Archived Notes", url: "/view-archived-notes" },
        { title: "Favorited Notes", url: "/view-favorited-notes" },
      ],
    },
    {
      title: "Extras",
      items: [
        { title: "Trash", url: "/trash-notes" },
        { title: "Import Notes", url: "/import-notes" },
        { title: "Export Notes", url: "/export-notes" },
      ],
    },
  ],
}

export function AppSidebar(props) {
  const { user } = useAuth0();
  const location = useLocation()

  return (
    <Sidebar {...props}>
      {/* Header / Logo */}
      <SidebarHeader>
        <div className="ml-1 mt-2 mb-0">
          <SvgComponent />
        </div>
      </SidebarHeader>

      {/* Content / Menu */}
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                      >
                        <Link
                          to={item.url}
                        >
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
