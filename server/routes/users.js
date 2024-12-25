import express from "express";
import {
  getuser,

  getusers,
  updateuser,
  deleteuser,
  adduser,
} from "../controllers/users/users.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const usersRoute = express.Router();


usersRoute.delete("/user/d/:id", deleteuser);
usersRoute.post("/user/:id", getuser);
usersRoute.post("/user", adduser);
usersRoute.post("/users", getusers);
usersRoute.put("/user/:id", updateuser);


export default usersRoute;
