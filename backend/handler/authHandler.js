import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import { CONFIG } from "../config/config.js";
import { Report } from "../model/reportModel.js";
import jwt from "@hapi/jwt";
export async function loginHandler(request, h) {
  try {
    const { email, password } = request.payload;
    const user = await User.findOne({ email });
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "Email atau password salah",
        })
        .code(401);
    }
    const passwordHashed = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHashed);
    if (!isPasswordValid) {
      return h
        .response({
          status: "fail",
          message: "Email atau password salah",
        })
        .code(401);
    }
    const response = h.response({
      status: "success",
      message: "Login berhasil",
      loginResult: {
        userId: user._id,
        name: user.name,
        role: user.role,
        token: jwt.token.generate(
          {
            userId: user._id,
            role: user.role,
            exp:
              Math.floor(Date.now() / 1000) +
              parseInt(CONFIG.JWT_EXPIRES_IN, 10),
          },
          {
            key: CONFIG.JWT_SECRET,
            algorithm: "HS256",
          }
        ),
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("gagal loginHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}
export async function registerHandler(request, h) {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
    } = request.payload;

    if (phone && !isValidPhone(phone)) {
      return h
        .response({
          status: "fail",
          message: "Nomor telepon tidak valid",
        })
        .code(400);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return h
        .response({
          status: "fail",
          message: "Email sudah digunakan",
        })
        .code(409);
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return h
        .response({
          status: "fail",
          message: "Nomor telepon sudah digunakan",
        })
        .code(409);
    }
    if(!kelurahan || !kecamatan) {
      return h
        .response({
          status: "fail",
          message: "Kelurahan, dan Kecamatan wajib diisi.",
        })
        .code(400);
    }
    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
      role: "pelapor",
    });

    const result = await newUser.save();

    await Report.updateMany(
      { "reporterInfo.phone": phone, reporterId: { $exists: false } },
      {
        $set: { reporterId: result._id },
        $unset: { reporterInfo: "" },
      }
    );

    return h
      .response({
        status: "success",
        message: "User berhasil ditambahkan",
        userId: result._id,
      })
      .code(201);
  } catch (error) {
    if (error.name === "ValidationError") {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }

    return h.response({ error: error.message }).code(500);
  }
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9+\-\s]+$/;
  return phoneRegex.test(phone);
}
