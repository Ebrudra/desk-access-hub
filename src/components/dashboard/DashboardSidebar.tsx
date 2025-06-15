import { Calendar, Home, Users, BarChart3, Settings, CreditCard, Shield, Sparkles, Key } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ConnectionStatus } from "@/components/ui/connection-status";

// Lateral menu items including Access Code and Billing
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard?tab=dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/dashboard?tab=calendar",
    icon: Calendar,
  },
  {
    title: "Smart Booking",
    url: "/dashboard?tab=smart-booking",
    icon: Sparkles,
  },
  {
    title: "Management",
    url: "/dashboard?tab=crud",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard?tab=analytics",
    icon: BarChart3,
  },
  {
    title: "Payments",
    url: "/dashboard?tab=payments",
    icon: CreditCard,
  },
  {
    title: "Access Code",
    url: "/dashboard?tab=access-codes",
    icon: Key,
  },
  {
    title: "Billing",
    url: "/dashboard?tab=billing",
    icon: CreditCard,
  },
];

const adminItems = [
  {
    title: "User Management",
    url: "/user-management",
    icon: Shield,
  },
  {
    title: "System Settings",
    url: "/dashboard?tab=crud&subtab=settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { hasRole } = useAuthRole();

  const isActive = (url: string) => {
    if (url.includes('?')) {
      const [pathname, search] = url.split('?');
      return location.pathname === pathname && location.search.includes(search);
    }
    return location.pathname === url;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold">WorkSpace Hub</span>
        </Link>
      </SidebarHeader>

      {/* Connection Status tag - only appears here now */}
      <div className="pl-5 pb-2 mt-2">
        <ConnectionStatus status="connected" />
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hasRole('admin') && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
