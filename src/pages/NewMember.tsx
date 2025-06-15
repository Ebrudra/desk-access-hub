
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Mail, Phone } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { MemberForm } from "@/components/crud/MemberForm";

const quickPresets = [
  {
    label: "Invite via Email",
    icon: <Mail className="mr-2 h-4 w-4" />,
    prefill: { membership_status: "pending" }
  },
  {
    label: "Add via Phone",
    icon: <Phone className="mr-2 h-4 w-4" />,
    prefill: { membership_status: "active" }
  },
  {
    label: "Bulk Import",
    icon: <UserPlus className="mr-2 h-4 w-4" />,
    prefill: { membership_tier: "basic" }
  },
];

const NewMember = () => {
  const navigate = useNavigate();
  const [formPrefill, setFormPrefill] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard?tab=crud&subtab=members")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Member
          </h1>
          <p className="text-gray-600">
            Register a new member to your coworking space
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Member Details
                </CardTitle>
                <CardDescription>
                  Fill in the details for the new member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberForm onSuccess={() => navigate("/dashboard?tab=crud&subtab=members")} prefill={formPrefill} />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickPresets.map((preset, idx) => (
                    <Button
                      key={idx}
                      className="w-full"
                      variant="outline"
                      onClick={() => setFormPrefill(preset.prefill)}
                    >
                      {preset.icon}
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMember;
