import mongoose from 'mongoose';
import { loadEnv } from './loadEnv.js';

loadEnv();

import Category from './models/Category.js';
import Brand from './models/Brand.js';
import Product from './models/Product.js';
import Variant from './models/Variant.js';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required in .env');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGO_URI!);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await Promise.all([
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    Variant.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  // ─── Categories ───
  const categories = await Category.insertMany([
    { name: 'Nước hoa chính hãng', slug: 'nuoc-hoa-chinh-hang', description: 'Hàng nhập khẩu nguyên seal từ các thương hiệu quốc tế', isActive: true },
    { name: 'Nước hoa chiết', slug: 'nuoc-hoa-chiet', description: 'Chiết từ chai gốc, dung tích nhỏ 5ml–30ml', isActive: true },
    { name: 'Gift Set / Combo', slug: 'gift-set-combo', description: 'Bộ quà tặng kết hợp nhiều sản phẩm', isActive: true },
    { name: 'Phụ kiện', slug: 'phu-kien', description: 'Lọ chiết, túi đựng, hộp quà, sticker', isActive: true },
    { name: 'Tủ lạnh mini', slug: 'tu-lanh-mini', description: 'Tủ bảo quản mỹ phẩm và nước hoa', isActive: true },
  ]);
  console.log(`Seeded ${categories.length} categories.`);

  // ─── Brands ───
  const brands = await Brand.insertMany([
    { name: 'Chanel', slug: 'chanel', country: 'France', description: 'Thương hiệu xa xỉ Pháp', isActive: true },
    { name: 'Dior', slug: 'dior', country: 'France', description: 'Christian Dior - thời trang và nước hoa cao cấp', isActive: true },
    { name: 'YSL', slug: 'ysl', country: 'France', description: 'Yves Saint Laurent - phong cách, quyến rũ', isActive: true },
    { name: 'Gucci', slug: 'gucci', country: 'Italy', description: 'Thương hiệu xa xỉ Ý', isActive: true },
    { name: 'Tom Ford', slug: 'tom-ford', country: 'USA', description: 'Nước hoa niche sang trọng', isActive: true },
    { name: 'Versace', slug: 'versace', country: 'Italy', description: 'Thời trang Italy đại chúng cao cấp', isActive: true },
    { name: 'Jo Malone', slug: 'jo-malone', country: 'UK', description: 'Nước hoa Anh Quốc - tối giản, tinh tế', isActive: true },
    { name: 'Creed', slug: 'creed', country: 'France', description: 'Nhà nước hoa lịch sử từ 1760', isActive: true },
  ]);
  console.log(`Seeded ${brands.length} brands.`);

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));
  const brandMap = Object.fromEntries(brands.map((b) => [b.slug, b._id]));

  // ─── Products with Variants ───
  const productsData = [
    {
      name: 'Chanel No.5 Eau de Parfum',
      slug: 'chanel-no5-edp',
      brand: brandMap['chanel'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Floral',
      concentration: 'EDP',
      gender: 'female',
      season: ['autumn', 'winter'],
      topNotes: ['Ylang-Ylang', 'Neroli', 'Aldehydes'],
      heartNotes: ['Rose', 'Jasmine', 'Iris'],
      baseNotes: ['Sandalwood', 'Vanilla', 'Vetiver'],
      description: 'Biểu tượng vĩnh cửu của sự nữ tính. Ra mắt năm 1921, Chanel No.5 vẫn là chai nước hoa bán chạy nhất mọi thời đại.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'CN5-EDP-35', size: '35ml', price: 3200000, stock: 15 },
        { sku: 'CN5-EDP-50', size: '50ml', price: 4500000, stock: 10 },
        { sku: 'CN5-EDP-100', size: '100ml', price: 6800000, stock: 8 },
      ],
    },
    {
      name: 'Dior Sauvage Eau de Parfum',
      slug: 'dior-sauvage-edp',
      brand: brandMap['dior'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Woody',
      concentration: 'EDP',
      gender: 'male',
      season: ['all'],
      topNotes: ['Bergamot', 'Pepper'],
      heartNotes: ['Lavender', 'Star Anise', 'Nutmeg'],
      baseNotes: ['Ambroxan', 'Vanilla', 'Cedar'],
      description: 'Mùi hương hoang dã, mạnh mẽ lấy cảm hứng từ sa mạc bao la. Một trong những chai nước hoa nam bán chạy nhất thế giới.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'DS-EDP-60', size: '60ml', price: 2800000, stock: 20 },
        { sku: 'DS-EDP-100', size: '100ml', price: 3900000, stock: 15 },
        { sku: 'DS-EDP-200', size: '200ml', price: 5500000, stock: 5 },
      ],
    },
    {
      name: 'YSL Libre Eau de Parfum',
      slug: 'ysl-libre-edp',
      brand: brandMap['ysl'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Oriental',
      concentration: 'EDP',
      gender: 'female',
      season: ['autumn', 'winter'],
      topNotes: ['Lavender', 'Mandarin', 'Blackcurrant'],
      heartNotes: ['Orange Blossom', 'Jasmine'],
      baseNotes: ['Vanilla', 'Musk', 'Cedar'],
      description: 'Sự tự do trong mùi hương – pha trộn giữa lavender Pháp và hoa cam Maroc. Chai nước hoa biểu trưng cho phụ nữ hiện đại.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'YSL-LB-30', size: '30ml', price: 2200000, stock: 12 },
        { sku: 'YSL-LB-50', size: '50ml', price: 3100000, stock: 18 },
        { sku: 'YSL-LB-90', size: '90ml', price: 4200000, stock: 8 },
      ],
    },
    {
      name: 'Tom Ford Tobacco Vanille',
      slug: 'tom-ford-tobacco-vanille',
      brand: brandMap['tom-ford'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Oriental',
      concentration: 'EDP',
      gender: 'unisex',
      season: ['autumn', 'winter'],
      topNotes: ['Tobacco Leaf', 'Spicy Notes'],
      heartNotes: ['Vanilla', 'Cacao', 'Tonka Bean'],
      baseNotes: ['Dried Fruits', 'Wood'],
      description: 'Sự ấm áp quyến rũ của thuốc lá và vanilla. Mùi hương unisex đầy sang trọng, phù hợp cho những buổi tối mùa đông.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'TF-TV-50', size: '50ml', price: 7500000, stock: 6 },
        { sku: 'TF-TV-100', size: '100ml', price: 11000000, stock: 3 },
      ],
    },
    {
      name: 'Gucci Bloom Eau de Parfum',
      slug: 'gucci-bloom-edp',
      brand: brandMap['gucci'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Floral',
      concentration: 'EDP',
      gender: 'female',
      season: ['spring', 'summer'],
      topNotes: ['Natural Tuberose'],
      heartNotes: ['Jasmine Bud', 'Rangoon Creeper'],
      baseNotes: ['Sandalwood', 'Orris'],
      description: 'Một khu vườn hoa phong phú, đậm đà – Alessandro Michele tạo nên mùi hương phản ánh sự đa dạng và chân thực.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'GB-EDP-30', size: '30ml', price: 2000000, stock: 20 },
        { sku: 'GB-EDP-50', size: '50ml', price: 2800000, stock: 14 },
        { sku: 'GB-EDP-100', size: '100ml', price: 3900000, stock: 10 },
      ],
    },
    {
      name: 'Versace Eros Eau de Toilette',
      slug: 'versace-eros-edt',
      brand: brandMap['versace'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Fresh',
      concentration: 'EDT',
      gender: 'male',
      season: ['spring', 'summer'],
      topNotes: ['Mint', 'Green Apple', 'Lemon'],
      heartNotes: ['Tonka Bean', 'Ambroxan', 'Geranium'],
      baseNotes: ['Vanilla', 'Vetiver', 'Oak Moss', 'Cedar'],
      description: 'Lấy cảm hứng từ thần tình yêu Hy Lạp Eros. Mùi hương tươi mát, nam tính và tự tin.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'VE-EDT-50', size: '50ml', price: 1800000, stock: 25 },
        { sku: 'VE-EDT-100', size: '100ml', price: 2500000, stock: 18 },
        { sku: 'VE-EDT-200', size: '200ml', price: 3500000, stock: 7 },
      ],
    },
    {
      name: 'Jo Malone English Pear & Freesia',
      slug: 'jo-malone-english-pear-freesia',
      brand: brandMap['jo-malone'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Fresh',
      concentration: 'EDC',
      gender: 'unisex',
      season: ['autumn'],
      topNotes: ['King William Pear', 'Melon'],
      heartNotes: ['Freesia'],
      baseNotes: ['Patchouli', 'Amber', 'White Musk'],
      description: 'Hương lê chín vàng hoà quyện cùng hoa freesia trắng tinh khôi. Thanh lịch, nhẹ nhàng – đặc trưng Jo Malone.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'JM-EPF-30', size: '30ml', price: 2100000, stock: 12 },
        { sku: 'JM-EPF-100', size: '100ml', price: 3800000, stock: 8 },
      ],
    },
    {
      name: 'Creed Aventus',
      slug: 'creed-aventus',
      brand: brandMap['creed'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Woody',
      concentration: 'EDP',
      gender: 'male',
      season: ['all'],
      topNotes: ['Pineapple', 'Bergamot', 'Blackcurrant', 'Apple'],
      heartNotes: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
      baseNotes: ['Musk', 'Oak Moss', 'Ambergris', 'Vanilla'],
      description: 'Biểu tượng của thành công và quyền lực. Creed Aventus là chai nước hoa niche bán chạy nhất thế giới.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'CR-AV-50', size: '50ml', price: 8500000, stock: 5 },
        { sku: 'CR-AV-100', size: '100ml', price: 12000000, stock: 3 },
      ],
    },
    {
      name: 'Dior Sauvage Chiết 10ml',
      slug: 'dior-sauvage-chiet-10ml',
      brand: brandMap['dior'],
      category: catMap['nuoc-hoa-chiet'],
      fragranceFamily: 'Woody',
      concentration: 'EDP',
      gender: 'male',
      season: ['all'],
      topNotes: ['Bergamot', 'Pepper'],
      heartNotes: ['Lavender', 'Star Anise'],
      baseNotes: ['Ambroxan', 'Cedar'],
      description: 'Phiên bản chiết 10ml từ chai gốc Dior Sauvage EDP – tiện dụng mang theo hàng ngày.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'DS-CH-10', size: '10ml', price: 450000, stock: 50 },
      ],
    },
    {
      name: 'Combo Mùa Thu - 3 Chai Chiết',
      slug: 'combo-mua-thu-3-chai',
      brand: brandMap['jo-malone'],
      category: catMap['gift-set-combo'],
      fragranceFamily: 'Woody',
      concentration: 'EDC',
      gender: 'unisex',
      season: ['autumn'],
      topNotes: ['Pear', 'Bergamot'],
      heartNotes: ['Freesia', 'Peony'],
      baseNotes: ['Musk', 'Amber'],
      description: 'Bộ combo 3 chai chiết 10ml dòng Jo Malone cho mùa thu: English Pear & Freesia, Peony & Blush Suede, Wood Sage & Sea Salt.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'CMT-3CH-30', size: '3x10ml', price: 850000, stock: 15 },
      ],
    },
    {
      name: 'Chanel Coco Mademoiselle EDP',
      slug: 'chanel-coco-mademoiselle-edp',
      brand: brandMap['chanel'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Oriental',
      concentration: 'EDP',
      gender: 'female',
      season: ['spring', 'autumn'],
      topNotes: ['Orange', 'Bergamot'],
      heartNotes: ['Rose', 'Jasmine', 'Litchi'],
      baseNotes: ['Musk', 'Vanilla', 'Patchouli'],
      description: 'Tinh thần trẻ trung, quyến rũ và độc lập. Coco Mademoiselle là lựa chọn hoàn hảo cho phụ nữ thành đạt.',
      isEngravable: true,
      isActive: true,
      variants: [
        { sku: 'CCM-EDP-35', size: '35ml', price: 3300000, stock: 10 },
        { sku: 'CCM-EDP-50', size: '50ml', price: 4600000, stock: 8 },
        { sku: 'CCM-EDP-100', size: '100ml', price: 6500000, stock: 5 },
      ],
    },
    {
      name: 'Dior Miss Dior Blooming Bouquet',
      slug: 'dior-miss-dior-blooming-bouquet',
      brand: brandMap['dior'],
      category: catMap['nuoc-hoa-chinh-hang'],
      fragranceFamily: 'Floral',
      concentration: 'EDT',
      gender: 'female',
      season: ['spring', 'summer'],
      topNotes: ['Sicilian Mandarin', 'Pink Peony'],
      heartNotes: ['Peach', 'Apricot', 'Damascus Rose'],
      baseNotes: ['White Musk'],
      description: 'Bó hoa tươi tắn trong chai nước hoa. Miss Dior Blooming Bouquet mang đến vẻ nữ tính nhẹ nhàng, tươi mới.',
      isEngravable: false,
      isActive: true,
      variants: [
        { sku: 'MDBB-EDT-30', size: '30ml', price: 2100000, stock: 15 },
        { sku: 'MDBB-EDT-50', size: '50ml', price: 2900000, stock: 12 },
        { sku: 'MDBB-EDT-100', size: '100ml', price: 4000000, stock: 7 },
      ],
    },
  ];

  for (const pd of productsData) {
    const { variants: variantsData, ...productData } = pd;
    const product = await Product.create(productData);

    const variants = variantsData.map((v) => ({
      ...v,
      product: product._id,
      isActive: true,
    }));
    await Variant.insertMany(variants);
  }
  console.log(`Seeded ${productsData.length} products with variants.`);

  // ─── Admin User ───
  await User.create({
    name: 'Admin Parfum',
    email: 'admin@parfumshop.vn',
    phone: '0901234567',
    password: 'Admin@123456',
    role: 'admin',
    isActive: true,
  });

  await User.create({
    name: 'Nguyễn Văn Khách',
    email: 'khach@gmail.com',
    phone: '0912345678',
    password: 'Customer@123',
    role: 'customer',
    isActive: true,
  });
  console.log('Seeded 2 users (1 admin, 1 customer).');

  console.log('\nSeed completed successfully!');
  console.log('Admin login: admin@parfumshop.vn / Admin@123456');
  console.log('Customer login: khach@gmail.com / Customer@123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
