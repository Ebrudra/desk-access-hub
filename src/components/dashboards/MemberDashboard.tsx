
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Star,
  Activity,
  Lightbulb,
  BarChart3,
  CreditCard,
  Bell
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedProfileDashboard } from "@/components/member/EnhancedProfileDashboard";
import { SmartBookingRecommendations } from "@/components/booking/SmartBookingRecommendations";

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('member-tab') || 'overview';

  const { data: memberStats } = useQuery({
    queryKey: ["member-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [bookingsRes, memberRes, paymentsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, resources(*)")
          .eq("member_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("members")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("payments")
          .select("*")
          .eq("member_id", user.id)
      ]);

      const upcomingBookings = bookingsRes.data?.filter(b => 
        new Date(b.start_time) > new Date()
      ) || [];

      const thisMonthBookings = bookingsRes.data?.filter(b => {
        const bookingDate = new Date(b.created_at);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear();
      }) || [];

      return {
        recentBookings: bookingsRes.data || [],
        upcomingBookings,
        thisMonthBookings: thisMonthBookings.length,
        membershipTier: memberRes.data?.membership_tier || 'basic',
        totalSpent: paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
        favoriteResource: 'Hot Desk 3' // Mock data
      };
    },
    enabled: !!user
  });

  const setMemberTab = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('member-tab', tab);
    setSearchParams(newSearchParams);
  };

  const quickStats = [
    {
      title: "This Month",
      value: memberStats?.thisMonthBookings || 0,
      icon: Calendar,
      color: "text-blue-600",
      label: "bookings"
    },
    {
      title: "Upcoming",
      value: memberStats?.upcomingBookings?.length || 0,
      icon: Activity,
      color: "text-green-600",
      label: "sessions"
    },
    {
      title: "Membership",
      value: memberStats?.membershipTier || 'Basic',
      icon: Star,
      color: "text-purple-600",
      label: "tier"
    },
    {
      title: "Total Spent",
      value: `$${memberStats?.totalSpent?.toFixed(2) || '0.00'}`,
      icon: CreditCard,
      color: "text-orange-600",
      label: "lifetime"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setMemberTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Smart Recommendations */}
          <SmartBookingRecommendations />

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberStats?.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{booking.title || booking.resources?.name || 'Booking'}</h4>
                        <p className="text-xs text-gray-600">
                          {new Date(booking.start_time).toLocaleDateString()} at {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {(!memberStats?.recentBookings || memberStats.recentBookings.length === 0) && (
                    <p className="text-center text-gray-500 py-4">No recent bookings</p>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Space
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Make a Booking
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Billing
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Member Tip</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Book your favorite spots in advance! Popular times fill up quickly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <EnhancedProfileDashboard />
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberStats?.recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{booking.title || booking.resources?.name || 'Booking'}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.start_time).toLocaleDateString()} • 
                          {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        {booking.description && (
                          <p className="text-sm text-gray-500 mt-1">{booking.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Usage Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Your Patterns</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Most Active Day</span>
                      <span className="font-medium">Wednesday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Preferred Time</span>
                      <span className="font-medium">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Favorite Resource</span>
                      <span className="font-medium">{memberStats?.favoriteResource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Session Length</span>
                      <span className="font-medium">3.5 hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Book earlier</p>
                      <p className="text-xs text-blue-600">Your preferred times are popular. Book 2-3 days ahead.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Try afternoons</p>
                      <p className="text-xs text-green-600">Fewer crowds after 3 PM. Great for focused work.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
