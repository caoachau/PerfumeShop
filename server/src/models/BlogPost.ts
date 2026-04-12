import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  publishedAt?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
