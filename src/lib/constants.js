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
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
  { value: "engineering", label: "Engineering" },
];
