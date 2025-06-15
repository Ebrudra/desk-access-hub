
import * as React from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface SearchFilter {
  id: string;
  label: string;
  type: "select" | "date" | "dateRange" | "text";
  options?: { value: string; label: string }[];
  value?: any;
}

interface AdvancedSearchProps {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: SearchFilter[];
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}

export function AdvancedSearch({
  placeholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const activeFilters = filters.filter(filter => 
    filter.value !== undefined && filter.value !== "" && filter.value !== null
  );

  const handleFilterChange = (filterId: string, value: any) => {
    onFilterChange(filterId, value);
  };

  const renderFilterInput = (filter: SearchFilter) => {
    switch (filter.type) {
      case "select":
        return (
          <Select
            value={filter.value || ""}
            onValueChange={(value) => handleFilterChange(filter.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filter.value ? format(filter.value, "PPP") : `Pick ${filter.label}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filter.value}
                onSelect={(date) => handleFilterChange(filter.id, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      case "text":
        return (
          <Input
            value={filter.value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={`Enter ${filter.label}`}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {activeFilters.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearFilters();
                      setIsOpen(false);
                    }}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="text-sm font-medium">{filter.label}</Label>
                    {renderFilterInput(filter)}
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onSearch();
                    setIsOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button onClick={onSearch}>Search</Button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="gap-1">
              {filter.label}: {
                filter.type === "date" 
                  ? format(filter.value, "PP")
                  : Array.isArray(filter.value) 
                    ? filter.value.join(", ")
                    : filter.value
              }
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1"
                onClick={() => handleFilterChange(filter.id, undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
