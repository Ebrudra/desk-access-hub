
import * as React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "./theme-toggle";
import { ColorSchemeSelector } from "./color-scheme-selector";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeSettings() {
  const { theme, colorScheme, resolvedTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Theme Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of your application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme Mode</Label>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">
                Current: {theme} {theme === 'system' && `(${resolvedTheme})`}
              </span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="color-scheme">Color Scheme</Label>
            <div className="flex items-center gap-2">
              <ColorSchemeSelector />
              <span className="text-sm text-muted-foreground capitalize">
                Current: {colorScheme}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Preview</Label>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-primary"></div>
                <span className="text-sm">Primary Color</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-accent"></div>
                <span className="text-sm">Accent Color</span>
              </div>
              <Button size="sm" className="mt-2">
                Sample Button
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
