
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, Calendar, Users, Zap, Shield, BarChart3, CheckCircle } from "lucide-react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: Building2,
      title: "Smart Space Management",
      description: "Manage multiple coworking locations with intelligent resource allocation and real-time availability."
    },
    {
      icon: Calendar,
      title: "Advanced Booking System",
      description: "Flexible booking with recurring reservations, waitlists, and automatic conflict resolution."
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Complete member lifecycle management with tiered memberships and access control."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant notifications for bookings, payments, and space availability across all devices."
    },
    {
      icon: Shield,
      title: "Digital Access Control",
      description: "RFID integration, mobile app access, and comprehensive security logging."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Detailed utilization reports, revenue tracking, and member behavior analytics."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small coworking spaces",
      features: [
        "Up to 50 members",
        "Basic booking system",
        "Email support",
        "Mobile app access",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "For growing coworking businesses",
      features: [
        "Up to 200 members",
        "Advanced booking & events",
        "Priority support",
        "Access control integration",
        "Advanced analytics",
        "Payment processing",
        "Multi-location support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large coworking networks",
      features: [
        "Unlimited members",
        "White-label solution",
        "24/7 phone support",
        "Custom integrations",
        "Advanced security",
        "Dedicated account manager",
        "Custom reporting"
      ],
      popular: false
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
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          <Button 
            variant="outline" 
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => window.location.href = '/auth'}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
            🚀 Now with AI-powered space optimization
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Coworking</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline operations, maximize revenue, and create exceptional member experiences with our all-in-one coworking space management platform.
          </p>
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
            Free 14-day trial • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to run a successful coworking space
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From member onboarding to revenue optimization, we've got every aspect of your business covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
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

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that scales with your coworking business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400 ml-1">{tier.period}</span>
                  </div>
                  <CardDescription className="text-gray-300">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    {tier.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your coworking space?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of coworking spaces already using WorkspaceHub to streamline operations and delight members.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3">
            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">WorkspaceHub</span>
          </div>
          <p className="text-gray-400">
            © 2024 WorkspaceHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
