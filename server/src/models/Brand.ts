import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  country?: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    country: { type: String, maxlength: 100 },
    logo: { type: String },
    description: { type: String, maxlength: 1000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

export default mongoose.model<IBrand>('Brand', brandSchema);
