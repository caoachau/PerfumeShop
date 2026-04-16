export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)]">
          <span className="text-[9px] font-bold tracking-[0.15em] text-[var(--color-text-inverse)]">
            LOGO
          </span>
        </div>
        <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <p
          className="text-xs tracking-[0.2em] text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          THE OLFACTORY EDITORIAL
        </p>
      </div>
    </div>
  );
}
