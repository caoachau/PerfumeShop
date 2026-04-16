import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — The Olfactory Editorial</title>
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-primary)] px-4 text-center">
        <h1
          className="mb-4 text-8xl text-[var(--color-accent)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>
        <p className="mb-2 text-xl text-[var(--color-text-primary)]">Page Not Found</p>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
          The scent trail you followed has faded. Let us guide you back.
        </p>
        <Link
          to="/"
          className="bg-[var(--color-accent)] px-8 py-3 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
        >
          RETURN HOME
        </Link>
      </div>
    </>
  );
}
