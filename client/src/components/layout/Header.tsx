import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/shop' },
  { label: 'Dịch vụ', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'Liên hệ', path: '/contact' },
  { label: 'Giới thiệu', path: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        {/* Mobile menu toggle */}
        <button
          className="text-[var(--color-text-primary)] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="font-[var(--font-heading)] text-xl tracking-[0.15em] text-[var(--color-text-primary)] md:text-2xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          PARFUM SHOP
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm tracking-wider text-[var(--color-text-secondary)] transition-colors duration-[var(--transition-base)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <Link
            to="/account"
            className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <Link
            to="/cart"
            className="relative text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-[var(--color-text-inverse)]">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu, dòng hương..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-[var(--color-border)] px-6 py-4 text-sm tracking-wider text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
