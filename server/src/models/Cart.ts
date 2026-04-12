import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  variant: mongoose.Types.ObjectId;
  qty: number;
  engravingText?: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    qty: { type: Number, required: true, min: 1 },
    engravingText: { type: String, maxlength: 30, default: null },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

cartSchema.index({ user: 1 });

export default mongoose.model<ICart>('Cart', cartSchema);
