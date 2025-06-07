import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Edit, Trash2, Plus, Search, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingForm } from "./BookingForm";
import { useNavigate } from "react-router-dom";

export const BookingsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          members(member_id),
          resources(name, type)
        `)
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Booking deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" });
    },
  });

  const filteredBookings = bookings?.filter((booking) =>
    booking.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.members?.member_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.resources?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <BookingForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredBookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {booking.title || "Untitled Booking"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/crud/bookings/${booking.id}`)}
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
                      <BookingForm bookingId={booking.id} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(booking.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Time: </span>
                  {formatDateTime(booking.start_time)}
                </div>
                <div>
                  <span className="font-medium">Resource: </span>
                  {booking.resources?.name || "No resource"}
                </div>
                <div>
                  <span className="font-medium">Member: </span>
                  {booking.members?.member_id || "No member"}
                </div>
              </div>
              {booking.description && (
                <p className="mt-2 text-sm text-gray-600">{booking.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bookings found.
        </div>
      )}
    </div>
  );
};
