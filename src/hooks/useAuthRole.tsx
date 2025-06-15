import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Match backend roles
export type UserRole =
  | "admin"
  | "manager"
  | "member"
  | "super-admin"
  | "employee"
  | "user";

// Subset used for app logic/UI: classic roles only
export type CoreUserRole = "admin" | "manager" | "member";

export const useAuthRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // Accept all backend roles but fallback to "member" for unknown/unsupported roles in core UI logic
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setRole('member');
        } else {
          // If not in UserRole, fallback to member
          const backendRole = data?.role as UserRole | undefined;
          setRole(
            backendRole && [
              "admin",
              "manager",
              "member",
              "super-admin",
              "employee",
              "user",
            ].includes(backendRole)
              ? backendRole
              : "member"
          );
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('member');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Logic only gives privileges to "admin", "manager", "member" (not special/extra roles)
  const hasRole = (requiredRole: CoreUserRole): boolean => {
    if (!role) return false;

    const roleHierarchy: Record<CoreUserRole, number> = {
      admin: 3,
      manager: 2,
      member: 1,
    };

    if (
      role === "admin" ||
      role === "manager" ||
      role === "member"
    ) {
      return roleHierarchy[role as CoreUserRole] >= roleHierarchy[requiredRole];
    }

    // extra roles not granted special privileges in UI
    return false;
  };

  const hasAnyRole = (requiredRoles: CoreUserRole[]): boolean => {
    return requiredRoles.some((requiredRole) => hasRole(requiredRole));
  };

  return {
    role,
    loading,
    hasRole,
    hasAnyRole,
    isAdmin: role === 'admin',
    isManager: role === 'manager' || role === 'admin',
    isMember: !!role
  };
};
