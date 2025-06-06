
import { useParams, useNavigate } from "react-router-dom";
import { useResource } from "@/hooks/useResources";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, DollarSign, MapPin, Calendar, Clock } from "lucide-react";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading, error } = useResource(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading resource details...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading resource details</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatResourceType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
                {resource.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Resource ID: {resource.id.slice(0, 8)}...
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(resource.is_available || false)}>
                {resource.is_available ? "Available" : "Unavailable"}
              </Badge>
              <Badge variant="outline">
                {formatResourceType(resource.type)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {resource.image_url && (
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={resource.image_url} 
                    alt={resource.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Resource Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{resource.description}</p>
                  </div>
                )}

                {resource.location_details && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location Details</p>
                    <p className="text-gray-900">{resource.location_details}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Resource Type</p>
                    <p className="text-lg">{formatResourceType(resource.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Capacity</p>
                    <p className="text-lg">{resource.capacity} people</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {resource.amenities && resource.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {resource.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="justify-center">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {resource.hourly_rate && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">${resource.hourly_rate}</div>
                      <p className="text-sm text-gray-500">per hour</p>
                    </div>
                  )}
                  {resource.daily_rate && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">${resource.daily_rate}</div>
                      <p className="text-sm text-gray-500">per day</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resource.capacity}</div>
                <p className="text-sm text-gray-500">Maximum occupancy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book This Resource
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  disabled={!resource.is_available}
                >
                  {resource.is_available ? "Book Now" : "Currently Unavailable"}
                </Button>
                <Button className="w-full" variant="outline">
                  Check Availability
                </Button>
                <Button className="w-full" variant="outline">
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Add to Favorites
                </Button>
                <Button className="w-full" variant="outline">
                  Share Resource
                </Button>
                <Button className="w-full" variant="outline">
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
