import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import { CONFIG } from "../config/config.js";
// import jwt from "jsonwebtoken";
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
        token: jwt.token.generate(
          {
            userId: user._id,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + parseInt(CONFIG.JWT_EXPIRES_IN, 10), // contoh 1 jam
          },
          {
            key: CONFIG.JWT_SECRET,
            algorithm: "HS256",
          },
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
    const { phone } = request.payload;
    if (phone && !isValidPhone(phone)) {
      const response = h.response({
        status: "fail",
        message: "Nomor telepon tidak valid",
      });
      return response.code(400);
    }
    const newUser = new User(request.payload);
    const result = await newUser.save();

    if (result) {
      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
        userId: result._id,
      });
      response.code(201);
      return response;
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      return response.code(400);
    }

    if (error.code === 11000) {
      const response = h.response({
        status: "fail",
        message: "Email sudah digunakan",
      });
      return response.code(409);
    }

    return h.response({ error: error.message }).code(500);
  }
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9+\-\s]+$/;
  return phoneRegex.test(phone);
}
