import dotenv from "dotenv";
import { User } from "../model/userModel.js"; 

dotenv.config();

export async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ENV variables ADMIN_EMAIL atau ADMIN_PASSWORD belum diatur!");
      return;
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin sudah ada");
      return;
    }

    const adminUser = new User({
      name: "Admin",
      email,
      password: password,
      role: "admin",
      phone: "1234567890", 
      address: "Jl. Admin No. 1, Makassar", 
      kelurahan: "Makassar 1",
      kecamatan: "Makassar 1",
    });

    await adminUser.save();
    console.log("Admin berhasil dibuat");
  } catch (err) {
    console.error("Gagal buat admin:", err);
  }
}
