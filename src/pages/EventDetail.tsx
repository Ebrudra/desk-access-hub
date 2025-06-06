
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, User } from "lucide-react";
import { format } from "date-fns";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEvent(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading event details</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Event ID: {event.id.slice(0, 8)}...
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={event.is_public ? "default" : "secondary"}>
                {event.is_public ? "Public" : "Private"}
              </Badge>
              {event.registration_required && (
                <Badge variant="outline">Registration Required</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {event.image_url && (
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Time</p>
                    <p className="text-lg">
                      {format(new Date(event.start_time), "PPP 'at' p")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Time</p>
                    <p className="text-lg">
                      {format(new Date(event.end_time), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
                
                {event.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{event.description}</p>
                  </div>
                )}

                {event.event_type && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Event Type</p>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </div>
                )}

                {event.location_details && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location Details</p>
                    <p className="text-gray-900">{event.location_details}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {event.spaces && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Venue Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{event.spaces.name}</h3>
                    <p className="text-gray-600">{event.spaces.description}</p>
                    <p className="text-sm text-gray-500">{event.spaces.address}, {event.spaces.city}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {event.capacity && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{event.capacity}</div>
                  <p className="text-sm text-gray-500">Maximum attendees</p>
                </CardContent>
              </Card>
            )}

            {event.price !== null && event.price > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${event.price}</div>
                  <p className="text-sm text-gray-500">Per person</p>
                </CardContent>
              </Card>
            )}

            {event.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      {event.organizer.first_name} {event.organizer.last_name}
                    </p>
                    {event.organizer.company && (
                      <p className="text-sm text-gray-500">{event.organizer.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.registration_required ? (
                  <Button className="w-full">
                    Register for Event
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline">
                    Add to Calendar
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
