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
      reporterId: userId, 
      title,
      description,
      location: parsedLocation, 
      photoUrl, 
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
    const newUser = new Report(request.payload);
    const result = await newUser.save();

    if (result) {
      const response = h.response({
        status: "success",
        message: "Report berhasil ditambahkan",
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

export async function getAllReportHandler(request, h) {
try {
    const { title, page, limit } = request.query;

    let query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    let reports;
    let pagination = null;

    if (!page || !limit) {
      reports = await Report.find(query);
    } else {
      const p = parseInt(page);
      const l = parseInt(limit);
      const skip = (p - 1) * l;

      reports = await Report.find(query)
        
        .skip(skip)
        .limit(l);

      const totalUsers = await Report.countDocuments(query);

      pagination = {
        currentPage: p,
        limit: l,
        totalUsers,
        totalPages: Math.ceil(totalUsers / l),
      };
    }

    return h.response({
      status: "success",
      message: reports.length > 0 ? "Berhasil mendapatkan Laporan" : "Report tidak ditemukan",
      listUser:reports
    }).code(200);
  } catch (error) {
    console.error("gagal getAllReportsHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}