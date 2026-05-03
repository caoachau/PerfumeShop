import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff, Leaf, Loader2, Package } from 'lucide-react';
import { login } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const data = await login(email.trim(), password);
      setUser(data.user, data.accessToken);
      toast.success('Đã đăng nhập.');
      const from = (location.state as { from?: string } | null)?.from;
      const safeFrom = from && from.startsWith('/') ? from : null;
      const fallback = data.user.role === 'admin' ? '/admin' : '/';
      navigate(safeFrom ?? fallback, { replace: true });
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
          ? err.response.data.message
          : 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputShell =
    'flex w-full items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 text-sm transition-colors duration-[var(--transition-fast)] focus-within:border-[var(--color-border-accent)] focus-within:shadow-[var(--shadow-glow)]';

  return (
    <>
      <Helmet>
        <title>Đăng nhập — HC Perfume</title>
      </Helmet>

      <section className="relative isolate min-h-[min(680px,calc(100vh-12rem))] overflow-hidden px-6 py-10 sm:px-10 lg:min-h-[min(760px,calc(100vh-10rem))] lg:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(139,115,53,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(92,74,30,0.12), transparent 50%), linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-cream) 100%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-16 lg:items-center">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden />
              Về trang chủ
            </Link>

            <p
              className="mt-8 text-[11px] font-medium tracking-[0.28em] text-[var(--color-accent-gold)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              HC PERFUME · TÀI KHOẢN
            </p>
            <h1
              className="mt-3 max-w-xl text-[2.125rem] font-medium leading-[1.12] text-[var(--color-text-primary)] sm:text-5xl sm:leading-[1.08]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Chào mừng trở lại
              <span className="mt-2 block text-[1.35rem] font-normal italic text-[var(--color-text-secondary)] sm:text-[1.6rem]">
                không gian hương dành cho bạn.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Đăng nhập để quản lý đơn hàng, cửa hàng yêu thích và nhận ưu đãi độc quyền. Khách có tài khoản
              quản trị sẽ được chuyển tới khu vực admin sau khi xác thực.
            </p>

            <ul className="mt-10 space-y-5">
              <li className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
                  <Package size={20} strokeWidth={1.35} aria-hidden />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Theo dõi đơn hàng</p>
                  <p className="mt-1 text-xs leading-snug text-[var(--color-text-muted)]">
                    Xem trạng thái và lịch sử mua trong một nơi.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
                  <Leaf size={20} strokeWidth={1.35} aria-hidden />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Khuyến mãi và thông báo</p>
                  <p className="mt-1 text-xs leading-snug text-[var(--color-text-muted)]">
                    Cập nhật bộ sưu tập mới và ưu đãi được chọn riêng.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-9 shadow-[var(--shadow-elevated)] sm:px-10 sm:py-10">
              <h2 className="text-xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Đăng nhập
              </h2>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">Nhập email và mật khẩu đã đăng ký.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {formError && (
                  <p
                    className="rounded-sm border border-[var(--color-error)]/25 bg-[var(--color-error)]/06 px-3 py-2.5 text-xs text-[var(--color-error)]"
                    role="alert"
                  >
                    {formError}
                  </p>
                )}

                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-[11px] font-medium tracking-wide text-[var(--color-text-secondary)]">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="ban@example.com"
                    disabled={submitting}
                    className={`${inputShell} py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="login-password" className="text-[11px] font-medium tracking-wide text-[var(--color-text-secondary)]">
                      Mật khẩu
                    </label>
                    <span className="text-[10px] text-[var(--color-text-muted)]">Quên mật khẩu? Liên hệ cửa hàng.</span>
                  </div>
                  <div className={`${inputShell} gap-2 py-1.5 ps-3 pe-2`}>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="••••••••"
                      disabled={submitting}
                      className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setShowPassword((v) => !v)}
                      className="rounded-sm p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-accent)]/40"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.35} /> : <Eye size={18} strokeWidth={1.35} />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    disabled={submitting}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-sm accent-[var(--color-accent)]"
                  />
                  <span className="text-xs leading-snug text-[var(--color-text-secondary)]">
                    Duy trì đăng nhập trên thiết bị này (cookie phiên được lưu theo chính sách bảo mật của chúng
                    tôi).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-accent)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-wait disabled:opacity-65"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} aria-hidden />
                      Đang xử lý…
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>

              <p className="mt-8 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-muted)]">
                Chưa có tài khoản khách hàng?{' '}
                <Link to="/shop" className="font-medium text-[var(--color-accent)] underline-offset-4 hover:underline">
                  Tiếp tục dạo cửa hàng
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
