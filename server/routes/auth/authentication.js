import express from "express";
import {
    login,
    refreshToken,
    resetPassword,
    logout,

} from "../../controllers/auth/authentication.js";

export const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/refreshToken", refreshToken);
authRoute.post("/resetPassword", resetPassword);
authRoute.get("/logout", logout);
