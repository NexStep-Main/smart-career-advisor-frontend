import { Helmet } from "react-helmet-async";

const APP_NAME = import.meta.env.VITE_APP_NAME || "Smart Career Advisor";

/** Per-page <title>/<meta description> via react-helmet-async. */
export default function SEOHead({ title, description }) {
  return (
    <Helmet>
      <title>{title ? `${title} — ${APP_NAME}` : APP_NAME}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
