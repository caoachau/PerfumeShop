import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Shield } from 'lucide-react';
import { displayProductImage, effectivePrice, formatVnd } from '../lib/productMedia';
import { fetchServerCart, syncServerCart, type ServerCartLine } from '../services/cartService';
import { createOrder } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const DEFAULT_SHIPPING_FEE = 30_000;

const inputClass =
  'w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[11px] tracking-[0.08em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none';

export default function Checkout() {
  const navigate = useNavigate();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearCart = useCartStore((s) => s.clearCart);

  const [bootstrapping, setBootstrapping] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [cartLines, setCartLines] = useState<ServerCartLine[]>([]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadCart = useCallback(async () => {
    setLoadError('');
    const local = useCartStore.getState().items;
    const payload = local.map((i) => ({
      variantId: i.variantId,
      qty: i.qty,
      engravingText: i.engravingText ?? undefined,
    }));
    await syncServerCart(payload);
    const lines = await fetchServerCart();
    setCartLines(lines);
  }, []);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    (async () => {
      try {
        await loadCart();
      } catch {
        setLoadError('Không tải được giỏ hàng. Thử lại sau.');
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [isLoading, isAuthenticated, loadCart]);

  useEffect(() => {
    if (!user) return;
    setEmail((e) => e || user.email || '');
    setPhone((p) => p || user.phone || '');
    setFullName((n) => n || user.name || '');
  }, [user]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of cartLines) {
      const v = line.variant;
      if (!v) continue;
      sum += effectivePrice(v.price, v.salePrice) * line.qty;
    }
    return sum;
  }, [cartLines]);

  const grandTotal = subtotal + DEFAULT_SHIPPING_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!cartLines.length) {
      setFormError('Giỏ hàng trống.');
      return;
    }
    setSubmitting(true);
    try {
      const { order } = await createOrder({
        shippingAddress: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          street: street.trim(),
          ward: ward.trim(),
          district: district.trim(),
          province: province.trim(),
        },
        shippingFee: DEFAULT_SHIPPING_FEE,
        paymentMethod,
        note: note.trim() || undefined,
      });
      clearCart();
      toast.success('Đặt hàng thành công.');
      navigate(`/checkout/thank-you/${order._id}`, { replace: true });
    } catch (err) {
      let msg = 'Không tạo được đơn. Vui lòng thử lại.';
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
        msg = err.response.data.message;
      }
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/checkout' }} />;
  }

  if (isLoading || bootstrapping) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-[var(--color-text-muted)]">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <span className="text-sm tracking-[0.12em] uppercase">Đang tải giỏ hàng…</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{loadError}</p>
        <button
          type="button"
          onClick={() => {
            setLoadError('');
            setBootstrapping(true);
            loadCart()
              .catch(() => setLoadError('Không tải được giỏ hàng.'))
              .finally(() => setBootstrapping(false));
          }}
          className="border border-black bg-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!cartLines.length) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <Helmet>
          <title>Thanh toán — HC PERFUME HOUSE</title>
        </Helmet>
        <p className="mb-6 font-body text-sm tracking-[0.15em] text-[var(--color-text-soft)] uppercase">
          Giỏ hàng của bạn đang trống.
        </p>
        <Link
          to="/shop"
          className="inline-flex border border-black bg-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black"
        >
          Mua sắm
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Thanh toán — HC PERFUME HOUSE</title>
      </Helmet>

      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="mb-8 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
          Thanh toán
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2
                className="mb-4 text-xl text-[var(--color-text-strong)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Thông tin giao hàng
              </h2>
              <div className="space-y-4">
                <input
                  className={inputClass}
                  placeholder="Họ và tên *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className={inputClass}
                    placeholder="Số điện thoại *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="Địa chỉ (số nhà, đường) *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  autoComplete="street-address"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <input
                    className={inputClass}
                    placeholder="Phường / Xã *"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                  />
                  <input
                    className={inputClass}
                    placeholder="Quận / Huyện *"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                  <input
                    className={inputClass}
                    placeholder="Tỉnh / Thành *"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
                <textarea
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="Ghi chú (tuỳ chọn)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <h2
                className="mb-4 text-xl text-[var(--color-text-strong)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Phương thức thanh toán
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-text-primary)]">
                <label className="flex cursor-pointer items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
                  <input
                    type="radio"
                    name="pay"
                    className="accent-[var(--color-accent)]"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label className="flex cursor-pointer items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
                  <input
                    type="radio"
                    name="pay"
                    className="accent-[var(--color-accent)]"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                  />
                  Chuyển khoản ngân hàng
                </label>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-700 dark:text-red-400" role="alert">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/cart"
                className="text-[10px] tracking-[0.15em] text-[var(--color-text-muted)] uppercase hover:text-[var(--color-text-primary)]"
              >
                ← Quay lại giỏ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-touch items-center gap-2 bg-[var(--color-accent)] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Đặt hàng
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[var(--color-bg-surface)] p-6">
              <h3
                className="mb-6 text-xl text-[var(--color-text-strong)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Đơn hàng
              </h3>

              <ul className="space-y-6">
                {cartLines.map((line, idx) => {
                  const v = line.variant;
                  const product = v?.product;
                  const name = product?.name ?? 'Sản phẩm';
                  const imgSalt = (line._id ?? v?._id ?? name).split('').reduce((a, c) => a + c.charCodeAt(0), idx);
                  const imgSrc = displayProductImage(product?.images ?? [], imgSalt);
                  const unit = v ? effectivePrice(v.price, v.salePrice) : 0;
                  return (
                    <li key={line._id ?? `${v?._id}-${line.qty}`} className="flex gap-4">
                      <div className="h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-bg-elevated)]">
                        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
                        {v && (
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            {v.size} × {line.qty}
                            {line.engravingText ? ` · Khắc: ${line.engravingText}` : ''}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-sm text-[var(--color-text-primary)]">
                        {formatVnd(unit * line.qty)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Tạm tính</span>
                  <span className="text-[var(--color-text-primary)]">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Phí vận chuyển</span>
                  <span className="text-[var(--color-text-primary)]">{formatVnd(DEFAULT_SHIPPING_FEE)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-[var(--color-text-primary)] uppercase">
                  Tổng cộng
                </span>
                <span
                  className="text-2xl text-[var(--color-text-strong)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {formatVnd(grandTotal)}
                </span>
              </div>

              <p className="mt-6 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Shield size={14} aria-hidden />
                Thanh toán an toàn qua kết nối mã hoá.
              </p>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
