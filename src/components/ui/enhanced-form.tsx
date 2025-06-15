
import * as React from "react";
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface BaseFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
}

interface PasswordFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
}

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  description?: string;
}

interface RadioFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[];
}

interface FileFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  accept?: string;
  multiple?: boolean;
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  className,
}: TextFieldProps<T>) {
  const { register, formState: { errors } } = form;
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={error ? "border-destructive" : ""}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}

export function PasswordField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  className,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, formState: { errors } } = form;
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className={cn("pr-10", error ? "border-destructive" : "")}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}

export function TextareaField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  rows = 3,
  className,
}: TextareaFieldProps<T>) {
  const { register, formState: { errors } } = form;
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className={error ? "border-destructive" : ""}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  options,
  placeholder,
  className,
}: SelectFieldProps<T>) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(name);
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={(value) => setValue(name, value as any)}>
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}

export function CheckboxField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  className,
}: CheckboxFieldProps<T>) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(name);
  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={value}
          onCheckedChange={(checked) => setValue(name, checked as any)}
        />
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground ml-6">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive ml-6">{error.message as string}</p>
      )}
    </div>
  );
}

export function RadioField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  options,
  className,
}: RadioFieldProps<T>) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(name);
  const error = errors[name];

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <RadioGroup value={value} onValueChange={(value) => setValue(name, value as any)}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label htmlFor={`${name}-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}
