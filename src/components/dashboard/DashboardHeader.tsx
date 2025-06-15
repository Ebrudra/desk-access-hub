import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";
import { supabase } from "@/integrations/supabase/client";
import { Settings, LogOut, Shield } from "lucide-react";
import { NotificationCenter } from "@/components/ui/notification-center";
import { LiveUserCount } from "@/components/ui/live-user-count";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Link, useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { user } = useAuth();
  const { role, isAdmin } = useAuthRole();
  const navigate = useNavigate();

  const realtimeNotifications = useRealtimeNotifications();
  const realtimeData = useRealtimeData('bookings', ['bookings']);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageToggle />
          <LiveUserCount />
          
          {user && (
            <>
              <NotificationCenter
                notifications={realtimeNotifications.notifications}
                onMarkAsRead={realtimeNotifications.markAsRead}
                onMarkAllAsRead={realtimeNotifications.markAllAsRead}
                onDismiss={realtimeNotifications.dismissNotification}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm font-medium truncate max-w-32">{user?.email}</span>
                    {role && (
                      <Badge className={getRoleBadgeColor()}>
                        {role}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/user-management" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Manage Users</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
