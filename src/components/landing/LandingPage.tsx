import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, Calendar, Users, Zap, Shield, BarChart3, CheckCircle, Wifi, Bell, Activity, Sparkles } from "lucide-react";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { LiveUserCount } from "@/components/ui/live-user-count";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const [liveStats, setLiveStats] = useState({
    activeUsers: 47,
    bookingsToday: 23,
    spacesBooked: 12
  });

  // Mock real-time data for demo
  const { connectionStatus } = useRealtimeData('spaces', ['spaces']);
  const { unreadCount } = useRealtimeNotifications();

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        bookingsToday: prev.bookingsToday + Math.floor(Math.random() * 2),
        spacesBooked: prev.spacesBooked + Math.floor(Math.random() * 2) - 1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant synchronization across all devices with WebSocket connections and live presence tracking.",
      demo: <ConnectionStatus status={connectionStatus} className="animate-pulse" />
    },
    {
      icon: Users,
      title: "Live User Presence",
      description: "See who's online in real-time with detailed presence indicators and activity status.",
      demo: <LiveUserCount />
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Contextual notifications that adapt to user behavior and preferences.",
      demo: <Badge variant="destructive" className="animate-bounce">{unreadCount || 3} new</Badge>
    },
    {
      icon: Building2,
      title: "Smart Space Management",
      description: "AI-powered resource allocation with predictive booking suggestions.",
      demo: <Badge variant="secondary">AI Powered</Badge>
    },
    {
      icon: Calendar,
      title: "Advanced Booking System",
      description: "Flexible scheduling with conflict resolution and automatic waitlist management.",
      demo: <Badge variant="outline" className="text-green-600">Available</Badge>
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time insights with interactive dashboards and custom reporting.",
      demo: <div className="flex items-center gap-1 text-xs text-green-600">
        <Activity className="h-3 w-3" />
        Live
      </div>
    }
  ];

  const liveFeatures = [
    { 
      label: "Active Users", 
      value: liveStats.activeUsers,
      icon: Users,
      color: "text-blue-500"
    },
    { 
      label: "Bookings Today", 
      value: liveStats.bookingsToday,
      icon: Calendar,
      color: "text-green-500" 
    },
    { 
      label: "Spaces Booked", 
      value: liveStats.spacesBooked,
      icon: Building2,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold text-white">WorkspaceHub</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />
            <ConnectionStatus status={connectionStatus} />
            {user && <LiveUserCount />}
          </div>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#live-demo" className="text-gray-300 hover:text-white transition-colors">Live Demo</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <Button 
            variant="outline" 
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => window.location.href = user ? '/?tab=dashboard' : '/auth'}
          >
            {user ? 'Dashboard' : 'Sign In'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Real-time Features
            </Badge>
            <ConnectionStatus status={connectionStatus} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Real-time</span>
            <br />Coworking
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience instant synchronization, live presence tracking, and real-time notifications in the most advanced coworking management platform.
          </p>

          {/* Live Stats Demo */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            {liveFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${feature.color}`} />
                    <div className="text-2xl font-bold text-white animate-pulse">
                      {feature.value}
                    </div>
                    <div className="text-xs text-gray-400">{feature.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Free 14-day trial • No credit card required • Real-time features included
          </p>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="live-demo" className="px-6 py-20 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-green-400 animate-pulse" />
              <h2 className="text-4xl font-bold text-white">Live Demo</h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch real-time features in action. These stats update live as you browse!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Connection Status</CardTitle>
                  <Wifi className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ConnectionStatus status={connectionStatus} />
                  <p className="text-sm text-gray-400">
                    Real-time WebSocket connection with automatic reconnection
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Live Presence</CardTitle>
                  <Users className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <LiveUserCount />
                  <p className="text-sm text-gray-400">
                    See who's online and their current activity
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Smart Notifications</CardTitle>
                  <Bell className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="destructive" className="animate-pulse">
                    {unreadCount || 2} unread notifications
                  </Badge>
                  <p className="text-sm text-gray-400">
                    Contextual real-time notifications
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Real-time features that scale with you
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of instant synchronization and live collaboration in your coworking space.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {feature.demo}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Activity className="h-6 w-6 text-green-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-white">
              Ready to experience real-time coworking?
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of workspace management with live updates, instant notifications, and seamless collaboration.
          </p>
          <div className="flex justify-center items-center gap-4 mb-6">
            <ConnectionStatus status={connectionStatus} />
            <LiveUserCount />
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
            onClick={() => window.location.href = user ? '/?tab=dashboard' : '/auth'}
          >
            {user ? 'Go to Dashboard' : 'Start Your Free Trial'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">WorkspaceHub</span>
          </div>
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <ConnectionStatus status={connectionStatus} />
              <Badge variant="secondary" className="text-xs">Real-time Enabled</Badge>
            </div>
            <p className="text-gray-400">
              © 2024 WorkspaceHub. All rights reserved. Real-time features powered by Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
