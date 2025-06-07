
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResourceFormProps {
  resourceId?: string;
  onSuccess?: () => void;
}

export const ResourceForm = ({ resourceId, onSuccess }: ResourceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "desk",
    space_id: "",
    capacity: "1",
    hourly_rate: "",
    daily_rate: "",
    location_details: "",
    image_url: "",
    amenities: ""
  });

  const { data: spaces } = useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const { data, error } = await supabase.from("spaces").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("resources").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Resource created successfully" });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create resource", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      capacity: parseInt(formData.capacity),
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      daily_rate: formData.daily_rate ? parseFloat(formData.daily_rate) : null,
      amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
    };
    createMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {resourceId ? "Edit Resource" : "Create New Resource"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot_desk">Hot Desk</SelectItem>
                  <SelectItem value="dedicated_desk">Dedicated Desk</SelectItem>
                  <SelectItem value="private_office">Private Office</SelectItem>
                  <SelectItem value="meeting_room">Meeting Room</SelectItem>
                  <SelectItem value="phone_booth">Phone Booth</SelectItem>
                  <SelectItem value="event_space">Event Space</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="lounge">Lounge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="space_id">Space</Label>
            <Select value={formData.space_id} onValueChange={(value) => setFormData({ ...formData, space_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {spaces?.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate</Label>
              <Input
                id="hourly_rate"
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate</Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                value={formData.daily_rate}
                onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_details">Location Details</Label>
            <Input
              id="location_details"
              value={formData.location_details}
              onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="WiFi, Printer, Whiteboard"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createMutation.isPending}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {resourceId ? "Update Resource" : "Create Resource"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
