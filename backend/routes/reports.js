import { createReportHandler } from "../handler/reportHandler.js";
import { PATH } from "../config/config.js";
const routesReports = [
  {
    method: "POST",
    path: PATH.REPORTS,
    handler: createReportHandler, // Ganti dengan handler yang sesuai
    options: {
      auth: "jwt", //
      payload: {
        output: "file",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // misalnya limit 10 MB
      },
    },
  },
];
export default routesReports;
