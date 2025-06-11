import {
  createReportHandler,
  getAllReportsHandler,
  getDetailReportHandler,
  updateStatusReportHandler,
  deleteReportByIdHandler,
} from "../handler/reportHandler.js";
import { PATH } from "../config/config.js";
import { onlyAdminOrPetugas } from "../utils/index.js";
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
    handler: getAllReportsHandler,
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
  {
    method: "PUT",
    path: `${PATH.REPORTS}/{id}`,
    handler: updateStatusReportHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "DELETE",
    path: `${PATH.REPORTS}/{id}`,
    handler: deleteReportByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },

];
export default routesReports;
