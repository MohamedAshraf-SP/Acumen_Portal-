import express from "express";
import accountantRoute from "./accountant.js";
import usersRoute from "./users.js";
import loginRoute from "./login.js";
import emailSenderRouter from "./email.js";
import helpersRoute from "./helpers/helpers.js";
import clientRouter from "./clients.js";
import formsRoute from "./formsFiles.js";
import tasksRouter from "./tasksdocuments.js";
import templatesRouter from "./emailTemplate.js";

// import {
//   roleMiddleware,
//   authMiddleware,
// } from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/v1/login", loginRoute);
router.use("/v1/accountants", accountantRoute);
router.use("/v1/clients", clientRouter);
router.use("/v1", usersRoute);
router.use("/v1/emailsender", emailSenderRouter);
router.use("/v1/helpers", helpersRoute);
router.use("/v1/forms", formsRoute);
router.use("/v1/tasksDocuments", tasksRouter);
router.use("/v1/emailtemplates", templatesRouter);
// /v1/Students/Count

export default router;

// module.exports=router
