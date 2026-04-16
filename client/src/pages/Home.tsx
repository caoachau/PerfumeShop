import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PenTool, FlaskConical, Compass, Leaf } from 'lucide-react';

/** Long lists for seamless marquee — duplicated in JSX ×2 for loop */
const BRANDS_MARQUEE_ROW1 = [
  'BYREDO',
  'DIPTYQUE',
  'CREED',
  'TOM FORD',
  'LE LABO',
  'GUERLAIN',
  'MAISON FRANCIS KURKDJIAN',
  'XERJOFF',
  'AMOUAGE',
  'CHANEL',
  'DIOR',
  'YVES SAINT LAURENT',
  'HERMÈS',
  'ACQUA DI PARMA',
  'FREDERIC MALLE',
  'JO MALONE LONDON',
  'KILIAN',
  'PARFUMS DE MARLY',
  'INITIO PARFUMS PRIVÉS',
  'MONTALE',
  'SERGE LUTENS',
];

const BRANDS_MARQUEE_ROW2 = [
  'VAN CLEEF & ARPELS',
  'VIKTOR & ROLF',
  'NARCISO RODRIGUEZ',
  'ISSEY MIYAKE',
  'PRADA',
  'VALENTINO',
  'GIORGIO ARMANI',
  'VERSACE',
  'BVLGARI',
  'CARTIER',
  'LANCOME',
  'ESTÉE LAUDER',
  'CLIVE CHRISTIAN',
  'ROJA PARFUMS',
  'PENHALIGON\'S',
  'L\'ARTISAN PARFUMEUR',
  'ANNICK GOUTAL',
  'COMME DES GARÇONS',
  'ETAT LIBRE D\'ORANGE',
  'ORMONDE JAYNE',
  'BYREDO',
  'DIPTYQUE',
  'CREED',
  'TOM FORD',
];

function BrandMarqueeRow({ brands, reverse }: { brands: readonly string[]; reverse: boolean }) {
  const sequence = [...brands, ...brands];
  return (
    <div className="home-brand-marquee__viewport">
      <div
        className={`home-brand-marquee__track ${reverse ? 'home-brand-marquee__track--right' : 'home-brand-marquee__track--left'}`}
      >
        {sequence.map((name, i) => (
          <span key={`${name}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: '2.75rem' }}>
            <Link
              to="/brands"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                letterSpacing: '0.22em',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </Link>
            <span style={{ color: 'var(--color-border)', fontSize: 8, userSelect: 'none' }} aria-hidden>
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

const FEATURED_ROW1 = [
  { name: 'De Marly Valaya', brand: 'PARFUMS DE MARLY', price: '$245.00', image: '/images/products/valaya-white.png', slug: 'valaya' },
  { name: 'Xerjoff Blue', brand: 'XERJOFF', price: '$320.00', image: '/images/products/xerjoff-blue.png', slug: 'xerjoff-blue' },
  { name: 'Dior Homme Intense', brand: 'DIOR', price: '$195.00', image: '/images/products/dior-homme-intense.png', slug: 'dior-homme-intense' },
  { name: 'Amber Intrigue', brand: 'TOM FORD', price: '$280.00', image: '/images/products/tf-amber-intrigue.png', slug: 'amber-intrigue' },
];

const FEATURED_ROW2 = [
  { name: 'Ombré Leather', brand: 'TOM FORD', price: '$210.00', image: '/images/products/tf-ombre-leather-dark.png', slug: 'ombre-leather' },
  { name: 'Ombré Leather Parfum', brand: 'TOM FORD', price: '$265.00', image: '/images/products/tf-ombre-leather-light.png', slug: 'ombre-leather-parfum' },
  { name: 'Oud Wood', brand: 'TOM FORD', price: '$340.00', image: '/images/products/tf-oud-wood.png', slug: 'oud-wood' },
  { name: 'Bleu Noir', brand: 'NARCISO RODRIGUEZ', price: '$225.00', image: '/images/products/narciso-bleu-noir.png', slug: 'bleu-noir' },
];

type SeasonCard = { name: string; notes: string; image: string; slug: string };

type SeasonThemeGroup = {
  id: string;
  label: string;
  scents: readonly [SeasonCard, SeasonCard, SeasonCard];
};

/** Three cards per theme — switch via tabs (seasonal / gendered edits) */
const SEASON_THEME_GROUPS: readonly SeasonThemeGroup[] = [
  {
    id: 'seasonal',
    label: 'SEASONAL EDIT',
    scents: [
      { name: 'Winter Solstice', notes: 'INCENSE, PINE, LEATHER', image: '/images/products/valaya-vanilla.png', slug: 'valaya-vanilla' },
      { name: 'Midnight Opera', notes: 'TUBEROSE, OUD, SAFFRON', image: '/images/products/layton-blue.png', slug: 'layton' },
      { name: 'Linen Sky', notes: 'WHITE MUSK, ALDEHYDES, IRIS', image: '/images/products/delina-pink.png', slug: 'delina' },
    ],
  },
  {
    id: 'for-her',
    label: 'FOR HER',
    scents: [
      { name: 'Royal Essence', notes: 'APPLE, JASMINE, VANILLA', image: '/images/products/valaya-white.png', slug: 'valaya' },
      { name: 'Velvet Bloom', notes: 'ROSE, VANILLA, MUSK', image: '/images/products/valaya-vanilla.png', slug: 'valaya-vanilla' },
      { name: 'Rose Nocturne', notes: 'TURKISH ROSE, LYCHEE, PEONY', image: '/images/products/delina-pink.png', slug: 'delina' },
    ],
  },
  {
    id: 'for-him',
    label: 'FOR HIM',
    scents: [
      { name: 'Magnetic Musk', notes: 'MUSK, BLUE CEDAR, EBONY', image: '/images/products/narciso-bleu-noir.png', slug: 'bleu-noir' },
      { name: 'Desert Leather', notes: 'JASMINE, PATCHOULI, LEATHER', image: '/images/products/tf-ombre-leather-dark.png', slug: 'ombre-leather' },
      { name: 'Iris Intensity', notes: 'IRIS, LAVENDER, CEDAR', image: '/images/products/dior-homme-intense.png', slug: 'dior-homme-intense' },
    ],
  },
] as const;

type EssenceLuxuryTab = {
  id: string;
  label: string;
  image: string;
  imagePosition?: string;
  intro: string;
  columns: readonly [string, string, string, string];
  watermark?: string;
};

const ESSENCE_LUXURY_TABS: readonly EssenceLuxuryTab[] = [
  {
    id: 'collection-01',
    label: 'COLLECTION 01',
    image: '/images/products/tf-oud-wood.png',
    imagePosition: 'center 40%',
    intro:
      'Every fragrance in our collection is a masterpiece — sourced from the finest ingredients, crafted by legendary perfumers, and presented with the reverence it deserves. We believe perfume is not just a scent, but a statement of identity.',
    columns: [
      'We source our resins from the high plateaus of Oman and our jasmines from the dawn-lit fields of Grasse. Our master perfumers treat scent as liquid poetry, capturing fleeting moments in crystal vessels. Each note is weighed against the silence it fills.',
      'The art of distillation has remained unchanged for centuries. We honor this tradition with slow extraction methods that preserve the volatile heart of the botanical. Our laboratories in Grasse unite ancient knowledge with modern analytical precision.',
      'Architecture, much like scent, defines the volume of our experience. Our bottles are designed for structural integrity — heavy glass that feels substantial in the hand. The weighted cap and fine mist delivery are part of the daily ritual we offer.',
      'Sustainability is a responsibility we owe to the earth that provides our raw materials. From considered packaging to ethical sourcing with local growers, we ensure the beauty we create does not come at the cost of the environment.',
    ],
  },
  {
    id: 'archive-notes',
    label: 'ARCHIVE NOTES',
    image: '/images/products/narciso-bleu-noir.png',
    imagePosition: 'center center',
    watermark: 'NARCISO',
    intro:
      'Perfume is the most intense form of memory. It is a signature, an invisible layer of architecture that defines the soul of a space. Every bottle in our editorial collection is a testament to the patient art of layering.',
    columns: [
      'Our archive preserves formula ledgers, vintage blotters, and the quiet correspondence between noses and patrons. Each entry documents how a chord evolved across seasons — proof that luxury is as much patience as it is precision.',
      'We catalogue raw materials by harvest year and terroir, not only by name. Musk accords, aged sandalwood, and small-batch absolutes rest in climate-controlled silence until the moment they are called back into composition.',
      'Editorial notes trace the narrative arc of a scent: what was discarded, what survived the final edit. Reading them is like walking through a museum of almosts — the paths not taken, still shimmering with possibility.',
      'The archive is open to our community in spirit: through limited journals, in-store listening sessions, and the stories we publish. Memory, we believe, should be shared as generously as it is worn.',
    ],
  },
  {
    id: 'process-film',
    label: 'PROCESS FILM',
    image: '/images/products/dior-homme-intense.png',
    imagePosition: '55% center',
    intro:
      'Process is where instinct meets rigor. We document every campaign of trials — from first sketch to final flacon — so the journey of a fragrance remains as legible as its sillage.',
    columns: [
      'Filming begins at the weighing bench: macro lenses on crystallized resins, slow pours of tinctures, the rhythm of gloved hands. Light is controlled like a top note — never louder than the material it reveals.',
      'Our directors work beside perfumers without interrupting the silence concentration requires. The cut is editorial: long takes for distillation, staccato cuts for market-day botanicals, colour graded like aged paper.',
      'Sound design carries equal weight: the click of a magnetic cap, the hiss of an atomizer, room tone in a Grasse atelier at dusk. These textures anchor the film in the body before the nose ever leans in.',
      'Each “Process Film” release accompanies a pillar of the collection — a living appendix to the formula. Watch them as you would read a colophon: small type, outsized meaning.',
    ],
  },
  {
    id: 'material-origin',
    label: 'MATERIAL ORIGIN',
    image: '/images/ingredients/wood-flowers.png',
    imagePosition: 'center center',
    intro:
      'Luxury begins where the map ends. We travel to origin — red earth, high altitude, coastal fog — to meet the people and places that give each material its voice.',
    columns: [
      'Oud and resins are traced to named forests and distilleries; roses to specific valleys where pickers still work at first light. Provenance is printed beside batch codes whenever the harvest allows.',
      'Citrus is pressed close to the grove; jasmine enfleurage is timed to the hour the flowers open. We favour partnerships over anonymous commodities — contracts that fund schools, water projects, and replanting.',
      'Glass, paper, and metal are chosen for recyclability and weight — fewer air miles, more reuse cycles. What touches your skin should know where it came from.',
      'When a material faces scarcity, we reduce its use rather than substitute with a hollow mimic. The editorial line is honest: some seasons yield less, and that restraint is part of the story.',
    ],
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: PenTool,
    title: 'Artisanal Craftsmanship',
    desc: 'Every vessel is a masterpiece. Our collections feature hand-poured bottles and utilize traditional distillation methods passed down through generations of master perfumers.',
  },
  {
    icon: FlaskConical,
    title: 'Rare Ingredients',
    desc: 'We scour the globe for the impossible. Our laboratory unites the finest natural absolutes with ground-breaking synthetics to create olfactory silhouettes that endure.',
  },
  {
    icon: Compass,
    title: 'Curated Experience',
    desc: 'Beyond a scent, we offer a narrative. Our editorial approach ensures a deeply personal journey in finding the fragrance that resonates with your unique identity.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Luxury with a conscience. We are committed to cruelty-free practices and ethically sourced materials, ensuring the preservation of the botanicals we cherish.',
  },
];

function ProductCard({ product }: { product: typeof FEATURED_ROW1[0] }) {
  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="mb-4 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mb-1 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">{product.brand}</p>
      <h3 className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">{product.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">{product.price}</p>
    </Link>
  );
}

export default function Home() {
  const [essenceTab, setEssenceTab] = useState(0);
  const essence = ESSENCE_LUXURY_TABS[essenceTab];
  const [seasonTheme, setSeasonTheme] = useState(0);
  const seasonGroup = SEASON_THEME_GROUPS[seasonTheme];

  return (
    <>
      <Helmet>
        <title>The Olfactory Editorial — Curated Fragrances</title>
        <meta name="description" content="A curated archive of high-end scents. Discover luxury perfumes from the world's finest houses." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[var(--color-bg-primary)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="relative" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
            <div className="relative z-10 py-20 lg:py-28" style={{ width: '55%', minWidth: '320px' }}>
              <p style={{ marginBottom: 12, fontSize: 10, letterSpacing: '0.3em', color: 'var(--color-accent-gold)' }}>
                PREMIUM CHOICE
              </p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.05, marginBottom: 16, color: 'var(--color-text-primary)' }}>
                FLOWER<br />
                <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>PERFUME</span>
              </h1>
              <p style={{ marginBottom: 8, fontSize: 14, fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                I WANT GETTING CLOSER TO YOU
              </p>
              <p style={{ marginBottom: 32, fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: 440 }}>
                Discover our curated collection of the world's most exquisite fragrances.
                Each scent tells a story, crafted by master perfumers with generations of artistry.
              </p>
              <Link
                to="/shop"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-accent)',
                  padding: '14px 40px',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  color: 'var(--color-text-inverse)',
                  textDecoration: 'none',
                }}
              >
                EXPLORE COLLECTION
              </Link>
            </div>

            <div className="hidden lg:block" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '42%' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 350, height: 500, borderRadius: 16, background: 'linear-gradient(135deg, rgba(220,240,220,0.4), rgba(230,245,230,0.2))' }} />
                <img
                  src="/images/products/valaya-centered.png"
                  alt="Featured Perfume"
                  style={{ position: 'relative', zIndex: 10, maxHeight: 600, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Curated Houses — infinite staggered marquees ── */}
      <section
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '40px 0 44px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
              marginBottom: 28,
              color: 'var(--color-text-primary)',
            }}
          >
            Our Curated Houses
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BrandMarqueeRow brands={BRANDS_MARQUEE_ROW1} reverse={false} />
          <BrandMarqueeRow brands={BRANDS_MARQUEE_ROW2} reverse />
        </div>
      </section>

      {/* ── Featured Fragrances ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <h2
            className="text-3xl italic text-[var(--color-text-primary)] md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Featured Fragrances
          </h2>
          <Link
            to="/shop"
            className="text-[11px] tracking-[0.15em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            VIEW ALL →
          </Link>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {FEATURED_ROW1.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {FEATURED_ROW2.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── Scents of the Season — equal-height cards + theme tabs ── */}
      <section
        className="border-y border-[var(--color-border)] bg-[var(--color-bg-surface)] py-16"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <div className="box-border w-full px-6 lg:px-12" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h2
            className="mb-8 text-center text-3xl italic text-[var(--color-text-primary)] md:mb-10 md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Scents of the Season
          </h2>

          <div
              className="mb-10 flex flex-wrap items-center justify-center gap-3"
              role="tablist"
              aria-label="Scent themes"
            >
              {SEASON_THEME_GROUPS.map((g, index) => {
                const selected = index === seasonTheme;

                return (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`season-tab-${g.id}`}
                    aria-controls="season-cards-panel"
                    onClick={() => setSeasonTheme(index)}
                    className={`group relative px-6 py-2 text-[10px] tracking-[0.25em] transition-all duration-300 ${
                      selected
                        ? 'text-[var(--color-accent-gold)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    <span className="relative inline-block">
                      {g.label}

                      {/* underline */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[1px] w-full bg-[var(--color-accent-gold)] origin-left transition-transform duration-300 ${
                          selected
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

          <div
            id="season-cards-panel"
            role="tabpanel"
            aria-labelledby={`season-tab-${seasonGroup.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={seasonGroup.id}
                className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-6"
                style={{ alignItems: 'start' }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
              {seasonGroup.scents.map((scent, idx) => (
                <Link
                  key={`${seasonGroup.id}-${scent.slug}`}
                  to={`/product/${scent.slug}`}
                  className={`group flex max-w-full flex-col overflow-hidden border border-[var(--color-border)] bg-transparent] no-underline shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)] ${idx === 1 ? 'md:mt-[clamp(2rem,8vw,5.5rem)]' : ''}`}
                >
                  <div
                    className="relative aspect-square w-full shrink-0 overflow-hidden"
                    style={{
                      background: 'radial-gradient(ellipse at center, #1a2744 0%, #0a0f18 70%, #06090e 100%)',
                    }}
                  >
                    <img
                      src={scent.image}
                      alt={scent.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      style={{ objectPosition: 'center center' }}
                    />
                  </div>
                  <div className="flex flex-col items-center px-6 py-8 text-center md:px-8 md:py-10">
                  <div
                      className="mb-5 h-px w-32 md:w-48 lg:w-64 mx-auto shrink-0 bg-[#735C00]"
                      aria-hidden
                    />                    <h3
                      className="mb-2 text-xl font-semibold text-[var(--color-text-primary)] md:text-2xl"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {scent.name}
                    </h3>
                    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-secondary)] space-y-1.5"></p>
                      {scent.notes.split(',').map((item, i) => (
                        <span key={i} className="block">
                          {item.trim()}
                        </span>
                      ))}
                    
                    <span
                      className="group/cta inline-block text-[10px] tracking-[0.22em] text-[var(--color-accent-gold)]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span className="relative inline-block pb-1 transition-transform duration-300 group-hover/cta:scale-105">
                        DISCOVER NOW
                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transform bg-[var(--color-accent-gold)] transition-transform duration-300 group-hover/cta:scale-x-100" />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>  

      {/* ── The Essence of Luxury — full-bleed editorial tabs (inline layout avoids Tailwind width bugs) ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'min(100vh, 920px)',
          overflowX: 'hidden',
          overflowY: 'visible',
          backgroundColor: '#0d0d0d',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={essence.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={essence.image}
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: essence.imagePosition ?? 'center center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.6), rgba(0,0,0,0.82))',
              }}
              aria-hidden
            />
            {essence.watermark ? (
              <div
                style={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                aria-hidden
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(3.5rem, 16vw, 11rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 0.9,
                    color: 'rgba(255,255,255,0.14)',
                    userSelect: 'none',
                  }}
                >
                  {essence.watermark}
                </span>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            minHeight: 'min(100vh, 920px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 24px 80px',
          }}
        >
          <div
            id="essence-luxury-panel"
            role="tabpanel"
            aria-labelledby={`essence-tab-${essence.id}`}
            style={{
              width: '100%',
              minWidth: 0,
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={essence.id}
                className="flex w-full min-w-0 flex-1 flex-col"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
              <header style={{ width: '100%', maxWidth: 640 }}>
                <h2
                  className="mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-[3.25rem]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  The Essence of Luxury
                </h2>
                <p
                  className="text-sm leading-relaxed text-white/85 md:text-[15px] md:leading-[1.75]"
                  style={{ fontFamily: 'var(--font-body)', width: '100%', maxWidth: 640 }}
                >
                  {essence.intro}
                </p>
              </header>

              <hr
                style={{
                  width: '100%',
                  maxWidth: 960,
                  marginTop: 40,
                  marginBottom: 40,
                  border: 0,
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                }}
              />

              <div
                className="grid w-full min-w-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {essence.columns.map((text, colIdx) => (
                  <p
                    key={`${essence.id}-col-${colIdx}`}
                    className="text-[12px] leading-[1.7] text-white/80 md:text-[13px] lg:text-[14px] lg:leading-[1.75]"                    style={{ width: '100%', minWidth: 0 }}
                  >
                    {text}
                  </p>
                ))}
              </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="mt-auto flex w-full min-w-0 shrink-0 flex-col gap-8 pt-12 lg:flex-row lg:items-end lg:justify-between lg:pt-20"
          >
            <div className="flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Essence of luxury stories">
              {ESSENCE_LUXURY_TABS.map((tab, index) => {
                const selected = index === essenceTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`essence-tab-${tab.id}`}
                    aria-controls="essence-luxury-panel"
                    onClick={() => setEssenceTab(index)}
                    className={`border px-4 py-2.5 text-left text-[14px] tracking-[0.12em] transition-colors sm:px-5 ${
                      selected
                        ? 'border-white/50 bg-white/20 text-white'
                        : 'border-white/35 bg-transparent text-white/75 hover:border-white/55 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <Link
              to="/about"
              className="inline-flex w-fit shrink-0 items-center justify-center border border-white/40 px-8 py-3 text-[11px] tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              DISCOVER OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
            THE EDITORIAL STANDARD
          </p>
          <h2
            className="text-3xl text-[var(--color-text-primary)] md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Choose Us
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title}>
              <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[var(--color-border)]">
                <item.icon size={18} className="text-[var(--color-text-primary)]" />
              </div>
              <h3
                className="mb-3 text-base font-semibold text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Join the Editorial ── */}
      <section style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ marginBottom: 8, fontSize: 10, letterSpacing: '0.3em', color: 'var(--color-text-muted)' }}>
            THE INNER CIRCLE
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: 16, color: 'var(--color-text-primary)' }}>
            Join the Editorial
          </h2>
          <p style={{ marginBottom: 32, fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
            Receive curated insights into the intersection of olfactory art, seasonal
            narratives, and exclusive early access to our limited botanical extractions.
          </p>
          <form
            style={{ display: 'flex', gap: 12, maxWidth: 460, margin: '0 auto' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: 1,
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-elevated)',
                padding: '12px 16px',
                fontSize: 14,
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-accent)',
                padding: '12px 24px',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.15em',
                color: 'var(--color-text-inverse)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              SUBSCRIBE
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 9, letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
            BY SUBSCRIBING, YOU AGREE TO OUR{' '}
            <Link to="/policy/privacy" style={{ textDecoration: 'underline' }}>PRIVACY POLICY</Link>
            {' '}AND{' '}
            <Link to="/policy/terms" style={{ textDecoration: 'underline' }}>TERMS OF SERVICE</Link>
          </p>
        </div>
      </section>
    </>
  );
}
