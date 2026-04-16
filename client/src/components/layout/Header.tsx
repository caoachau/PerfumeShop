import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart, MapPin } from 'lucide-react';
import { useCartStore, getCartCount } from '../../store/cartStore';

const NAV_LEFT = [
  { label: 'HOME', path: '/' },
  { label: 'PRODUCT', path: '/shop' },
  { label: 'BRAND', path: '/brands' },
];

const NAV_RIGHT = [
  { label: 'BLOG', path: '/blog' },
  { label: 'ABOUT', path: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const cartCount = getCartCount(items);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 lg:px-12">
        {/* Mobile menu toggle */}
        <button
          className="text-[var(--color-text-primary)] lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Left Navigation (desktop) */}
        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_LEFT.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-medium tracking-[0.2em] transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center Logo */}
        <Link to="/" className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] md:h-14 md:w-14">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--color-text-inverse)]">
              LOGO
            </span>
          </div>
        </Link>

        {/* Right Navigation (desktop) */}
        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_RIGHT.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-medium tracking-[0.2em] transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <span className="hidden h-6 w-px bg-[var(--color-border)] lg:block" />
          <Link
            to="/locations"
            className="hidden text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] lg:block"
            aria-label="Locations"
          >
            <MapPin size={18} />
          </Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <Link
            to="/wishlist"
            className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>
          <Link
            to="/cart"
            className="relative text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-semibold text-[var(--color-text-inverse)]">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Account"
          >
            <User size={18} />
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="Search products, brands, scent notes..."
              className="w-full border-b border-[var(--color-border)] bg-transparent px-2 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] lg:hidden">
          {[...NAV_LEFT, ...NAV_RIGHT].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block border-b border-[var(--color-border)] px-6 py-4 text-[11px] tracking-[0.2em] transition-colors ${
                isActive(link.path)
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
