// Canonical option lists for the User model's educationLevel/stream enums —
// must stay in sync with Backend/src/models/User.js and the student-facing
// forms (RegisterPage/ProfilePage), so the admin portal never edits a
// student into a value the student-facing UI itself couldn't produce.
export const EDUCATION_LEVELS = [
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];

export const STREAMS = [
  { value: "science", label: "Science (PCM)" },
  { value: "science_bio", label: "Science (PCB)" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts / Humanities" },
  { value: "engineering", label: "Engineering" },
  { value: "other", label: "Other" },
];

// Career.domain — was free text (typo could silently create a phantom
// domain nothing could filter by). Mirrors Backend/src/constants/domains.js
// exactly; keep both in sync by hand (different runtimes, no shared import).
export const DOMAINS = ["Technology", "Healthcare", "Arts", "Commerce", "Science", "Law", "Design"];
