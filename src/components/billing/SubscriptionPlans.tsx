
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals getting started",
    price: 9,
    priceId: "price_basic_monthly", // Replace with actual Stripe price ID
    features: [
      "Up to 5 bookings per month",
      "Basic calendar integration",
      "Email notifications",
      "Standard support"
    ],
    icon: Star,
    popular: false,
  },
  {
    name: "Premium",
    description: "Best for growing teams and businesses",
    price: 19,
    priceId: "price_premium_monthly", // Replace with actual Stripe price ID
    features: [
      "Unlimited bookings",
      "Advanced calendar sync",
      "SMS notifications",
      "Priority support",
      "Analytics dashboard",
      "Custom branding"
    ],
    icon: Crown,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: 49,
    priceId: "price_enterprise_monthly", // Replace with actual Stripe price ID
    features: [
      "Everything in Premium",
      "Advanced analytics",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SSO integration",
      "White-label solution"
    ],
    icon: Zap,
    popular: false,
  },
];

export const SubscriptionPlans = () => {
  const { subscription, createCheckout, loading } = useSubscription();

  const handleSubscribe = (priceId: string) => {
    createCheckout(priceId, "subscription");
  };

  const isCurrentPlan = (planName: string) => {
    return subscription.subscription_tier?.toLowerCase() === planName.toLowerCase() && subscription.subscribed;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the perfect plan for your workspace management needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentPlan(plan.name);
          
          return (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''} ${isCurrent ? 'border-green-500 bg-green-50/50' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              {isCurrent && (
                <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  Current Plan
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className={`h-12 w-12 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading || isCurrent}
                >
                  {loading ? "Loading..." : isCurrent ? "Current Plan" : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
