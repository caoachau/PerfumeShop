import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Gift } from 'lucide-react';

const ORDER_ITEMS = [
  {
    name: 'Oud Éthéré Eau de Parfum',
    collection: 'LES BOIS SERIES',
    size: '100ML | 3.4 FL OZ',
    price: '€265.00',
    image: '/images/products/tf-oud-wood.png',
  },
  {
    name: 'Noire Velours Candle',
    collection: 'HOME RITUALS',
    size: '200G / HAND-POURED',
    price: '€85.00',
    image: '/images/products/tf-amber-intrigue.png',
  },
];

export default function Checkout() {
  const [promoCode, setPromoCode] = useState('');

  return (
    <>
      <Helmet>
        <title>Checkout — The Olfactory Editorial</title>
      </Helmet>

      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left: Checkout form */}
          <div className="lg:col-span-3">
            {/* Progress steps */}
            <div className="mb-8 flex items-center gap-3 text-[10px] tracking-[0.15em]">
              <span className="text-[var(--color-text-primary)]">INFORMATION</span>
              <span className="text-[var(--color-text-muted)]">»</span>
              <span className="text-[var(--color-text-muted)]">SHIPPING</span>
              <span className="text-[var(--color-text-muted)]">»</span>
              <span className="text-[var(--color-text-muted)]">PAYMENT</span>
            </div>

            {/* Contact Information */}
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="text-xl text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Contact Information
                </h2>
                <Link to="/login" className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                  LOG IN
                </Link>
              </div>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="mb-3 w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--color-accent)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  KEEP ME UPDATED ON EXCLUSIVE SCENT RELEASES
                </span>
              </label>
            </div>

            {/* Shipping Address */}
            <div className="mb-10">
              <h2
                className="mb-6 text-xl text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ADDRESS"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="POSTAL CODE"
                    className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CITY"
                    className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>
                <select className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.1em] text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none">
                  <option>Country / Region</option>
                  <option>France</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Japan</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/cart"
                className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                ← RETURN TO CART
              </Link>
              <button className="bg-[var(--color-accent)] px-8 py-3 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]">
                CONTINUE TO SHIPPING
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-bg-surface)] p-6">
              <h3
                className="mb-6 text-xl text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Your Selection
              </h3>

              {/* Items */}
              <div className="space-y-6">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.name} className="flex gap-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-bg-elevated)]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] tracking-wider text-[var(--color-accent-gold)]">
                        {item.collection}
                      </p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{item.size}</p>
                    </div>
                    <p className="text-sm text-[var(--color-text-primary)]">{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="mt-6 flex gap-2 border-t border-[var(--color-border)] pt-6">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO CODE"
                  className="flex-1 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[11px] tracking-[0.1em] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <button className="bg-[var(--color-accent)] px-4 py-2 text-[10px] tracking-[0.1em] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]">
                  APPLY
                </button>
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">SUBTOTAL</span>
                  <span className="text-[var(--color-text-primary)]">€350.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">SHIPPING</span>
                  <span className="text-[var(--color-text-muted)]">CALCULATED AT NEXT STEP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">TAXES</span>
                  <span className="text-[var(--color-text-primary)]">€46.00</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-[11px] font-semibold tracking-[0.1em] text-[var(--color-text-primary)]">
                  TOTAL
                </span>
                <div className="text-right">
                  <span className="mr-2 text-xs text-[var(--color-text-muted)]">EUR</span>
                  <span
                    className="text-2xl text-[var(--color-text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    €396.00
                  </span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 space-y-2 text-xs text-[var(--color-text-muted)]">
                <p className="flex items-center gap-2">
                  <Shield size={14} /> Secure checkout encrypted by SSL
                </p>
                <p className="flex items-center gap-2">
                  <Gift size={14} /> Complimentary artisan wrapping
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
