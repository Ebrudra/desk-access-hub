
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, Calendar, Users, Zap, Shield, BarChart3, CheckCircle, Wifi, Bell, Activity, Sparkles, Star, Globe, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useAuth } from "@/hooks/useAuth";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const [liveStats, setLiveStats] = useState({
    activeUsers: 47,
    bookingsToday: 23,
    spacesBooked: 12,
    totalRevenue: 15420
  });

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        bookingsToday: Math.max(0, prev.bookingsToday + Math.floor(Math.random() * 2)),
        spacesBooked: Math.max(0, prev.spacesBooked + Math.floor(Math.random() * 2) - 1),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 100)
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant synchronization across all devices with WebSocket connections.",
      highlight: "Live Sync"
    },
    {
      icon: Users,
      title: "User Presence",
      description: "See who's online in real-time with detailed presence indicators.",
      highlight: "Live Users"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Contextual notifications that adapt to user behavior.",
      highlight: "AI Powered"
    },
    {
      icon: Building2,
      title: "Space Management",
      description: "AI-powered resource allocation with predictive booking suggestions.",
      highlight: "Smart AI"
    },
    {
      icon: Calendar,
      title: "Booking System",
      description: "Advanced scheduling with conflict resolution and automatic waitlists.",
      highlight: "Advanced"
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time insights with interactive dashboards and custom reporting.",
      highlight: "Real-time"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access control.",
      highlight: "Secure"
    },
    {
      icon: Globe,
      title: "Multi-language",
      description: "Support for multiple languages and international markets.",
      highlight: "Global"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "GDPR compliant with end-to-end encryption.",
      highlight: "Private"
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
    },
    { 
      label: "Revenue Today", 
      value: `$${liveStats.totalRevenue.toLocaleString()}`,
      icon: BarChart3,
      color: "text-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Community Manager",
      company: "TechHub",
      content: "The real-time features have transformed how we manage our coworking space. Everything just works seamlessly.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director", 
      company: "WorkSpace Pro",
      content: "Best investment we've made. The AI-powered booking suggestions alone have increased our efficiency by 40%.",
      rating: 5
    },
    {
      name: "Emily Foster",
      role: "Founder",
      company: "Creative Commons",
      content: "The live analytics help us make data-driven decisions in real-time. Our members love the transparency.",
      rating: 5
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
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Wifi className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
          <Button 
            variant="outline" 
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => window.location.href = user ? '/' : '/auth'}
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
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <Activity className="h-3 w-3 mr-1" />
              99.9% Uptime
            </Badge>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {liveFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${feature.color}`} />
                    <div className="text-lg md:text-2xl font-bold text-white animate-pulse">
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

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Enterprise-grade features that scale with you
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage a modern coworking space, with real-time collaboration at its core.
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
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {feature.highlight}
                      </Badge>
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

      {/* Live Demo Section */}
      <section id="demo" className="px-6 py-20 bg-black/20">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                        Live
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{feature.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white animate-pulse">
                      {feature.value}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Updates every few seconds
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by industry leaders
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers say about WorkspaceHub
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-300 text-base">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
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
            Join thousands of workspace managers who trust WorkspaceHub for their daily operations.
          </p>
          <div className="flex justify-center items-center gap-4 mb-6">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Free 14-day trial
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise ready
            </Badge>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
            onClick={() => window.location.href = user ? '/' : '/auth'}
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
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Enabled
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Enterprise Grade
              </Badge>
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
