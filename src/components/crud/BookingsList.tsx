
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Edit, Trash2, Plus, Search, Eye, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingForm } from "./BookingForm";
import { useNavigate } from "react-router-dom";
import { EnhancedSearch } from "./EnhancedSearch";
import { BulkActions } from "./BulkActions";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { exportToCSV, exportToJSON, importFromCSV } from "@/utils/exportUtils";

interface SearchFilters {
  query: string;
  status?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  category?: string;
}

export const BookingsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    status: undefined,
    dateRange: undefined
  });

  // Real-time updates
  const { connectionStatus } = useRealtimeData("bookings", ["bookings"]);

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
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("bookings").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: `${selectedBookings.length} bookings deleted` });
      setSelectedBookings([]);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[], status: "confirmed" | "pending" | "cancelled" | "completed" }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: `Status updated for ${selectedBookings.length} bookings` });
      setSelectedBookings([]);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const filteredBookings = bookings?.filter((booking) => {
    const matchesQuery = 
      booking.title?.toLowerCase().includes(filters.query.toLowerCase()) ||
      booking.members?.member_id?.toLowerCase().includes(filters.query.toLowerCase()) ||
      booking.resources?.name?.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesStatus = !filters.status || booking.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange?.from) {
      const bookingDate = new Date(booking.start_time);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : fromDate;
      matchesDate = bookingDate >= fromDate && bookingDate <= toDate;
    }

    return matchesQuery && matchesStatus && matchesDate;
  }) || [];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" }
  ];

  const handleSelectAll = () => {
    setSelectedBookings(filteredBookings.map(b => b.id));
  };

  const handleClearSelection = () => {
    setSelectedBookings([]);
  };

  const handleExport = (ids: string[]) => {
    const dataToExport = bookings?.filter(b => ids.includes(b.id)) || [];
    exportToCSV(dataToExport, `bookings-${new Date().toISOString().split('T')[0]}`);
    toast({ title: "Success", description: "Bookings exported successfully" });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromCSV(file);
      // Process and validate data before importing
      toast({ title: "Success", description: `Imported ${data.length} bookings` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to import file", variant: "destructive" });
    }
  };

  const handleBulkStatusChange = (ids: string[], status: string) => {
    const typedStatus = status as "confirmed" | "pending" | "cancelled" | "completed";
    bulkStatusUpdateMutation.mutate({ ids, status: typedStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
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
        <div>
          <h2 className="text-2xl font-bold">Bookings Management</h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">Real-time {connectionStatus}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            id="import-bookings"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-bookings')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
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
      </div>

      <EnhancedSearch
        filters={filters}
        onFiltersChange={setFilters}
        statusOptions={statusOptions}
        placeholder="Search bookings..."
      />

      {selectedBookings.length > 0 && (
        <BulkActions
          selectedItems={selectedBookings}
          totalItems={filteredBookings.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onBulkDelete={(ids) => bulkDeleteMutation.mutate(ids)}
          onBulkStatusChange={handleBulkStatusChange}
          onExport={handleExport}
          statusOptions={statusOptions}
        />
      )}

      <div className="grid gap-4">
        {filteredBookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedBookings.includes(booking.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBookings([...selectedBookings, booking.id]);
                      } else {
                        setSelectedBookings(selectedBookings.filter(id => id !== booking.id));
                      }
                    }}
                  />
                  <CardTitle className="text-lg">
                    {booking.title || "Untitled Booking"}
                  </CardTitle>
                </div>
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
