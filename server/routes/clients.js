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
import { upload } from "../middlewares/multer.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
export const clientRoute = express.Router();

clientRoute.get("/:id/companies", roleMiddleware(["admin", "accountant", "client"]), getClientCompanies);
clientRoute.get("/count", roleMiddleware(["admin"]), getClientsCount);
clientRoute.get("/ofdepartment", roleMiddleware(["admin", "accountant"]), getDepartmentClients);
clientRoute.get("/:id", roleMiddleware(["admin", "accountant"]), getClient);
clientRoute.get("/", roleMiddleware(["admin"]), getClients);
clientRoute.post("/", roleMiddleware(["admin", "accountant"]), upload.single('LOEfile'), addClient);
clientRoute.put("/:id", roleMiddleware(["admin", "accountant"]), updateClient);
clientRoute.delete("/:id", roleMiddleware(["admin", "accountant"]), deleteClient);


export default clientRoute;