import express from "express";
import {
    getClient,
    getClientsCount,
    getClients,
    updateClient,
    deleteClient,
    addClient,
    getClientCompanies,
    getDepartmentClients
} from "../controllers/users/client.js";
import { upload } from "../config/multer.js";
import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const clientRoute = express.Router();

clientRoute.get("/:id/companies", getClientCompanies);
clientRoute.get("/count", getClientsCount);
clientRoute.get("/ofdepartment", getDepartmentClients);
clientRoute.get("/:id", getClient);
clientRoute.get("/", getClients);
clientRoute.post("/", upload.single('LOEfile'), addClient);
clientRoute.put("/:id", updateClient);
clientRoute.delete("/:id", deleteClient);


export default clientRoute;