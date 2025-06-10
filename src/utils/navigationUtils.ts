
import { NavigateFunction } from "react-router-dom";

export interface NavigationAction {
  type: 'navigate' | 'modal' | 'tab' | 'external';
  target: string;
  params?: Record<string, string>;
}

export const createNavigationHandler = (navigate: NavigateFunction) => {
  return (action: NavigationAction) => {
    switch (action.type) {
      case 'navigate':
        navigate(action.target);
        break;
      case 'tab':
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('tab', action.target);
        navigate(`${currentUrl.pathname}${currentUrl.search}`);
        break;
      case 'modal':
        // For future modal implementation
        console.log(`Opening modal: ${action.target}`);
        break;
      case 'external':
        window.open(action.target, '_blank');
        break;
    }
  };
};

export const quickActionRoutes = {
  'Add Member': { type: 'tab' as const, target: 'crud' },
  'New Booking': { type: 'navigate' as const, target: '/bookings/new' },
  'Grant Access': { type: 'tab' as const, target: 'crud' },
  'Send Notice': { type: 'modal' as const, target: 'notifications' },
  'Settings': { type: 'tab' as const, target: 'crud' }
};
