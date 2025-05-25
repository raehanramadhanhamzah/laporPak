import { getAllUsersHandler, getDetailUsersHandler } from "../handler/usersHandler.js";
import { PATH } from "../config/config.js";
const routesUsers = [
  {
    method: "GET",
    path: PATH.USERS,
    handler: getAllUsersHandler,
    options: {
      auth: 'jwt'  
    },
  },
  {
    method: "GET",
    path: `${PATH.USERS}/{id}`,
    handler: getDetailUsersHandler,
    options: {
      auth: 'jwt'  
    },
  },
];
export default routesUsers;