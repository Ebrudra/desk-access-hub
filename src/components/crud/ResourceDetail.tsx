
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building2, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resource, isLoading } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          spaces(name)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading resource details...</div>;
  }

  if (!resource) {
    return <div className="text-center p-8">Resource not found</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting_room": return "bg-blue-100 text-blue-800";
      case "desk": return "bg-green-100 text-green-800";
      case "office": return "bg-purple-100 text-purple-800";
      case "equipment": return "bg-orange-100 text-orange-800";
      case "lounge": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
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
        
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Resources", href: "/" },
            { label: resource.name }
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{resource.name}</CardTitle>
            <div className="flex gap-2">
              <Badge className={getTypeColor(resource.type)}>
                {resource.type.replace('_', ' ')}
              </Badge>
              <Badge variant={resource.is_available ? "default" : "secondary"}>
                {resource.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {resource.image_url && (
            <img 
              src={resource.image_url} 
              alt={resource.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Space</p>
                  <p className="text-sm text-gray-600">
                    {resource.spaces?.name || "No space assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-sm text-gray-600">{resource.capacity} people</p>
                </div>
              </div>

              {resource.location_details && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Location Details</p>
                    <p className="text-sm text-gray-600">{resource.location_details}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {resource.hourly_rate && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Hourly Rate</p>
                    <p className="text-sm text-gray-600">${resource.hourly_rate}</p>
                  </div>
                </div>
              )}

              {resource.daily_rate && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Daily Rate</p>
                    <p className="text-sm text-gray-600">${resource.daily_rate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {resource.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{resource.description}</p>
            </div>
          )}

          {resource.amenities && resource.amenities.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {resource.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Created: {new Date(resource.created_at).toLocaleString()} | 
              Last updated: {new Date(resource.updated_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
