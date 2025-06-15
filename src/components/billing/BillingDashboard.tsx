import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, DollarSign, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const BillingDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const invoice = invoices?.find(inv => inv.id === invoiceId);
      if (!invoice) throw new Error("Invoice not found");

      // Handle the metadata properly
      let downloadUrl = '';
      if (typeof invoice.metadata === 'object' && invoice.metadata !== null) {
        const metadata = invoice.metadata as { downloadUrl?: string };
        downloadUrl = metadata.downloadUrl || '';
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        // Generate a mock PDF download
        const blob = new Blob(['Mock Invoice PDF'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    onSuccess: () => {
      toast({
        title: "Invoice Downloaded",
        description: "Invoice has been downloaded successfully."
      });
    }
  });
};
