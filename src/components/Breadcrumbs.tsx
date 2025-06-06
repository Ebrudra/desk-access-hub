
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const getBreadcrumbName = (segment: string, index: number) => {
    // If it's a UUID (for detail pages), show a shortened version
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const previousSegment = pathnames[index - 1];
      if (previousSegment) {
        return `${previousSegment.slice(0, -1)} Detail`; // Remove 's' from plural
      }
      return segment.slice(0, 8) + '...';
    }
    
    // Convert path segments to readable names
    switch (segment) {
      case 'bookings': return 'Bookings';
      case 'members': return 'Members';
      case 'events': return 'Events';
      case 'spaces': return 'Spaces';
      case 'resources': return 'Resources';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      case 'payments': return 'Payments';
      case 'auth': return 'Authentication';
      default: return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      <Link 
        to="/" 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(segment, index);

        return (
          <div key={segment} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{breadcrumbName}</span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-gray-700 transition-colors"
              >
                {breadcrumbName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
