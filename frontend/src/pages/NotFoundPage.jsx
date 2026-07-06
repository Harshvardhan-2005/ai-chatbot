import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-placeholder">
      <section className="page-placeholder__content">
        <p className="page-placeholder__eyebrow">404</p>

        <h1 className="page-placeholder__title">Page not found</h1>

        <p className="page-placeholder__description">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/assistants"
          style={{
            display: "inline-block",
            marginTop: "24px",
            color: "var(--color-primary)",
            fontWeight: 600,
          }}
        >
          Return to Assistants
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
