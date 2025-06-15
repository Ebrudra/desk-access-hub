import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Key, Info } from "lucide-react";

export const TestUsersSetup = () => {
  const testUsers = [
    {
      email: "admin.user@getnada.com",
      password: "AdminPass123!",
      role: "admin",
      name: "Admin User"
    },
    {
      email: "manager.user@getnada.com", 
      password: "ManagerPass123!",
      role: "manager",
      name: "Manager User"
    },
    {
      email: "member.user@getnada.com",
      password: "MemberPass123!",
      role: "member", 
      name: "Member User"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Test Users Setup</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              To test different user roles, manually sign up with these test accounts through the sign-up form, 
              then use the User Role Manager to assign the appropriate roles.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Test User Credentials
              </h3>
              <div className="space-y-3">
                {testUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">Email: {user.email}</p>
                      <p className="text-sm text-gray-600">Password: {user.password}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Sign up with each test email through your app's sign-up form</li>
                <li>After signing up, go to the User Role Manager</li>
                <li>Assign the appropriate role to each user</li>
                <li>Test different role-based features by signing in with different accounts</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
