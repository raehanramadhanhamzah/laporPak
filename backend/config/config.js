import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL,
  HOST: process.env.HOST || "localhost",
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 3600,
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const PATH = {
  LOGIN: "/api/login",
  REGISTER: "/api/register",
  USERS: "/api/users",
  STAFF: "/api/staff",
  
  REPORTS: "/api/reports",
};



