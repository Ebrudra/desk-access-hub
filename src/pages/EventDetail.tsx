
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          spaces(name),
          profiles!events_organizer_id_fkey(first_name, last_name)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex justify-center p-8">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="text-center p-8">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={event.is_public ? "default" : "secondary"}>
                  {event.is_public ? "Public" : "Private"}
                </Badge>
                {event.registration_required && (
                  <Badge variant="outline">Registration Required</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">
                      {event.spaces?.name || "Location TBA"}
                    </p>
                    {event.location_details && (
                      <p className="text-sm text-gray-500">{event.location_details}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {event.capacity && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-gray-600">{event.capacity} people</p>
                    </div>
                  </div>
                )}

                {event.price && event.price > 0 && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-sm text-gray-600">${event.price}</p>
                    </div>
                  </div>
                )}

                {event.event_type && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Event Type</p>
                      <p className="text-sm text-gray-600">{event.event_type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Created: {new Date(event.created_at).toLocaleString()} | 
                Last updated: {new Date(event.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
