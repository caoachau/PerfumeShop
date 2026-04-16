import { Helmet } from 'react-helmet-async';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Sparkles,
  Settings,
  Headphones,
} from 'lucide-react';

const ACCOUNT_NAV = [
  { label: 'Overview', path: '/account', icon: User },
  { label: 'Order History', path: '/account/orders', icon: ShoppingBag },
  { label: 'Wishlist', path: '/wishlist', icon: Heart },
  { label: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
  { label: 'Scent Profile', path: '/account/scent-profile', icon: Sparkles },
  { label: 'Settings', path: '/account/settings', icon: Settings },
];

const RECENT_ORDERS = [
  { name: 'Midnight Vetiver', id: '#9921', date: 'Dec 12, 2023', price: '$340.00' },
  { name: 'The Discovery Set', id: '#8815', date: 'Nov 05, 2023', price: '$85.00' },
];

const RECOMMENDATIONS = [
  { name: 'Encens Suprême', subtitle: 'EAU DE PARFUM', desc: 'Smoky incense layered with coldcatch and warm vanilla leaves.', image: '/images/products/tf-oud-wood.png' },
  { name: "L'Or de Cuir", subtitle: 'INTENSE COLLECTION', desc: 'The scent of fine vintage leather found in saffron and musk.', image: '/images/products/tf-ombre-leather-light.png' },
  { name: 'Noire Gardenia', subtitle: 'FLORAL ESSENCE', desc: 'A dark interpretation of classic floral notes with gardenia.', image: '/images/products/delina-pink.png' },
];

function AccountOverview() {
  return (
    <>
      {/* Greeting */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
            PERSONAL PORTAL
          </p>
          <h1
            className="text-3xl text-[var(--color-text-primary)] md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Bonjour, Julian.
          </h1>
        </div>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          <p>Member since November 2023</p>
          <p className="font-medium text-[var(--color-accent-gold)]">NOIR ELITE STATUS</p>
        </div>
      </div>

      {/* Scent DNA + Replenishment */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-[var(--color-bg-surface)] p-6">
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
            Your Scent DNA
          </h3>
          <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
            Your preference leans towards Woody Orientals with base notes of Sandalwood and Oud.
          </p>
          <div className="mb-4 flex gap-2">
            {['OUD', 'AMBER', 'BERGAMOT'].map((tag) => (
              <span key={tag} className="border border-[var(--color-border)] px-2 py-1 text-[9px] tracking-wider text-[var(--color-text-secondary)]">
                {tag}
              </span>
            ))}
          </div>
          <button className="bg-[var(--color-accent)] px-4 py-2 text-[10px] tracking-[0.15em] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]">
            REFINE PROFILE
          </button>
        </div>

        <div className="bg-[var(--color-accent-gold)]/10 p-6">
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
            Replenishment Due
          </h3>
          <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
            Your signature scent L'Obscurité is estimated to run low in 12 days.
          </p>
          <button className="bg-[var(--color-accent)] px-4 py-2 text-[10px] tracking-[0.15em] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]">
            ORDER REFILL NOW
          </button>
        </div>
      </div>

      {/* Recent Acquisitions + Saved Addresses */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Recent Acquisitions
            </h3>
            <Link to="/account/orders" className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              VIEW ALL HISTORY
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[var(--color-bg-surface)]">
                    <Sparkles size={14} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-primary)]">{order.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Order {order.id} · {order.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-primary)]">{order.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Saved Residences
            </h3>
            <Link to="/account/addresses" className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              MANAGE ADDRESSES
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[var(--color-border)] p-4">
              <p className="mb-1 text-[9px] tracking-wider text-[var(--color-accent-gold)]">PRIMARY</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Julian Desrosiers</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                142 Avenue Montaigne<br />75008 Paris, France
              </p>
              <div className="mt-3 flex gap-3 text-[10px] text-[var(--color-text-muted)]">
                <button className="hover:text-[var(--color-text-primary)]">EDIT</button>
                <button className="hover:text-[var(--color-error)]">REMOVE</button>
              </div>
            </div>
            <Link to="/account/addresses" className="flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]">
              <span className="mb-2 text-lg text-[var(--color-text-muted)]">+</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">ADD NEW ADDRESS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Winter Recommendations */}
      <section className="border-t border-[var(--color-border)] pt-10">
        <div className="mb-2 text-center">
          <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
            CURATED JUST FOR YOU
          </p>
          <h2
            className="text-2xl italic text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Winter Recommendations
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {RECOMMENDATIONS.map((rec) => (
            <Link key={rec.name} to="/shop" className="group">
              <div className="mb-4 aspect-[4/3] overflow-hidden bg-[var(--color-bg-surface)]">
                <img src={rec.image} alt={rec.name} className="h-full w-full object-cover" />
              </div>
              <p className="mb-1 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">
                {rec.subtitle}
              </p>
              <h3
                className="mb-1 text-lg text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {rec.name}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{rec.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default function Account() {
  const location = useLocation();
  const isOverview = location.pathname === '/account';

  return (
    <>
      <Helmet>
        <title>My Account — The Olfactory Editorial</title>
      </Helmet>

      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden w-[220px] shrink-0 lg:block">
            <p className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">
              The Olfactory Editorial
            </p>
            <p className="mb-6 text-xs text-[var(--color-text-muted)]">The Curated Account</p>

            <nav className="space-y-1">
              {ACCOUNT_NAV.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Concierge */}
            <div className="mt-8 bg-[var(--color-accent-muted)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Headphones size={14} className="text-[var(--color-accent)]" />
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Concierge Service
                </span>
              </div>
              <p className="mb-3 text-[10px] text-[var(--color-text-secondary)]">
                Dedicated olfactory guidance available 24/7 for members.
              </p>
              <button className="text-[10px] tracking-[0.1em] text-[var(--color-accent)] hover:underline">
                CONTACT EXPERT
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {isOverview ? <AccountOverview /> : <Outlet />}
          </div>
        </div>
      </div>
    </>
  );
}
