import { Report } from "../model/reportModel.js";
import { uploadImage } from "../utils/index.js";
export async function createReportHandler(request, h) {
  try {
    const { title, description, location, image } = request.payload;
    const userId = request.auth.credentials.userId;
    
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
      listReport:reports
    }).code(200);
  } catch (error) {
    console.error("gagal getAllReportsHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function getDetailReportHandler(request, h){
try {
    const reportId = request.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return h.response({
        status: "fail",
        message: "Laporan tidak ditemukan",
      }).code(404);
    }
    return h.response({
      status: "success",
      message: "Berhasil mendapatkan detail laporan",
      report,
    }).code(200);
  }
  catch (error) {
    console.error("gagal getDetailReportHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}