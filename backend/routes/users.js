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
    path: `${PATH.USERS}/{id}/profile`,
    handler: updateProfileByIdHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: `${PATH.USERS}/{id}/password`,
    handler: updatePasswordByIdHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: `${PATH.USERS}/{id}/delete`,
    handler: deleteUserByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
];
export default routesUsers;
