
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Plus, Mail, Phone } from "lucide-react";

export const MemberList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const members = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567",
      plan: "Premium",
      status: "active",
      joinDate: "2024-01-15",
      lastAccess: "Today, 9:23 AM",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@example.com",
      phone: "+1 (555) 234-5678",
      plan: "Standard",
      status: "active",
      joinDate: "2024-02-20",
      lastAccess: "Today, 8:15 AM",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "+1 (555) 345-6789",
      plan: "Premium",
      status: "pending",
      joinDate: "2024-03-01",
      lastAccess: "Never",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "David Lee",
      email: "david.lee@example.com",
      phone: "+1 (555) 456-7890",
      plan: "Enterprise",
      status: "active",
      joinDate: "2023-12-10",
      lastAccess: "Yesterday, 6:45 PM",
      avatar: "/placeholder.svg"
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise": return "bg-purple-100 text-purple-800";
      case "Premium": return "bg-blue-100 text-blue-800";
      case "Standard": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Members</span>
            </CardTitle>
            <CardDescription>
              Manage your coworking space members
            </CardDescription>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Joined: {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <Badge className={getPlanColor(member.plan)}>
                      {member.plan}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last access: {member.lastAccess}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
