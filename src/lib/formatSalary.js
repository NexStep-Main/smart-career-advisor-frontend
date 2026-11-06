/** ₹ in lakhs / crores, the way people actually say salaries (100 lakh = 1 crore). */
export function formatSalary(n) {
  if (n == null) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1).replace(/\.0$/, "")}Cr`;
  return `₹${(n / 100_000).toFixed(1).replace(/\.0$/, "")}L`;
}
