
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Edit, Trash2, Plus, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResourceForm } from "./ResourceForm";

export const ResourcesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          spaces(name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Resource deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    },
  });

  const filteredResources = resources?.filter((resource) =>
    resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors = {
      "hot_desk": "bg-blue-100 text-blue-800",
      "dedicated_desk": "bg-green-100 text-green-800",
      "private_office": "bg-purple-100 text-purple-800",
      "meeting_room": "bg-orange-100 text-orange-800",
      "phone_booth": "bg-gray-100 text-gray-800",
      "event_space": "bg-red-100 text-red-800",
      "equipment": "bg-yellow-100 text-yellow-800",
      "lounge": "bg-pink-100 text-pink-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <ResourceForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredResources?.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{resource.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant={resource.is_available ? "default" : "secondary"}>
                    {resource.is_available ? "Available" : "Unavailable"}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <ResourceForm resourceId={resource.id} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(resource.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{resource.spaces?.name || "No space assigned"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Capacity: {resource.capacity}</span>
                </div>
                <div>
                  <span className="font-medium">Rate: </span>
                  {resource.hourly_rate ? `$${resource.hourly_rate}/hr` : 
                   resource.daily_rate ? `$${resource.daily_rate}/day` : "No rate set"}
                </div>
              </div>
              {resource.description && (
                <p className="mt-2 text-sm text-gray-600">{resource.description}</p>
              )}
              {resource.amenities && resource.amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {resource.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No resources found.
        </div>
      )}
    </div>
  );
};
