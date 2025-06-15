
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import { TestUsersSetup } from "@/components/admin/TestUsersSetup";
import { Navigation } from "@/components/Navigation";

const UserManagement = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useAuthRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!roleLoading && role !== 'admin') {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roles">User Role Manager</TabsTrigger>
            <TabsTrigger value="setup">Test Users Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles">
            <UserRoleManager />
          </TabsContent>
          
          <TabsContent value="setup">
            <TestUsersSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;
