
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "./FormField";

interface BookingSelectorsProps {
  formData: {
    resource_id: string;
    member_id: string;
  };
  onFormDataChange: (data: any) => void;
  resources?: any[];
  members?: any[];
}

export const BookingSelectors = ({ formData, onFormDataChange, resources, members }: BookingSelectorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Resource" htmlFor="resource_id">
        <Select 
          value={formData.resource_id} 
          onValueChange={(value) => onFormDataChange({ ...formData, resource_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a resource" />
          </SelectTrigger>
          <SelectContent>
            {resources?.map((resource) => (
              <SelectItem key={resource.id} value={resource.id}>
                {resource.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Member" htmlFor="member_id">
        <Select 
          value={formData.member_id} 
          onValueChange={(value) => onFormDataChange({ ...formData, member_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            {members?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.member_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
};
