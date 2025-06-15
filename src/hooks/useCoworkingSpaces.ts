
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch all coworking spaces the current user can access (based on RLS)
export const useCoworkingSpaces = () => {
  return useQuery({
    queryKey: ["coworking_spaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coworking_spaces")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
