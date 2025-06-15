
import * as React from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

const colorSchemes = [
  { value: 'default', label: 'Default', color: 'hsl(210, 100%, 50%)' },
  { value: 'blue', label: 'Blue', color: 'hsl(217, 91%, 60%)' },
  { value: 'green', label: 'Green', color: 'hsl(142, 76%, 36%)' },
  { value: 'purple', label: 'Purple', color: 'hsl(262, 83%, 58%)' },
  { value: 'orange', label: 'Orange', color: 'hsl(25, 95%, 53%)' },
] as const;

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select color scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
        {colorSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value)}
            className={colorScheme === scheme.value ? "bg-accent" : ""}
          >
            <div 
              className="mr-2 h-4 w-4 rounded-full border"
              style={{ backgroundColor: scheme.color }}
            />
            <span>{scheme.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
