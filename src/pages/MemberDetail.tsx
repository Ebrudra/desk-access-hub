
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Building2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(`
          *,
          profiles(first_name, last_name, phone, company, bio, avatar_url),
          spaces(name)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex justify-center p-8">Loading member details...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="text-center p-8">Member not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium": return "bg-purple-100 text-purple-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "basic": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
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
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                {member.profiles?.first_name} {member.profiles?.last_name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(member.membership_status)}>
                  {member.membership_status}
                </Badge>
                <Badge className={getTierColor(member.membership_tier)}>
                  {member.membership_tier}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {member.profiles?.avatar_url && (
              <img 
                src={member.profiles.avatar_url} 
                alt="Member avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Member ID</p>
                    <p className="text-sm text-gray-600">{member.member_id}</p>
                  </div>
                </div>

                {member.profiles?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{member.profiles.phone}</p>
                    </div>
                  </div>
                )}

                {member.profiles?.company && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Company</p>
                      <p className="text-sm text-gray-600">{member.profiles.company}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
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

                {member.monthly_rate && (
                  <div>
                    <p className="font-medium">Monthly Rate</p>
                    <p className="text-sm text-gray-600">${member.monthly_rate}</p>
                  </div>
                )}

                {member.spaces?.name && (
                  <div>
                    <p className="font-medium">Space</p>
                    <p className="text-sm text-gray-600">{member.spaces.name}</p>
                  </div>
                )}
              </div>
            </div>

            {member.profiles?.bio && (
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{member.profiles.bio}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Member since: {new Date(member.created_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDetail;
