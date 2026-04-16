import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';

const FILTER_BRANDS = ['Byredo', 'Diptyque', 'Creed', 'Tom Ford', 'Le Labo'];
const FILTER_GENDERS = ['Women', 'Men', 'Unisex'];
const FILTER_SCENT_PROFILES = ['Floral & Powdery', 'Woody & Earthy', 'Smoky & Spicy', 'Fresh & Citrus'];
const FILTER_CONCENTRATIONS = ['Parfum', 'EDP', 'EDT', 'Cologne'];
const FILTER_SIZES = ['10ML', '30ML', '50ML', '100ML', '125ML'];
const SORT_OPTIONS = ['Latest Arrival', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];

const PRODUCTS = [
  { id: 1, name: 'De Marly Valaya', desc: 'A captivating floral scent that embodies femininity and grace with Turkish rose.', price: '$245.00', image: '/images/products/valaya-white.png', slug: 'valaya' },
  { id: 2, name: 'Ombré Leather', desc: 'A deep, resinous journey through cedarwood and burnt honey, inspired by the desert.', price: '$240.00', image: '/images/products/tf-ombre-leather-dark.png', slug: 'ombre-leather' },
  { id: 3, name: 'Amber Intrigue', desc: 'Warm amber and exotic spices create an intoxicating, mysterious aura.', price: '$280.00', image: '/images/products/tf-amber-intrigue.png', slug: 'amber-intrigue' },
  { id: 4, name: 'Oud Wood', desc: 'Rare oud wood blended with rosewood and cardamom for an exotic sensory experience.', price: '$340.00', image: '/images/products/tf-oud-wood.png', slug: 'oud-wood' },
  { id: 5, name: 'Delina', desc: 'A fresh and sophisticated floral with Turkish rose, lychee, and peony.', price: '$310.00', image: '/images/products/delina-pink.png', slug: 'delina' },
  { id: 6, name: 'Bleu Noir', desc: 'A magnetic blend of musk, blue cedar, and ebony wood for the modern man.', price: '$225.00', image: '/images/products/narciso-bleu-noir.png', slug: 'bleu-noir' },
  { id: 7, name: 'Valaya EDP', desc: 'Rose de Mai and white musk dance around a heart of iris and vanilla.', price: '$265.00', image: '/images/products/valaya-centered.png', slug: 'valaya-edp' },
  { id: 8, name: 'Xerjoff Comandante', desc: 'An avant-garde Italian perfume house known for rare and precious ingredients.', price: '$320.00', image: '/images/products/xerjoff-blue.png', slug: 'xerjoff-blue' },
  { id: 9, name: 'Dior Homme Intense', desc: 'Iris, lavender and Virginia cedar create a sensual masculine signature.', price: '$195.00', image: '/images/products/dior-homme-intense.png', slug: 'dior-homme-intense' },
  { id: 10, name: 'Ombré Leather Parfum', desc: 'A richer, deeper evolution of the iconic leather fragrance.', price: '$290.00', image: '/images/products/tf-ombre-leather-light.png', slug: 'ombre-leather-parfum' },
  { id: 11, name: 'Valaya Vanilla', desc: 'Warm Madagascar vanilla meets creamy sandalwood and white flowers.', price: '$255.00', image: '/images/products/valaya-vanilla.png', slug: 'valaya-vanilla' },
  { id: 12, name: 'Layton', desc: 'Royal essence of apple, bergamot, jasmine, and precious woods.', price: '$315.00', image: '/images/products/layton-blue.png', slug: 'layton' },
];

function FilterSection({ title, items, type = 'checkbox' }: { title: string; items: string[]; type?: string }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <div className="border-b border-[var(--color-border)] py-4">
      <button
        className="flex w-full items-center justify-between text-[11px] font-semibold tracking-[0.15em] text-[var(--color-text-primary)]"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {type === 'size' ? (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className={`border px-3 py-1.5 text-[10px] tracking-wider transition-colors ${
                    selected.includes(item)
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : (
            items.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => toggle(item)}
                  className="h-3.5 w-3.5 rounded-sm border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  const FiltersContent = () => (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search a product"
          className="w-full border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
      <FilterSection title="BRAND" items={FILTER_BRANDS} />
      <FilterSection title="GENDER" items={FILTER_GENDERS} />
      <div className="border-b border-[var(--color-border)] py-4">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.15em] text-[var(--color-text-primary)]">
          PRICE RANGE
        </p>
        <div className="flex items-center gap-3">
          <input type="number" placeholder="$50" className="w-full border border-[var(--color-border)] bg-transparent px-2 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none" />
          <span className="text-[var(--color-text-muted)]">—</span>
          <input type="number" placeholder="$500" className="w-full border border-[var(--color-border)] bg-transparent px-2 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none" />
        </div>
      </div>
      <FilterSection title="SCENT PROFILE" items={FILTER_SCENT_PROFILES} />
      <FilterSection title="CONCENTRATION" items={FILTER_CONCENTRATIONS} />
      <FilterSection title="SIZE" items={FILTER_SIZES} type="size" />
    </>
  );

  return (
    <>
      <Helmet>
        <title>Shop — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="bg-[var(--color-bg-primary)] px-6 pb-10 pt-14 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <h1
                className="text-5xl leading-[1.05] text-[var(--color-text-primary)] md:text-6xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                The Seasonal
                <br />
                <span className="italic text-[var(--color-accent-gold)]">Archives</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                A curated selection of olfactory experiences, from the smoky resins of the Orient
                to the dew-kissed petals of a Grasse morning.
              </p>
            </div>
            <div className="w-full overflow-hidden bg-[var(--color-bg-dark)] lg:w-1/2">
              <img src="/images/banners/collection-books.png" alt="Collection" className="aspect-[2/1] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-[240px] shrink-0 lg:block">
            <FiltersContent />
          </aside>

          {/* Mobile filters */}
          <div className="mb-4 lg:hidden">
            <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative z-10 w-[300px] overflow-y-auto bg-[var(--color-bg-elevated)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">Filters</span>
                  <button onClick={() => setMobileFiltersOpen(false)}><X size={18} /></button>
                </div>
                <FiltersContent />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs text-[var(--color-text-muted)]">SHOWING 1-12 OF 48 ITEMS</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-[0.1em] text-[var(--color-text-muted)]">SORT BY</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-b border-[var(--color-border)] bg-transparent py-1 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none">
                  {SORT_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {PRODUCTS.map((product) => (
                <Link key={product.id} to={`/product/${product.slug}`} className="group">
                  <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">{product.name}</h3>
                  <p className="mb-2 text-xs leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{product.price}</span>
                    <span className="text-[10px] tracking-wider text-[var(--color-accent-gold)] opacity-0 transition-opacity group-hover:opacity-100">VIEW DETAILS</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-14 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <button key={page} className={`flex h-9 w-9 items-center justify-center text-sm transition-colors ${page === 1 ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>{page}</button>
              ))}
              <button className="ml-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">NEXT →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] py-5">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">
          <span>ETHICALLY SOURCED</span>
          <span className="hidden md:inline">·</span>
          <span>ARTISANAL DISTILLATION</span>
          <span className="hidden md:inline">·</span>
          <span>CRUELTY FREE</span>
          <span className="hidden md:inline">·</span>
          <span>HAND POURED IN GRASSE</span>
          <span className="hidden md:inline">·</span>
          <span>BESPOKE FRAGRANCE DESIGN</span>
        </div>
      </section>
    </>
  );
}
