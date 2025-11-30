import * as yup from "yup";
export const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

export const profileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  description: yup
    .string()
    .max(500, "Description must be less than 500 characters")
    .nullable(),
  avatar: yup
    .mixed<string | null>()
    .nullable()
});

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  description: string;
  avatar: string | null;
};
