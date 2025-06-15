
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/hooks/useAuthRole";
import { Users, Shield, UserCheck } from "lucide-react";

type UserWithRole = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole | null;
};

export const UserRoleManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["all-users-with-roles"],
    queryFn: async (): Promise<UserWithRole[]> => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");
      
      if (profilesError) throw profilesError;

      // Get user roles for each profile
      const usersWithRoles: UserWithRole[] = [];
      
      for (const profile of profiles || []) {
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.id)
          .single();

        usersWithRoles.push({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: userRole?.role || null,
        });
      }

      return usersWithRoles;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .upsert({
          user_id: userId,
          role: newRole,
        }, { onConflict: 'user_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["all-users-with-roles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeColor = (role: UserRole | null) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <UserCheck className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">User Role Manager</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Assign User Roles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    <p className="text-sm text-gray-500 font-mono">
                      {user.id}
                    </p>
                  </div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role || 'No role'}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={user.role || ''}
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
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found. Users need to sign up first.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
