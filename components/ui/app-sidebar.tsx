import { Users, Verified, Users2, Mail, List } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Kunden",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Abonnementdetails",
    url: "/client-subscriptions",
    icon: Verified,
  },
  {
    title: "Abonnements",
    url: "/subscriptions",
    icon: Verified,
  },
  {
    title: "Benutzer",
    url: "/users",
    icon: Users2,
  },
  {
    title: "E-Mail-Vorlagen",
    url: "/emails",
    icon: Mail,
  },
  {
    title: "Berichte",
    url: "/reports",
    icon: List,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="z-0 ">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent className="my-30">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="px-4 py-7" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-lg font-semibold">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
