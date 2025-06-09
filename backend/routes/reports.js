import {
  createReportHandler,
  getAllReportHandler,
  getDetailReportHandler,
} from "../handler/reportHandler.js";
import { PATH } from "../config/config.js";
const routesReports = [
  {
    method: "POST",
    path: PATH.REPORTS,
    handler: createReportHandler,
    options: {
      auth: {
        mode: "try", 
        strategy: "jwt",
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024,
      },
    },
  },
  {
    method: "GET",
    path: PATH.REPORTS,
    handler: getAllReportHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: `${PATH.REPORTS}/{id}`,
    handler: getDetailReportHandler,
    options: {
      auth: "jwt",
    },
  },
];
export default routesReports;
