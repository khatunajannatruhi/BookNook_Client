import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let db = null;

if (uri && !uri.includes('<db_username>') && !uri.includes('cluster0.mongodb.net')) {
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    db = client.db('booknook');
  } catch (err) {
    console.error('MongoDB client initialization notice:', err);
  }
}

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  ...(db ? { database: mongodbAdapter(db) } : {}),
  secret: process.env.BETTER_AUTH_SECRET || 'booknook_better_auth_secret_key_2024',
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
});
