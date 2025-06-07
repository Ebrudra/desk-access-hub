import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Users, Edit, Trash2, Plus, Search, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MemberForm } from "./MemberForm";
import { useNavigate } from "react-router-dom";

export const MembersList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(`
          *,
          spaces(name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Member deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    },
  });

  const filteredMembers = members?.filter((member) =>
    member.member_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic": return "bg-blue-100 text-blue-800";
      case "premium": return "bg-purple-100 text-purple-800";
      case "enterprise": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Members Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <MemberForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredMembers?.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{member.member_id}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(member.membership_status || "pending")}>
                    {member.membership_status || "pending"}
                  </Badge>
                  <Badge className={getTierColor(member.membership_tier || "basic")}>
                    {member.membership_tier || "basic"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/crud/members/${member.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <MemberForm memberId={member.id} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(member.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Space: </span>
                  {member.spaces?.name || "No space assigned"}
                </div>
                <div>
                  <span className="font-medium">Monthly Rate: </span>
                  ${member.monthly_rate || "0"}
                </div>
                <div>
                  <span className="font-medium">Start Date: </span>
                  {member.start_date ? new Date(member.start_date).toLocaleDateString() : "Not set"}
                </div>
              </div>
              {member.access_code && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Access Code: </span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{member.access_code}</code>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No members found.
        </div>
      )}
    </div>
  );
};
