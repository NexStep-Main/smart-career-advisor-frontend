import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    educationLevel: z.enum(["class10", "class12", "graduation"], {
      errorMap: () => ({ message: "Select your education level" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileFormSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  educationLevel: z.enum(["class10", "class12", "graduation"], {
    errorMap: () => ({ message: "Select your education level" }),
  }),
  stream: z.enum(["science", "commerce", "arts", "engineering"], {
    errorMap: () => ({ message: "Select your stream" }),
  }),
});

// Comma-separated text input → trimmed, non-empty string array. Keeps the
// admin forms to plain text inputs instead of building a tag-input widget.
const csvRequired = (message) =>
  z
    .string()
    .trim()
    .min(1, message)
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().min(1)).min(1, message));

const csvOptional = () =>
  z
    .string()
    .trim()
    .optional()
    .default("")
    .transform((v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    );

export const careerFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  domain: z.string().trim().min(1, "Domain is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  educationLevel: z
    .array(z.enum(["class10", "class12", "graduation"]))
    .min(1, "Select at least one education level"),
  streams: csvRequired("Enter at least one stream, separated by commas"),
  averageSalary: z
    .object({
      min: z.coerce.number({ message: "Enter a number" }).nonnegative("Must be 0 or more"),
      max: z.coerce.number({ message: "Enter a number" }).nonnegative("Must be 0 or more"),
      currency: z.string().trim().min(1).default("INR"),
    })
    .refine((d) => d.max >= d.min, { message: "Max must be ≥ min", path: ["max"] }),
  demandLevel: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Select a demand level" }),
  }),
  skills: csvRequired("Enter at least one skill, separated by commas"),
  topColleges: csvOptional(),
  futureScope: z.string().trim().optional(),
  tags: csvOptional(),
  isActive: z.boolean().default(true),
});

const resourceFormSchema = z.object({
  name: z.string().trim().min(1, "Resource name is required"),
  url: z.string().trim().min(1, "URL is required"),
  type: z.enum(["video", "article", "course"]),
});

const phaseFormSchema = z.object({
  title: z.string().trim().min(1, "Phase title is required"),
  description: z.string().trim().min(1, "Phase description is required"),
  skills: csvOptional(),
  durationWeeks: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  resources: z.array(resourceFormSchema).default([]),
});

export const roadmapFormSchema = z.object({
  careerId: z.string().trim().min(1, "Select a career"),
  title: z.string().trim().min(1, "Title is required"),
  phases: z.array(phaseFormSchema).min(1, "Add at least one phase"),
});
