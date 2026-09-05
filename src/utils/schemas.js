import { z } from "zod";
import { DOMAINS } from "@/lib/constants";

// Same ceiling as the Career model (Backend/src/models/Career.js) — a stray
// extra zero on salary shouldn't silently pass client-side either.
const MAX_SALARY = 100_000_000;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Mirrors Backend's adminAuth.validator.js exactly — starts with a letter,
// 3-30 chars, letters/numbers/underscore/dot.
const usernameSchema = z
  .string()
  .trim()
  .min(1, "Username is required")
  .regex(
    /^[a-z][a-z0-9_.]{2,29}$/i,
    "Must start with a letter and be 3-30 characters (letters, numbers, underscore, dot)",
  );

// Admin/superadmin login — by username, not email, so this form has no
// field in common with the student loginSchema above.
export const adminLoginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Password is required"),
});

const adminIdentityFields = {
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  username: usernameSchema,
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
};
const passwordsMatch = (data) => data.password === data.confirmPassword;
const passwordsMatchRefinement = {
  message: "Passwords don't match",
  path: ["confirmPassword"],
};

// /admin/setup — one-time first-superadmin creation. Self-service, so this
// is the only admin-account form that still collects a password directly.
export const superadminSetupSchema = z
  .object({
    ...adminIdentityFields,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(passwordsMatch, passwordsMatchRefinement);

// Superadmin inviting another admin account from /admin/admins — no
// password. The invitee sets their own via the emailed reset-password link,
// so a superadmin never has to choose or transmit someone else's password.
export const createAdminSchema = z.object(adminIdentityFields);

// Editing an existing admin-tier account from /admin/admins — same fields,
// but every one optional (partial update) since a superadmin might only be
// fixing a typo'd name.
export const updateAdminSchema = z
  .object({
    fullName: adminIdentityFields.fullName.optional(),
    username: adminIdentityFields.username.optional(),
    email: adminIdentityFields.email.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined && v !== ""), {
    message: "Change at least one field",
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

// Admin editing a student's profile — same fields/enums as profileFormSchema
// (the User model only has one canonical educationLevel/stream), plus email
// since admin (unlike the student self-service form) is allowed to correct
// it. `stream` stays optional here: a student mid-onboarding may not have
// set it yet, and the admin form shouldn't force a value just to fix a typo
// in their name.
export const adminEditStudentSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  educationLevel: z.enum(["class10", "class12", "graduation"], {
    errorMap: () => ({ message: "Select an education level" }),
  }),
  stream: z.enum(["science", "commerce", "arts", "engineering"]).optional(),
  isTestAccount: z.boolean().optional(),
});

// Comma-separated text input → trimmed, non-empty string array. Still used
// by the roadmap phase form (skills) below, which kept its plain text
// input; the career form's tag-style fields (streams/skills) moved to
// TagInput, which produces a real array directly, no CSV parsing needed.
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
  domain: z.enum(DOMAINS, { errorMap: () => ({ message: "Select a domain" }) }),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  educationLevel: z
    .array(z.enum(["class10", "class12", "graduation"]))
    .min(1, "Select at least one education level"),
  streams: z.array(z.string().trim().min(1)).min(1, "Add at least one stream"),
  averageSalary: z
    .object({
      min: z.coerce
        .number({ message: "Enter a number" })
        .nonnegative("Must be 0 or more")
        .max(MAX_SALARY, "That's an unreasonably high salary"),
      max: z.coerce
        .number({ message: "Enter a number" })
        .nonnegative("Must be 0 or more")
        .max(MAX_SALARY, "That's an unreasonably high salary"),
      currency: z.string().trim().min(1).default("INR"),
    })
    .refine((d) => d.max >= d.min, { message: "Max must be ≥ min", path: ["max"] }),
  demandLevel: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Select a demand level" }),
  }),
  skills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill"),
  topColleges: z.array(z.string().trim().min(1)).default([]),
  futureScope: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
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
