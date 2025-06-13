import mongoose from "mongoose";

const options = { discriminatorKey: "reportType", timestamps: true };

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.trim().length > 0,
        message: "Title tidak boleh kosong",
      },
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.trim().length > 0,
        message: "Deskripsi tidak boleh kosong",
      },
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
    photoUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: [
        "evakuasi_penyelamatan_hewan",
        "kebakaran",
        "layanan_lingkungan_dan_fasilitas_umum",
        "penyelamatan_non_hewan_dan_bantuan_teknis",
      ],
      default: null,
    },
    status: {
      type: String,
      enum: ["menunggu", "diproses", "selesai"],
      default: "menunggu",
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    reporterInfo: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      rt: { type: String },
      rw: { type: String },
      kelurahan: { type: String },
      kecamatan: { type: String },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  options
);

const Report = mongoose.model("Report", reportSchema);

const quickReportSchema = new mongoose.Schema({
  fireType: { type: String, required: true },
  hasCasualties: { type: Boolean, required: true, default: false },
  urgencyLevel: {
    type: String,
    enum: ["rendah", "sedang", "tinggi", "kritis"],
    required: true,
  },
});

const standardReportSchema = new mongoose.Schema({
  rescueType: { type: String, default: null },
  additionalInfo: { type: String, default: null },
});

const QuickReport = Report.discriminator("darurat", quickReportSchema);
const StandardReport = Report.discriminator("biasa", standardReportSchema);

export { Report, QuickReport, StandardReport };
