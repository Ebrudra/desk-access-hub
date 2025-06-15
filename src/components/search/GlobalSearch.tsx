
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Calendar, 
  Users, 
  Building2, 
  FileText, 
  Clock,
  Filter,
  X
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  type: 'booking' | 'member' | 'space' | 'resource' | 'event';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, any>;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const GlobalSearch = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchTypes = [
    { type: 'booking', label: 'Bookings', icon: Calendar },
    { type: 'member', label: 'Members', icon: Users },
    { type: 'space', label: 'Spaces', icon: Building2 },
    { type: 'resource', label: 'Resources', icon: FileText },
    { type: 'event', label: 'Events', icon: Clock }
  ];

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["global-search", debouncedQuery, selectedTypes],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      const results: SearchResult[] = [];

      // Search bookings
      if (selectedTypes.length === 0 || selectedTypes.includes('booking')) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*, resources(name)")
          .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        bookings?.forEach(booking => {
          results.push({
            id: booking.id,
            type: 'booking',
            title: booking.title || `Booking ${booking.id.slice(0, 8)}`,
            subtitle: booking.resources?.name,
            description: `${new Date(booking.start_time).toLocaleDateString()} - ${booking.status}`,
            url: `/bookings/${booking.id}`,
            metadata: booking
          });
        });
      }

      // Search members
      if (selectedTypes.length === 0 || selectedTypes.includes('member')) {
        const { data: members } = await supabase
          .from("members")
          .select("*, profiles(first_name, last_name)")
          .limit(5);

        members?.forEach(member => {
          const profile = member.profiles as any;
          const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
          if (fullName.toLowerCase().includes(debouncedQuery.toLowerCase())) {
            results.push({
              id: member.id,
              type: 'member',
              title: fullName || 'Unknown Member',
              subtitle: member.membership_tier,
              description: `Status: ${member.membership_status}`,
              url: `/members/${member.id}`,
              metadata: member
            });
          }
        });
      }

      // Search spaces
      if (selectedTypes.length === 0 || selectedTypes.includes('space')) {
        const { data: spaces } = await supabase
          .from("spaces")
          .select("*")
          .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        spaces?.forEach(space => {
          results.push({
            id: space.id,
            type: 'space',
            title: space.name,
            subtitle: `${space.city}, ${space.country}`,
            description: space.description,
            url: `/spaces/${space.id}`,
            metadata: space
          });
        });
      }

      // Search resources
      if (selectedTypes.length === 0 || selectedTypes.includes('resource')) {
        const { data: resources } = await supabase
          .from("resources")
          .select("*")
          .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        resources?.forEach(resource => {
          results.push({
            id: resource.id,
            type: 'resource',
            title: resource.name,
            subtitle: resource.type,
            description: `Capacity: ${resource.capacity} • ${resource.is_available ? 'Available' : 'Unavailable'}`,
            url: `/resources/${resource.id}`,
            metadata: resource
          });
        });
      }

      // Search events
      if (selectedTypes.length === 0 || selectedTypes.includes('event')) {
        const { data: events } = await supabase
          .from("events")
          .select("*")
          .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        events?.forEach(event => {
          results.push({
            id: event.id,
            type: 'event',
            title: event.title,
            subtitle: event.event_type,
            description: `${new Date(event.start_time).toLocaleDateString()}`,
            url: `/events/${event.id}`,
            metadata: event
          });
        });
      }

      return results;
    },
    enabled: !!debouncedQuery && debouncedQuery.length >= 2
  });

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = searchTypes.find(t => t.type === type);
    if (!typeConfig) return <FileText className="h-4 w-4" />;
    const Icon = typeConfig.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      booking: 'bg-blue-100 text-blue-800',
      member: 'bg-green-100 text-green-800',
      space: 'bg-purple-100 text-purple-800',
      resource: 'bg-orange-100 text-orange-800',
      event: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bookings, members, spaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <Card className="absolute top-12 left-0 right-0 z-50">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {searchTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  size="sm"
                  variant={selectedTypes.includes(type) ? "default" : "outline"}
                  onClick={() => toggleType(type)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {debouncedQuery && debouncedQuery.length >= 2 && (
        <Card className="absolute top-12 left-0 right-0 z-40 mt-1">
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <Search className="h-6 w-6 mx-auto mb-2 animate-spin" />
                  Searching...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm truncate">{result.title}</h4>
                            <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                              {result.type}
                            </Badge>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                          )}
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">{result.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{debouncedQuery}"</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
