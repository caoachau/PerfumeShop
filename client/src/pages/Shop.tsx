import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { bannerImage } from '../lib/cloudinaryAssets';
import { brandDisplayName, displayProductImage, formatVnd, minVariantRetailPrice } from '../lib/productMedia';
import { fetchStoreProducts } from '../services/productCatalogService';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';

const FILTER_BRANDS = ['Byredo', 'Diptyque', 'Creed', 'Tom Ford', 'Le Labo'];
const FILTER_GENDERS = ['Women', 'Men', 'Unisex'];
const FILTER_SCENT_PROFILES = ['Floral & Powdery', 'Woody & Earthy', 'Smoky & Spicy', 'Fresh & Citrus'];
const FILTER_CONCENTRATIONS = ['Parfum', 'EDP', 'EDT', 'Cologne'];
const FILTER_SIZES = ['10ML', '30ML', '50ML', '100ML', '125ML'];
const SORT_API: Record<string, string> = {
  'Latest Arrival': 'newest',
  'Price: Low to High': 'price_asc',
  'Price: High to Low': 'price_desc',
  'Best Sellers': 'rating',
};
const SORT_OPTIONS = Object.keys(SORT_API);
const FILTER_OCCASIONS = ['Daily', 'Office', 'Date Night', 'Party', 'Formal', 'Sport', 'Summer', 'Winter'];

/**
 * Stock video (MP4) from Pexels — free to use under the Pexels license.
 * Hero: liquid / formulation tray (Pressmaster, id 3195394).
 * Sidebar: dark cinematic particles / mood (Dan Cristian Pădureț, id 3045163).
 * For production, prefer self-hosted assets so you are not tied to third-party CDNs.
 */
const SHOP_HERO_VIDEO_MP4 =
  'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4';
const SHOP_SIDEBAR_VIDEO_MP4 =
  'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4';

function LoopingStockVideo({
  src,
  className,
  style,
  'aria-label': ariaLabel,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (mq.matches) {
        el.pause();
      } else {
        void el.play().catch(() => {});
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

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
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0]!);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [products, setProducts] = useState<Awaited<ReturnType<typeof fetchStoreProducts>>['data']>([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sort = SORT_API[sortBy] ?? 'newest';
        const res = await fetchStoreProducts({ page, limit, sort });
        if (cancelled) return;
        setProducts(res.data);
        setMeta(res.meta);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setMeta({ total: 0, totalPages: 1, page: 1, limit });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, sortBy, limit]);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

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
      <FilterSection title="OCCASION" items={FILTER_OCCASIONS} /> {/* 👈 thêm ở đây */}

      <FilterSection title="CONCENTRATION" items={FILTER_CONCENTRATIONS} />
      <FilterSection title="SIZE" items={FILTER_SIZES} type="size" />
      {/* Tall vertical frame — desktop sidebar only (matches layout mock) */}
      <div className="hidden lg:block">
        <div className="relative mt-6 w-full overflow-hidden bg-[#141210] shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-[4/8] w-full min-h-[220px]">
            <LoopingStockVideo
              src={SHOP_SIDEBAR_VIDEO_MP4}
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
              aria-label="Cinematic fragrance mood"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-0 left-0 p-4 pr-6">
              <p
                className="text-[9px] font-medium leading-tight tracking-[0.38em] text-white/95"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                SCENT
              </p>
              <p
                className="mt-1.5 text-[9px] font-medium leading-tight tracking-[0.38em] text-white/95"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                PROFILE
              </p>
            </div>
          </div>
        </div>
      </div>
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
              <img src={bannerImage('collection-books.png')} alt="Collection" className="aspect-[2/1] w-full object-cover" />
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
              <p className="text-xs text-[var(--color-text-muted)]">
                {meta.total > 0
                  ? `HIỂN THỊ ${Math.min(meta.total, (meta.page - 1) * limit + 1)}–${Math.min(meta.total, meta.page * limit)} / ${meta.total} SẢN PHẨM`
                  : 'CHƯA CÓ SẢN PHẨM HIỂN THỊ'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-[0.1em] text-[var(--color-text-muted)]">SORT BY</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-b border-[var(--color-border)] bg-transparent py-1 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none">
                  {SORT_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4 lg:gap-y-16">
              {products.map((product, idx) => {
                const thumb = displayProductImage(product.images, idx + product.slug.length);
                const linePrice = formatVnd(minVariantRetailPrice(product.variants ?? []));
                const brandLine = brandDisplayName(product.brand);
                const desc =
                  product.description ??
                  `${brandLine ? `${brandLine} · ` : ''}${product.concentration ?? ''}${product.fragranceFamily ? ` · ${product.fragranceFamily}` : ''}`;
                return (
                  <Link key={product._id} to={`/product/${product.slug}`} className="group flex flex-col">
                    <div className="mb-4 aspect-[3/5] overflow-hidden bg-[var(--color-bg-surface)]">
                      <img
                        src={thumb}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mb-1 text-[10px] tracking-[0.12em] text-[var(--color-text-muted)]">
                      {brandLine || 'CURATED'}
                    </p>
                    <h3
                      className="mb-1.5 text-sm font-medium text-[var(--color-text-primary)] lg:text-[15px]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {product.name}
                    </h3>
                    <p className="mb-3 flex-1 text-xs leading-relaxed text-[var(--color-text-secondary)] line-clamp-3 md:text-[13px] md:leading-relaxed">
                      {desc}
                    </p>
                    <div className="mt-auto flex items-end justify-between border-t border-transparent pt-1 group-hover:border-[var(--color-border)]">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{linePrice}</span>
                      <span className="text-[10px] tracking-[0.12em] text-[var(--color-accent-gold)] opacity-0 transition-opacity group-hover:opacity-100">
                        XEM CHI TIẾT
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-35"
                >
                  ← PREV
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setPage(pNum)}
                    className={`flex h-9 min-w-[2.25rem] items-center justify-center px-2 text-sm transition-colors ${
                      pNum === page ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-35"
                >
                  NEXT →
                </button>
              </div>
            )}
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
