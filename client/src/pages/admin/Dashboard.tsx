import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Package, ShieldCheck } from 'lucide-react';
import { adminCard } from '../../components/admin/adminStyles';

export default function AdminDashboard() {
  return (
    <>
      <Helmet>
        <title>Quản trị — Tổng quan</title>
      </Helmet>

      <div className="w-full">
        <header className="mb-10">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent-gold)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            HC Perfume Admin
          </p>
          <h1 className="mt-2 text-3xl text-[var(--color-text-primary)] sm:text-[2.125rem]" style={{ fontFamily: 'var(--font-heading)' }}>
            Tổng quan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Theo dõi catalog và các thao tác quản trị. Module thống kê đơn hàng và khách sẽ được bổ sung ở bước sau.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <article className={`${adminCard} group flex flex-col p-7`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
              <Package size={22} strokeWidth={1.35} aria-hidden />
            </div>
            <h2 className="text-lg font-medium text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Sản phẩm
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Tạo, chỉnh sửa SKU, ẩn một sản phẩm trên storefront hoặc cập nhật hình ảnh.
            </p>
            <Link
              to="/admin/products"
              className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)] transition-colors group-hover:gap-3"
            >
              Đến danh sách <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </Link>
          </article>

          <article className={`${adminCard} flex flex-col p-7 opacity-[0.92]`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-bg-sand)] text-[var(--color-text-muted)]">
              <BarChart3 size={22} strokeWidth={1.35} aria-hidden />
            </div>
            <h2 className="text-lg font-medium text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Đơn hàng & doanh thu
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Dashboard đơn, thanh toán và vận chuyển — đang được triển khai.
            </p>
            <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Sớm có</span>
          </article>

          <article className={`${adminCard} flex flex-col p-7 opacity-[0.92] sm:col-span-2 xl:col-span-1`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-bg-sand)] text-[var(--color-success)]">
              <ShieldCheck size={22} strokeWidth={1.35} aria-hidden />
            </div>
            <h2 className="text-lg font-medium text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Bảo mật
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Khu admin chỉ hiển thị cho tài khoản vai trò <strong className="font-medium text-[var(--color-text-secondary)]">admin</strong>. Phiên dùng
              Bearer + cookie làm mới như các route auth hiện tại.
            </p>
            <Link
              to="/"
              className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)] hover:underline"
            >
              Xem storefront
            </Link>
          </article>
        </div>
      </div>
    </>
  );
}
