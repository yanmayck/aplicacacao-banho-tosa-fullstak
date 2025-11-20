import * as React from "react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

type FormItemContextValue = {
  id: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const formContext = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!formContext) {
    throw new Error("useFormField should be used within <Form>");
  }

  // Additional safety check to ensure formContext has required methods
  if (!formContext.getFieldState || !formContext.formState) {
    console.error("Form context is missing required methods:", formContext);
    throw new Error("Form context is incomplete - missing getFieldState or formState");
  }
  
  const { getFieldState, formState } = formContext;
  
  // Ensure fieldContext.name exists before calling getFieldState
  if (!fieldContext.name) {
    throw new Error("Field name is required");
  }
  
  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
