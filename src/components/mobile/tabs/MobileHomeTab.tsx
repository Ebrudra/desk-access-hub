
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Button } from "@/components/ui/button";
import { MobileOptimizedCard } from "@/components/mobile/MobileOptimizedCard";
import { SwipeActions } from "@/components/mobile/SwipeActions";
import { Edit, Star, Trash, Clock, MapPin } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";
import React from "react";

export function MobileHomeTab({ bookings }: { bookings: any[] }) {
  const { hasRole } = useAuthRole();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="pb-3 px-4 pt-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Search</div>
        </div>
        <div className="px-4 pb-4">
          <GlobalSearch />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="pb-3 px-4 pt-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Quick Insights</div>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">3</div>
              <div className="text-xs text-blue-600 font-medium">Active Today</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">12</div>
              <div className="text-xs text-green-600 font-medium">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      {hasRole('member') && (
        <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="pb-3 px-4 pt-4">
            <div className="text-lg font-semibold text-gray-800 mb-1">Recent Bookings</div>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">No bookings found.</div>
            ) : (
              bookings.map((booking) => (
                <SwipeActions
                  key={booking.id}
                  leftActions={[
                    {
                      label: "Edit",
                      color: "blue",
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => console.log("Edit booking", booking.id)
                    },
                    {
                      label: "Star",
                      color: "orange",
                      icon: <Star className="h-4 w-4" />,
                      onClick: () => console.log("Star booking", booking.id)
                    }
                  ]}
                  rightActions={[
                    {
                      label: "Cancel",
                      color: "red",
                      icon: <Trash className="h-4 w-4" />,
                      onClick: () => console.log("Cancel booking", booking.id)
                    }
                  ]}
                >
                  <MobileOptimizedCard
                    title={booking.title}
                    subtitle={booking.time}
                    description={`${booking.attendees} attendee${booking.attendees > 1 ? 's' : ''} • ${booking.status}`}
                    onTap={() => console.log("View booking", booking.id)}
                    className="rounded-lg border border-slate-200"
                  />
                </SwipeActions>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
