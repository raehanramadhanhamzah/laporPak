import { createReportHandler, getAllReportHandler, getDetailReportHandler } from "../handler/reportHandler.js";
import { PATH } from "../config/config.js";
const routesReports = [
  {
    method: "POST",
    path: PATH.REPORTS,
    handler: createReportHandler,
    options: {
      auth: "jwt", 
      payload: {
        output: "file",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, 
      },
    },
  },
  {
    method: "GET",
    path: PATH.REPORTS,
    handler: getAllReportHandler,
    options:{
      auth:"jwt",
    }
  },
  {
    method: "GET",
    path:   `${PATH.REPORTS}/{id}`,
    handler: getDetailReportHandler,
    options:{
      auth:"jwt",
    }
  }
];
export default routesReports;
