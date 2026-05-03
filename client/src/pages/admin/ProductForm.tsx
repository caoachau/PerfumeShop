import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminAddVariant,
  adminCreateProduct,
  adminGetProduct,
  adminUpdateProduct,
  adminUpdateVariant,
  type AdminCreateProductBody,
  type AdminVariant,
  type Concentration,
  type FragranceFamily,
} from '../../services/adminProductService';
import { fetchBrands, fetchCategories, type BrandRow, type CategoryNode } from '../../services/catalogService';
import { deleteCloudinaryAsset, uploadProductImage, uploadProductImages } from '../../services/uploadService';
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminCardInner,
  adminInput,
  adminLabel,
  adminSelect,
  adminSmallInput,
  adminTextarea,
} from '../../components/admin/adminStyles';

const FAMILIES: FragranceFamily[] = [
  'Floral',
  'Woody',
  'Fresh',
  'Oriental',
  'Gourmand',
  'Citrus',
  'Aquatic',
  'Aromatic',
];
const CONCS: Concentration[] = ['EDT', 'EDP', 'EDP Intense', 'Parfum', 'EDC'];
const GENDERS = ['unisex', 'male', 'female'] as const;
const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all'] as const;

function flattenCategories(nodes: CategoryNode[], depth = 0): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  for (const n of nodes) {
    out.push({ id: n._id, label: `${'\u2014 '.repeat(depth)}${n.name}` });
    if (n.children?.length) out.push(...flattenCategories(n.children, depth + 1));
  }
  return out;
}

type VariantDraft = {
  sku: string;
  size: string;
  price: string;
  salePrice: string;
  stock: string;
  isActive: boolean;
};

const emptyVariant = (): VariantDraft => ({
  sku: '',
  size: '',
  price: '',
  salePrice: '',
  stock: '0',
  isActive: true,
});

type ProductImageRow = { id: string; url: string; publicId?: string };

function newImageRow(url: string, publicId?: string): ProductImageRow {
  return { id: crypto.randomUUID(), url: url.trim(), publicId };
}

/** Cloudinary assets under perfumeshop/ — safe to destroy after product save. */
function isManagedCloudinaryAsset(row: ProductImageRow): boolean {
  if (row.publicId?.replace(/^\/+/, '').startsWith('perfumeshop/')) return true;
  try {
    const u = new URL(row.url);
    return u.hostname.includes('cloudinary.com') && u.pathname.includes('/perfumeshop/');
  } catch {
    return false;
  }
}

function pushDestroy(
  queue: { publicId?: string; url?: string }[],
  row: ProductImageRow,
): { publicId?: string; url?: string }[] {
  return [...queue, { publicId: row.publicId, url: row.url }];
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [catFlat, setCatFlat] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fragranceFamily, setFragranceFamily] = useState<FragranceFamily>('Floral');
  const [concentration, setConcentration] = useState<Concentration>('EDP');
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>('unisex');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [imageRows, setImageRows] = useState<ProductImageRow[]>([]);
  const [cloudDeleteTiming, setCloudDeleteTiming] = useState<'after_save' | 'immediate'>('after_save');
  const [pendingDestroy, setPendingDestroy] = useState<{ publicId?: string; url?: string }[]>([]);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [replacingRowId, setReplacingRowId] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const replaceRowIdRef = useRef<string | null>(null);
  const pendingDestroyRef = useRef<{ publicId?: string; url?: string }[]>([]);
  const latestImageRowsRef = useRef<ProductImageRow[]>([]);

  pendingDestroyRef.current = pendingDestroy;
  latestImageRowsRef.current = imageRows;

  const [manualUrlText, setManualUrlText] = useState('');
  const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
  const [topNotesText, setTopNotesText] = useState('');
  const [heartNotesText, setHeartNotesText] = useState('');
  const [baseNotesText, setBaseNotesText] = useState('');
  const [description, setDescription] = useState('');
  const [isEngravable, setIsEngravable] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);
  const [existingVariants, setExistingVariants] = useState<AdminVariant[]>([]);
  const [newVariant, setNewVariant] = useState<VariantDraft>(emptyVariant());

  const imagesArr = useMemo(() => imageRows.map((r) => r.url).filter(Boolean), [imageRows]);

  useEffect(() => {
    if (imagesArr.length === 0) {
      setImagePreviewIndex(0);
      return;
    }
    setImagePreviewIndex((i) => Math.min(Math.max(0, i), imagesArr.length - 1));
  }, [imagesArr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [cats, brs] = await Promise.all([fetchCategories(), fetchBrands()]);
        if (cancelled) return;
        setCatFlat(flattenCategories(cats));
        setBrands(brs);

        if (isNew || !id) {
          setImageRows([]);
          setManualUrlText('');
          setPendingDestroy([]);
        }

        if (!isNew && id) {
          const p = await adminGetProduct(id);
          if (cancelled) return;
          setPendingDestroy([]);
          setName(p.name);
          setSlug(p.slug);
          setBrandId(typeof p.brand === 'object' && p.brand ? (p.brand as { _id: string })._id : '');
          setCategoryId(typeof p.category === 'object' && p.category ? (p.category as { _id: string })._id : '');
          setFragranceFamily(p.fragranceFamily);
          setConcentration(p.concentration);
          setGender(p.gender || 'unisex');
          setSeasons(Array.isArray(p.season) ? [...p.season] : []);
          setImageRows((p.images || []).map((url) => newImageRow(url)));
          setTopNotesText((p.topNotes || []).join(', '));
          setHeartNotesText((p.heartNotes || []).join(', '));
          setBaseNotesText((p.baseNotes || []).join(', '));
          setDescription(p.description || '');
          setIsEngravable(Boolean(p.isEngravable));
          setIsActive(Boolean(p.isActive));
          setExistingVariants(p.variants || []);
        }
      } catch (e: unknown) {
        const msg =
          e && typeof e === 'object' && 'response' in e
            ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;
        toast.error(msg || 'Không tải dữ liệu form');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  function toggleSeason(s: string) {
    setSeasons((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function parseList(csv: string): string[] {
    return csv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleImageFilesPicked(fileList: FileList | File[] | null) {
    if (!fileList?.length) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      toast.error('Chỉ chọn file ảnh');
      return;
    }
    setUploadingImages(true);
    try {
      const merged: { url: string; publicId: string }[] = [];
      for (let i = 0; i < files.length; i += 15) {
        const chunk = files.slice(i, i + 15);
        const part = await uploadProductImages(chunk);
        merged.push(...part);
      }
      setImageRows((prev) => [...prev, ...merged.map((f) => newImageRow(f.url, f.publicId))]);
      toast.success(`Đã tải ${merged.length} ảnh lên Cloudinary`);
    } catch {
      toast.error('Upload thất bại — kiểm tra đăng nhập admin và dung lượng tối đa 12MB/ảnh');
    } finally {
      setUploadingImages(false);
    }
  }

  function addManualUrls() {
    const lines = manualUrlText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!lines.length) {
      toast.error('Chưa có URL');
      return;
    }
    setImageRows((prev) => {
      const existing = new Set(prev.map((r) => r.url));
      const next = [...prev];
      for (const url of lines) {
        if (!existing.has(url)) {
          existing.add(url);
          next.push(newImageRow(url));
        }
      }
      return next;
    });
    setManualUrlText('');
    toast.success('Đã thêm URL vào danh sách');
  }

  function openReplacePicker(rowId: string) {
    replaceRowIdRef.current = rowId;
    replaceFileInputRef.current?.click();
  }

  async function handleReplacePickedFile(file: File) {
    const rowId = replaceRowIdRef.current;
    replaceRowIdRef.current = null;
    if (!rowId) return;
    const old = latestImageRowsRef.current.find((r) => r.id === rowId);
    if (!old) return;

    setReplacingRowId(rowId);
    try {
      const res = await uploadProductImage(file);
      const wasManaged = isManagedCloudinaryAsset(old);
      if (wasManaged && cloudDeleteTiming === 'after_save') {
        setPendingDestroy((p) => pushDestroy(p, old));
      } else if (wasManaged && cloudDeleteTiming === 'immediate') {
        try {
          await deleteCloudinaryAsset({ publicId: old.publicId, url: old.url });
        } catch {
          toast.error('Ảnh mới đã tải lên nhưng chưa xóa được ảnh cũ trên Cloudinary.');
          return;
        }
      }
      setImageRows((rows) =>
        rows.map((r) =>
          r.id === rowId ? { ...r, url: res.url.trim(), publicId: res.publicId } : r,
        ),
      );
      toast.success('Đã đổi ảnh');
    } catch {
      toast.error('Không tải được ảnh mới — kiểm tra đăng nhập admin và dung lượng tối đa 12MB');
    } finally {
      setReplacingRowId(null);
    }
  }

  async function removeImageRow(rowId: string) {
    if (removingImageId || replacingRowId) return;
    const row = latestImageRowsRef.current.find((r) => r.id === rowId);
    if (!row) return;

    if (isManagedCloudinaryAsset(row) && cloudDeleteTiming === 'after_save') {
      setPendingDestroy((p) => pushDestroy(p, row));
      setImageRows((rows) => rows.filter((r) => r.id !== rowId));
      toast.success('Đã bỏ ảnh khỏi sản phẩm — file trên Cloudinary sẽ gỡ sau khi bạn Lưu');
      return;
    }

    if (isManagedCloudinaryAsset(row) && cloudDeleteTiming === 'immediate') {
      setRemovingImageId(rowId);
      try {
        await deleteCloudinaryAsset({ publicId: row.publicId, url: row.url });
      } catch {
        toast.error('Không xóa được ảnh trên Cloudinary — đăng nhập admin và thử lại');
        return;
      } finally {
        setRemovingImageId(null);
      }
    }

    setImageRows((rows) => rows.filter((r) => r.id !== rowId));
    toast.success('Đã xóa ảnh');
  }

  async function flushQueuedCloudinaryDeletes() {
    const batch = [...pendingDestroyRef.current];
    if (!batch.length) return;
    const outcomes = await Promise.allSettled(batch.map((d) => deleteCloudinaryAsset(d)));
    const failed = outcomes.filter((o) => o.status === 'rejected').length;
    if (failed) {
      toast.error(`${failed}/${batch.length} ảnh chưa xóa được trên Cloudinary (sản phẩm đã lưu).`);
      return;
    }
    setPendingDestroy([]);
  }

  function handleCloudTimingChange(next: 'after_save' | 'immediate') {
    if (next === cloudDeleteTiming) return;
    if (pendingDestroy.length > 0) {
      toast.error(
        `Đang chờ gỡ ${pendingDestroy.length} ảnh trên Cloudinary khi Lưu — Lưu sản phẩm hoặc bổ sung ảnh / đổi chế độ sau.`,
      );
      return;
    }
    setCloudDeleteTiming(next);
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!brandId || !categoryId) {
      toast.error('Chọn thương hiệu và danh mục');
      return;
    }

    const bodyCommon = {
      name,
      slug: slug.trim() || undefined,
      brandId,
      categoryId,
      fragranceFamily,
      concentration,
      gender,
      season: seasons as AdminCreateProductBody['season'],
      images: imagesArr,
      topNotes: parseList(topNotesText),
      heartNotes: parseList(heartNotesText),
      baseNotes: parseList(baseNotesText),
      description,
      isEngravable,
      isActive,
    };

    setSaving(true);
    try {
      if (isNew) {
        const vRows = variants
          .map((v) => ({
            sku: v.sku.trim(),
            size: v.size.trim(),
            price: Number(v.price),
            salePrice: v.salePrice.trim() === '' ? undefined : Number(v.salePrice),
            stock: Number(v.stock) || 0,
            isActive: v.isActive,
          }))
          .filter((v) => v.sku && v.size && Number.isFinite(v.price));

        if (vRows.length < 1) {
          toast.error('Thêm ít nhất một biến thể hợp lệ (SKU, size, giá)');
          setSaving(false);
          return;
        }

        await adminCreateProduct({
          ...bodyCommon,
          variants: vRows,
        });
        await flushQueuedCloudinaryDeletes();
        toast.success('Đã tạo sản phẩm');
        navigate('/admin/products');
      } else if (id) {
        await adminUpdateProduct(id, bodyCommon);
        await flushQueuedCloudinaryDeletes();
        toast.success('Đã cập nhật sản phẩm');
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } } })
              .response?.data?.message
          : undefined;
      const errors = (err as { response?: { data?: { errors?: { field: string; message: string }[] } } })?.response
        ?.data?.errors;
      toast.error(msg || 'Lưu thất bại');
      if (errors?.length) console.warn(errors);
    } finally {
      setSaving(false);
    }
  }

  async function saveVariantRow(v: AdminVariant, draft: VariantDraft) {
    if (!id) return;
    try {
      await adminUpdateVariant(v._id, {
        sku: draft.sku,
        size: draft.size,
        price: Number(draft.price),
        salePrice: draft.salePrice.trim() === '' ? null : Number(draft.salePrice),
        stock: Number(draft.stock) || 0,
        isActive: draft.isActive,
      });
      toast.success('Đã lưu biến thể');
      const p = await adminGetProduct(id);
      setExistingVariants(p.variants || []);
    } catch {
      toast.error('Không lưu được biến thể');
    }
  }

  async function addVariantSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!newVariant.sku.trim() || !newVariant.size.trim() || !Number.isFinite(Number(newVariant.price))) {
      toast.error('SKU, dung tích và giá là bắt buộc');
      return;
    }
    try {
      await adminAddVariant(id, {
        sku: newVariant.sku.trim(),
        size: newVariant.size.trim(),
        price: Number(newVariant.price),
        salePrice: newVariant.salePrice.trim() === '' ? undefined : Number(newVariant.salePrice),
        stock: Number(newVariant.stock) || 0,
        isActive: newVariant.isActive,
      });
      toast.success('Đã thêm biến thể');
      setNewVariant(emptyVariant());
      const p = await adminGetProduct(id);
      setExistingVariants(p.variants || []);
    } catch {
      toast.error('Không thêm được biến thể');
    }
  }

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <p className="text-sm text-[var(--color-text-muted)]">Đang tải biểu mẫu…</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isNew ? 'Admin — Thêm sản phẩm' : 'Admin — Sửa sản phẩm'}</title>
      </Helmet>

      <div className="w-full max-w-4xl">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]" aria-label="Breadcrumb">
          <Link to="/admin/products" className="transition-colors hover:text-[var(--color-accent)]">
            Sản phẩm
          </Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-[var(--color-text-primary)]">{isNew ? 'Thêm mới' : 'Chỉnh sửa'}</span>
        </nav>

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-gold)]">Catalog</p>
            <h1 className="mt-1 text-3xl text-[var(--color-text-primary)] sm:text-[2rem]" style={{ fontFamily: 'var(--font-heading)' }}>
              {isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
            </h1>
          </div>
          <Link to="/admin/products" className={`${adminBtnSecondary} self-start sm:self-auto`}>
            ← Danh sách
          </Link>
        </div>

      <form onSubmit={handleSaveProduct} className={`${adminCard} flex flex-col`}>
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/60 px-6 py-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Biểu mẫu sản phẩm</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Sau khi tạo, bạn có thể thêm nhiều biến thể (SKU/dung tích/giá) trong trang chỉnh sửa.
          </p>
        </div>

        <div className="space-y-10 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Thông tin chung
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className={adminLabel}>Tên *</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={adminInput} />
              </label>
              <label className="block text-sm">
                <span className={adminLabel}>Slug (tuỳ chọn)</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className={adminInput} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className={adminLabel}>Thương hiệu *</span>
                <select required value={brandId} onChange={(e) => setBrandId(e.target.value)} className={adminSelect}>
                  <option value="">— Chọn —</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className={adminLabel}>Danh mục *</span>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={adminSelect}
                >
                  <option value="">— Chọn —</option>
                  {catFlat.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Phân nhóm & tầng hương
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm">
                <span className={adminLabel}>Nhóm hương</span>
                <select
                  value={fragranceFamily}
                  onChange={(e) => setFragranceFamily(e.target.value as FragranceFamily)}
                  className={adminSelect}
                >
                  {FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className={adminLabel}>Nồng độ</span>
                <select
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value as Concentration)}
                  className={adminSelect}
                >
                  {CONCS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className={adminLabel}>Giới tính</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'unisex')}
                  className={adminSelect}
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset className={`${adminCardInner} p-4 text-sm`}>
              <legend className={`${adminLabel} mb-3 !uppercase px-1`}>Mùa áp dụng (tuỳ chọn)</legend>
              <div className="flex flex-wrap gap-4">
                {SEASONS.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <input type="checkbox" checked={seasons.includes(s)} onChange={() => toggleSeason(s)} className="rounded-sm accent-[var(--color-accent)]" />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="space-y-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Ảnh & nội dung hiển thị
            </h3>
            <div className="space-y-4 text-sm">
              <div
                className={`${adminCardInner} border-[var(--color-accent-gold)]/35 bg-[var(--color-accent-gold)]/6 p-4 text-xs text-[var(--color-text-secondary)]`}
                role="note"
              >
                <p className="font-semibold text-[var(--color-text-primary)]">Ràng buộc &amp; giới hạn khi sửa ảnh</p>
                <ul className="mt-3 list-disc space-y-2 pl-[1.35rem] marker:text-[var(--color-accent-gold)]">
                  <li>Phải đăng nhập <strong>admin</strong> (token còn hạn) để upload hoặc gỡ file trên Cloudinary.</li>
                  <li>
                    Tối đa <strong>15</strong> ảnh mỗi lần chọn; dung lượng mỗi file khoảng <strong>12&nbsp;MB</strong>; chỉ
                    chấp nhận file ảnh.
                  </li>
                  <li>
                    Toàn bộ API có <strong>giới hạn số request / 15 phút</strong> theo IP — nếu gặp « Too many requests » hãy
                    đợi vài phút hoặc tăng <span className="font-mono">API_RATE_LIMIT_MAX</span> trên server.
                  </li>
                  <li>
                    Chỉ URL Cloudinary có đường dẫn <span className="font-mono">…/perfumeshop/…</span> mới được xóa
                    trực tiếp trên Cloudinary; URL ngoài chỉ bị bỏ khỏi danh sách sản phẩm trong DB.
                  </li>
                </ul>
              </div>

              <fieldset className={`${adminCardInner} space-y-3 p-4`}>
                <legend className={`${adminLabel} mb-2 px-1`}>Khi xóa hoặc đổi ảnh đang có</legend>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                  Ảnh upload được lưu trên Cloudinary (<span className="font-mono">perfumeshop/products</span>). Dùng{' '}
                  <strong>Đổi ảnh</strong> để thay bằng file mới, hoặc <strong>Xóa</strong> để bỏ dòng.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-[var(--color-text-secondary)]">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="cloudDeleteTiming"
                      checked={cloudDeleteTiming === 'after_save'}
                      onChange={() => handleCloudTimingChange('after_save')}
                      disabled={replacingRowId != null || removingImageId != null}
                      className="accent-[var(--color-accent)] disabled:opacity-45"
                    />
                    Gỡ file cũ trên Cloudinary <strong>sau khi Lưu</strong> (mặc định)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="cloudDeleteTiming"
                      checked={cloudDeleteTiming === 'immediate'}
                      onChange={() => handleCloudTimingChange('immediate')}
                      disabled={replacingRowId != null || removingImageId != null}
                      className="accent-[var(--color-accent)] disabled:opacity-45"
                    />
                    Gỡ <strong>ngay</strong> trên Cloudinary khi Xóa / Đổi
                  </label>
                </div>
              </fieldset>

              {pendingDestroy.length > 0 && (
                <p className="text-xs font-medium text-[var(--color-accent-gold)]" role="status">
                  Hàng chờ gỡ Cloudinary: <strong>{pendingDestroy.length}</strong> — thực hiện khi «{' '}
                  {isNew ? 'Tạo sản phẩm' : 'Lưu thông tin'} » thành công.
                </p>
              )}

              <input
                ref={replaceFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImages || replacingRowId != null || saving}
                aria-hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void handleReplacePickedFile(file);
                }}
              />

              <div>
                <span className={adminLabel}>Ảnh sản phẩm — thêm nhiều ảnh</span>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Luôn bấm <strong>Lưu</strong> sau khi chỉnh danh sách để cập nhật database sản phẩm (kể cả khi chọn gỡ
                  Cloudinary « sau khi Lưu »).
                </p>
                <div
                  className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-10 transition-colors hover:border-[var(--color-accent)]/60 ${uploadingImages ? 'pointer-events-none opacity-60' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleImageFilesPicked(e.dataTransfer.files);
                  }}
                >
                  <label className={`${adminBtnSecondary} cursor-pointer sm:!py-2`}>
                    {uploadingImages ? 'Đang tải…' : 'Chọn ảnh từ máy'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploadingImages || saving}
                      onChange={(e) => {
                        void handleImageFilesPicked(e.target.files);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-[var(--color-text-muted)]">hoặc thả ảnh vào khung này</span>
                </div>
              </div>

              {imageRows.length > 0 && (
                <ul className="space-y-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3">
                  {imageRows.map((row) => (
                    <li key={row.id} className="flex flex-wrap items-start gap-x-3 gap-y-2 text-xs">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                        <img src={row.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <span className="min-w-0 flex-1 truncate font-mono text-[var(--color-text-muted)]">{row.url}</span>
                      <div className="flex shrink-0 flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={
                            uploadingImages ||
                            replacingRowId != null ||
                            removingImageId != null ||
                            saving
                          }
                          className={`${adminBtnGhost} disabled:pointer-events-none disabled:opacity-50`}
                          onClick={() => openReplacePicker(row.id)}
                        >
                          {replacingRowId === row.id ? 'Đang đổi…' : 'Đổi ảnh'}
                        </button>
                        <button
                          type="button"
                          disabled={removingImageId === row.id || replacingRowId != null || saving}
                          className={`${adminBtnGhost} shrink-0 !text-[var(--color-error)] hover:!text-[var(--color-error)] disabled:pointer-events-none disabled:opacity-50`}
                          onClick={() => void removeImageRow(row.id)}
                        >
                          {removingImageId === row.id ? 'Đang xóa…' : 'Xóa'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div>
                <span className={adminLabel}>URL bổ sung (tuỳ chọn)</span>
                <textarea
                  value={manualUrlText}
                  onChange={(e) => setManualUrlText(e.target.value)}
                  rows={3}
                  className={adminTextarea}
                  placeholder="Mỗi dòng một URL https://…"
                />
                <button type="button" className={`${adminBtnGhost} mt-2`} onClick={addManualUrls}>
                  Thêm URL vào danh sách
                </button>
              </div>

              {imagesArr.length > 0 ? (
                <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5">
                  <span className={adminLabel}>Xem trước ảnh (giống trang chủ / shop)</span>
                  <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <div className="aspect-square max-h-[300px] w-full max-w-[300px] overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                      <img
                        key={imagesArr[imagePreviewIndex]}
                        src={imagesArr[imagePreviewIndex]}
                        alt="Xem trước sản phẩm"
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                    {imagesArr.length > 1 && (
                      <div className="flex flex-wrap gap-2 sm:flex-col">
                        {imageRows.map((row, i) => (
                          <button
                            key={row.id}
                            type="button"
                            onClick={() => setImagePreviewIndex(i)}
                            title={`Ảnh ${i + 1}`}
                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-[var(--color-bg-surface)] p-0.5 transition-colors ${
                              i === imagePreviewIndex ? 'border-[var(--color-accent)]' : 'border-transparent hover:border-[var(--color-border)]'
                            }`}
                          >
                            <img src={row.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-[var(--color-text-muted)]">Chưa có ảnh — tải từ máy hoặc thêm URL.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm sm:col-span-1">
                <span className={adminLabel}>Top notes (phẩy)</span>
                <input value={topNotesText} onChange={(e) => setTopNotesText(e.target.value)} className={adminInput} />
              </label>
              <label className="block text-sm sm:col-span-1">
                <span className={adminLabel}>Heart notes</span>
                <input value={heartNotesText} onChange={(e) => setHeartNotesText(e.target.value)} className={adminInput} />
              </label>
              <label className="block text-sm sm:col-span-1">
                <span className={adminLabel}>Base notes</span>
                <input value={baseNotesText} onChange={(e) => setBaseNotesText(e.target.value)} className={adminInput} />
              </label>
            </div>

            <label className="block text-sm">
              <span className={adminLabel}>Mô tả</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={adminTextarea} />
            </label>

            <div className={`${adminCardInner} flex flex-wrap gap-6 px-4 py-4 text-sm`}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={isEngravable} onChange={(e) => setIsEngravable(e.target.checked)} className="rounded-sm accent-[var(--color-accent)]" />
                <span className="text-[var(--color-text-secondary)]">Cho phép khắc tên</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded-sm accent-[var(--color-accent)]" />
                <span className="text-[var(--color-text-secondary)]">Đang bán (hiển thị cửa hàng)</span>
              </label>
            </div>
          </section>

          {isNew && (
          <section className={`${adminCardInner} space-y-4 border border-dashed border-[var(--color-accent)]/25 p-5`}>
            <h3 className="text-[15px] font-medium text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Biến thể ban đầu
            </h3>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              Thêm ít nhất một dòng SKU, dung tích và giá.
            </p>
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className={`${adminCardInner} grid gap-2 bg-[var(--color-bg-primary)] p-3 sm:grid-cols-6`}>
                  <input placeholder="SKU" value={v.sku} onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, sku: e.target.value } : r)))} className={adminSmallInput} />
                  <input placeholder="Size" value={v.size} onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, size: e.target.value } : r)))} className={adminSmallInput} />
                  <input placeholder="Giá" type="number" value={v.price} onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, price: e.target.value } : r)))} className={adminSmallInput} />
                  <input placeholder="Giá sale" type="number" value={v.salePrice} onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, salePrice: e.target.value } : r)))} className={adminSmallInput} />
                  <input placeholder="Tồn" type="number" value={v.stock} onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, stock: e.target.value } : r)))} className={adminSmallInput} />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={v.isActive} className="rounded-sm accent-[var(--color-accent)]" onChange={(e) => setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, isActive: e.target.checked } : r)))} />
                      Active
                    </label>
                    <button type="button" className={`${adminBtnGhost} !text-[var(--color-error)] hover:!text-[var(--color-error)]`} onClick={() => setVariants((rows) => rows.filter((_, i) => i !== idx))}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className={`${adminBtnGhost} px-1`} onClick={() => setVariants((r) => [...r, emptyVariant()])}>
                + Thêm dòng biến thể
              </button>
            </div>
          </section>
          )}

        </div>

        <div className="flex flex-wrap gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]/45 px-6 py-5 md:px-8">
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? 'Đang lưu…' : isNew ? 'Tạo sản phẩm' : 'Lưu thông tin'}
          </button>
        </div>
      </form>

      {!isNew && id && (
        <section className={`${adminCard} mt-12 p-6 md:p-8`}>
          <div className="border-b border-[var(--color-border)] pb-5">
            <h2 className="text-xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Biến thể
            </h2>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">Lưu từng dòng khi chỉnh SKU, giá hoặc tồn.</p>
          </div>
          <div className="space-y-4 pt-6">
            {existingVariants.map((v) => (
              <VariantEditorRow key={v._id} v={v} onSave={(draft) => void saveVariantRow(v, draft)} />
            ))}
          </div>

          <div className="mt-10 border-t border-[var(--color-border)] pt-8">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Thêm biến thể mới
            </h3>
            <form onSubmit={addVariantSubmit} className={`${adminCardInner} grid gap-3 bg-[var(--color-bg-primary)] p-4 sm:grid-cols-6`}>
              <input placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant((s) => ({ ...s, sku: e.target.value }))} className={adminSmallInput} />
              <input placeholder="Size" value={newVariant.size} onChange={(e) => setNewVariant((s) => ({ ...s, size: e.target.value }))} className={adminSmallInput} />
              <input placeholder="Giá" type="number" value={newVariant.price} onChange={(e) => setNewVariant((s) => ({ ...s, price: e.target.value }))} className={adminSmallInput} />
              <input placeholder="Giá sale" type="number" value={newVariant.salePrice} onChange={(e) => setNewVariant((s) => ({ ...s, salePrice: e.target.value }))} className={adminSmallInput} />
              <input placeholder="Tồn" type="number" value={newVariant.stock} onChange={(e) => setNewVariant((s) => ({ ...s, stock: e.target.value }))} className={adminSmallInput} />
              <button type="submit" className={adminBtnSecondary}>
                Thêm
              </button>
            </form>
          </div>
        </section>
      )}
      </div>
    </>
  );
}

function VariantEditorRow({ v, onSave }: { v: AdminVariant; onSave: (d: VariantDraft) => void }) {
  const [draft, setDraft] = useState<VariantDraft>({
    sku: v.sku,
    size: v.size,
    price: String(v.price),
    salePrice: v.salePrice != null && v.salePrice !== undefined ? String(v.salePrice) : '',
    stock: String(v.stock),
    isActive: v.isActive,
  });

  return (
    <div className={`${adminCardInner} grid gap-2 bg-[var(--color-bg-primary)] p-3 sm:grid-cols-6`}>
      <input value={draft.sku} onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))} className={adminSmallInput} />
      <input value={draft.size} onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))} className={adminSmallInput} />
      <input type="number" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} className={adminSmallInput} />
      <input type="number" value={draft.salePrice} onChange={(e) => setDraft((d) => ({ ...d, salePrice: e.target.value }))} className={adminSmallInput} />
      <input type="number" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} className={adminSmallInput} />
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={draft.isActive} className="rounded-sm accent-[var(--color-accent)]" onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} />
          Active
        </label>
        <button type="button" className={adminBtnSecondary} onClick={() => onSave(draft)}>
          Lưu
        </button>
      </div>
    </div>
  );
}
