"use client";
import { Users, Verified, Users2, Mail, List } from "lucide-react";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";
// Menu items.
const items = [
  {
    title: "Kunden",
    url: "/clients",
    icon: Users,
  },
  {
    title: "cliëntabonnementen",
    url: "/client-subscription",
    icon: Verified,
  },
  {
    title: "Abonnements",
    url: "/subscriptions",
    icon: Verified,
  },
  {
    title: "abonnementstypen",
    url: "/subscription-types",
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
  const pathname = usePathname();
  return (
    <Sidebar className="z-0 ">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent className="my-30">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.url === pathname}
                    className={cn(
                      "px-4 py-7",
                      item.url === pathname
                        ? "bg-[#EFF6FF]! text-[#28A7FF]!" // active styles
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    asChild
                  >
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
