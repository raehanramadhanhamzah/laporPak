import { Report } from "../model/reportModel.js";
import { uploadImage } from "../utils/index.js";
export async function createReportHandler(request, h) {
  try {
    const {
      userId,
      title,
      description,
      location, 
      image, 
    } = request.payload;

    let parsedLocation = location;
    if (typeof location === 'string') {
    parsedLocation = JSON.parse(location);
    }

    let photoUrl = "";
    if (image && image.path) {
      photoUrl = await uploadImage(image.path);
    }

    const report = new Report({
      reporterId: userId, // harus pakai key 'reporter' sesuai schema
      title,
      description,
      location: parsedLocation, // pastikan sesuai format schema
      photoUrl, // URL hasil upload Cloudinary
      // status otomatis "menunggu"
    });

    await report.save();

    return h
      .response({
        message: "Laporan berhasil dibuat",
        report,
      })
      .code(201);
  } catch (error) {
    console.error("gagal createReportHandler:", error);
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
