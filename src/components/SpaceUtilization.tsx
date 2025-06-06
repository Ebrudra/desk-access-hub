
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSpaces } from "@/hooks/useSpaces";
import { useResources } from "@/hooks/useResources";
import { useBookings } from "@/hooks/useBookings";
import { MapPin, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpaceUtilizationProps {
  expanded?: boolean;
}

export const SpaceUtilization = ({ expanded = false }: SpaceUtilizationProps) => {
  const navigate = useNavigate();
  const { data: spaces, isLoading: spacesLoading } = useSpaces();
  const { data: resources, isLoading: resourcesLoading } = useResources();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();

  if (spacesLoading || resourcesLoading || bookingsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Space Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeBookings = bookings?.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.end_time) > new Date()
  ) || [];

  const getResourceUtilization = (resourceId: string) => {
    const resourceBookings = activeBookings.filter(booking => 
      booking.resource_id === resourceId
    );
    return (resourceBookings.length / 10) * 100; // Mock calculation
  };

  const availableResources = resources?.filter(resource => resource.is_available) || [];
  const displayResources = expanded ? availableResources : availableResources.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Space Utilization
        </CardTitle>
        <CardDescription>
          {expanded ? "All available resources" : "Current space usage"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayResources.map((resource) => {
            const utilization = getResourceUtilization(resource.id);
            return (
              <div 
                key={resource.id} 
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => navigate(`/resources/${resource.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{resource.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {resource.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(utilization)}%</span>
                </div>
                <Progress value={utilization} className="h-2" />
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    {resource.capacity}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {activeBookings.filter(b => b.resource_id === resource.id).length} bookings
                  </div>
                </div>
              </div>
            );
          })}
          
          {!expanded && availableResources.length > 3 && (
            <button 
              onClick={() => navigate("/resources")}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
            >
              View all resources ({availableResources.length - 3} more)
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
