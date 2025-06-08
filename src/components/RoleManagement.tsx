
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthRole, UserRole } from "@/hooks/useAuthRole";
import { RoleBasedRoute } from "./auth/RoleBasedRoute";
import { Users, Shield } from "lucide-react";

export const RoleManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasRole } = useAuthRole();

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          user_roles!inner(
            role,
            assigned_at
          )
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: hasRole('admin'),
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      // First, remove existing role
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Then add new role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: newRole,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RoleBasedRoute requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          </div>
          <p className="text-gray-600">
            Manage user roles and permissions across the platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Roles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {usersWithRoles?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                      <Badge className={getRoleBadgeColor(user.user_roles[0]?.role)}>
                        {user.user_roles[0]?.role || 'No role'}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={user.user_roles[0]?.role || ''}
                        onValueChange={(newRole: UserRole) => {
                          updateRoleMutation.mutate({ userId: user.id, newRole });
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {usersWithRoles?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleBasedRoute>
  );
};
