
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileDrawerProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

export const MobileDrawer = ({ children, trigger }: MobileDrawerProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div onClick={() => setOpen(false)}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
