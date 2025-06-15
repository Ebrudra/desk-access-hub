
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreVertical } from "lucide-react";
import { useState } from "react";

interface MobileOptimizedCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive";
  }>;
  onTap?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const MobileOptimizedCard = ({
  title,
  subtitle,
  description,
  image,
  actions = [],
  onTap,
  className = "",
  children
}: MobileOptimizedCardProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className={`touch-manipulation ${className}`}>
      <div 
        className={`${onTap ? 'cursor-pointer active:bg-gray-50' : ''}`}
        onClick={onTap}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight">{title}</CardTitle>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-2">
              {actions.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )}
              {onTap && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </CardHeader>
        
        {(image || description || children) && (
          <CardContent className="pt-0">
            {image && (
              <img 
                src={image} 
                alt={title}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
            {children}
          </CardContent>
        )}
      </div>

      {showActions && actions.length > 0 && (
        <CardContent className="pt-0 border-t">
          <div className="grid grid-cols-1 gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setShowActions(false);
                }}
                className="w-full justify-center"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
