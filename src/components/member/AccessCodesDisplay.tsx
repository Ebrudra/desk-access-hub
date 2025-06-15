
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Key, Clock, MapPin, Copy, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AccessCode {
  id: string;
  booking_id: string;
  code: string;
  qr_code_url?: string;
  expires_at: string;
  is_active: boolean;
  booking: {
    title: string;
    start_time: string;
    end_time: string;
    resources: {
      name: string;
      location_details?: string;
    };
  };
}

export const AccessCodesDisplay = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);

  const { data: accessCodes, refetch } = useQuery({
    queryKey: ["user-access-codes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("access_codes")
        .select(`
          id,
          booking_id,
          code,
          qr_code_url,
          expires_at,
          is_active,
          bookings (
            title,
            start_time,
            end_time,
            resources (
              name,
              location_details
            )
          )
        `)
        .eq("member_id", user.id)
        .gte("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: true });
      
      if (error) throw error;
      return data as AccessCode[];
    },
    enabled: !!user?.id,
  });

  const { data: upcomingBookings } = useQuery({
    queryKey: ["upcoming-bookings-without-codes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          title,
          start_time,
          end_time,
          status,
          resources (
            name,
            location_details
          )
        `)
        .eq("member_id", user.id)
        .eq("status", "confirmed")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      
      // Filter out bookings that already have access codes
      const existingCodeBookings = accessCodes?.map(ac => ac.booking_id) || [];
      return data.filter(booking => !existingCodeBookings.includes(booking.id));
    },
    enabled: !!user?.id && !!accessCodes,
  });

  const generateAccessCode = async (bookingId: string) => {
    setGeneratingCode(bookingId);
    
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Calculate expiration (24 hours after booking end time)
      const booking = upcomingBookings?.find(b => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      
      const expiresAt = new Date(booking.end_time);
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const { error } = await supabase
        .from("access_codes")
        .insert({
          booking_id: bookingId,
          member_id: user?.id,
          code,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      
      if (error) throw error;
      
      await refetch();
      
      toast({
        title: "Access Code Generated",
        description: "Your access code has been created successfully."
      });
      
    } catch (error) {
      console.error("Error generating access code:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate access code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingCode(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard."
    });
  };

  const downloadQRCode = (qrCodeUrl: string, bookingTitle: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${bookingTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  const isCodeActive = (expiresAt: string) => {
    return new Date(expiresAt) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Active Access Codes */}
      {accessCodes && accessCodes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Access Codes</h2>
          <div className="grid gap-4">
            {accessCodes.map((accessCode) => (
              <Card key={accessCode.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{accessCode.booking.title}</CardTitle>
                    <Badge variant={isCodeActive(accessCode.expires_at) ? "default" : "secondary"}>
                      {isCodeActive(accessCode.expires_at) ? "Active" : "Expired"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {accessCode.booking.resources.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(accessCode.booking.start_time).toLocaleDateString()} at{" "}
                      {new Date(accessCode.booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Access Code</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-3 py-2 bg-gray-100 rounded font-mono text-lg font-bold">
                            {accessCode.code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(accessCode.code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Expires</label>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(accessCode.expires_at).toLocaleDateString()} at{" "}
                          {new Date(accessCode.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {accessCode.qr_code_url && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">QR Code</label>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                            <QrCode className="h-8 w-8 text-gray-400" />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode(accessCode.qr_code_url!, accessCode.booking.title)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bookings without access codes */}
      {upcomingBookings && upcomingBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Access Codes</h2>
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{booking.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.resources.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(booking.start_time).toLocaleDateString()} at{" "}
                      {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateAccessCode(booking.id)}
                    disabled={generatingCode === booking.id}
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    {generatingCode === booking.id ? "Generating..." : "Generate Access Code"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty states */}
      {(!accessCodes || accessCodes.length === 0) && (!upcomingBookings || upcomingBookings.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Codes</h3>
            <p className="text-gray-600 mb-4">
              You don't have any active access codes. Access codes are generated for confirmed bookings.
            </p>
            <Button onClick={() => window.location.href = "/?tab=smart-booking"}>
              Make a Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
