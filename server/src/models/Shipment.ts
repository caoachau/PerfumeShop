import mongoose, { Schema, Document } from 'mongoose';

export type Carrier = 'GHN' | 'GHTK';

export interface IShipmentLog {
  status: string;
  time: Date;
  note?: string;
}

export interface IShipment extends Document {
  order: mongoose.Types.ObjectId;
  carrier: Carrier;
  trackingCode?: string;
  status: string;
  estimatedDate?: Date;
  actualDeliveredAt?: Date;
  ghnOrderCode?: string;
  logs: IShipmentLog[];
  createdAt: Date;
  updatedAt: Date;
}

const shipmentLogSchema = new Schema<IShipmentLog>(
  {
    status: { type: String, required: true },
    time: { type: Date, required: true, default: Date.now },
    note: { type: String },
  },
  { _id: false },
);

const shipmentSchema = new Schema<IShipment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    carrier: { type: String, enum: ['GHN', 'GHTK'], required: true },
    trackingCode: { type: String },
    status: { type: String, default: 'pending' },
    estimatedDate: { type: Date },
    actualDeliveredAt: { type: Date },
    ghnOrderCode: { type: String },
    logs: [shipmentLogSchema],
  },
  { timestamps: true },
);

shipmentSchema.index({ order: 1 });
shipmentSchema.index({ trackingCode: 1 }, { sparse: true });

export default mongoose.model<IShipment>('Shipment', shipmentSchema);
