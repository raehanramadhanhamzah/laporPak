import {
  createStaffHandler,
  updateStaffByIdHandler,
  updateStaffPasswordHandler,
  deleteStaffByIdHandler,

} from "../handler/staffHandler.js";
import { PATH } from "../config/config.js";
import { onlyAdminOrPetugas } from "../utils/index.js";
import { onlyAdmin } from "../utils/index.js";
const routesStaff = [
  {
    method: "POST",
    path: PATH.STAFF,
    handler: createStaffHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdmin }],
    },
  },
  
  {
    method: "PUT",
    path: `${PATH.STAFF}/{id}`,
    handler: updateStaffByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "PUT",
    path: `${PATH.STAFF}/{id}/password`,
    handler: updateStaffPasswordHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdminOrPetugas }],
    },
  },
  {
    method: "DELETE",
    path: `${PATH.STAFF}/{id}`,
    handler: deleteStaffByIdHandler,
    options: {
      auth: "jwt",
      pre: [{ method: onlyAdmin }],
    },
  },
];

export default routesStaff;