import {
  createStaffHandler,
  getUsersByRoleHandler,
  getDetailUsersHandler,
  updateProfileByIdHandler,
  updatePasswordByIdHandler,
  updateStaffByIdHandler,
  deleteUserByIdHandler,
  deleteStaffByIdHandler,

} from "../handler/usersHandler.js";
import { PATH } from "../config/config.js";
import { onlyAdminOrPetugas } from "../utils/index.js";
import { onlyAdmin } from "../utils/index.js";
const routesUsers = [
  {
    method: "GET",
    path: PATH.USERS,
    handler: getUsersByRoleHandler,
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
    path: `${PATH.USERS}/{id}/user`,
    handler: deleteUserByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "POST",
    path: PATH.USERS,
    handler: createStaffHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdmin }],
    },
  },
  {
    method: "PUT",
    path: `${PATH.USERS}/{id}/staff`,
    handler: updateStaffByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "DELETE",
    path: `${PATH.USERS}/{id}/staff`,
    handler: deleteStaffByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdmin }],
    },
  },
];
export default routesUsers;
