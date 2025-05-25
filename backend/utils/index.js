import jwt from "@hapi/jwt";
import mongoose from 'mongoose';
import { CONFIG } from "../config/config.js";
export async function setupAuth(server) {
  await server.register(jwt);

  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false, 
      iss: false, 
      sub: false, 
      exp: true, 
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });
}


export async function connectDB() {
  try {
    await mongoose.connect(CONFIG.DATABASE_URL);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    console.log("📂 Database name:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

export async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url; 
  } catch (error) {
    console.error('Upload gagal:', error);
    throw error;
  }
}