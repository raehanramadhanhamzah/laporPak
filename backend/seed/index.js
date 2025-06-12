import mongoose from "mongoose";
import { seedAdmin } from "./seedAdmin.js";
import { seedPetugas } from "./seedPetugas.js";
import { seedReports } from "./seedReports.js";
import { CONFIG } from "../config/config.js";
async function seedAll() {
  try {
    console.log("Connecting to DB:", CONFIG.DATABASE_URL);

    await mongoose.connect("mongodb+srv://raehanramadh27:QsiMhB7TbuwQqEDz@laporpak.vldznsh.mongodb.net/LaporPakDB?retryWrites=true&w=majority&appName=LaporPak");
    // await seedAdmin();
    // await seedPetugas();
    await seedReports();
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedAll()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
