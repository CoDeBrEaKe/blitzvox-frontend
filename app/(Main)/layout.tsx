import { AppSidebar } from "@/components/ui/app-sidebar";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Image from "next/image";
import Header from "@/components/ui/header";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Header />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-white m-3 rounded-xl shadow-2xl">
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
