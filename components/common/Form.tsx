"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}

interface FormProps {
  fields: Field[];
  onSubmit: (data: Record<string, string>) => void;
  initialData?: Partial<Record<string, string | number>>;
  submitLabel?: string;
}

export function Form({
  fields,
  onSubmit,
  initialData,
  submitLabel = "Submit",
}: FormProps) {
  // ✅ single source of truth — no effect needed
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    fields.forEach((field) => {
      data[field.name] = initialData?.[field.name]?.toString() ?? "";
    });
    return data;
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder || field.label}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
