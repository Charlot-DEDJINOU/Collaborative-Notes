import { useState, useCallback } from 'react';
import type { ValidationError, UseFormOptions, UseFormReturn } from '../types/form';

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(options.initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur modifie la valeur
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!options.validationSchema) return true;

    const validationErrors = options.validationSchema(values);
    const errorMap: Record<keyof T, string> = {} as Record<keyof T, string>;

    validationErrors.forEach((error: ValidationError) => {
      errorMap[error.field as keyof T] = error.message;
    });

    setErrors(errorMap);
    return validationErrors.length === 0;
  }, [values, options.validationSchema]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await options.onSubmit(values);
    } catch (error) {
      // Les erreurs spécifiques aux champs peuvent être gérées par le composant parent
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, isSubmitting, validateForm, options.onSubmit]);

  const resetForm = useCallback(() => {
    setValues(options.initialValues);
    setErrors({} as Record<keyof T, string>);
    setIsSubmitting(false);
  }, [options.initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
    resetForm,
  };
}