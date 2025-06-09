
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSmartBooking } from '@/hooks/useSmartBooking';
import { Clock, Users, MapPin, Sparkles } from 'lucide-react';

interface SmartBookingSuggestionsProps {
  date: string;
  duration: number;
  capacity?: number;
  amenities?: string[];
  onSelectSuggestion: (suggestion: any) => void;
}

export const SmartBookingSuggestions = ({
  date,
  duration,
  capacity,
  amenities,
  onSelectSuggestion
}: SmartBookingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { generateBookingSuggestions } = useSmartBooking();

  useEffect(() => {
    if (date && duration) {
      loadSuggestions();
    }
  }, [date, duration, capacity, amenities]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const newSuggestions = await generateBookingSuggestions(date, duration, capacity, amenities);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading suggestions...</div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No suggestions available for the selected criteria
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{suggestion.spaceName}</span>
                <Badge variant={suggestion.confidence > 0.8 ? "default" : "secondary"}>
                  {Math.round(suggestion.confidence * 100)}% match
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(suggestion.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(suggestion.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {suggestion.reason}
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              Select
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
