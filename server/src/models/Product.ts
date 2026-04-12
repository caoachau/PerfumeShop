import mongoose, { Schema, Document } from 'mongoose';

export type Concentration = 'EDT' | 'EDP' | 'EDP Intense' | 'Parfum' | 'EDC';
export type FragranceFamily = 'Floral' | 'Woody' | 'Fresh' | 'Oriental' | 'Gourmand' | 'Citrus' | 'Aquatic' | 'Aromatic';
export type Gender = 'male' | 'female' | 'unisex';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  fragranceFamily: FragranceFamily;
  concentration: Concentration;
  gender: Gender;
  season: Season[];
  images: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  isEngravable: boolean;
  isActive: boolean;
  soldCount: number;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    fragranceFamily: {
      type: String,
      required: true,
      enum: ['Floral', 'Woody', 'Fresh', 'Oriental', 'Gourmand', 'Citrus', 'Aquatic', 'Aromatic'],
    },
    concentration: {
      type: String,
      required: true,
      enum: ['EDT', 'EDP', 'EDP Intense', 'Parfum', 'EDC'],
    },
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
    season: [{ type: String, enum: ['spring', 'summer', 'autumn', 'winter', 'all'] }],
    images: [{ type: String }],
    topNotes: [{ type: String, trim: true }],
    heartNotes: [{ type: String, trim: true }],
    baseNotes: [{ type: String, trim: true }],
    description: { type: String, maxlength: 5000 },
    isEngravable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0, min: 0 },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ fragranceFamily: 1 });
productSchema.index({ isActive: 1, soldCount: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ gender: 1, fragranceFamily: 1, concentration: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
