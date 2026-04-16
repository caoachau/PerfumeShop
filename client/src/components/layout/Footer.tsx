import { Link } from 'react-router-dom';
import { Share2, Mail, AtSign } from 'lucide-react';

const NAVIGATION_LINKS = [
  { label: 'Our Story', path: '/about' },
  { label: 'Shipping & Returns', path: '/policy/shipping' },
  { label: 'Privacy Policy', path: '/policy/privacy' },
  { label: 'Contact', path: '/contact' },
];

const COLLECTION_LINKS = [
  { label: 'The Resin Archive', path: '/shop?collection=resin-archive' },
  { label: 'Floral Monologues', path: '/shop?collection=floral-monologues' },
  { label: 'Citrus Studies', path: '/shop?collection=citrus-studies' },
  { label: 'Limited Editions', path: '/shop?collection=limited-editions' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)]">
              <span className="text-[9px] font-bold tracking-[0.15em] text-[var(--color-text-inverse)]">
                LOGO
              </span>
            </div>
            <h3
              className="mb-3 text-lg text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Olfactory Editorial
            </h3>
            <p className="mb-6 max-w-[240px] text-xs leading-relaxed text-[var(--color-text-secondary)]">
              A curated archive of high-end scents and the stories they tell. Elevating the art of
              perfumery through editorial precision.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]" aria-label="Share">
                <Share2 size={16} />
              </a>
              <a href="#" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]" aria-label="Email">
                <Mail size={16} />
              </a>
              <a href="#" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]" aria-label="Social">
                <AtSign size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-6 text-[11px] font-semibold tracking-[0.2em] text-[var(--color-text-primary)]">
              NAVIGATION
            </h4>
            <ul className="space-y-3">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="mb-6 text-[11px] font-semibold tracking-[0.2em] text-[var(--color-text-primary)]">
              COLLECTIONS
            </h4>
            <ul className="space-y-3">
              {COLLECTION_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 text-[11px] font-semibold tracking-[0.2em] text-[var(--color-text-primary)]">
              NEWSLETTER
            </h4>
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
              Join our list for exclusive releases and editorial insights.
            </p>
            <form className="flex items-center border-b border-[var(--color-border)]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Subscribe"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} The Olfactory Editorial. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs tracking-[0.1em] text-[var(--color-text-muted)]">
            <span>PARIS</span>
            <span>GRASSE</span>
            <span>NEW YORK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
