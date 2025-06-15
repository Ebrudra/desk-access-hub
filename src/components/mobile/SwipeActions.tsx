
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SwipeAction {
  label: string;
  onClick: () => void;
  color: 'red' | 'green' | 'blue' | 'orange';
  icon?: React.ReactNode;
}

interface SwipeActionsProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
}

export const SwipeActions = ({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 80
}: SwipeActionsProps) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white'
  };

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX.current;
    const maxSwipe = Math.max(leftActions.length, rightActions.length) * 80;
    const clampedX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setSwipeX(clampedX);
  };

  const handleEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(swipeX) > threshold) {
      if (swipeX > 0 && leftActions.length > 0) {
        setShowActions('left');
        setSwipeX(leftActions.length * 80);
      } else if (swipeX < 0 && rightActions.length > 0) {
        setShowActions('right');
        setSwipeX(-rightActions.length * 80);
      } else {
        setSwipeX(0);
        setShowActions(null);
      }
    } else {
      setSwipeX(0);
      setShowActions(null);
    }
  };

  const resetSwipe = () => {
    setSwipeX(0);
    setShowActions(null);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => handleEnd();
    const handleMouseLeave = () => {
      if (isDragging) handleEnd();
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]);

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div 
          className="absolute left-0 top-0 h-full flex"
          style={{ 
            transform: `translateX(${Math.max(0, swipeX) - leftActions.length * 80}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {leftActions.map((action, index) => (
            <Button
              key={index}
              className={`h-full w-20 rounded-none ${colorClasses[action.color]}`}
              onClick={() => {
                action.onClick();
                resetSwipe();
              }}
            >
              <div className="flex flex-col items-center text-xs">
                {action.icon}
                {action.label}
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div 
          className="absolute right-0 top-0 h-full flex"
          style={{ 
            transform: `translateX(${Math.min(0, swipeX) + rightActions.length * 80}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {rightActions.map((action, index) => (
            <Button
              key={index}
              className={`h-full w-20 rounded-none ${colorClasses[action.color]}`}
              onClick={() => {
                action.onClick();
                resetSwipe();
              }}
            >
              <div className="flex flex-col items-center text-xs">
                {action.icon}
                {action.label}
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        className="relative bg-white z-10 touch-pan-y"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
      >
        {children}
      </div>
    </div>
  );
};
