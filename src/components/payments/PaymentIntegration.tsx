
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

interface PaymentIntegrationProps {
  bookingId?: string;
  amount: number;
  onPaymentSuccess?: () => void;
}

export const PaymentIntegration = ({ bookingId, amount, onPaymentSuccess }: PaymentIntegrationProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const { toast } = useToast();

  // Mock payment methods
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025
    },
    {
      id: '2',
      type: 'card',
      last4: '0005',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2024
    }
  ]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
      });
      
      onPaymentSuccess?.();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const AddCardForm = () => (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-number">Card Number</Label>
          <Input id="card-number" placeholder="1234 5678 9012 3456" />
        </div>
        <div>
          <Label htmlFor="card-name">Cardholder Name</Label>
          <Input id="card-name" placeholder="John Doe" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="expiry-month">Month</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {(i + 1).toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiry-year">Year</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="YYYY" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                  {new Date().getFullYear() + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" maxLength={4} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setShowAddCard(false)} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={() => setShowAddCard(false)} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment
        </CardTitle>
        <CardDescription>
          Secure payment processing for your booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <span className="font-medium">Total Amount</span>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-xl font-bold">{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label>Select Payment Method</Label>
          <div className="space-y-2">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.brand}</span>
                      <span className="text-muted-foreground">•••• {method.last4}</span>
                    </div>
                    {method.expiryMonth && method.expiryYear && (
                      <div className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </div>
                    )}
                  </div>
                </div>
                {selectedPaymentMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Card */}
        {!showAddCard ? (
          <Button
            variant="outline"
            onClick={() => setShowAddCard(true)}
            className="w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Add New Card
          </Button>
        ) : (
          <AddCardForm />
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={processing || !selectedPaymentMethod}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Pay ${amount.toFixed(2)}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
