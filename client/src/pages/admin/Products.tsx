import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDeactivateProduct, adminListProducts, type AdminProductRow } from '../../services/adminProductService';
import {
  adminBadgeOff,
  adminBadgeOn,
  adminBtnDanger,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminTableWrap,
  adminTdRow,
  adminTh,
  adminInput,
} from '../../components/admin/adminStyles';

export default function AdminProducts() {
  const [rows, setRows] = useState<AdminProductRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminListProducts({ page, limit: 20, q: q.trim() || undefined });
      setRows(res.data);
      setTotalPages(res.meta.totalPages || 1);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      toast.error(msg || 'Không tải được danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function deactivate(id: string, name: string) {
    if (!window.confirm(`Ẩn sản phẩm "${name}" khỏi cửa hàng? (isActive = false)`)) return;
    try {
      await adminDeactivateProduct(id);
      toast.success('Đã cập nhật');
      void load();
    } catch {
      toast.error('Thao tác thất bại');
    }
  }

  return (
    <>
      <Helmet>
        <title>Quản trị — Sản phẩm</title>
      </Helmet>

      <div className="w-full">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-gold)]">Catalog</p>
            <h1 className="mt-1 text-3xl text-[var(--color-text-primary)] sm:text-[2.125rem]" style={{ fontFamily: 'var(--font-heading)' }}>
              Sản phẩm
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
              CRUD metadata, giá & tồn theo biến thể. SKU trùng sẽ bị backend từ chối.
            </p>
          </div>
          <Link to="/admin/products/new" className={adminBtnPrimary}>
            <Plus size={17} strokeWidth={2} aria-hidden />
            Thêm sản phẩm
          </Link>
        </header>

        <div className={`${adminCard} mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center`}>
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              size={18}
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  void load();
                }
              }}
              placeholder="Tìm theo tên hoặc slug…"
              className={`${adminInput} pl-11`}
              aria-label="Tìm sản phẩm"
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                void load();
              }}
              className={adminBtnSecondary}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className={adminTableWrap}>
          {loading ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
              <p className="text-sm text-[var(--color-text-muted)]">Đang tải danh sách…</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">Chưa có sản phẩm khớp bộ lọc.</p>
              <Link to="/admin/products/new" className={`${adminBtnGhost} mt-4 inline-flex`}>
                Tạo sản phẩm đầu tiên
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                  <tr>
                    <th className={adminTh}>Sản phẩm</th>
                    <th className={adminTh}>Thương hiệu</th>
                    <th className={adminTh}>Danh mục</th>
                    <th className={`${adminTh} text-end`}>Tồn</th>
                    <th className={`${adminTh} text-center`}>Hiển thị</th>
                    <th className={`${adminTh} text-end`} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p._id} className={adminTdRow}>
                      <td className="px-4 py-3.5 align-top">
                        <p className="font-medium text-[var(--color-text-primary)]">{p.name}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">{p.slug}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">{p.brand?.name ?? '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-[var(--color-text-secondary)]">{p.category?.name ?? '—'}</td>
                      <td className="px-4 py-3.5 text-end text-sm tabular-nums text-[var(--color-text-primary)]">{p.totalStock ?? 0}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={p.isActive ? adminBadgeOn : adminBadgeOff}>{p.isActive ? 'Đang bán' : 'Đã ẩn'}</span>
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        <Link to={`/admin/products/${p._id}/edit`} className={`${adminBtnGhost} mr-3`}>
                          Sửa
                        </Link>
                        <button type="button" className={adminBtnDanger} onClick={() => void deactivate(p._id, p.name)}>
                          Ẩn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`${adminBtnSecondary} gap-2 disabled:pointer-events-none disabled:opacity-35`}
            >
              <ChevronLeft size={18} aria-hidden /> Trước
            </button>
            <span className="rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Trang {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`${adminBtnSecondary} gap-2 disabled:pointer-events-none disabled:opacity-35`}
            >
              Sau <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
