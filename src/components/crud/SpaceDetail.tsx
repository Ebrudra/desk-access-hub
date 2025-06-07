
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: space, isLoading } = useQuery({
    queryKey: ["space", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading space details...</div>;
  }

  if (!space) {
    return <div className="text-center p-8">Space not found</div>;
  }

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
            { label: "Spaces", href: "/" },
            { label: space.name }
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {space.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {space.image_url && (
            <img 
              src={space.image_url} 
              alt={space.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-600">
                    {space.address}<br />
                    {space.city}, {space.country}
                    {space.postal_code && ` ${space.postal_code}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-sm text-gray-600">{space.timezone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {space.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{space.phone}</p>
                  </div>
                </div>
              )}

              {space.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">{space.email}</p>
                  </div>
                </div>
              )}

              {space.website_url && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href={space.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {space.website_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {space.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{space.description}</p>
            </div>
          )}

          {space.amenities && space.amenities.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}

          {space.operating_hours && (
            <div>
              <h3 className="font-medium mb-2">Operating Hours</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(space.operating_hours, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Created: {new Date(space.created_at).toLocaleString()} | 
              Last updated: {new Date(space.updated_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
