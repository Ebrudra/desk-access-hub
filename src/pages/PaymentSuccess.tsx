
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSubscription } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Refresh subscription status after successful payment
      setTimeout(() => {
        checkSubscription();
      }, 2000);

      toast({
        title: "Payment Successful!",
        description: "Thank you for your purchase. Your subscription has been activated.",
      });
    }
  }, [sessionId, checkSubscription, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully. Welcome to your new subscription!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              Your subscription is now active. You should receive a confirmation email shortly.
            </p>
          </div>
          {sessionId && (
            <p className="text-xs text-muted-foreground">
              Transaction ID: {sessionId.slice(-8)}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={() => navigate('/')} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate('/billing')} variant="outline" className="flex-1">
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
