import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define type for member form data so it can be referenced in props and state
export interface MemberFormData {
  member_id: string;
  space_id: string;
  membership_tier: string;
  membership_status: string;
  monthly_rate: string;
  start_date: string;
  end_date: string;
  access_code: string;
  rfid_card_id: string;
}

interface MemberFormProps {
  memberId?: string;
  onSuccess?: () => void;
  prefill?: Partial<MemberFormData>;
}

export const MemberForm = ({ memberId, onSuccess, prefill }: MemberFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<MemberFormData>({
    member_id: prefill?.member_id || "",
    space_id: prefill?.space_id || "",
    membership_tier: prefill?.membership_tier || "basic",
    membership_status: prefill?.membership_status || "pending",
    monthly_rate: prefill?.monthly_rate || "",
    start_date: prefill?.start_date || "",
    end_date: prefill?.end_date || "",
    access_code: prefill?.access_code || "",
    rfid_card_id: prefill?.rfid_card_id || ""
  });

  // If prefill changes, update formData (handle quick actions)
  useEffect(() => {
    if (prefill) {
      setFormData((fd) => ({
        ...fd,
        ...prefill,
      }));
    }
  }, [prefill]);

  const { data: spaces } = useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const { data, error } = await supabase.from("spaces").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("members").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Member created successfully" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create member", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      monthly_rate: formData.monthly_rate ? parseFloat(formData.monthly_rate) : null,
    };
    createMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {memberId ? "Edit Member" : "Create New Member"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member_id">Member ID</Label>
              <Input
                id="member_id"
                value={formData.member_id}
                onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space_id">Space</Label>
              <Select value={formData.space_id} onValueChange={(value) => setFormData({ ...formData, space_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a space" />
                </SelectTrigger>
                <SelectContent>
                  {spaces?.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membership_tier">Membership Tier</Label>
              <Select value={formData.membership_tier} onValueChange={(value) => setFormData({ ...formData, membership_tier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="membership_status">Status</Label>
              <Select value={formData.membership_status} onValueChange={(value) => setFormData({ ...formData, membership_status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rate">Monthly Rate</Label>
              <Input
                id="monthly_rate"
                type="number"
                step="0.01"
                value={formData.monthly_rate}
                onChange={(e) => setFormData({ ...formData, monthly_rate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_code">Access Code</Label>
              <Input
                id="access_code"
                value={formData.access_code}
                onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfid_card_id">RFID Card ID</Label>
            <Input
              id="rfid_card_id"
              value={formData.rfid_card_id}
              onChange={(e) => setFormData({ ...formData, rfid_card_id: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createMutation.isPending}
          >
            <Users className="h-4 w-4 mr-2" />
            {memberId ? "Update Member" : "Create Member"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
