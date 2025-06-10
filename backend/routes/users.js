import {
  getAllUsersHandler,
  getDetailUsersHandler,
  updateProfileByIdHandler,
  updatePasswordByIdHandler,
  deleteUserByIdHandler,
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
    path: `${PATH.USERS}/{id}/update-profile`,
    handler: updateProfileByIdHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: `${PATH.USERS}/{id}/update-password`,
    handler: updatePasswordByIdHandler,
    options: {
      auth: "jwt",
    },
  },
];
export default routesUsers;
