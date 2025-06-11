import jwt from "@hapi/jwt";
import mongoose from "mongoose";
import { CONFIG } from "../config/config.js";
import { v2 as cloudinary } from "cloudinary";
import Boom from "@hapi/boom";

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
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "reports",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );

      fileStream.pipe(stream);
    });

    return url;
  } catch (error) {
    console.error("Upload gagal:", error);
    throw error;
  }
}

export function onlyAdminOrPetugas(request, h) {
  const { role } = request.auth.credentials;
  if (role === "admin" || role === "petugas") {
    return h.continue;
  }
  throw Boom.forbidden(
    "Akses ditolak: hanya admin atau petugas yang diperbolehkan"
  );
}
export function onlyAdmin(request, h) {
  const { role } = request.auth.credentials;
  if (role === "admin") {
    return h.continue;
  }
  throw Boom.forbidden("Akses ditolak: hanya admin yang diperbolehkan");
}
export function onlyPelapor(request, h) {
  const { userId } = request.auth.credentials;
  const reportId = request.params.id;

  if (!reportId) {
    throw Boom.badRequest("ID laporan tidak ditemukan");
  }

  if (request.payload.reporterId.toString() === userId.toString()) {
    return h.continue;
  }

  throw Boom.forbidden("Akses ditolak: hanya pelapor yang diperbolehkan");
} 

export async function predictCategory(title, description) {
  const categories = {
    label_0: "evakuasi_penyelamatan_hewan",
    label_1: "kebakaran",
    label_2: "layanan_lingkungan_dan_fasilitas_umum",
    label_3: "penyelamatan_non_hewan_dan_bantuan_teknis",
  };

  try {
    const data = `${title} ${description}`;
    const lowerData = data.toLowerCase();

    const response = await fetch(
      "https://metkid-type-laporan-damkar.hf.space/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lowerData }),
      }
    );

    const result = await response.json();

    if (!result || !result.label) {
      return {
        status: "error",
        message: "Tidak dapat menemukan kategori yang sesuai",
        raw: result,
      };
    }

    const getLabel = result.label.toLowerCase();
    const category = categories[getLabel] || null;

    return {
      status: "success",
      label: result.label,
      score: result.score,
      category: category,
    };
  } catch (error) {
    console.error("Error ketika melakukan prediksi di ML:", error);
    return {
      status: "error",
      message: "Gagal menghubungi model ML",
      error: error.message,
    };
  }
}
