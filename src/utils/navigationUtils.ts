
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
  'Add Member': { type: 'navigate' as const, target: '/members/new' },
  'New Booking': { type: 'navigate' as const, target: '/bookings/new' },
  'Grant Access': { type: 'tab' as const, target: 'crud' },
  'Send Notice': { type: 'modal' as const, target: 'notifications' },
  'Settings': { type: 'tab' as const, target: 'crud' }
};

export const dashboardRoutes = {
  'View Calendar': { type: 'tab' as const, target: 'calendar' },
  'Check Availability': { type: 'tab' as const, target: 'smart-booking' },
  'Book Now': { type: 'navigate' as const, target: '/bookings/new' },
  'View All': { type: 'tab' as const, target: 'crud' },
  'Manage Members': { type: 'tab' as const, target: 'crud' },
  'View Analytics': { type: 'tab' as const, target: 'analytics' }
};

export const createTabHandler = (setSearchParams: (params: URLSearchParams) => void, searchParams: URLSearchParams) => {
  return (tabName: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tabName);
    setSearchParams(newSearchParams);
  };
};

export const createDetailNavigationHandler = (navigate: NavigateFunction) => {
  return (type: 'bookings' | 'members' | 'events' | 'spaces' | 'resources', id: string) => {
    navigate(`/${type}/${id}`);
  };
};

export const createResourcesTabHandler = (setSearchParams: (params: URLSearchParams) => void, searchParams: URLSearchParams) => {
  return () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', 'crud');
    // Add a sub-tab parameter to open the resources tab within management
    newSearchParams.set('subtab', 'resources');
    setSearchParams(newSearchParams);
  };
};
