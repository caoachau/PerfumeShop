export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <p
          className="text-sm tracking-widest text-[var(--color-text-secondary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          PARFUM SHOP
        </p>
      </div>
    </div>
  );
}
