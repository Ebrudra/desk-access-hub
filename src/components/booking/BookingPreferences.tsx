
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Clock, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";

interface BookingPreferencesProps {
  onPreferencesChange: (preferences: BookingPreferences) => void;
  initialPreferences?: Partial<BookingPreferences>;
}

export interface BookingPreferences {
  resourceType?: string;
  capacity?: number;
  duration?: number;
  timePreference?: 'morning' | 'afternoon' | 'evening';
  budget?: number;
}

export const BookingPreferences = ({ 
  onPreferencesChange, 
  initialPreferences = {} 
}: BookingPreferencesProps) => {
  const [preferences, setPreferences] = useState<BookingPreferences>(initialPreferences);

  const resourceTypes = [
    { value: "meeting_room", label: "Meeting Room" },
    { value: "desk", label: "Desk" },
    { value: "office", label: "Private Office" },
    { value: "conference_room", label: "Conference Room" },
    { value: "phone_booth", label: "Phone Booth" }
  ];

  const timePreferences = [
    { value: "morning", label: "Morning (9 AM - 12 PM)", icon: "🌅" },
    { value: "afternoon", label: "Afternoon (12 PM - 5 PM)", icon: "☀️" },
    { value: "evening", label: "Evening (5 PM - 8 PM)", icon: "🌆" }
  ];

  const updatePreference = (key: keyof BookingPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const clearPreferences = () => {
    setPreferences({});
    onPreferencesChange({});
  };

  const activePreferencesCount = Object.values(preferences).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Booking Preferences
          </div>
          {activePreferencesCount > 0 && (
            <Badge variant="secondary">
              {activePreferencesCount} active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Set your preferences to get personalized booking suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resourceType" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Resource Type
            </Label>
            <Select 
              value={preferences.resourceType || ""} 
              onValueChange={(value) => updatePreference('resourceType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any resource type</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Capacity Needed
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="Number of people"
              value={preferences.capacity || ""}
              onChange={(e) => updatePreference('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
              min="1"
              max="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration (hours)
            </Label>
            <Select 
              value={preferences.duration?.toString() || ""} 
              onValueChange={(value) => updatePreference('duration', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any duration</SelectItem>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="8">Full day (8 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Limit
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="Maximum amount ($)"
              value={preferences.budget || ""}
              onChange={(e) => updatePreference('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
              step="10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Preferred Time
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {timePreferences.map((time) => (
              <Button
                key={time.value}
                variant={preferences.timePreference === time.value ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-1"
                onClick={() => updatePreference('timePreference', 
                  preferences.timePreference === time.value ? undefined : time.value
                )}
              >
                <span className="text-lg">{time.icon}</span>
                <span className="text-xs text-center">{time.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {activePreferencesCount > 0 && (
          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={clearPreferences}
              className="w-full"
            >
              Clear All Preferences
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
