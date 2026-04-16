import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BOUTIQUES = [
  {
    name: 'Le Palais Royal',
    address: '7 Galerie de Valois, 75001 Paris',
    hours: 'Mon–Sat: 10:00–19:00 | Sun: 11:00–18:00',
    desc: 'An oasis of olfactory and visual art, nestled in the arcades of the Palais Royal. Our flagship boutique features curated exhibitions of rare essences.',
  },
];

const HIGH_STREET = [
  {
    name: 'Rue Saint-Honoré',
    address: '243 Rue Saint-Honoré, 75001 Paris',
    hours: 'Mon–Sat: 10:00–20:00 | Sun: Closed',
  },
  {
    name: 'Bond Street',
    address: '14 New Bond Street, London W1S',
    hours: 'Mon–Sat: 10:00–19:00 | Sun: 12:00–17:00',
  },
];

const URBAN_ESSENCE = [
  { name: 'Tokyo Ginza', details: '4-7-5 Ginza, Chuo-ku' },
  { name: 'Milano', details: 'Via Montenapoleone 12' },
  { name: 'Milan Brera', details: 'Corso Garibaldi 8' },
];

export default function Locations() {
  return (
    <>
      <Helmet>
        <title>Locations — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="bg-[var(--color-bg-surface)] py-20">
        <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
            OUR PRESENCE
          </p>
          <h1
            className="mb-4 text-5xl italic leading-[1.1] text-[var(--color-text-primary)] md:text-6xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Bespoke
            <br />
            Destinations
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Each of our boutiques is an olfactory sanctuary — designed to immerse you in the world
            of curated fragrance. Visit us at our exclusive locations around the globe.
          </p>
        </div>
      </section>

      {/* The Sanctuary */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <p className="mb-8 text-xs italic text-[var(--color-text-muted)]">The Sanctuary</p>
        {BOUTIQUES.map((boutique) => (
          <div key={boutique.name} className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2
                className="mb-4 text-3xl italic text-[var(--color-text-primary)] md:text-4xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {boutique.name}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {boutique.desc}
              </p>
              <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                <p>{boutique.address}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{boutique.hours}</p>
              </div>
            </div>
            <div className="aspect-[16/9] bg-[var(--color-bg-surface)]">
              <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                Boutique Image
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* The High Street */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <h2
            className="mb-10 text-2xl italic text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The High Street
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {HIGH_STREET.map((store) => (
              <div key={store.name}>
                <div className="mb-4 aspect-[4/3] bg-[var(--color-bg-dark)]">
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-inverse)]/30">
                    Store Image
                  </div>
                </div>
                <h3
                  className="mb-2 text-xl text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {store.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{store.address}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{store.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Urban Essence */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <h2
          className="mb-10 text-2xl italic text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          The Urban Essence
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {URBAN_ESSENCE.map((store) => (
            <div key={store.name}>
              <div className="mb-4 aspect-[4/3] bg-[var(--color-bg-surface)]">
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                  Store Image
                </div>
              </div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">{store.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{store.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Consultations CTA */}
      <section className="bg-[var(--color-bg-dark)] py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2
            className="mb-3 text-2xl text-[var(--color-text-inverse)] md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Bespoke Consultations
          </h2>
          <p className="mb-6 text-sm text-[var(--color-text-inverse)]/60">
            Schedule a private consultation with one of our fragrance curators at any of our
            global boutiques.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[var(--color-accent)] px-8 py-3 text-[11px] tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
          >
            BOOK AN APPOINTMENT
          </Link>
        </div>
      </section>
    </>
  );
}
