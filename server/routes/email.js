import { emailSender } from "../helpers/emailSender.js";
import { Router } from "express";
import { roleMiddleware } from "../middlewares/autherization.js";

const emailSenderRouter = Router()

emailSenderRouter.post('/sendEmail', roleMiddleware(["admin", "accountant", "client"]), emailSender)

export default emailSenderRouter;
