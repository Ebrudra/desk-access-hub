
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  Target,
  CheckCircle,
  Gift
} from "lucide-react";

export const EnhancedProfileDashboard = () => {
  const { user } = useAuth();

  const { data: profileData } = useQuery({
    queryKey: ["enhanced-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [profileRes, memberRes, bookingsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("members").select("*").eq("user_id", user.id).single(),
        supabase.from("bookings").select("*").eq("member_id", user.id),
        supabase.from("payments").select("*").eq("member_id", user.id)
      ]);

      const bookings = bookingsRes.data || [];
      const payments = paymentsRes.data || [];
      
      // Calculate metrics
      const totalBookings = bookings.length;
      const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const avgBookingDuration = bookings.length > 0 
        ? bookings.reduce((sum, b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0) / bookings.length
        : 0;

      // Member since calculation
      const memberSince = memberRes.data?.created_at 
        ? new Date(memberRes.data.created_at)
        : new Date();
      const monthsActive = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30));

      // Loyalty score calculation
      const loyaltyScore = Math.min(100, (totalBookings * 5) + (monthsActive * 10));

      // Achievements
      const achievements = [];
      if (totalBookings >= 10) achievements.push({ name: "Regular Booker", icon: Calendar, earned: true });
      if (totalBookings >= 50) achievements.push({ name: "Power User", icon: Star, earned: true });
      if (monthsActive >= 6) achievements.push({ name: "Loyal Member", icon: Award, earned: true });
      if (loyaltyScore >= 75) achievements.push({ name: "Elite Status", icon: Target, earned: true });

      return {
        profile: profileRes.data,
        member: memberRes.data,
        totalBookings,
        totalSpent,
        avgBookingDuration,
        monthsActive,
        loyaltyScore,
        achievements,
        memberSince
      };
    },
    enabled: !!user
  });

  const upcomingMilestones = [
    { name: "50 Bookings", current: profileData?.totalBookings || 0, target: 50, reward: "Free day pass" },
    { name: "1 Year Member", current: profileData?.monthsActive || 0, target: 12, reward: "VIP status" },
    { name: "Elite Loyalty", current: profileData?.loyaltyScore || 0, target: 100, reward: "Premium perks" }
  ];

  if (!profileData) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Member Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profileData.profile?.first_name?.charAt(0) || 'U'}
                  {profileData.profile?.last_name?.charAt(0) || 'S'}
                </span>
              </div>
              <h3 className="font-semibold">
                {profileData.profile?.first_name} {profileData.profile?.last_name}
              </h3>
              <p className="text-sm text-gray-600">{profileData.member?.membership_tier || 'Basic'} Member</p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Member since {profileData.memberSince.toLocaleDateString()}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="font-semibold">{profileData.totalBookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="font-semibold">${profileData.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Session</span>
                <span className="font-semibold">{profileData.avgBookingDuration.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Months</span>
                <span className="font-semibold">{profileData.monthsActive}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeDasharray={`${(profileData.loyaltyScore / 100) * 201.06} 201.06`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{profileData.loyaltyScore}</span>
                </div>
              </div>
              <h4 className="font-semibold">Loyalty Score</h4>
              <p className="text-sm text-gray-600">out of 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profileData.achievements.map((achievement, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <achievement.icon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium text-sm">{achievement.name}</h4>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Earned
                </Badge>
              </div>
            ))}
            
            {/* Placeholder for unearned achievements */}
            {profileData.achievements.length < 4 && (
              <div className="p-4 border border-dashed rounded-lg text-center opacity-50">
                <Gift className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-sm text-gray-500">More to unlock</h4>
                <p className="text-xs text-gray-400 mt-1">Keep using the space!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Towards Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Upcoming Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMilestones.map((milestone, index) => {
              const progress = Math.min(100, (milestone.current / milestone.target) * 100);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-sm">{milestone.name}</h4>
                      <p className="text-xs text-gray-600">Reward: {milestone.reward}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {milestone.current} / {milestone.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Book a Space
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Usage Analytics
            </Button>
            <Button className="w-full" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Leave Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
