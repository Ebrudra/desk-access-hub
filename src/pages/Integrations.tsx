
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { IntegrationsHub } from "@/components/integrations/IntegrationsHub";

export default function Integrations() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <IntegrationsHub />
      </div>
    </ProtectedRoute>
  );
}
