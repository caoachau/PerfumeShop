import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant extends Document {
  product: mongoose.Types.ObjectId;
  sku: string;
  size: string;
  price: number;
  salePrice?: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    size: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

variantSchema.index({ product: 1 });
variantSchema.index({ sku: 1 });
variantSchema.index({ product: 1, isActive: 1 });
variantSchema.index({ stock: 1 });

export default mongoose.model<IVariant>('Variant', variantSchema);
