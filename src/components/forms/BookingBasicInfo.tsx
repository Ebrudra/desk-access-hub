
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./FormField";

interface BookingBasicInfoProps {
  formData: {
    title: string;
    description: string;
    attendees: number;
  };
  onFormDataChange: (data: any) => void;
}

export const BookingBasicInfo = ({ formData, onFormDataChange }: BookingBasicInfoProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title" htmlFor="title">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
            required
          />
        </FormField>
        
        <FormField label="Attendees" htmlFor="attendees">
          <Input
            id="attendees"
            type="number"
            min="1"
            value={formData.attendees}
            onChange={(e) => onFormDataChange({ ...formData, attendees: parseInt(e.target.value) })}
            required
          />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          rows={3}
        />
      </FormField>
    </>
  );
};
