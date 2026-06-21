import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    const combined = error instanceof Error ? `${error.name} ${error.message}` : String(error);

    if (/ServerSelection|whitelist|ReplicaSetNoPrimary|timed out|ENOTFOUND/i.test(combined)) {
      console.error(
        '\n→ Gợi ý (Atlas / mạng):\n' +
          '  • Network Access: thêm IP máy bạn (hoặc tạm 0.0.0.0/0 chỉ khi dev).\n' +
          '  • Đợi 1–2 phút sau khi đổi IP; tắt VPN thử lại.\n' +
          '  • Kiểm tra MONGO_URI trong server/.env.\n',
      );
    }

    if (/SSL|TLS|tlsv1|alerts? number 80|MongoNetworkError/i.test(combined)) {
      console.error(
        '\n→ Gợi ý (TLS / chuỗi kết nối — lỗi thường gặp nhất):\n' +
          '  • Mật khẩu user DB có @ : / # ? % + khoảng trắng … → phải URL-encode trong MONGO_URI.\n' +
          '    Ví dụ @ → %40, # → %23, : → %3A. Hoặc đổi mật khẩu trong Atlas → Database Users (chỉ chữ số + chữ).\n' +
          '  • Copy lại URI: Atlas → Connect → Drivers → Node — dán nguyên vào MONGO_URI.\n' +
          '  • Thử chuỗi « Standard connection string » (không dùng mongodb+srv) nếu DNS/SRV lỗi.\n' +
          '  • Cài Node 20 LTS; tắt phần mềm « SSL inspection » / antivirus quét HTTPS tạm thời.\n',
      );
    }

    process.exit(1);
  }
}
