
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserPresence } from "@/hooks/useUserPresence";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const LiveUserCount = () => {
  const { getUserCount, getOnlineUsers } = useUserPresence();
  const userCount = getUserCount();
  const onlineUsers = getOnlineUsers();

  if (userCount === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer">
            <Users className="h-3 w-3" />
            <span className="text-xs">{userCount} online</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">Online Users:</p>
            {onlineUsers.slice(0, 5).map((user, index) => (
              <p key={index} className="text-xs">
                {user.user_email}
              </p>
            ))}
            {onlineUsers.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{onlineUsers.length - 5} more
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
