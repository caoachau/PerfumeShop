import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface IOrderItem {
  variant: mongoose.Types.ObjectId;
  productName: string;
  variantSize: string;
  qty: number;
  unitPrice: number;
  engravingText?: string;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  email?: string;
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  shippingFee: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
  orderStatus: OrderStatus;
  coupon?: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    productName: { type: String, required: true },
    variantSize: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    engravingText: { type: String, maxlength: 30, default: null },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    shippingFee: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    finalTotal: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', default: null },
    note: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);
