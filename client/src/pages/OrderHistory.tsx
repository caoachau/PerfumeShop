import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ORDERS = [
  {
    id: '#LN-882941',
    date: 'Oct 12, 2023',
    total: '$340.00',
    status: 'Delivered',
    statusColor: 'text-[var(--color-success)]',
    items: 2,
  },
  {
    id: '#LN-871822',
    date: 'Aug 04, 2023',
    total: '$195.00',
    status: 'Delivered',
    statusColor: 'text-[var(--color-success)]',
    items: 1,
  },
  {
    id: '#LN-895440',
    date: 'Dec 01, 2023',
    total: '$510.00',
    status: 'Processing',
    statusColor: 'text-[var(--color-warning)]',
    items: 3,
  },
];

type TabFilter = 'ALL ORDERS' | 'IN PROGRESS' | 'RETURNS';

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL ORDERS');
  const tabs: TabFilter[] = ['ALL ORDERS', 'IN PROGRESS', 'RETURNS'];

  return (
    <>
      <Helmet>
        <title>Order History — The Olfactory Editorial</title>
      </Helmet>

      <div>
        <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
          ARCHIVE
        </p>
        <h1
          className="mb-2 text-3xl text-[var(--color-text-primary)] md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Order History
        </h1>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
          A retrospective of your olfactory journeys. Revisit your past acquisitions and curated
          selections.
        </p>

        {/* Tabs */}
        <div className="mb-8 flex gap-6 border-b border-[var(--color-border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[11px] font-medium tracking-[0.1em] transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order list */}
        <div className="space-y-6">
          {ORDERS.map((order) => (
            <div key={order.id} className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-6 py-4">
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-[9px] tracking-wider text-[var(--color-text-muted)]">ORDER NUMBER</p>
                    <p className="font-medium text-[var(--color-text-primary)]">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-[var(--color-text-muted)]">DATE PLACED</p>
                    <p className="text-[var(--color-text-primary)]">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-[var(--color-text-muted)]">TOTAL AMOUNT</p>
                    <p className="text-[var(--color-text-primary)]">{order.total}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-wider text-[var(--color-text-muted)]">CURRENT STATUS</p>
                    <p className={order.statusColor}>• {order.status}</p>
                  </div>
                </div>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="text-[10px] tracking-[0.1em] text-[var(--color-accent-gold)] hover:underline"
                >
                  {order.status === 'Processing' ? 'TRACK ORDER' : 'VIEW DETAILS'}
                </Link>
              </div>

              {/* Order items placeholder */}
              <div className="flex gap-4 px-6 py-4">
                {Array.from({ length: Math.min(order.items, 3) }).map((_, i) => (
                  <div key={i} className="h-20 w-20 bg-[var(--color-bg-surface)]">
                    <div className="flex h-full items-center justify-center text-[8px] text-[var(--color-text-muted)]">
                      Item
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Help section */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-[16/9] overflow-hidden bg-[var(--color-bg-dark)]">
            <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-inverse)]/30">
              Concierge Image
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h3
              className="mb-3 text-xl text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Need help with an order?
            </h3>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
              Our concierges are available to discuss returns, exchanges, or provide detailed
              scent information for any of your past selections.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-fit bg-[var(--color-accent)] px-6 py-2.5 text-[10px] tracking-[0.15em] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
              >
                CONTACT THE ATELIER
              </Link>
              <Link
                to="/policy/return"
                className="text-[10px] tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                REVIEW RETURNS POLICY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
