import { Link } from 'react-router-dom';

const FOOTER_SECTIONS = [
  {
    title: 'Cửa hàng',
    links: [
      { label: 'Sản phẩm', path: '/shop' },
      { label: 'Thương hiệu', path: '/brands' },
      { label: 'Khuyến mãi', path: '/shop?sale=true' },
      { label: 'Sản phẩm mới', path: '/shop?sort=newest' },
    ],
  },
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Tư vấn mùi hương', path: '/services/consultation' },
      { label: 'Khắc tên', path: '/services/engraving' },
      { label: 'Gift Set', path: '/shop?category=gift-set' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Liên hệ', path: '/contact' },
      { label: 'Chính sách đổi trả', path: '/policy/return' },
      { label: 'Chính sách vận chuyển', path: '/policy/shipping' },
      { label: 'Câu hỏi thường gặp', path: '/faq' },
    ],
  },
  {
    title: 'Về chúng tôi',
    links: [
      { label: 'Giới thiệu', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Tuyển dụng', path: '/careers' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4
                className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-accent)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row">
          <p
            className="text-lg tracking-[0.15em] text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            PARFUM SHOP
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} Parfum Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
