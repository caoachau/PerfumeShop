import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const RAW_PALETTE = [
  { name: 'Bulgarian Rose', image: '/images/ingredients/tuberose.png' },
  { name: 'Indian Sandalwood', image: '/images/ingredients/sandalwood.png' },
  { name: 'French Lavender', image: '/images/ingredients/jasmine.png' },
  { name: 'Madagascan Vanilla', image: '/images/ingredients/mandarin.png' },
  { name: 'Italian Bergamot', image: '/images/ingredients/bergamot.png' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
              OUR PHILOSOPHY
            </p>
            <h1
              className="mb-6 text-5xl leading-[1.1] text-[var(--color-text-primary)] md:text-6xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Alchemy of
              <br />
              Invisible
              <br />
              <span className="italic">Narratives</span>
            </h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              We are a curatorial platform dedicated to the art of perfumery — bridging the invisible,
              olfactory dimension with visual storytelling and editorial precision.
            </p>
          </div>
          <div className="aspect-[3/4] w-full overflow-hidden bg-[var(--color-bg-dark)] lg:w-1/2">
            <img src="/images/products/valaya-centered.png" alt="The Olfactory Editorial" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Our Heritage */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2
                className="mb-6 text-3xl italic text-[var(--color-text-primary)] md:text-4xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Our Heritage
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Our journey started in the heart of Grasse, France — the undisputed capital of world
                perfumery. What began as a small atelier cataloguing rare essences has grown into a
                global editorial platform.
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                We partner with master perfumers and independent houses to bring their vision to an
                audience that values craftsmanship, history, and the raw beauty of natural ingredients.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden bg-[var(--color-bg-dark)]">
                <img src="/images/ingredients/wood-flowers.png" alt="Heritage" className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden bg-[var(--color-bg-dark)]">
                <img src="/images/products/tf-oud-wood.png" alt="Craftsmanship" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Perfumer */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="grid w-full grid-cols-2 gap-4 lg:w-1/2">
            <div className="aspect-[3/4] overflow-hidden bg-[var(--color-bg-dark)]">
              <img src="/images/products/tf-ombre-leather-dark.png" alt="Portrait" className="h-full w-full object-cover" />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
              <img src="/images/ingredients/wood-flowers.png" alt="Detail" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]">
              <span className="text-sm font-bold text-[var(--color-text-inverse)]">N°1</span>
            </div>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
              THE PERFUMER
            </p>
            <h2
              className="mb-4 text-3xl text-[var(--color-text-primary)] md:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mastering the
              <br />
              Olfactory Silence
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Scent is simply a bridge — connecting nature to memory and emotion.
              An invitation to pause, breathe, and remember what matters.
            </p>
            <p className="mt-4 text-xs italic text-[var(--color-text-muted)]">
              — Cécile Thierry
            </p>
          </div>
        </div>
      </section>

      {/* The Raw Palette */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <div className="mb-4 text-center">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
              THE RAW PALETTE
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
            {RAW_PALETTE.map((item) => (
              <div key={item.name}>
                <div className="mb-2 aspect-square overflow-hidden rounded-full bg-[var(--color-bg-dark)]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-center text-xs text-[var(--color-text-secondary)]">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Luxury */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2
              className="mb-6 text-3xl italic text-[var(--color-text-primary)] md:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Sustainable Luxury
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              True luxury doesn't come at the expense of the planet. Our commitment to sustainability
              is woven into every aspect — from ethically sourced raw materials to recyclable
              packaging and carbon-neutral shipping.
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              We work exclusively with suppliers who uphold the highest environmental and social
              standards, ensuring every bottle tells a story of responsibility.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-[var(--color-bg-dark)]">
              <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-inverse)]/30">Image</div>
            </div>
            <div className="aspect-[3/4] bg-[var(--color-bg-surface)]">
              <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-cream)] py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2
            className="mb-3 text-2xl text-[var(--color-text-primary)] md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Join the Editorial
          </h2>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            Subscribe to a curated journey through scent, art and culture.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[var(--color-accent)] px-8 py-3 text-[11px] tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
          >
            BECOME A MEMBER
          </Link>
        </div>
      </section>
    </>
  );
}
