
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Edit, Download, CheckSquare, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusChange: (ids: string[], status: string) => void;
  onExport: (ids: string[]) => void;
  statusOptions?: { value: string; label: string }[];
}

export const BulkActions = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onExport,
  statusOptions = []
}: BulkActionsProps) => {
  const { toast } = useToast();
  const [bulkStatus, setBulkStatus] = useState("");
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartialSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isPartialSelected;
    }
  }, [isPartialSelected]);

  const handleBulkStatusChange = () => {
    if (!bulkStatus) {
      toast({ title: "Error", description: "Please select a status", variant: "destructive" });
      return;
    }
    onBulkStatusChange(selectedItems, bulkStatus);
    setBulkStatus("");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            ref={checkboxRef}
            checked={isAllSelected}
            onCheckedChange={isAllSelected ? onClearSelection : onSelectAll}
          />
          <span className="text-sm font-medium">
            {selectedItems.length > 0 ? (
              <Badge variant="default">{selectedItems.length} selected</Badge>
            ) : (
              "Select all"
            )}
          </span>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            {statusOptions.length > 0 && (
              <div className="flex items-center space-x-2">
                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkStatusChange} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Update
                </Button>
              </div>
            )}

            <Button
              onClick={() => onExport(selectedItems)}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedItems.length} items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onBulkDelete(selectedItems)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <Button variant="ghost" onClick={onClearSelection}>
          Clear selection
        </Button>
      )}
    </div>
  );
};
