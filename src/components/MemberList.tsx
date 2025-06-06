
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMembers } from "@/hooks/useMembers";
import { Search, UserPlus, Mail, Building } from "lucide-react";

export const MemberList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: members, isLoading, error } = useMembers();

  const filteredMembers = members?.filter(member => {
    const fullName = `${member.profiles?.first_name || ""} ${member.profiles?.last_name || ""}`.toLowerCase();
    const company = member.profiles?.company?.toLowerCase() || "";
    const memberId = member.member_id.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || company.includes(search) || memberId.includes(search);
  }) || [];

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Loading member data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Error loading member data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage your coworking space members ({filteredMembers.length} total)
            </CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow 
                  key={member.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profiles?.avatar_url} />
                        <AvatarFallback>
                          {member.profiles?.first_name?.charAt(0) || "M"}
                          {member.profiles?.last_name?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {member.member_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.membership_status || "pending")}>
                      {member.membership_status || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(member.membership_tier || "basic")}>
                      {member.membership_tier || "basic"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {member.profiles?.company && (
                        <>
                          <Building className="mr-1 h-3 w-3 text-gray-400" />
                          {member.profiles.company}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.monthly_rate ? `$${member.monthly_rate}` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add email functionality here
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
