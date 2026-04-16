import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ARCHETYPES = [
  { name: 'Sensual Amber', image: '/images/products/tf-amber-intrigue.png' },
  { name: 'Ancient Rose', image: '/images/products/delina-pink.png' },
  { name: 'Charcoal Lavender', image: '/images/products/layton-blue.png' },
  { name: 'Solar Tangerine', image: '/images/ingredients/mandarin.png' },
];

const ARTICLES = [
  {
    title: 'Crystallizing the Invisible: The Synesthesia of Scent',
    category: 'FLORAL ESSENCE',
    image: '',
  },
  {
    title: 'Sourcing Brutalism: The Architecture of Bold Air',
    category: 'INTENSE COLLECTION',
    image: '',
  },
  {
    title: 'The Ethics of Extraction: Preserving Endangered Florals',
    category: 'FLORAL ESSENCE',
    image: '',
  },
];

const BOTTOM_ARTICLES = [
  {
    title: 'The Molecular Poetry of Oudh Reveal',
    image: '',
  },
  {
    title: 'The Lost Art of Scented Correspondence',
    image: '',
  },
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog — The Olfactory Editorial</title>
      </Helmet>

      {/* Hero */}
      <section className="bg-[var(--color-bg-dark)] py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-text-inverse)]/50">
                THE JOURNAL
              </p>
              <h1
                className="mb-4 text-5xl leading-[1.1] text-[var(--color-text-inverse)] md:text-6xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notes on the
                <br />
                <span className="italic">Ephemeral.</span>
              </h1>
              <p className="text-sm leading-relaxed text-[var(--color-text-inverse)]/60">
                An editorial exploration of scent, art and culture. Raw materials, fragrance
                history, and modern sensory experiences through curated storytelling.
              </p>
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg-primary)]/10 lg:w-1/2">
              <img src="/images/products/valaya-flowers.png" alt="Featured" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-[4/3] bg-[var(--color-bg-surface)]">
            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
              Article Image
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--color-accent-gold)]">
              IN CONVERSATION
            </p>
            <h2
              className="mb-4 text-2xl leading-tight text-[var(--color-text-primary)] md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Master Your Fragrance Wardrobe
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              An exclusive series exploring the principles of scent layering, seasonal rotation,
              and the art of building a personal olfactory identity.
            </p>
            <Link to="/blog/featured" className="text-[10px] tracking-[0.15em] text-[var(--color-accent-gold)] hover:underline">
              READ MORE →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured article 2 */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2
              className="mb-4 text-2xl leading-tight text-[var(--color-text-primary)] md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Sanguine Heart: Sourcing Damask Rose at Dawn
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              An intimate glimpse into the harvesting rituals and centuries-old traditions
              surrounding one of perfumery's most coveted ingredients.
            </p>
          </div>
          <div className="aspect-[4/3] bg-[var(--color-bg-surface)]">
            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
              Article Image
            </div>
          </div>
        </div>
      </section>

      {/* Olfactory Archetypes */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-8 flex items-center justify-between">
            <h2
              className="text-2xl text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Olfactory Archetypes
            </h2>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]">
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {ARCHETYPES.map((archetype) => (
              <div key={archetype.name}>
                <div className="mb-3 aspect-square overflow-hidden bg-[var(--color-bg-dark)]">
                  <img src={archetype.image} alt={archetype.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-sm text-[var(--color-text-primary)]">{archetype.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link key={article.title} to="/blog/article" className="group">
              <div className="mb-4 aspect-[4/3] bg-[var(--color-bg-surface)]">
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                  Article Image
                </div>
              </div>
              <p className="mb-1 text-[10px] tracking-[0.15em] text-[var(--color-accent-gold)]">
                {article.category}
              </p>
              <h3
                className="text-lg leading-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom articles */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BOTTOM_ARTICLES.map((article) => (
            <Link key={article.title} to="/blog/article" className="group">
              <div className="mb-4 aspect-[4/3] bg-[var(--color-bg-surface)]">
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                  Article Image
                </div>
              </div>
              <h3
                className="text-lg leading-tight text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {article.title}
              </h3>
            </Link>
          ))}
          {/* CTA Card */}
          <div className="flex flex-col justify-center bg-[var(--color-bg-cream)] p-8">
            <h3
              className="mb-3 text-xl text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Receive the Printed Journal
            </h3>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
              A quarterly publication delivered to your door with exclusive stories.
            </p>
            <button className="w-fit bg-[var(--color-accent)] px-6 py-2.5 text-[10px] tracking-[0.15em] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]">
              SUBSCRIBE NOW
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
