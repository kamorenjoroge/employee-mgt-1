"use client";

import React, { useState, useEffect } from "react";
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
  initialData?: Record<string, string>;
  submitLabel?: string;
  onCancel?: () => void;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = "Submit",
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // populate initial data if provided
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = initialData[field.name] || "";
    });
    setFormData(initial);
  }, [fields, initialData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simple validation
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label 
            htmlFor={field.name}
            className="text-sm font-medium text-foreground"
          >
            {field.label}
            {field.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={isSubmitting}
            className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-100px"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-100px"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};