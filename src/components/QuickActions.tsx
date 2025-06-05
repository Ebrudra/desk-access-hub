
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Calendar, KeyRound, Mail, Settings } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Add Member",
      description: "Register new member",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Calendar,
      label: "New Booking",
      description: "Create space booking",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: KeyRound,
      label: "Grant Access",
      description: "Provide space access",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Mail,
      label: "Send Notice",
      description: "Member announcement",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const handleAction = (actionLabel: string) => {
    console.log(`Triggered action: ${actionLabel}`);
    // In a real app, this would navigate to the appropriate form or modal
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
              onClick={() => handleAction(action.label)}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-2"
            onClick={() => handleAction("Settings")}
          >
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
