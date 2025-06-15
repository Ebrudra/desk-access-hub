
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, Calendar, Users, Zap, Shield, BarChart3, CheckCircle, Wifi, Bell, Activity, Sparkles, Star, Globe, Lock, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      title: "Real-time Booking Management",
      description: "Instantly manage all your coworking space bookings with live updates across all devices. See changes happen in real-time as members book, cancel, or modify their reservations.",
      highlight: "Live Sync"
    },
    {
      icon: Users,
      title: "Smart Member Management",
      description: "Comprehensive member profiles with access control, billing history, and behavioral analytics. Track member preferences and optimize space usage patterns.",
      highlight: "AI Powered"
    },
    {
      icon: Bell,
      title: "Intelligent Notifications",
      description: "Smart notification system that adapts to user behavior and preferences. Automated reminders, booking confirmations, and proactive space availability alerts.",
      highlight: "Smart AI"
    },
    {
      icon: Building2,
      title: "Advanced Space Optimization",
      description: "AI-powered resource allocation with predictive analytics. Optimize space utilization, reduce conflicts, and maximize revenue with intelligent booking suggestions.",
      highlight: "Smart AI"
    },
    {
      icon: Calendar,
      title: "Unified Calendar System",
      description: "Seamless integration with Google Calendar, Outlook, and other calendar platforms. Automated conflict resolution and intelligent scheduling recommendations.",
      highlight: "Integrated"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics Dashboard",
      description: "Comprehensive analytics with live data visualization. Track occupancy rates, revenue metrics, member engagement, and space performance in real-time.",
      highlight: "Live Data"
    },
    {
      icon: Shield,
      title: "Enterprise Security & Access Control",
      description: "Bank-grade security with role-based access control, QR code generation, RFID integration, and comprehensive audit trails for all activities.",
      highlight: "Secure"
    },
    {
      icon: Globe,
      title: "Multi-location Management",
      description: "Manage multiple coworking locations from a single dashboard. Centralized reporting, cross-location member access, and unified billing systems.",
      highlight: "Scalable"
    },
    {
      icon: Lock,
      title: "GDPR Compliant Privacy",
      description: "Full GDPR compliance with end-to-end encryption, data anonymization, and comprehensive privacy controls. Your data stays secure and private.",
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
      company: "TechHub Berlin",
      content: "WorkspaceHub transformed our operations completely. The real-time features and AI-powered insights helped us increase occupancy by 40% while reducing operational overhead.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c1?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director", 
      company: "Innovation Space NYC",
      content: "The smart booking system and automated workflows saved us 20+ hours per week. The analytics dashboard gives us insights we never had before.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Foster",
      role: "Founder",
      company: "Creative Commons London",
      content: "Best investment for our coworking space. The member portal and real-time notifications improved our member satisfaction scores significantly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">WorkspaceHub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <LanguageToggle />
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <Button 
                variant="outline" 
                className="text-white border-white/20 hover:bg-white/10"
                asChild
              >
                <Link to={user ? '/dashboard' : '/auth'}>
                  {user ? 'Dashboard' : 'Sign In'}
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/10">
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <Button asChild className="w-full">
                    <Link to={user ? '/dashboard' : '/auth'}>
                      {user ? 'Dashboard' : 'Get Started'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Platform
            </Badge>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <Activity className="h-3 w-3 mr-1" />
              Real-time Everything
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Complete
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Coworking</span>
            <br />Management Platform
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your coworking space with AI-powered booking management, real-time analytics, 
            smart member engagement, and automated operations. Everything you need in one powerful platform.
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
              asChild
            >
              <Link to="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Free 14-day trial • No credit card required • Full feature access
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to run a modern coworking space
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From intelligent booking management to advanced analytics, our platform handles every aspect 
              of your coworking operations with AI-powered automation and real-time insights.
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
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by coworking spaces worldwide
            </h2>
            <p className="text-xl text-gray-300">
              See how WorkspaceHub transforms coworking operations
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
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
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
              Ready to transform your coworking space?
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of coworking spaces worldwide who trust WorkspaceHub for their daily operations.
            Start your free trial today and see the difference AI-powered management makes.
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
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-powered
            </Badge>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
            asChild
          >
            <Link to={user ? '/dashboard' : '/auth'}>
              {user ? 'Go to Dashboard' : 'Start Your Free Trial'} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">WorkspaceHub</span>
          </div>
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Platform
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Enterprise Security
              </Badge>
            </div>
            <p className="text-gray-400">
              © 2024 WorkspaceHub. All rights reserved. Built with ❤️ for the coworking community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
