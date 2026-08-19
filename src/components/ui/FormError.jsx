/** Inline field error text for react-hook-form + zod validation messages. */
export default function FormError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{message}</p>;
}
