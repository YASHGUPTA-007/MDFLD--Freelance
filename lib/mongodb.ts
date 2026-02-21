import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error('MONGODB_URI not defined in .env.local');

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof globalThis & { mongoose: MongooseCache };

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectDB() {
    if (cached.conn) {
        console.log('MongoDB: using cached connection');
        return cached.conn;
    }

    console.log('MongoDB: connecting to', MONGODB_URI); // URI dekho

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB: connected successfully');
    } catch (err) {
        console.error('MongoDB: connection failed', err);
        cached.promise = null;
        throw err;
    }

    globalWithMongoose.mongoose = cached;
    return cached.conn;
}