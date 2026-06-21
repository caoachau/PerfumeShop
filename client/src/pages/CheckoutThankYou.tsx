import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

/** Trang sau khi đặt hàng (orderId từ `createOrder`). */
export default function CheckoutThankYouPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-6 py-20">
      <Helmet defaultTitle="">
        <title>Đặt hàng thành công | HC PERFUME HOUSE</title>
      </Helmet>

      <div className="mx-auto max-w-lg text-center space-y-6">
        <h1 className="font-display text-[2rem] sm:text-[2.5rem] text-[var(--color-text-strong)] uppercase tracking-[0.2em]">
          Cảm ơn quý khách
        </h1>
        <p className="font-body tracking-[0.2em] text-sm text-[var(--color-text-soft)] uppercase">
          Đơn hàng đã được tiếp nhận.{orderId && ` Mã: ${orderId}`}
        </p>
        <p className="font-body tracking-[0.15em] text-xs text-[var(--color-text-muted)]">
          Chúng tôi sẽ xác nhận và gửi cập nhật qua thông tin bạn đã cung cấp.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/"
            className="inline-flex min-h-touch items-center border border-black bg-black px-6 py-4 text-[10px] font-medium uppercase tracking-[0.34em] text-white transition-colors hover:bg-white hover:text-black"
          >
            Về cửa hàng
          </Link>
          {orderId && (
            <Link
              to="/account/orders"
              className="inline-flex min-h-touch items-center border border-black bg-transparent px-6 py-4 text-[10px] font-medium uppercase tracking-[0.34em] transition-colors hover:bg-black hover:text-white"
            >
              Đơn hàng của tôi
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
