
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto py-12">
        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default Pricing;
