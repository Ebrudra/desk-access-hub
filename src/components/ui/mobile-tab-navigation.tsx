import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Users,
  Shield,
  KeyRound,
  Brain,
  CalendarDays,
  Building2,
  Settings,
  AlertTriangle,
  Bell
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const iconMap = {
  Home,
  Brain,
  BarChart3,
  Calendar,
  Users,
  Building2,
  CalendarDays,
  Settings,
  Shield,
  KeyRound,
  AlertTriangle,
  Notifications: Bell,
  MoreHorizontal
};

interface Tab {
  value: string;
  label: string;
  icon: string;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  currentTab: string;
  onTabChange: (value: string) => void;
  moreItems?: Tab[];
  setSearchParams?: (p: URLSearchParams) => void;
  searchParams?: URLSearchParams;
}

export const MobileTabNavigation = ({
  tabs,
  currentTab,
  onTabChange,
  moreItems = [],
  setSearchParams,
  searchParams
}: MobileTabNavigationProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // The last tab is always "More"
  const mainTabs = tabs.slice(0, tabs.length - 1);

  const TabButton = ({ tab, isActive }: { tab: Tab; isActive: boolean }) => {
    const IconComponent = iconMap[tab.icon as keyof typeof iconMap] || Home;
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex flex-col items-center justify-center h-12 px-2 py-1 min-w-0 flex-1",
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
        onClick={() => onTabChange(tab.value)}
      >
        <IconComponent className="h-5 w-5 mb-1" />
        <span className="text-xs font-medium truncate max-w-full">{tab.label}</span>
      </Button>
    );
  };

  const handleMoreClick = () => setIsSheetOpen(true);

  const handleOverflowTabClick = (tabValue: string) => {
    if (setSearchParams && searchParams) {
      const params = new URLSearchParams(searchParams);
      params.set('tab', tabValue);
      setSearchParams(params);
    }
    setIsSheetOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Margins top & bottom */}
      <div className="bg-white border-t border-gray-200 rounded-t-xl shadow-md mx-4 mb-4 mt-2 py-2">
        <div className="flex items-center px-1">
          {/* Main tabs */}
          {mainTabs.map((tab) => (
            <TabButton
              key={tab.value}
              tab={tab}
              isActive={currentTab === tab.value}
            />
          ))}
          {/* More menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-12 px-2 py-1 min-w-0 flex-1",
                  moreItems.some(tab => tab.value === currentTab)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={handleMoreClick}
              >
                <MoreHorizontal className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto pb-8">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">More Options</h3>
                <ScrollArea className="max-h-60">
                  <div className="grid grid-cols-2 gap-3">
                    {moreItems.map((tab) => {
                      const IconComponent = iconMap[tab.icon as keyof typeof iconMap] || Home;
                      const isActive = currentTab === tab.value;
                      return (
                        <Button
                          key={tab.value}
                          variant={isActive ? "default" : "outline"}
                          className="flex items-center justify-start h-14 px-4"
                          onClick={() => handleOverflowTabClick(tab.value)}
                        >
                          <IconComponent className="h-5 w-5 mr-3" />
                          <span className="font-medium">{tab.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
