import routesAuth from "./auth.js";
import routesUsers from "./users.js";
import routesReports from "./reports.js";
import routesStaff from "./staff.js";

export default [
  ...routesAuth,
  ...routesUsers,
  ...routesReports,
  ...routesStaff,
];
