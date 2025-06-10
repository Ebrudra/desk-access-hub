
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";
import { supabase } from "@/integrations/supabase/client";
import { Home, Settings, LogOut, Menu, X, Shield } from "lucide-react";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { Badge } from "@/components/ui/badge";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const { user } = useAuth();
  const { role, isAdmin } = useAuthRole();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
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

  const NavigationItems = () => (
    <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-8'}`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActivePath(item.path)
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">WorkSpace Hub</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && <NavigationItems />}

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            
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
                    <Link to="/?tab=roles" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Manage Roles</span>
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

            {/* Mobile menu */}
            {isMobile && (
              <MobileDrawer>
                <div className="pt-6">
                  <NavigationItems />
                </div>
              </MobileDrawer>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
