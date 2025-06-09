
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./FormField";

interface BookingSpecialRequestsProps {
  formData: {
    special_requests: string;
  };
  onFormDataChange: (data: any) => void;
}

export const BookingSpecialRequests = ({ formData, onFormDataChange }: BookingSpecialRequestsProps) => {
  return (
    <FormField label="Special Requests" htmlFor="special_requests">
      <Textarea
        id="special_requests"
        value={formData.special_requests}
        onChange={(e) => onFormDataChange({ ...formData, special_requests: e.target.value })}
        rows={2}
      />
    </FormField>
  );
};
