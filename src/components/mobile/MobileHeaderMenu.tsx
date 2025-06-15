
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useNavigate } from "react-router-dom";

export function MobileHeaderMenu() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/auth");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 px-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white">
        <div className="py-8 flex flex-col gap-2 items-start px-4">
          <div className="font-bold text-2xl mb-6">Menu</div>
          <Button
            variant="ghost"
            className="w-full justify-start text-lg text-white"
            onClick={() => { navigate("/profile"); setOpen(false); }}
          >
            <User className="mr-3" /> Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-lg text-white"
            onClick={() => { navigate("/settings"); setOpen(false); }}
          >
            <Settings className="mr-3" /> Settings
          </Button>
          <ThemeToggle />
          <LanguageToggle />
          <Button
            variant="ghost"
            className="w-full justify-start text-lg text-red-200 mt-6"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3" /> Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
