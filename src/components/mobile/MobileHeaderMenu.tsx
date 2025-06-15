
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User, Settings, LogOut, Menu } from "lucide-react";
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
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 px-0 bg-gradient-to-br from-[#35386a] via-[#633dc3] to-[#4152b2] text-white">
        <div className="py-8 flex flex-col gap-2 items-start px-4">
          <div className="font-bold text-2xl mb-7">Menu</div>
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
          <div className="flex w-full gap-3 mt-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-lg text-red-300 mt-7"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3" /> Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
