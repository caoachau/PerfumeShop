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

const iconProps = {
  size: 19,
  strokeWidth: 1.15,
} as const;

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

  const navLinkClass = (path: string) =>
    `text-[11px] font-normal uppercase tracking-[0.28em] whitespace-nowrap transition-colors duration-200 ${
      isActive(path)
        ? 'text-[#1a1a1a]'
        : 'text-[#7a6e52] hover:text-[#1a1a1a]'
    }`;

  const iconClass =
    'shrink-0 text-[#6b6048] transition-colors duration-200 hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20 focus-visible:ring-offset-2';

  return (
    <header
      className="relative z-50 border-b border-[#1a1a1a] bg-white"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      <div
            className="mx-auto grid h-[4.25rem] w-full items-center px-6 md:h-[5rem] lg:px-12"
            style={{
              maxWidth: 1400,
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
            }}
          >
        <div className="flex min-w-0 items-center justify-start gap-5 lg:gap-10">
          <button
            type="button"
            className={`shrink-0 lg:hidden ${iconClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X {...iconProps} /> : <Menu {...iconProps} />}
          </button>
          <nav className="hidden min-w-0 items-center justify-evenly w-full lg:flex" aria-label="Primary">           {NAV_LEFT.map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 justify-center justify-self-center">
          <Link to="/" className="flex flex-col items-center" aria-label="Home">
            <div
              className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-[#735C00] md:h-[3.35rem] md:w-[3.35rem]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white md:text-[10px]">
                LOGO
              </span>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4 lg:gap-5">
        <nav className="hidden flex-1 items-center justify-evenly lg:flex" aria-label="Secondary">
                      {NAV_RIGHT.map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="hidden h-7 w-px shrink-0 bg-[#1a1a1a] lg:block" aria-hidden />
          <Link to="/locations" className={`hidden lg:block ${iconClass}`} aria-label="Locations">
            <MapPin {...iconProps} />
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={iconClass}
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <Search {...iconProps} />
          </button>
          <Link to="/wishlist" className={iconClass} aria-label="Wishlist">
            <Heart {...iconProps} />
          </Link>
          <Link to="/cart" className={`relative ${iconClass}`} aria-label="Cart">
            <ShoppingBag {...iconProps} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[#0a0a0a] px-0.5 text-[8px] font-semibold tabular-nums text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/account" className={iconClass} aria-label="Account">
            <User {...iconProps} />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#1a1a1a]/15 bg-white px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <input
              type="search"
              placeholder="Search products, brands, scent notes..."
              className="w-full border-b border-[#1a1a1a]/20 bg-transparent px-2 py-3 text-sm text-[#1a1a1a] placeholder:text-[#7a6e52]/70 focus:border-[#1a1a1a] focus:outline-none"
              style={{ fontFamily: 'var(--font-body)' }}
              autoFocus
            />
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <nav
          className="border-t border-[#1a1a1a]/15 bg-white lg:hidden"
          aria-label="Mobile"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {[...NAV_LEFT, ...NAV_RIGHT].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block border-b border-[#1a1a1a]/10 px-6 py-4 text-[11px] uppercase tracking-[0.28em] transition-colors ${
                isActive(link.path) ? 'bg-[#faf9f6] text-[#1a1a1a]' : 'text-[#7a6e52] hover:bg-[#faf9f6] hover:text-[#1a1a1a]'
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
