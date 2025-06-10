import {
  getAllUsersHandler,
  getDetailUsersHandler,
  updatedUserByIdHandler,
} from "../handler/usersHandler.js";
import { PATH } from "../config/config.js";
import { onlyAdminOrPetugas } from "../utils/index.js";
const routesUsers = [
  {
    method: "GET",
    path: PATH.USERS,
    handler: getAllUsersHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "GET",
    path: `${PATH.USERS}/{id}`,
    handler: getDetailUsersHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: `${PATH.USERS}/{id}`,
    handler: updatedUserByIdHandler,
    options: {
      auth: "jwt",
    },
  },
];
export default routesUsers;
