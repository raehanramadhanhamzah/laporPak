import { registerHandler, loginHandler } from "../handler/authHandler.js";
import { PATH } from "../config/config.js";
const routesAuth = [
  {
    method: "POST",
    path: PATH.LOGIN,
    handler: loginHandler,
  },
  {
    method: "POST",
    path: PATH.REGISTER,
    handler: registerHandler,
  },
];
export default routesAuth;
