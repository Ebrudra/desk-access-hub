
import { useAuthRole } from "@/hooks/useAuthRole";
import { MemberDashboard } from "./dashboards/MemberDashboard";
import { ManagerDashboard } from "./dashboards/ManagerDashboard";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const RoleDashboardRenderer = () => {
  const { role, loading } = useAuthRole();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-gray-800">No Role Assigned</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Please contact an administrator to assign you a role to access the platform.
          </p>
        </CardContent>
      </Card>
    );
  }

  switch (role) {
    case 'member':
      return <MemberDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <MemberDashboard />;
  }
};
