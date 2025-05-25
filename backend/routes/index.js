import routesAuth from "./auth.js";
import routesUsers from "./users.js";
import routesReports from "./reports.js";

export default [
  ...routesAuth,
  ...routesUsers,
  ...routesReports,
];
