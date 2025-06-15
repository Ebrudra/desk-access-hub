
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Sparkles, Star } from "lucide-react";
import { useSmartBooking } from "@/hooks/useSmartBooking";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SmartBooking() {
  const { getSmartRecommendations, userPreferences, recentRecommendations, loading } = useSmartBooking();
  const [constraints, setConstraints] = useState({
    start_date: '',
    end_date: '',
    resource_types: [] as string[],
    min_capacity: '',
    required_amenities: [] as string[],
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleGetRecommendations = async () => {
    if (!constraints.start_date || !constraints.end_date) return;

    try {
      const result = await getSmartRecommendations.mutateAsync({
        preferences: {
          preferred_times: userPreferences?.preferred_times || [],
          preferred_resource_types: userPreferences?.preferred_resource_types || [],
          default_duration: userPreferences?.default_duration || 2,
          default_attendees: userPreferences?.default_attendees || 1,
        },
        constraints: {
          start_date: constraints.start_date,
          end_date: constraints.end_date,
          resource_types: constraints.resource_types,
          min_capacity: constraints.min_capacity ? parseInt(constraints.min_capacity) : undefined,
          required_amenities: constraints.required_amenities,
        }
      });

      setRecommendations(result.recommended_slots || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold">Smart Booking</h1>
          </div>
          <p className="text-gray-600">
            AI-powered booking recommendations based on your preferences and availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Constraints */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={constraints.start_date}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      start_date: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={constraints.end_date}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      end_date: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="resource_type">Resource Type</Label>
                  <Select onValueChange={(value) => setConstraints({
                    ...constraints,
                    resource_types: value ? [value] : []
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      <SelectItem value="meeting_room">Meeting Room</SelectItem>
                      <SelectItem value="desk">Desk</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="phone_booth">Phone Booth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="min_capacity">Minimum Capacity</Label>
                  <Input
                    id="min_capacity"
                    type="number"
                    placeholder="Number of people"
                    value={constraints.min_capacity}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      min_capacity: e.target.value
                    })}
                  />
                </div>

                <Button 
                  onClick={handleGetRecommendations}
                  disabled={loading || !constraints.start_date || !constraints.end_date}
                  className="w-full"
                >
                  {loading ? 'Generating...' : 'Get Smart Recommendations'}
                </Button>
              </CardContent>
            </Card>

            {/* User Preferences Summary */}
            {userPreferences && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {userPreferences.preferred_times?.length > 0 && (
                      <div>
                        <strong>Preferred Times:</strong> {userPreferences.preferred_times.join(', ')}
                      </div>
                    )}
                    {userPreferences.preferred_resource_types?.length > 0 && (
                      <div>
                        <strong>Preferred Types:</strong> {userPreferences.preferred_resource_types.join(', ')}
                      </div>
                    )}
                    <div>
                      <strong>Default Duration:</strong> {userPreferences.default_duration || 2} hours
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Generate smart recommendations to see AI-powered booking suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {rec.resource_name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">{rec.resource_type.replace('_', ' ')}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getScoreColor(rec.score)}>
                              <Star className="h-3 w-3 mr-1" />
                              {rec.score}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(rec.start_time).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(rec.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(rec.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {rec.reasons && rec.reasons.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Why this recommendation:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {rec.reasons.map((reason: string, idx: number) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button size="sm" className="w-full">
                          Book This Slot
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Recommendations */}
        {recentRecommendations && recentRecommendations.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {rec.resources?.name || 'Resource'}
                      </span>
                      <Badge variant="outline">
                        Score: {rec.confidence_score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rec.recommended_slots?.length || 0} recommendations generated
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
