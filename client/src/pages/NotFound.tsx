import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Không tìm thấy trang | Parfum Shop</title>
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-primary)] px-4 text-center">
        <h1
          className="mb-4 text-8xl text-[var(--color-accent)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>
        <p className="mb-2 text-xl text-[var(--color-text-primary)]">Không tìm thấy trang</p>
        <p className="mb-8 text-[var(--color-text-secondary)]">
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          to="/"
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 text-sm font-medium tracking-wider text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)]"
        >
          VỀ TRANG CHỦ
        </Link>
      </div>
    </>
  );
}
