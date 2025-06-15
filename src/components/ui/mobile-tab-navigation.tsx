
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Brain, 
  BarChart3, 
  Calendar, 
  Users, 
  Building2, 
  CalendarDays, 
  Settings,
  MoreHorizontal,
  Shield,
  KeyRound,
  AlertTriangle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tab {
  value: string;
  label: string;
  icon: string;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  currentTab: string;
  onTabChange: (value: string) => void;
}

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
  AlertTriangle
};

export const MobileTabNavigation = ({ tabs, currentTab, onTabChange }: MobileTabNavigationProps) => {
  // Show first 4 tabs directly, rest in overflow menu
  const visibleTabs = tabs.slice(0, 4);
  const overflowTabs = tabs.slice(4);

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center">
        {/* Visible tabs */}
        {visibleTabs.map((tab) => (
          <TabButton 
            key={tab.value} 
            tab={tab} 
            isActive={currentTab === tab.value} 
          />
        ))}
        
        {/* Overflow menu */}
        {overflowTabs.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-12 px-2 py-1 min-w-0 flex-1",
                  overflowTabs.some(tab => tab.value === currentTab)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <MoreHorizontal className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">More Options</h3>
                <ScrollArea className="max-h-60">
                  <div className="grid grid-cols-2 gap-3">
                    {overflowTabs.map((tab) => {
                      const IconComponent = iconMap[tab.icon as keyof typeof iconMap] || Home;
                      const isActive = currentTab === tab.value;
                      
                      return (
                        <Button
                          key={tab.value}
                          variant={isActive ? "default" : "outline"}
                          className="flex items-center justify-start h-14 px-4"
                          onClick={() => onTabChange(tab.value)}
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
        )}
      </div>
    </div>
  );
};
