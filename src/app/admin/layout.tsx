import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminAvatar = PlaceHolderImages.find(p => p.id === 'admin-avatar');
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin" tooltip="Dashboard" asChild>
                  <Link href="/admin">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/products" tooltip="Products" asChild>
                  <Link href="/admin/products">
                    <Package />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/orders" tooltip="Orders" asChild>
                  <Link href="/admin/orders">
                    <ShoppingCart />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/users" tooltip="Customers" asChild>
                  <Link href="/admin/users">
                    <Users />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" tooltip="Exit Admin" asChild>
                   <Link href="/dashboard">
                    <LogOut />
                    <span>Back to App</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="ml-auto">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {adminAvatar && <AvatarImage src={adminAvatar.imageUrl} alt="Admin" />}
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
