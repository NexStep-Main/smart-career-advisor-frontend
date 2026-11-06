// Quick-start skeletons for the roadmap phase timeline — free alternative
// to an AI-generated draft (no external API, no cost, no key to manage).
// Applying one replaces the current phases via useFieldArray's `replace`;
// the admin edits/reorders/deletes from there using the same timeline as
// always. Every phase already satisfies phaseFormSchema (non-empty title +
// description) so the form is valid the moment a template is applied.
const blank = (title, description, durationWeeks) => ({
  title,
  description,
  skills: [],
  durationWeeks,
  resources: [],
});

export const ROADMAP_TEMPLATES = [
  {
    key: "standard",
    label: "Standard path",
    summary: "4 phases · balanced pacing",
    phases: [
      blank("Foundations", "Build core theoretical knowledge and basic terminology.", 4),
      blank("Core Skills", "Hands-on practice with the primary tools and techniques.", 8),
      blank("Specialization", "Go deeper into a focus area within this career.", 6),
      blank("Job Readiness", "Portfolio, interview prep, and real-world projects.", 4),
    ],
  },
  {
    key: "fast-track",
    label: "Fast track",
    summary: "3 phases · quick certification path",
    phases: [
      blank("Fundamentals", "Quickly cover the essential concepts.", 3),
      blank("Hands-on Practice", "Apply what you learned through guided projects.", 5),
      blank("Certification & Placement", "Prepare for certification exams and job placement.", 3),
    ],
  },
  {
    key: "deep-dive",
    label: "Deep dive",
    summary: "6 phases · thorough, in-depth path",
    phases: [
      blank("Orientation", "Understand the field and what to expect.", 2),
      blank("Foundations", "Core theory and terminology.", 5),
      blank("Core Skills", "Primary tools and techniques, hands-on.", 8),
      blank("Applied Projects", "Real-world projects to build a portfolio.", 6),
      blank("Specialization", "Focus on a niche within the field.", 6),
      blank("Job Readiness", "Interview prep, networking, and placement.", 4),
    ],
  },
];
