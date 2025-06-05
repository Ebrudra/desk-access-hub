
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { KeyRound, Smartphone, Shield, Clock } from "lucide-react";

export const AccessControl = () => {
  const [accessRequests, setAccessRequests] = useState([
    {
      id: 1,
      member: "Emma Wilson",
      requestType: "New Member Access",
      spaces: ["Main Floor", "Meeting Rooms"],
      requestedAt: "2024-03-01 10:30 AM",
      status: "pending"
    },
    {
      id: 2,
      member: "John Doe",
      requestType: "24/7 Access",
      spaces: ["Main Floor", "Meeting Rooms", "Private Offices"],
      requestedAt: "2024-03-01 09:15 AM",
      status: "pending"
    }
  ]);

  const activeAccess = [
    {
      id: 1,
      member: "Sarah Johnson",
      accessLevel: "Full Access",
      lastEntry: "Today, 9:23 AM",
      virtualKey: true,
      spaces: ["Main Floor", "Meeting Rooms", "Private Offices"]
    },
    {
      id: 2,
      member: "Mike Chen",
      accessLevel: "Standard",
      lastEntry: "Today, 8:15 AM",
      virtualKey: true,
      spaces: ["Main Floor", "Meeting Rooms"]
    },
    {
      id: 3,
      member: "David Lee",
      accessLevel: "Premium",
      lastEntry: "Yesterday, 6:45 PM",
      virtualKey: true,
      spaces: ["Main Floor", "Meeting Rooms", "Private Offices", "24/7 Access"]
    }
  ];

  const handleApproveAccess = (requestId: number) => {
    setAccessRequests(prev => 
      prev.filter(request => request.id !== requestId)
    );
    // In a real app, this would make an API call
    console.log(`Approved access request ${requestId}`);
  };

  const handleDenyAccess = (requestId: number) => {
    setAccessRequests(prev => 
      prev.filter(request => request.id !== requestId)
    );
    console.log(`Denied access request ${requestId}`);
  };

  const toggleVirtualKey = (memberId: number) => {
    console.log(`Toggled virtual key for member ${memberId}`);
  };

  return (
    <div className="space-y-6">
      {/* Access Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <KeyRound className="h-5 w-5" />
            <span>Access Requests</span>
          </CardTitle>
          <CardDescription>
            Pending access requests from members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending access requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {request.member}
                    </div>
                    <div className="text-sm text-gray-600">
                      {request.requestType}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Spaces: {request.spaces.join(", ")}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center space-x-1 mt-2">
                      <Clock className="h-3 w-3" />
                      <span>Requested: {request.requestedAt}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDenyAccess(request.id)}
                    >
                      Deny
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveAccess(request.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Active Virtual Keys</span>
          </CardTitle>
          <CardDescription>
            Manage member access and virtual keycards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAccess.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {access.member}
                  </div>
                  <div className="text-sm text-gray-600">
                    {access.accessLevel} • Last entry: {access.lastEntry}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Access to: {access.spaces.join(", ")}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Virtual Key</span>
                    <Switch
                      checked={access.virtualKey}
                      onCheckedChange={() => toggleVirtualKey(access.id)}
                    />
                  </div>
                  <Badge variant={access.virtualKey ? "default" : "secondary"}>
                    {access.virtualKey ? "Active" : "Disabled"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control System Status</CardTitle>
          <CardDescription>
            Monitor your smart access control integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-green-800">System Online</div>
                <div className="text-sm text-green-600">All systems operational</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium text-blue-800">Cloud Connected</div>
                <div className="text-sm text-blue-600">Real-time sync active</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <div className="font-medium text-purple-800">Security Active</div>
                <div className="text-sm text-purple-600">All doors secured</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
