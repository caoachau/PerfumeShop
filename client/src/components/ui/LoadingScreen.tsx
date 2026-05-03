export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[var(--color-bg-primary)] px-6">
      <div
        className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]"
        style={{ fontFamily: 'var(--font-heading)' }}
        aria-hidden
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">HC</span>
      </div>
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" aria-hidden />
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
        HC Perfume
      </p>
      <p className="-mt-2 text-xs text-[var(--color-text-secondary)]">Đang tải…</p>
    </div>
  );
}
