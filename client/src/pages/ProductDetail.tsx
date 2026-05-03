import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Star, Shield, Truck, Heart } from 'lucide-react';
import { ingredientImage } from '../lib/cloudinaryAssets';
import {
  brandDisplayName,
  displayGalleryImages,
  displayProductImage,
  effectivePrice,
  formatVnd,
  minVariantRetailPrice,
} from '../lib/productMedia';
import { fetchProductBySlug, fetchProductReviews, type StoreReviewRow } from '../services/productCatalogService';

const PYRAMID_LABELS = ['TOP NOTES', 'HEART NOTES', 'BASE NOTES'] as const;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [detail, setDetail] = useState<Awaited<ReturnType<typeof fetchProductBySlug>> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [reviews, setReviews] = useState<StoreReviewRow[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [pickedSize, setPickedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setDetail(null);
    setLoadError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await fetchProductBySlug(slug);
        if (!cancelled) setDetail(data);
      } catch {
        if (!cancelled) {
          setDetail(null);
          setLoadError('Không tìm thấy sản phẩm hoặc đã ngừng hiển thị.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!detail?.variants?.length) return;
    setPickedSize((prev) => {
      if (prev && detail.variants.some((v) => v.size === prev)) return prev;
      return detail.variants[0]?.size ?? null;
    });
    setGalleryIndex(0);
    setQty(1);
  }, [detail]);

  useEffect(() => {
    if (!detail?._id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchProductReviews(detail._id, 1, 12);
        if (!cancelled) setReviews(res.data);
      } catch {
        if (!cancelled) setReviews([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [detail?._id]);

  const gallery = useMemo(
    () => displayGalleryImages(detail?.images, slug?.length ?? 0),
    [detail?.images, slug],
  );

  const mainSrc = gallery[Math.min(galleryIndex, gallery.length - 1)] ?? displayProductImage([], 0);

  const activeVariant = useMemo(() => {
    const vs = detail?.variants ?? [];
    if (!vs.length) return undefined;
    const match = pickedSize ? vs.find((v) => v.size === pickedSize) : vs[0];
    return match ?? vs[0];
  }, [detail?.variants, pickedSize]);

  const pyramidNotes = useMemo(() => {
    const top = detail?.topNotes ?? [];
    const heart = detail?.heartNotes ?? [];
    const base = detail?.baseNotes ?? [];
    return [
      top.length ? top : ['Đang cập nhật'],
      heart.length ? heart : ['Đang cập nhật'],
      base.length ? base : ['Đang cập nhật'],
    ] as const;
  }, [detail?.topNotes, detail?.heartNotes, detail?.baseNotes]);

  const related = (detail?.relatedProducts ?? []).slice(0, 8);

  const ingredientStrip = [ingredientImage('bergamot.png'), ingredientImage('tuberose.png'), ingredientImage('sandalwood.png')];

  if (!slug) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <p className="text-sm text-[var(--color-text-muted)]">Thiếu đường dẫn sản phẩm.</p>
      </section>
    );
  }

  if (loading && !loadError) {
    return (
      <section className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-6 py-24">
        <Helmet>
          <title>Sản phẩm — HC Perfume</title>
        </Helmet>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <p className="text-sm text-[var(--color-text-muted)]">Đang tải sản phẩm…</p>
      </section>
    );
  }

  if (loadError || !detail) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 py-16 text-center">
        <Helmet>
          <title>Sản phẩm — HC Perfume</title>
        </Helmet>
        <p className="text-sm text-[var(--color-text-secondary)]">{loadError ?? 'Không có dữ liệu.'}</p>
        <Link to="/shop" className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] text-[var(--color-accent)] hover:underline">
          ← Về cửa hàng
        </Link>
      </section>
    );
  }

  const brand = brandDisplayName(detail.brand);
  const category = detail.category && typeof detail.category === 'object' && 'name' in detail.category ? (detail.category as { name: string }).name : '';
  const concentration = detail.concentration ?? '—';
  const linePrice = activeVariant
    ? formatVnd(effectivePrice(activeVariant.price, activeVariant.salePrice))
    : formatVnd(minVariantRetailPrice(detail.variants ?? []));

  const maxQty = Math.max(1, activeVariant?.stock ?? 1);

  return (
    <>
      <Helmet>
        <title>{detail.name} — HC Perfume</title>
        <meta name="description" content={detail.description?.slice(0, 160)} />
      </Helmet>

      {/* Product Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12">
        <div className="mb-4 text-[11px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          <Link to="/shop" className="hover:text-[var(--color-accent)]">
            Cửa hàng
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)]">{detail.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 aspect-square overflow-hidden bg-[var(--color-bg-surface)]">
              <img src={mainSrc} alt={detail.name} className="h-full w-full object-contain p-8" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {gallery.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`aspect-square overflow-hidden bg-[var(--color-bg-surface)] transition-opacity ${galleryIndex === i ? 'ring-2 ring-[var(--color-accent)]' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Ảnh ${i + 1}`} className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {brand && (
              <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">{brand.toUpperCase()}</p>
            )}
            <h1
              className="mb-2 text-4xl text-[var(--color-text-primary)] md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {detail.name}
            </h1>
            <p className="mb-1 text-sm italic text-[var(--color-text-secondary)]">{concentration}</p>
            <p className="mb-6 max-w-lg whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {detail.description ?? 'Mô tả đang được bổ sung.'}
            </p>

            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <p className="text-3xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {linePrice}
              </p>
              {activeVariant && activeVariant.salePrice != null && activeVariant.salePrice > 0 && activeVariant.salePrice < activeVariant.price && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatVnd(activeVariant.price)}
                </span>
              )}
            </div>

            {(detail.variants?.length ?? 0) > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">DUNG TÍCH</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Map((detail.variants ?? []).map((v) => [v.size, v])).values()].map((v) => (
                    <button
                      key={v._id}
                      type="button"
                      onClick={() => {
                        setPickedSize(v.size);
                        setQty(1);
                      }}
                      className={`border px-5 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                        pickedSize === v.size
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      {v.size}
                      {v.stock <= 0 ? ' · Hết' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  −
                </button>
                <span className="min-w-[40px] px-2 py-2.5 text-center text-sm">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(maxQty, qty + 1))} className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={(activeVariant?.stock ?? 0) <= 0}
                className="flex-1 bg-[var(--color-accent)] py-3 text-[11px] font-medium tracking-[0.15em] text-[var(--color-text-inverse)] transition-all hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                THÊM VÀO GIỎ (sắp có)
              </button>
              <button
                type="button"
                className="border border-[var(--color-border)] p-3 text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                aria-label="Yêu thích"
              >
                <Heart size={18} />
              </button>
            </div>

            <div className="flex items-center gap-6 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Shield size={14} /> Hàng chính hãng
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} /> Giao hàng toàn quốc
              </span>
            </div>
            <div className="mt-3 text-xs text-[var(--color-text-muted)]">
              {detail.fragranceFamily && <span className="mr-4">NHÓM HƯƠNG: {detail.fragranceFamily}</span>}
              {category && <span>DANH MỤC: {category}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Olfactory Pyramid */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Tháp hương
            </h2>
            <span className="text-[10px] tracking-[0.15em] text-[var(--color-text-muted)]">THÀNH PHẦN GHI TRÊN SẢN PHẨM</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PYRAMID_LABELS.map((label, idx) => {
              const notes = pyramidNotes[idx];
              return (
                <div key={label} className="bg-[var(--color-bg-elevated)] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <img src={ingredientStrip[idx]} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] text-[var(--color-text-primary)]">{label}</h3>
                  </div>
                  <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
                    {label === 'TOP NOTES' && 'Ấn tượng đầu tiên, thường bay hơi nhanh.'}
                    {label === 'HEART NOTES' && 'Lõi mùi thể hiện tính cách của chai nước hoa.'}
                    {label === 'BASE NOTES' && 'Lớp hương bám da lâu nhất.'}
                  </p>
                  <ul className="space-y-1.5">
                    {notes.map((note) => (
                      <li key={note} className="text-sm text-[var(--color-text-primary)]">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <h2 className="mb-10 text-center text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Gợi ý thêm
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((product, i) => (
              <Link key={product._id} to={`/product/${product.slug}`} className="group">
                <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--color-bg-surface)]">
                  <img
                    src={displayProductImage(product.images, i + product.slug.length)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-1 text-sm text-[var(--color-text-primary)]">{product.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {formatVnd(minVariantRetailPrice(product.variants ?? []))}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
          <div className="text-center">
            <h2 className="text-2xl italic text-[var(--color-text-primary)] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Đánh giá
            </h2>
            {typeof detail.avgRating === 'number' && detail.avgRating > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(detail.avgRating ?? 0)
                        ? 'fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]'
                        : 'text-[var(--color-border)]'
                    }
                  />
                ))}
                <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                  ({detail.reviewCount ?? reviews.length} lượt)
                </span>
              </div>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="mt-10 text-center text-sm text-[var(--color-text-muted)]">Chưa có đánh giá được duyệt.</p>
          ) : (
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {reviews.map((review) => (
                <blockquote key={review._id} className="bg-[var(--color-bg-elevated)] p-6">
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating ? 'fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]' : 'text-[var(--color-border)]'
                        }
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm italic leading-relaxed text-[var(--color-text-secondary)]">
                    &ldquo;{review.comment ?? '—'}&rdquo;
                  </p>
                  <cite className="text-xs not-italic text-[var(--color-text-muted)]">
                    — {review.user?.name ?? 'Khách'}
                  </cite>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
