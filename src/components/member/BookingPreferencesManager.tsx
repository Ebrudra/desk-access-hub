
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Heart, Bell, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface UserPreferences {
  id?: string;
  preferred_resource_types: string[];
  preferred_times: string[];
  default_duration: number;
  notification_settings: {
    booking_reminders: boolean;
    booking_confirmations: boolean;
    promotional_emails: boolean;
  };
  favorite_resources: string[];
  default_attendees: number;
}

export const BookingPreferencesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_resource_types: [],
    preferred_times: [],
    default_duration: 2,
    notification_settings: {
      booking_reminders: true,
      booking_confirmations: true,
      promotional_emails: false,
    },
    favorite_resources: [],
    default_attendees: 1,
  });
  const [saving, setSaving] = useState(false);

  const { data: resources } = useQuery({
    queryKey: ["all-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("is_available", true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userPreferences, refetch } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        id: userPreferences.id,
        preferred_resource_types: userPreferences.preferred_resource_types || [],
        preferred_times: userPreferences.preferred_times || [],
        default_duration: userPreferences.default_duration || 2,
        notification_settings: userPreferences.notification_settings || {
          booking_reminders: true,
          booking_confirmations: true,
          promotional_emails: false,
        },
        favorite_resources: userPreferences.favorite_resources || [],
        default_attendees: userPreferences.default_attendees || 1,
      });
    }
  }, [userPreferences]);

  const resourceTypes = [
    { value: "meeting_room", label: "Meeting Room" },
    { value: "desk", label: "Desk" },
    { value: "office", label: "Private Office" },
    { value: "conference_room", label: "Conference Room" },
    { value: "phone_booth", label: "Phone Booth" }
  ];

  const timeSlots = [
    { value: "morning", label: "Morning (9 AM - 12 PM)" },
    { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
    { value: "evening", label: "Evening (5 PM - 8 PM)" }
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const preferenceData = {
        user_id: user.id,
        preferred_resource_types: preferences.preferred_resource_types,
        preferred_times: preferences.preferred_times,
        default_duration: preferences.default_duration,
        notification_settings: preferences.notification_settings,
        favorite_resources: preferences.favorite_resources,
        default_attendees: preferences.default_attendees,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_preferences")
        .upsert(preferenceData, { onConflict: 'user_id' });

      if (error) throw error;

      await refetch();
      toast({
        title: "Preferences Saved",
        description: "Your booking preferences have been updated successfully."
      });

    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Booking Preferences</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Resource Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Preferred Resource Types</Label>
            <p className="text-sm text-gray-600 mb-3">Select the types of spaces you usually book</p>
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={preferences.preferred_resource_types.includes(type.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    preferred_resource_types: toggleArrayItem(prev.preferred_resource_types, type.value)
                  }))}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Favorite Resources</Label>
            <p className="text-sm text-gray-600 mb-3">Mark specific resources as favorites</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {resources?.map((resource) => (
                <div
                  key={resource.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.favorite_resources.includes(resource.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    favorite_resources: toggleArrayItem(prev.favorite_resources, resource.id)
                  }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                    {preferences.favorite_resources.includes(resource.id) && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time & Duration Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Preferred Time Slots</Label>
            <p className="text-sm text-gray-600 mb-3">When do you usually book spaces?</p>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <Badge
                  key={slot.value}
                  variant={preferences.preferred_times.includes(slot.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    preferred_times: toggleArrayItem(prev.preferred_times, slot.value)
                  }))}
                >
                  {slot.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="defaultDuration">Default Duration (hours)</Label>
              <Select 
                value={preferences.default_duration.toString()} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, default_duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultAttendees">Default Attendees</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={preferences.default_attendees}
                onChange={(e) => setPreferences(prev => ({ ...prev, default_attendees: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Booking Reminders</Label>
              <p className="text-sm text-gray-600">Get reminded about upcoming bookings</p>
            </div>
            <Switch
              checked={preferences.notification_settings.booking_reminders}
              onCheckedChange={(checked) => setPreferences(prev => ({
                ...prev,
                notification_settings: { ...prev.notification_settings, booking_reminders: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Booking Confirmations</Label>
              <p className="text-sm text-gray-600">Get notified when bookings are confirmed</p>
            </div>
            <Switch
              checked={preferences.notification_settings.booking_confirmations}
              onCheckedChange={(checked) => setPreferences(prev => ({
                ...prev,
                notification_settings: { ...prev.notification_settings, booking_confirmations: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Promotional Emails</Label>
              <p className="text-sm text-gray-600">Receive updates about new features and offers</p>
            </div>
            <Switch
              checked={preferences.notification_settings.promotional_emails}
              onCheckedChange={(checked) => setPreferences(prev => ({
                ...prev,
                notification_settings: { ...prev.notification_settings, promotional_emails: checked }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};
