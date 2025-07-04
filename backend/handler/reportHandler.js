import { Report } from "../model/reportModel.js";
import { User } from "../model/userModel.js";
import { uploadFile } from "../utils/index.js";
import { QuickReport, StandardReport } from "../model/reportModel.js";
import { predictCategory } from "../utils/index.js";
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
    const resultPredict = await predictCategory(title, description);
    const category = resultPredict.category;
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
    let finalReporterId = userId;

    if (userId) {
      const currentUser = await User.findById(userId);
      if (currentUser && ["admin", "petugas"].includes(currentUser.role)) {
        const targetUser = await User.findOne({ phone });
        if (targetUser) {
          finalReporterId = targetUser._id;
        } else {
          finalReporterId = null;
        }
      }
    }

    const baseReportData = {
      reporterId: finalReporterId || undefined,
      title,
      description,
      location: parsedLocation,
      photoUrl,
      videoUrl,
      category,
    };
    if (!finalReporterId) {
      baseReportData.reporterInfo = {
        name,
        phone,
        address: address || null,
        rt: rt || null,
        rw: rw || null,
        kelurahan: kelurahan || null,
        kecamatan: kecamatan || null,
      };
    }

    if (!userId) {
      const isMissingCommon = !name || !phone;

      if (reportType === "biasa") {
        if (isMissingCommon || !address || !kelurahan || !kecamatan) {
          return h
            .response({
              status: "fail",
              message: "Selain RT dan RW, semua field wajib diisi.",
            })
            .code(400);
        }
      }

      if (reportType === "darurat") {
        if (!fireType || !hasCasualties || !urgencyLevel) {
          return h
            .response({
              status: "fail",
              message:
                "Jenis kebakaran, ada korban, dan tingkat urgensi wajib diisi.",
            })
            .code(400);
        }
        if (isMissingCommon) {
          return h
            .response({
              status: "fail",
              message: "Nama, nomor telepon wajib diisi.",
            })
            .code(400);
        }
      }
      const existingUser = await User.findOne({ phone });
      if (!existingUser) {
        baseReportData.reporterInfo = {
          name,
          phone,
          address: address || null,
          rt: rt || null,
          rw: rw || null,
          kelurahan: kelurahan || null,
          kecamatan: kecamatan || null,
        };
      } else {
        baseReportData.reporterId = existingUser._id;
      }
    }

    if (baseReportData.reporterId) {
      delete baseReportData.reporterInfo;
    }

    let report;

    if (reportType === "darurat") {
      report = new QuickReport({
        ...baseReportData,
        fireType,
        hasCasualties,
        urgencyLevel,
      });
    } else if (reportType === "biasa") {
      report = new StandardReport({
        ...baseReportData,
        rescueType,
        additionalInfo,
      });
    } else {
      throw new Error("Invalid reportType");
    }
    console.log("Base data:", baseReportData);
    await report.save();

    return h
      .response({
        status: "success",
        message: "Laporan berhasil dibuat",
        report_id: report._id,
      })
      .code(201);
  } catch (error) {
    console.error("gagal createReportHandler:", error);
    return h
      .response({
        status: "fail",
        message: error.message || "Gagal membuat laporan",
      })
      .code(500);
  }
}

export async function getAllReportsHandler(request, h) {
  try {
    const { title, reportType, status, page, limit } = request.query;

    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (reportType) {
      query.reportType = reportType;
    }
    if (status) {
      query.status = status;
    }

    let reports;
    let pagination = null;

    if (!page || !limit) {
      reports = await Report.find(query).populate(
        "reporterId",
        "name email phone"
      );
    } else {
      const p = parseInt(page);
      const l = parseInt(limit);
      const skip = (p - 1) * l;

      reports = await Report.find(query)
        .skip(skip)
        .limit(l)
        .populate("reporterId", "name email phone");

      const totalReports = await Report.countDocuments(query);
      pagination = {
        currentPage: p,
        limit: l,
        totalReports,
        totalPages: Math.ceil(totalReports / l),
      };
    }

    return h
      .response({
        status: "success",
        message:
          reports.length > 0
            ? "Berhasil mendapatkan semua laporan"
            : "Report tidak ditemukan",
        listReport: reports,
        pagination,
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

export async function updateStatusReportHandler(request, h) {
  try {
    const reportId = request.params.id;
    const { status } = request.payload;

    if (!status) {
      return h
        .response({
          status: "fail",
          message: "Status tidak boleh kosong",
        })
        .code(400);
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return h
        .response({
          status: "fail",
          message: "Laporan tidak ditemukan",
        })
        .code(404);
    }
    const statusList = ["menunggu", "diproses", "selesai"];
    if (!statusList.includes(status)) {
      return h
        .response({
          status: "fail",
          message: `Status harus salah satu dari ${statusList.join(", ")}`,
        })
        .code(400);
    }
    return h
      .response({
        status: "success",
        message: "Status laporan berhasil diperbarui",
        status: report.status,
      })
      .code(200);
  } catch (error) {
    console.error("gagal updateStatusReportHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}

export async function deleteReportByIdHandler(request, h) {
  try {
    const reportId = request.params.id;
    const report = await Report.findByIdAndDelete(reportId);
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
        message: "Laporan berhasil dihapus",
      })
      .code(200);
  } catch (error) {
    console.error("gagal deleteReportHandler:", error);
    return h.response({ error: error.message }).code(500);
  }
}
