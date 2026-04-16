import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BRANDS = [
  { name: 'Parfums de Marly', desc: 'Royal heritage perfumery inspired by the court of Versailles, blending classical French artistry with modern olfactory innovation.', slug: 'parfums-de-marly', image: '/images/products/valaya-white.png' },
  { name: 'Tom Ford', desc: 'The pinnacle of modern glamour. Bold, sensual compositions that redefine luxury fragrance for the contemporary world.', slug: 'tom-ford', image: '/images/products/tf-ombre-leather-dark.png' },
  { name: 'Xerjoff', desc: 'An avant-garde Italian perfume house known for using the rarest and most precious ingredients in exquisite presentations.', slug: 'xerjoff', image: '/images/products/xerjoff-blue.png' },
  { name: 'Dior', desc: 'Timeless elegance from the house of Christian Dior. Each fragrance is a masterclass in sophistication and savoir-faire.', slug: 'dior', image: '/images/products/dior-homme-intense.png' },
  { name: 'Narciso Rodriguez', desc: 'Minimalist luxury built around the magnetic allure of musk. Clean lines, pure essences, unforgettable signatures.', slug: 'narciso-rodriguez', image: '/images/products/narciso-bleu-noir.png' },
  { name: 'Maison Francis Kurkdjian', desc: 'A fragrance orchestra where each note plays in perfect harmony, created by one of the greatest living perfumers.', slug: 'mfk', image: '/images/products/valaya-centered.png' },
];

export default function Brands() {
  return (
    <>
      <Helmet>
        <title>Curated Houses — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 pb-8 pt-16 lg:px-12">
        <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">EXCLUSIVE ROSTER</p>
        <h1
          className="mb-6 text-5xl italic leading-[1.05] text-[var(--color-text-primary)] md:text-6xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Curated
          <br />
          Houses
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
          From the historic ateliers of Paris to the avant-garde laboratories of Stockholm, we
          present a collection of the world's most distinguished perfume houses. Each brand in our
          portfolio is selected for its art-first approach to scent and uncompromising commitment
          to the olfactory arts.
        </p>
      </section>

      {/* Brand Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((brand) => (
            <Link key={brand.slug} to={`/shop?brand=${brand.slug}`} className="group">
              <div className="mb-4 aspect-[4/3] overflow-hidden bg-[var(--color-bg-surface)]">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="mb-2 text-2xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {brand.name}
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{brand.desc}</p>
              <span className="text-[10px] tracking-[0.15em] text-[var(--color-accent-gold)] group-hover:underline">VIEW COLLECTION</span>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-14 flex items-center justify-center gap-6 text-xs text-[var(--color-text-muted)]">
          <span className="cursor-pointer hover:text-[var(--color-text-primary)]">PREVIOUS</span>
          {['01', '02', '03'].map((p) => (
            <button key={p} className={p === '01' ? 'text-[var(--color-text-primary)]' : 'hover:text-[var(--color-text-primary)]'}>{p}</button>
          ))}
          <span className="cursor-pointer hover:text-[var(--color-text-primary)]">NEXT</span>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-accent-gold)]/10 to-[var(--color-bg-surface)] py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="mb-6 text-4xl italic text-[var(--color-text-primary)] md:text-5xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Signature Awaits
          </h2>
          <Link
            to="/shop"
            className="inline-block border border-[var(--color-accent)] px-10 py-3.5 text-[11px] tracking-[0.15em] text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)]"
          >
            FIND YOUR SCENT
          </Link>
        </div>
      </section>
    </>
  );
}
