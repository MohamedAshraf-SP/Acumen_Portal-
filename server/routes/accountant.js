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


accountantRoute.get("/count", roleMiddleware(["admin", "accountant"]), getAccountantsCount);
accountantRoute.get("/:id", roleMiddleware(["admin", "accountant"]), getAccountant);
accountantRoute.get("/", roleMiddleware(["admin"]), getAccountants);
accountantRoute.post("/", roleMiddleware(["admin"]), addAccountant);
accountantRoute.put("/:id", roleMiddleware(["admin", "accountant"]), updateAccountant);
accountantRoute.delete("/:id", roleMiddleware(["admin"]), deleteAccountant);


export default accountantRoute;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ4NTljZGJiZjRiNmNlNGEzNjVjNTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjU0NTUxNzUsImV4cCI6MTcyNTU0MTU3NX0.sIjnKBfG3q0_zwb72-Iv9v16Qw3i5UD65DNTlIS-SBo
