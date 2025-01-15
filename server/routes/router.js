import express from "express";
import accountantRoute from "./accountant.js";
import usersRoute from "./users.js";
import loginRoute from "./login.js";
import emailSenderRouter from "./email.js";
import helpersRoute from "./helpers/consts.js";
import clientRouter from "./clients.js";
import formsRoute from "./formsFiles.js";
import tasksRouter from "./tasksdocuments.js";
import templatesRouter from "./emailTemplate.js";
import companyRouter from "./company/company.js";
import { authRoute } from "./auth/authentication.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

// import {
//   roleMiddleware,
//   authMiddleware,
// } from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/v1/auth", authRoute);

router.use(authMiddleware)

router.use("/v1/accountants",roleMiddleware(["admin"]), accountantRoute);
router.use("/v1/clients", clientRouter);
router.use("/v1",roleMiddleware(["admin"]), usersRoute);
router.use("/v1/emailsender",roleMiddleware(["admin","accountant","client"]), emailSenderRouter);
router.use("/v1/helpers", helpersRoute);
router.use("/v1/forms",roleMiddleware(["admin"]), formsRoute);
router.use("/v1/tasksDocuments",roleMiddleware(["admin","accountant","client"]), tasksRouter);
router.use("/v1/emailtemplates",roleMiddleware(["admin"]), templatesRouter);
router.use("/v1/companies", companyRouter);

// /v1/Students/Count

export default router;

// module.exports=router
