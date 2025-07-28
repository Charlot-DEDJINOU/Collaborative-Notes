export interface ValidationError {
  field: string;
  message: string;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => ValidationError[];
  onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}