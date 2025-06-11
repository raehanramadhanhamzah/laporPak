import jwt from "@hapi/jwt";
import mongoose from 'mongoose';
import { CONFIG } from "../config/config.js";
import { v2 as cloudinary } from 'cloudinary';
import Boom from '@hapi/boom';

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

export async function uploadFile(fileStream) {
  try {
    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: "auto",
        folder: "reports"
      },
      (error, result) => {
        if(error){
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    fileStream.pipe(stream);  
  }); 

    return url
  } catch (error) {
    console.error('Upload gagal:', error);
    throw error;
  }
}

export function onlyAdminOrPetugas(request, h) {
  const { role } = request.auth.credentials;
  if (role === "admin" || role === "petugas") {
    return h.continue;
  }
  throw Boom.forbidden("Akses ditolak: hanya admin atau petugas yang diperbolehkan");
}
export function onlyAdmin(request, h) {
  const { role } = request.auth.credentials;
  if (role === "admin") {
    return h.continue;
  }
  throw Boom.forbidden("Akses ditolak: hanya admin yang diperbolehkan");
}

export function onlyAdmin(request, h) {
  const { role } = request.auth.credentials;
  if (role === "admin") {
    return h.continue;
  }
  throw Boom.forbidden("Akses ditolak: hanya admin yang diperbolehkan");
}