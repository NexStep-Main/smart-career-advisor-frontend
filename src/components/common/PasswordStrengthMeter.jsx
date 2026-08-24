const LEVELS = [
  { label: "Too weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-accent-orange" },
  { label: "Fair", color: "bg-amber-400" },
  { label: "Good", color: "bg-lime-500" },
  { label: "Strong", color: "bg-accent-green" },
];

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

/**
 * Live password-strength indicator for the auth flow (register + reset-
 * password) — a rough heuristic (length + character variety), not a real
 * entropy calculation, but enough to steer someone away from "password1"
 * before they submit rather than after a rejected form. Renders nothing
 * until the field has a value, so an empty password field doesn't show a
 * permanent "Too weak" bar before the user has typed anything.
 */
export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const score = getStrength(password);
  const { label, color } = LEVELS[score];

  return (
    <div className="-mt-3 mb-1 flex items-center gap-3">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors ${
              i <= score ? color : "bg-rule"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
        {label}
      </span>
    </div>
  );
}
