
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Calendar, DollarSign, Clock, Target } from "lucide-react";

export const AdvancedMetrics = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ["advanced-analytics"],
    queryFn: async () => {
      const [bookingsRes, membersRes, paymentsRes] = await Promise.all([
        supabase.from("bookings").select("*"),
        supabase.from("members").select("*"),
        supabase.from("payments").select("*")
      ]);

      // Calculate trends and metrics
      const bookings = bookingsRes.data || [];
      const members = membersRes.data || [];
      const payments = paymentsRes.data || [];

      // Monthly booking trends
      const monthlyBookings = bookings.reduce((acc, booking) => {
        const month = new Date(booking.created_at).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Membership tier distribution
      const tierDistribution = members.reduce((acc, member) => {
        const tier = member.membership_tier || 'basic';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {});

      // Revenue trends
      const monthlyRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((acc, payment) => {
          const month = new Date(payment.created_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + Number(payment.amount);
          return acc;
        }, {});

      return {
        monthlyBookings: Object.entries(monthlyBookings).map(([month, count]) => ({ month, count })),
        tierDistribution: Object.entries(tierDistribution).map(([tier, count]) => ({ tier, count })),
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
        totalRevenue: payments.reduce((sum, p) => sum + (p.status === 'completed' ? Number(p.amount) : 0), 0),
        avgBookingValue: bookings.length > 0 ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / bookings.length : 0,
        memberRetention: ((members.filter(m => m.membership_status === 'active').length / Math.max(members.length, 1)) * 100).toFixed(1)
      };
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${analyticsData?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: "text-green-600",
      trend: "+12.5%"
    },
    {
      title: "Avg Booking Value",
      value: `$${analyticsData?.avgBookingValue?.toFixed(2) || '0'}`,
      icon: Target,
      color: "text-blue-600",
      trend: "+8.3%"
    },
    {
      title: "Member Retention",
      value: `${analyticsData?.memberRetention || '0'}%`,
      icon: Users,
      color: "text-purple-600",
      trend: "+5.2%"
    },
    {
      title: "Utilization Rate",
      value: "78%",
      icon: Clock,
      color: "text-orange-600",
      trend: "+15.1%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{kpi.trend}</span>
                  </div>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.monthlyBookings || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.tierDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tier, count, percent }) => `${tier}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(analyticsData?.tierDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Space Utilization</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Satisfaction</span>
                <span className="font-semibold">4.7/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Booking Conversion</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
