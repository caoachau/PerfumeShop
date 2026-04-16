import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';

const WISHLIST_ITEMS = [
  { name: 'Obsidienne Noire', type: 'EAU DE PARFUM — 100ML', price: '$210.00', slug: 'obsidienne-noire', image: '/images/products/tf-ombre-leather-dark.png' },
  { name: "Or d'Hiver", type: 'EXTRAIT DE PARFUM — 75ML', price: '$185.00', slug: 'or-dhiver', image: '/images/products/valaya-vanilla.png' },
  { name: 'Pétale de Nuit', type: 'EAU DE PARFUM — 100ML', price: '$245.00', slug: 'petale-de-nuit', image: '/images/products/delina-pink.png' },
];

const RECOMMENDED = [
  { name: 'Discovery Set', subtitle: 'GIFT SET', price: '$120.00', slug: 'discovery-set', image: '/images/products/tf-amber-intrigue.png' },
  { name: 'Noir Intense Candle', subtitle: 'HOME RITUALS', price: '$85.00', slug: 'noir-intense-candle', image: '/images/products/tf-oud-wood.png' },
];

export default function Wishlist() {
  return (
    <>
      <Helmet>
        <title>Saved Fragrances — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 pt-12 lg:px-12">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-accent-gold)]">
              YOUR PRIVATE GALLERY
            </p>
            <h1
              className="text-4xl text-[var(--color-text-primary)] md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Saved
              <br />
              <span className="italic">Fragrances</span>
            </h1>
          </div>
          <p className="max-w-xs text-right text-xs leading-relaxed text-[var(--color-text-secondary)]">
            A curated selection of olfactory memories and future signatures. Your personal archive
            of the invisible.
          </p>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {WISHLIST_ITEMS.map((item) => (
            <div key={item.slug} className="group">
              <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <button className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-error)]">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                    {item.name}
                  </h3>
                  <p className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)]">
                    {item.type}
                  </p>
                </div>
                <p className="text-lg text-[var(--color-text-primary)]">{item.price}</p>
              </div>
              <button className="mt-3 w-full bg-[var(--color-accent)] py-2.5 text-[10px] tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]">
                ADD TO BAG
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Discover More CTA */}
      <section className="mx-auto max-w-[1400px] px-6 pb-12 lg:px-12">
        <div className="flex items-center gap-6 bg-[var(--color-bg-surface)] p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            <Sparkles size={24} className="text-[var(--color-accent)]" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-medium text-[var(--color-text-primary)]">
              Discover More
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Not finding the perfect scent? Take our olfactory quiz to discover your signature.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[10px] tracking-[0.15em] text-[var(--color-accent-gold)] hover:underline"
          >
            START PROFILE
          </Link>
        </div>
      </section>

      {/* You might also desire */}
      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
          <h2
            className="mb-8 text-2xl italic text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            You might also desire...
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {RECOMMENDED.map((item) => (
              <Link key={item.slug} to={`/product/${item.slug}`} className="group">
                <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-sm text-[var(--color-text-primary)]">{item.name}</h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">{item.subtitle}</p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
