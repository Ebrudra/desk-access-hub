import { useParams, useNavigate } from "react-router-dom";
import { useMember } from "@/hooks/useMembers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowLeft, Mail, Phone, Building, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, error } = useMember(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading member details</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
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
      case "enterprise": return "bg-purple-100 text-purple-800";
      case "premium": return "bg-blue-100 text-blue-800";
      case "basic": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.profiles?.avatar_url} />
                    <AvatarFallback>
                      {member.profiles?.first_name?.charAt(0) || "M"}
                      {member.profiles?.last_name?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      {member.profiles?.first_name} {member.profiles?.last_name}
                    </CardTitle>
                    <CardDescription>
                      Member ID: {member.member_id}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(member.membership_status || "pending")}>
                        {member.membership_status || "pending"}
                      </Badge>
                      <Badge className={getTierColor(member.membership_tier || "basic")}>
                        {member.membership_tier || "basic"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.profiles?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{member.profiles.phone}</span>
                  </div>
                )}
                
                {member.profiles?.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{member.profiles.company}</span>
                  </div>
                )}

                {member.profiles?.job_title && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Title</p>
                    <p className="text-gray-900">{member.profiles.job_title}</p>
                  </div>
                )}

                {member.profiles?.bio && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="text-gray-900">{member.profiles.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Membership Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {member.start_date && (
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold">
                      {format(new Date(member.start_date), "PPP")}
                    </p>
                  </div>
                )}
                {member.end_date && (
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold">
                      {format(new Date(member.end_date), "PPP")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {member.monthly_rate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Monthly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${member.monthly_rate}</div>
                  <p className="text-sm text-gray-500">per month</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Access Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {member.access_code && (
                  <div>
                    <p className="text-sm text-gray-500">Access Code</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {member.access_code}
                    </p>
                  </div>
                )}
                {member.rfid_card_id && (
                  <div>
                    <p className="text-sm text-gray-500">RFID Card ID</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {member.rfid_card_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Edit Member
                </Button>
                <Button className="w-full" variant="outline">
                  View Bookings
                </Button>
                <Button className="w-full" variant="outline">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
