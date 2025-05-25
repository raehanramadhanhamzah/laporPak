import Hapi from "@hapi/hapi";
import routesUsers from "./routes/users.js";
import routesAuth from "./routes/auth.js";
import routesReports from "./routes/reports.js";
import { CONFIG } from "./config/config.js";
import { setupAuth } from "./utils/index.js";
import { connectDB } from "./utils/index.js";
const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: CONFIG.PORT,
    host: CONFIG.HOST,
    routes: {
      cors: {
        origin: ["*"], 
      },
    },
  });

  const allRoutes = [
    ...routesUsers,
    ...routesAuth,
    ...routesReports,
  ];
  await setupAuth(server);
  server.route(allRoutes);

  await server.start();
  console.log("🚀 Server running on", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
