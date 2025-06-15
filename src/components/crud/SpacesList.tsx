
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SpaceForm } from "./SpaceForm";

export const SpacesList = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: spaces, isLoading, refetch } = useQuery({
    queryKey: ["spaces-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="text-gray-500 py-8 text-center">Loading spaces...</div>;
  }

  if (showForm) {
    // Show creation form
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create a New Space</CardTitle>
        </CardHeader>
        <CardContent>
          <SpaceForm 
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }}
            onCancel={() => setShowForm(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Spaces</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Space
        </Button>
      </div>
      {spaces?.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No spaces found. <Button variant="link" onClick={() => setShowForm(true)}>Create one now</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {spaces.map((space: any) => (
            <a
              key={space.id}
              href={`/spaces/${space.id}`}
              className="block"
            >
              <Card className="hover:ring-2 hover:ring-primary/50 transition cursor-pointer">
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 mb-2">{space.description}</div>
                  <div className="text-xs text-gray-500">{space.city}, {space.country}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
