
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Zap, Calendar, Users } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const occupancyData = [
  { time: '8:00', meeting_rooms: 45, coworking: 30, phone_booths: 80 },
  { time: '10:00', meeting_rooms: 75, coworking: 65, phone_booths: 90 },
  { time: '12:00', meeting_rooms: 85, coworking: 40, phone_booths: 70 },
  { time: '14:00', meeting_rooms: 90, coworking: 80, phone_booths: 85 },
  { time: '16:00', meeting_rooms: 70, coworking: 75, phone_booths: 75 },
  { time: '18:00', meeting_rooms: 40, coworking: 55, phone_booths: 60 }
];

const revenueData = [
  { month: 'Jan', revenue: 12500, bookings: 245, forecast: 13000 },
  { month: 'Feb', revenue: 15200, bookings: 298, forecast: 15800 },
  { month: 'Mar', revenue: 18900, bookings: 356, forecast: 19200 },
  { month: 'Apr', revenue: 22100, bookings: 401, forecast: 22800 },
  { month: 'May', revenue: 25300, bookings: 445, forecast: 26100 },
  { month: 'Jun', revenue: 28700, bookings: 489, forecast: 29200 }
];

const spaceUtilizationData = [
  { name: 'Meeting Rooms', value: 85, color: '#8884d8' },
  { name: 'Coworking', value: 72, color: '#82ca9d' },
  { name: 'Phone Booths', value: 94, color: '#ffc658' },
  { name: 'Event Spaces', value: 45, color: '#ff7c7c' }
];

const performanceData = [
  { metric: 'Occupancy Rate', value: 78, target: 85 },
  { metric: 'Revenue Growth', value: 145, target: 120 },
  { metric: 'Customer Satisfaction', value: 92, target: 90 },
  { metric: 'Booking Efficiency', value: 88, target: 85 },
  { metric: 'Space Utilization', value: 74, target: 80 },
  { metric: 'Retention Rate', value: 96, target: 95 }
];

export const AdvancedAnalytics = () => {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+{revenueGrowth.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Occupancy</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Target: 85%</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peak Hours</p>
                <p className="text-2xl font-bold">2-4 PM</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">90% utilized</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold">8.7/10</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-500">Excellent</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Forecast</CardTitle>
            <CardDescription>
              Monthly revenue with AI-powered forecasting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value}`, name === 'revenue' ? 'Actual' : 'Forecast']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Occupancy Rates</CardTitle>
            <CardDescription>
              Space utilization throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                <Line type="monotone" dataKey="meeting_rooms" stroke="#8884d8" name="Meeting Rooms" />
                <Line type="monotone" dataKey="coworking" stroke="#82ca9d" name="Coworking" />
                <Line type="monotone" dataKey="phone_booths" stroke="#ffc658" name="Phone Booths" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Radar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>
              Key metrics vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 150]} />
                <Radar name="Actual" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Space Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Space Utilization</CardTitle>
            <CardDescription>
              Current utilization by space type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spaceUtilizationData.map((space, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{space.name}</span>
                    <span className="text-sm text-muted-foreground">{space.value}%</span>
                  </div>
                  <Progress value={space.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
          <CardDescription>
            Data-driven suggestions for optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Opportunities
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Peak Hour Optimization:</strong> Consider dynamic pricing during 2-4 PM to maximize revenue.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Event Space Potential:</strong> Event spaces are underutilized. Marketing push recommended.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                Areas for Improvement
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Morning Utilization:</strong> Low occupancy before 10 AM. Consider flexible pricing.
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Weekend Usage:</strong> 30% capacity on weekends. Explore weekend packages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
