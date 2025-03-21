import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  addUser,
} from "../controllers/users/users.js";

export const usersRoute = express.Router();


usersRoute.delete("/d/:id", deleteUser);
usersRoute.get("/:id", getUser);
usersRoute.post("/", addUser);
usersRoute.get("/", getUsers);
usersRoute.put("/:id", updateUser);


export default usersRoute;
