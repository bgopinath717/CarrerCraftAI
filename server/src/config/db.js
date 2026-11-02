import mongoose from 'mongoose';

/**
 * Sanitizes MongoDB connection URIs to prevent malformed database names
 * e.g., missing '?' delimiter before query parameters: .../careercraft_airetryWrites=true...
 */
export const sanitizeMongoUri = (rawUri) => {
  if (!rawUri) return 'mongodb://127.0.0.1:27017/careercraft_ai';
  let uri = rawUri.trim();

  // If query parameter was accidentally appended directly to db name without '?'
  if (!uri.includes('?') && /(retryWrites=|w=|appName=|ssl=|authSource=)/i.test(uri)) {
    uri = uri.replace(/\/([^/?&]*)(retryWrites=|w=|appName=|ssl=|authSource=)/i, (m, db, param) => {
      const cleanDb = db || 'careercraft_ai';
      return `/${cleanDb}?${param}`;
    });
  }

  return uri;
};

export const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';
    const uri = sanitizeMongoUri(rawUri);
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};
