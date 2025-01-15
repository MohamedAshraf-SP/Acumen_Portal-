import express from "express";
import {
  getAccountant,
  getAccountantsCount,
  getAccountants,
  updateAccountant,
  deleteAccountant,
  addAccountant,
} from "../controllers/users/accountant.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

export const accountantRoute = express.Router();

accountantRoute.get("/count", getAccountantsCount);
accountantRoute.get("/:id", getAccountant);
accountantRoute.get("/", getAccountants);
accountantRoute.post("/", addAccountant);
accountantRoute.put("/:id", updateAccountant);
accountantRoute.delete("/:id", deleteAccountant);


export default accountantRoute;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ4NTljZGJiZjRiNmNlNGEzNjVjNTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjU0NTUxNzUsImV4cCI6MTcyNTU0MTU3NX0.sIjnKBfG3q0_zwb72-Iv9v16Qw3i5UD65DNTlIS-SBo
