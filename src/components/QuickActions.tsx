
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, UserPlus, Calendar, KeyRound, Settings, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createNavigationHandler, quickActionRoutes } from "@/utils/navigationUtils";
import { useIsMobile } from "@/hooks/use-mobile";

const quickActionFeatures = [
  {
    icon: Brain,
    title: "Smart Booking",
    description: "AI-powered suggestions for bookings.",
    action: "smart-booking"
  },
  {
    icon: UserPlus,
    title: "Add Member",
    description: "Register new member to your space.",
    action: "members/new"
  },
  {
    icon: Calendar,
    title: "New Booking",
    description: "Create a new booking.",
    action: "bookings/new"
  },
  {
    icon: KeyRound,
    title: "Grant Access",
    description: "Provide space access to a member.",
    action: "access-codes"
  }
];

export const QuickActions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const handleAction = (action: string) => {
    if (action === "smart-booking") {
      const params = new URLSearchParams(searchParams);
      params.set('tab', 'smart-booking');
      setSearchParams(params);
    } else if (action === "members/new") {
      navigate("/members/new");
    } else if (action === "bookings/new") {
      navigate("/bookings/new");
    } else if (action === "access-codes") {
      // This is now specifically fixed to new requirements:
      navigate("/dashboard?tab=access-codes");
    }
  };

  // Use bento/micro-animation style layout
  return (
    <Card className="rounded-2xl shadow-md bg-gradient-to-br from-indigo-50/70 to-white/90 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {quickActionFeatures.map(({ icon: Icon, title, description, action }, idx) => (
            <div
              key={idx}
              tabIndex={0}
              role="button"
              onClick={() => handleAction(action)}
              className="group rounded-xl px-5 py-6 bg-gradient-to-br from-white to-indigo-100 shadow group-hover:shadow-lg border border-indigo-100 cursor-pointer focus:outline-none transform transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-indigo-50/60"
              style={{ minHeight: "120px" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="h-7 w-7 text-indigo-500 group-hover:scale-125 transition-transform drop-shadow" />
                <span className="text-lg font-semibold text-indigo-800">{title}</span>
              </div>
              <div className="text-sm text-indigo-800 opacity-80">{description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
