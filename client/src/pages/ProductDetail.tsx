import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, Shield, Truck, Heart } from 'lucide-react';

const THUMB_IMAGES = [
  '/images/products/valaya-centered.png',
  '/images/products/valaya-flowers.png',
  '/images/products/valaya-white.png',
];

const NOTES = {
  top: ['Rose de Mai', 'Pink Pepper', 'Italian Bergamot'],
  heart: ['Turkish Rose', 'Iris Pallida', 'Jasmine Absolute'],
  base: ['Oud', 'Sandalwood', 'Amber'],
};

const RELATED = [
  { name: 'Ombré Leather', price: '€240.00', slug: 'ombre-leather', image: '/images/products/tf-ombre-leather-dark.png' },
  { name: 'Amber Intrigue', price: '€280.00', slug: 'amber-intrigue', image: '/images/products/tf-amber-intrigue.png' },
  { name: 'Oud Wood', price: '€340.00', slug: 'oud-wood', image: '/images/products/tf-oud-wood.png' },
  { name: 'Delina', price: '€310.00', slug: 'delina', image: '/images/products/delina-pink.png' },
];

const REVIEWS = [
  { author: 'Anonymous', text: 'Illumination cannot describe this fragrance. Rich beauty, cinnamon and anise, citrus flavors. The sillage is extraordinary and the longevity is even better.', rating: 5 },
  { author: 'scentseeker2025', text: 'A divine exploration of floral artistry, blending old-world charm with modern sensibility. This has become my signature scent.', rating: 5 },
];

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(THUMB_IMAGES[0]);
  const [selectedSize, setSelectedSize] = useState('100ML');
  const [qty, setQty] = useState(1);
  const sizes = ['30ML', '50ML', '100ML'];

  return (
    <>
      <Helmet>
        <title>De Marly Valaya — The Olfactory Editorial</title>
      </Helmet>

      {/* Product Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="mb-4 aspect-square overflow-hidden bg-[var(--color-bg-surface)]">
              <img src={mainImage} alt="De Marly Valaya" className="h-full w-full object-contain p-8" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {THUMB_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square overflow-hidden bg-[var(--color-bg-surface)] transition-opacity ${mainImage === img ? 'ring-2 ring-[var(--color-accent)]' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1
              className="mb-2 text-4xl text-[var(--color-text-primary)] md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              De Marly Valaya
            </h1>
            <p className="mb-1 text-sm italic text-[var(--color-text-secondary)]">Eau de Parfum</p>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
              A captivating floral scent that embodies femininity and grace, blending notes of
              Turkish rose with a luminous warmth that lingers elegantly on the skin. Crafted by
              the house of Parfums de Marly.
            </p>

            <p className="mb-6 text-3xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              $245.00
            </p>

            {/* Size */}
            <div className="mb-6">
              <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">SIZE</p>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-5 py-2.5 text-xs tracking-wider transition-colors ${selectedSize === size ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Cart */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center border border-[var(--color-border)]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">−</button>
                <span className="min-w-[40px] px-2 py-2.5 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">+</button>
              </div>
              <button className="flex-1 bg-[var(--color-accent)] py-3 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]">
                ADD TO SELECTION
              </button>
              <button className="border border-[var(--color-border)] p-3 text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-6 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5"><Shield size={14} /> 100% Authentic</span>
              <span className="flex items-center gap-1.5"><Truck size={14} /> Free Shipping</span>
            </div>
            <div className="mt-3 text-xs text-[var(--color-text-muted)]">
              <span className="mr-4">NOTES: rose, cardamom, iris</span>
              <span>CATEGORY: Floral Oriental</span>
            </div>
          </div>
        </div>
      </section>

      {/* Olfactory Pyramid */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              The Olfactory Pyramid
            </h2>
            <span className="text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">NOTES COMPOSITION</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(['TOP NOTES', 'HEART NOTES', 'BASE NOTES'] as const).map((label, idx) => {
              const key = (['top', 'heart', 'base'] as const)[idx];
              const images = ['/images/ingredients/bergamot.png', '/images/ingredients/tuberose.png', '/images/ingredients/sandalwood.png'];
              return (
                <div key={label} className="bg-[var(--color-bg-elevated)] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <img src={images[idx]} alt={label} className="h-10 w-10 rounded-full object-cover" />
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] text-[var(--color-text-primary)]">{label}</h3>
                  </div>
                  <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
                    {label === 'TOP NOTES' && 'The initial, fleeting impression that greets the senses.'}
                    {label === 'HEART NOTES' && 'The core character that defines the fragrance.'}
                    {label === 'BASE NOTES' && 'The lasting, deep impression that lingers.'}
                  </p>
                  <ul className="space-y-1.5">
                    {NOTES[key].map((note) => (
                      <li key={note} className="text-sm text-[var(--color-text-primary)]">{note}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete the Ritual */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <h2 className="mb-10 text-center text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Complete the Ritual
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {RELATED.map((product) => (
            <Link key={product.slug} to={`/product/${product.slug}`} className="group">
              <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="mb-1 text-sm text-[var(--color-text-primary)]">{product.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <div className="text-center">
            <h2 className="text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Voices of the Evening
            </h2>
            <div className="mt-2 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {REVIEWS.map((review, i) => (
              <blockquote key={i} className="bg-[var(--color-bg-elevated)] p-6">
                <p className="mb-4 text-sm italic leading-relaxed text-[var(--color-text-secondary)]">&ldquo;{review.text}&rdquo;</p>
                <cite className="text-xs not-italic text-[var(--color-text-muted)]">— {review.author}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
