
import { CrudManagement } from "@/components/crud/CrudManagement";

export function MobileCrudTab({ subtab }: { subtab: string }) {
  // Pass subtab to CrudManagement for context-aware rendering
  return (
    <div className="p-0 pt-4">
      <CrudManagement mobile subtab={subtab} />
    </div>
  );
}
