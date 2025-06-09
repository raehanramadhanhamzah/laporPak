import { Report } from "../model/reportModel.js";
import { uploadFile } from "../utils/index.js";
import { QuickReport, StandardReport } from "../model/reportModel.js";
export async function createReportHandler(request, h) {
  try {
    const {
      reportType,
      title,
      description,
      location,
      fireType,
      hasCasualties,
      urgencyLevel,
      rescueType,
      additionalInfo,
      name,
      phone,
      address,
      rt,
      rw,
      kelurahan,
      kecamatan,
    } = request.payload;

    const image = request.payload.image;
    const video = request.payload.video;
    const userId = request.auth.isAuthenticated
      ? request.auth.credentials.userId
      : null;

    let parsedLocation = location;
    if (typeof location === "string") {
      parsedLocation = JSON.parse(location);
    }

    let photoUrl = null;
    let videoUrl = null;

    if (image && image.hapi) {
      const imageType = image.hapi.headers["content-type"];
      const imageExt = image.hapi.filename.split(".").pop().toLowerCase();

      const allowedImageTypes = ["jpeg", "jpg", "png", "webp"];
      if (
        imageType.startsWith("image/") &&
        allowedImageTypes.includes(imageExt)
      ) {
        const imageFilename = image.hapi.filename;
        photoUrl = await uploadFile(image);
      } else {
        throw new Error("File image tidak valid (hanya jpg, png, webp)");
      }
    }
    if (video && video.hapi && video._data.length > 0) {
      const videoType = video.hapi.headers["content-type"];
      const videoExt = video.hapi.filename.split(".").pop().toLowerCase();

      const allowedVideoTypes = ["mp4", "mov", "webm"];
      if (
        videoType.startsWith("video/") &&
        allowedVideoTypes.includes(videoExt)
      ) {
        videoUrl = await uploadFile(video);
      } else {
        throw new Error("File video tidak valid (hanya mp4, mov, webm)");
      }
    }
    const baseReportData = {
      reporterId: userId || undefined,
      title,
      description,
      location: parsedLocation,
      photoUrl,
      videoUrl,
      reporterInfo: undefined,
    };

    if (!userId) {
      if (
        !name ||
        !phone ||
        !address ||
        !kelurahan ||
        !kecamatan
      ) {
        return h
          .response({
            status: "fail",
            message: "Selain RT dan RW, semua field wajib diisi.",
          })
          .code(400);
      }
      baseReportData.reporterInfo = {
        name,
        phone,
        address,
        rt,
        rw,
        kelurahan,
        kecamatan,
      };
    }

    let report;

    if (reportType === "quick") {
      report = new QuickReport({
        ...baseReportData,
        fireType,
        hasCasualties,
        urgencyLevel,
      });
    } else if (reportType === "standard") {
      report = new StandardReport({
        ...baseReportData,
        rescueType,
        additionalInfo,
      });
    } else {
      throw new Error("Invalid reportType");
    }

    await report.save();

    return h
      .response({
        message: "Laporan berhasil dibuat",
        report_id: report._id,
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
      query.title = { $regex: title, $options: "i" };
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

    return h
      .response({
        status: "success",
        message:
          reports.length > 0
            ? "Berhasil mendapatkan Laporan"
            : "Report tidak ditemukan",
        listReport: reports,
      })
      .code(200);
  } catch (error) {
    console.error("gagal getAllReportsHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function getDetailReportHandler(request, h) {
  try {
    const reportId = request.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
      return h
        .response({
          status: "fail",
          message: "Laporan tidak ditemukan",
        })
        .code(404);
    }
    return h
      .response({
        status: "success",
        message: "Berhasil mendapatkan detail laporan",
        report,
      })
      .code(200);
  } catch (error) {
    console.error("gagal getDetailReportHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}
