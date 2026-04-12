import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAddress {
  label: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

export interface IFragranceProfile {
  gender?: string;
  ageRange?: string;
  occasion?: string;
  preferredFamilies?: string[];
  lifestyle?: string;
  results?: mongoose.Types.ObjectId[];
  updatedAt?: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  savedFragranceProfile?: IFragranceProfile;
  totalSpent: number;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    ward: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const fragranceProfileSchema = new Schema<IFragranceProfile>(
  {
    gender: { type: String },
    ageRange: { type: String },
    occasion: { type: String },
    preferredFamilies: [{ type: String }],
    lifestyle: { type: String },
    results: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    updatedAt: { type: Date },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    savedFragranceProfile: { type: fragranceProfileSchema, default: null },
    totalSpent: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
