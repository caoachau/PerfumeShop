import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, Package, Store, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logout as apiLogout } from '../services/authService';

const nav = [
  { to: '/admin/dashboard', label: 'Tổng quan', Icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Sản phẩm', Icon: Package, end: false },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link
        to="/"
        onClick={onNavigate}
        className="mb-10 flex items-center gap-2 text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
      >
        <Store size={16} strokeWidth={1.4} aria-hidden />
        Về cửa hàng
      </Link>
      <div className="mb-8 border-b border-[var(--color-border)] pb-8">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-accent-gold)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          HC Perfume
        </p>
        <p className="mt-1 text-lg text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Quản trị
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
          Catalog, biến thể và cài đặt hiển thị.
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Menu</p>
        {nav.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-muted)] font-medium text-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]',
              ].join(' ')
            }
          >
            <Icon size={18} strokeWidth={1.4} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    try {
      await apiLogout();
    } finally {
      logoutStore();
    }
  }

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="relative min-h-screen text-[var(--color-text-primary)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 0% -5%, rgba(139,115,53,0.14), transparent 50%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(92,74,30,0.08), transparent 45%), linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-cream) 55%, var(--color-bg-primary) 100%)',
        }}
        aria-hidden
      />

      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-5 py-8 backdrop-blur-sm md:flex md:flex-col">
          <SidebarContent />
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Đóng menu"
            className="fixed inset-0 z-40 bg-[var(--color-bg-dark)]/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={[
            'fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-8 shadow-[var(--shadow-elevated)] transition-transform duration-[var(--transition-base)] md:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="mb-6 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-sm p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]"
              aria-label="Đóng menu"
            >
              <X size={20} />
            </button>
          </div>
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <button
              type="button"
              className="-ms-1 rounded-sm p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)] md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={22} strokeWidth={1.4} />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[13px] font-semibold text-[var(--color-accent)]">
                {initial}
              </div>
              <div className="min-w-0 py-0.5">
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Phiên làm việc
                </p>
                <p className="truncate text-base text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {user?.name ?? 'Quản trị viên'}
                </p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex shrink-0 items-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-accent)] hover:text-[var(--color-accent)]"
            >
              <LogOut size={16} strokeWidth={1.4} aria-hidden />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </header>

          <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
