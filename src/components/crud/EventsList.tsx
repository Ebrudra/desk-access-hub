import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Edit, Trash2, Plus, Search, Calendar, MapPin, Users, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "./EventForm";
import { useNavigate } from "react-router-dom";

export const EventsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          spaces(name)
        `)
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Event deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    },
  });

  const filteredEvents = events?.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <EventForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredEvents?.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  {event.event_type && (
                    <Badge variant="outline">{event.event_type}</Badge>
                  )}
                  <Badge variant={event.is_public ? "default" : "secondary"}>
                    {event.is_public ? "Public" : "Private"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/crud/events/${event.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <EventForm eventId={event.id} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(event.id)}
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
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{formatDateTime(event.start_time)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{event.spaces?.name || "No space assigned"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Capacity: {event.capacity || "Unlimited"}</span>
                </div>
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-gray-600">{event.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {event.price && event.price > 0 && (
                  <Badge variant="outline">Price: ${event.price}</Badge>
                )}
                {event.registration_required && (
                  <Badge variant="outline">Registration Required</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No events found.
        </div>
      )}
    </div>
  );
};
