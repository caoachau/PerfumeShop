import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Parfum Shop - Nước hoa chính hãng</title>
        <meta
          name="description"
          content="Cửa hàng nước hoa chính hãng - Chanel, Dior, YSL, Gucci và nhiều thương hiệu cao cấp khác. Dịch vụ tư vấn mùi hương và khắc tên."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-primary)]/60 to-[var(--color-bg-primary)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-[var(--color-accent)]">
            DISCOVER YOUR SIGNATURE SCENT
          </p>
          <h1
            className="mb-6 text-4xl leading-tight text-[var(--color-text-primary)] md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Nước Hoa Chính Hãng
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-[var(--color-text-secondary)]">
            Khám phá bộ sưu tập nước hoa cao cấp từ các thương hiệu hàng đầu thế giới.
            Tư vấn mùi hương cá nhân hóa.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/shop"
              className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-8 py-3 text-sm font-medium tracking-wider text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-glow)]"
            >
              KHÁM PHÁ NGAY
            </a>
            <a
              href="/services/consultation"
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-8 py-3 text-sm tracking-wider text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              TƯ VẤN MÙI HƯƠNG
            </a>
          </div>
        </div>
      </section>

      {/* Placeholder sections for Phase 1 */}
      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)]">
        <div className="text-center">
          <p className="mb-2 text-xs tracking-[0.2em] text-[var(--color-accent)]">BỘ SƯU TẬP</p>
          <h2
            className="mb-12 text-3xl text-[var(--color-text-primary)] md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Sản phẩm sẽ được hiển thị ở đây trong Phase 1.
          </p>
        </div>
      </section>
    </>
  );
}
