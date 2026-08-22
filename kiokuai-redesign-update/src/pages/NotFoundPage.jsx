import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">404</p>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>

      <p className="max-w-xs text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/overview"
        className="mt-2 text-sm font-medium text-primary hover:underline"
      >
        Return to Overview
      </Link>
    </main>
  );
}

export default NotFoundPage;
