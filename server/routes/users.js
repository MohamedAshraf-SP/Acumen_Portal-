import express from "express";
import {
  getUser,

  getUsers,
  updateUser,
  deleteUser,
  addUser,
} from "../controllers/users/users.js";
//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const usersRoute = express.Router();


usersRoute.delete("/users/d/:id", deleteUser);
usersRoute.get("/users/:id", getUser);
usersRoute.post("/users", addUser);
usersRoute.get("/users", getUsers);
usersRoute.put("/users/:id", updateUser);


export default usersRoute;
