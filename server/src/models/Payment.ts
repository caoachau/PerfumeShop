import mongoose, { Schema, Document } from 'mongoose';

export type PaymentMethod = 'bank_transfer' | 'cod' | 'momo' | 'zalopay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  paidAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    method: {
      type: String,
      required: true,
      enum: ['bank_transfer', 'cod', 'momo', 'zalopay'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 }, { sparse: true });

export default mongoose.model<IPayment>('Payment', paymentSchema);
