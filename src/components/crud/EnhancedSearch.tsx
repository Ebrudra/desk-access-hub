
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface SearchFilters {
  query: string;
  status?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  category?: string;
}

interface EnhancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  statusOptions?: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  placeholder?: string;
}

export const EnhancedSearch = ({
  filters,
  onFiltersChange,
  statusOptions = [],
  categoryOptions = [],
  placeholder = "Search..."
}: EnhancedSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onFiltersChange({ query: "" });
  };

  const hasActiveFilters = filters.status || filters.dateRange || filters.category;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      onFiltersChange({ 
        ...filters, 
        dateRange: {
          from: range.from,
          to: range.to
        }
      });
    } else {
      onFiltersChange({ ...filters, dateRange: undefined });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            className="pl-8"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
          {statusOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => onFiltersChange({ ...filters, status: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {categoryOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select
                value={filters.category || ""}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      `${format(filters.dateRange.from, "LLL dd")} - ${format(filters.dateRange.to, "LLL dd")}`
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange as DateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.status && (
            <Badge variant="secondary">
              Status: {statusOptions.find(o => o.value === filters.status)?.label || filters.status}
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">
              Category: {categoryOptions.find(o => o.value === filters.category)?.label || filters.category}
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary">
              Date: {format(filters.dateRange.from, "MMM dd")} - {format(filters.dateRange.to || filters.dateRange.from, "MMM dd")}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
