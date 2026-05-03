/**
 * Tailwind snippets shared by `/admin/*` pages — luxury editorial palette (index.css tokens).
 */

export const adminInput =
  'w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-[var(--transition-fast)] focus:border-[var(--color-border-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/15';

export const adminSelect = `${adminInput} cursor-pointer`;

export const adminTextarea = `${adminInput} min-h-[96px] resize-y align-top`;

export const adminSmallInput =
  'rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2.5 py-2 text-xs text-[var(--color-text-primary)] transition-colors focus:border-[var(--color-border-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/12';

export const adminLabel =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-text-muted)]';

export const adminCard =
  'rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]';

export const adminCardInner = 'rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-surface)]';

export const adminBtnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-accent)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50';

export const adminBtnSecondary =
  'inline-flex items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-accent)] hover:bg-[var(--color-bg-primary)] disabled:opacity-40';

export const adminBtnOutline =
  'inline-flex items-center justify-center rounded-sm border border-[var(--color-border)] bg-transparent px-4 py-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40';

export const adminBtnGhost =
  'text-[11px] font-medium text-[var(--color-accent)] underline-offset-4 transition-colors hover:underline disabled:opacity-40';

export const adminBtnDanger =
  'text-[11px] font-medium text-[var(--color-error)] transition-colors hover:underline disabled:opacity-40';

export const adminTableWrap = `${adminCard} overflow-hidden p-0`;

export const adminTh =
  'px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]';

export const adminTdRow =
  'border-b border-[var(--color-border)] transition-colors last:border-b-0 hover:bg-[var(--color-bg-surface)]';

export const adminBadgeOn =
  'inline-flex rounded-full bg-[var(--color-success)]/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-success)]';

export const adminBadgeOff =
  'inline-flex rounded-full bg-[var(--color-bg-surface)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';
