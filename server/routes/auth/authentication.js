import express from "express";
import {
    login,
    refreshToken,
    resetPassword,
    logout,
    updatePassword,

} from "../../controllers/auth/authentication.js";

export const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/refreshToken", refreshToken);
authRoute.post("/resetPassword", resetPassword);
authRoute.post("/updatePassword", updatePassword);
authRoute.get("/logout", logout);
