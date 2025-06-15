
import { useCoworkingSpaces } from "@/hooks/useCoworkingSpaces";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const CoworkingSpacesList = () => {
  const { data: spaces, isLoading, error } = useCoworkingSpaces();

  if (isLoading) return <div className="text-center text-gray-500 py-4">Loading spaces...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error loading coworking spaces</div>;

  if (!spaces || spaces.length === 0)
    return <div className="text-center text-gray-400 py-8">You don't belong to any coworking spaces yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
      {spaces.map((space: any) => (
        <Card key={space.id} className="hover:shadow-lg">
          <CardContent className="p-4">
            <CardTitle className="font-semibold">{space.name}</CardTitle>
            <div className="text-gray-600 text-sm mt-2">
              <div>{space.city}, {space.country}</div>
              <div className="mt-1 text-xs">Address: {space.address || "Not set"}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
