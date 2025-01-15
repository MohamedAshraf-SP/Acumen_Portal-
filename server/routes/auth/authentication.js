import express from "express";
import {
    login,
    refreshToken,
    resetPassword,
    logout,

} from "../../controllers/auth/authentication.js";

export const authRoute = express.Router();

authRoute.get("/login", login);
authRoute.get("/refreshToken", refreshToken);
authRoute.get("/resetPassword", resetPassword);
authRoute.get("/logout", logout);
