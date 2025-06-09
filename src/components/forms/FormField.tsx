
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ label, htmlFor, children, className = "" }: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
};
