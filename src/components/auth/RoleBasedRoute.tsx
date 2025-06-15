
import { ReactNode } from "react";
import { useAuthRole, CoreUserRole } from "@/hooks/useAuthRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface RoleBasedRouteProps {
  children: ReactNode;
  requiredRole: CoreUserRole;
  fallback?: ReactNode;
}

export const RoleBasedRoute = ({ children, requiredRole, fallback }: RoleBasedRouteProps) => {
  const { hasRole, loading } = useAuthRole();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Required role: {requiredRole}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
