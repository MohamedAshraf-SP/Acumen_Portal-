import { emailSender } from "../helpers/emailSender.js";
import { Router } from "express";

const emailSenderRouter = Router()

emailSenderRouter.post('/sendEmail', emailSender)

export default emailSenderRouter;
