import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Building2, Calendar, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(`
          *,
          spaces(name),
          profiles:user_id(*)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading member details...</div>;
  }

  if (!member) {
    return <div className="text-center p-8">Member not found</div>;
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Breadcrumbs />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              {member.member_id}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className={getStatusColor(member.membership_status || "pending")}>
                {member.membership_status || "pending"}
              </Badge>
              <Badge className={getTierColor(member.membership_tier || "basic")}>
                {member.membership_tier || "basic"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Space</p>
                  <p className="text-sm text-gray-600">
                    {member.spaces?.name || "No space assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Membership Period</p>
                  <p className="text-sm text-gray-600">
                    {member.start_date ? new Date(member.start_date).toLocaleDateString() : "Not set"} - 
                    {member.end_date ? new Date(member.end_date).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Monthly Rate</p>
                  <p className="text-sm text-gray-600">${member.monthly_rate || "0"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {member.access_code && (
                <div>
                  <p className="font-medium">Access Code</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {member.access_code}
                  </code>
                </div>
              )}

              {member.rfid_card_id && (
                <div>
                  <p className="font-medium">RFID Card ID</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {member.rfid_card_id}
                  </code>
                </div>
              )}

              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-sm text-gray-600">
                  {new Date(member.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {member.access_hours && (
            <div>
              <h3 className="font-medium mb-2">Access Hours</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(member.access_hours, null, 2)}
              </pre>
            </div>
          )}

          {member.profiles && (
            <div>
              <h3 className="font-medium mb-2">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name: </span>
                  {member.profiles.first_name} {member.profiles.last_name}
                </div>
                {member.profiles.company && (
                  <div>
                    <span className="font-medium">Company: </span>
                    {member.profiles.company}
                  </div>
                )}
                {member.profiles.job_title && (
                  <div>
                    <span className="font-medium">Job Title: </span>
                    {member.profiles.job_title}
                  </div>
                )}
                {member.profiles.phone && (
                  <div>
                    <span className="font-medium">Phone: </span>
                    {member.profiles.phone}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
