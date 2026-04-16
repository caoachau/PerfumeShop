import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { X, Shield, Truck, ChevronRight } from 'lucide-react';
import { useCartStore, getCartTotal } from '../store/cartStore';
import { useState } from 'react';

const COMPLIMENTARY_SAMPLES = [
  { name: 'Oud Mystique', status: 'ADDED', image: '/images/products/layton-blue.png' },
  { name: 'Cèdre Fumé', status: 'SELECT', image: '/images/products/narciso-bleu-noir.png' },
  { name: 'Vetiver Noir', status: 'ADDED', image: '/images/products/valaya-vanilla.png' },
  { name: 'Musc Blanc', status: 'SOLD OUT', image: '/images/products/delina-pink.png' },
];

const DEMO_ITEMS = [
  {
    name: 'Noire Absolu',
    type: 'EAU DE PARFUM — 100ML',
    desc: 'Top notes of saffron and black pepper, melting into a heart of Bulgarian rose and agarwood.',
    price: 285,
    qty: 1,
    image: '/images/products/tf-ombre-leather-dark.png',
  },
  {
    name: "L'Ambre Soir",
    type: 'SCENTED CANDLE — 240G',
    desc: 'A warm, resinous glow of amber and sandalwood. Hand-poured into a bespoke obsidian glass vessel.',
    price: 85,
    qty: 1,
    image: '/images/products/tf-amber-intrigue.png',
  },
];

export default function Cart() {
  const [items] = useState(DEMO_ITEMS);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <Helmet>
        <title>Your Selection — The Olfactory Editorial</title>
      </Helmet>

      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="mb-2">
          <h1
            className="text-4xl text-[var(--color-text-primary)] md:text-5xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your Selection
          </h1>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
            CURATING YOUR SENSORY EXPERIENCE
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-6 border-b border-[var(--color-border)] pb-8">
                  <div className="h-32 w-24 shrink-0 overflow-hidden bg-[var(--color-bg-surface)] md:h-40 md:w-32">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                          {item.name}
                        </h3>
                        <p className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)]">
                          {item.type}
                        </p>
                      </div>
                      <p className="text-lg text-[var(--color-text-primary)]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {item.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-[var(--color-border)]">
                        <button className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">−</button>
                        <span className="px-4 py-1.5 text-sm">{item.qty}</span>
                        <button className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">+</button>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-error)]">
                        <X size={12} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-[var(--color-bg-surface)] p-6">
              <h3
                className="mb-6 text-xl text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="text-[var(--color-text-primary)]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Shipping</span>
                  <span className="text-[var(--color-success)]">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Sales Tax</span>
                  <span className="text-[var(--color-text-primary)]">$0.00</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="font-medium text-[var(--color-text-primary)]">Total</span>
                <span
                  className="text-2xl text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[var(--color-accent)] py-3.5 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
              >
                PROCEED TO CHECKOUT →
              </Link>

              <div className="mt-4 space-y-2 text-xs text-[var(--color-text-secondary)]">
                <p className="flex items-center gap-2">
                  <Shield size={14} /> Secure checkout encrypted by SSL
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} /> White glove delivery with signature confirmation
                </p>
              </div>
            </div>

            {/* Gift Message */}
            <div className="mt-4 flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              <div>
                <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Add a Gift Message
                </h4>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Exquisite packaging is standard with every order.
                </p>
              </div>
              <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
            </div>
          </div>
        </div>

        {/* Complimentary Samples */}
        <section className="mt-16 border-t border-[var(--color-border)] pt-12">
          <h2
            className="mb-2 text-2xl text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Complimentary Samples
          </h2>
          <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
            Select two scents to explore with your order.
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {COMPLIMENTARY_SAMPLES.map((sample) => (
              <div key={sample.name}>
                <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                  <img src={sample.image} alt={sample.name} className="h-full w-full object-cover" />
                </div>
                <p className={`mb-1 text-[9px] tracking-wider ${
                  sample.status === 'ADDED' ? 'text-[var(--color-success)]' :
                  sample.status === 'SOLD OUT' ? 'text-[var(--color-text-muted)]' :
                  'text-[var(--color-accent-gold)]'
                }`}>
                  {sample.status}
                </p>
                <p className="text-sm text-[var(--color-text-primary)]">{sample.name}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
