
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected';
  className?: string;
}

export const ConnectionStatus = ({ status, className }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          label: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'connecting':
        return {
          icon: AlertCircle,
          label: 'Connecting',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          label: 'Disconnected',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={cn("flex items-center gap-1", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  );
};
