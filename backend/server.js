import Hapi from "@hapi/hapi";
import routes from "./routes/index.js";
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

  await setupAuth(server);
  server.route(routes);

  await server.start();
  console.log("🚀 Server running on", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
