
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface BookingDateTimeProps {
  formData: {
    start_time: string;
    end_time: string;
  };
  onFormDataChange: (data: any) => void;
}

export const BookingDateTime = ({ formData, onFormDataChange }: BookingDateTimeProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Start Time" htmlFor="start_time">
        <Input
          id="start_time"
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => onFormDataChange({ ...formData, start_time: e.target.value })}
          required
        />
      </FormField>
      
      <FormField label="End Time" htmlFor="end_time">
        <Input
          id="end_time"
          type="datetime-local"
          value={formData.end_time}
          onChange={(e) => onFormDataChange({ ...formData, end_time: e.target.value })}
          required
        />
      </FormField>
    </div>
  );
};
