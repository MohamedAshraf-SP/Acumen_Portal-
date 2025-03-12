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

// Clients Management
clientRoute.get("/", roleMiddleware(["admin"]), getClients);
clientRoute.get("/count", roleMiddleware(["admin", "accountant"]), getClientsCount);
clientRoute.post("/ofdepartment", roleMiddleware(["admin", "accountant"]), getDepartmentClients);
clientRoute.get("/:id/companies", roleMiddleware(["admin", "accountant", "client"]), getClientCompanies);
clientRoute.get("/:id", roleMiddleware(["admin", "accountant"]), getClient);

clientRoute.post("/", roleMiddleware(["admin", "accountant", "client"]), upload.single("LOEfile"), addClient);
clientRoute.put("/:id", roleMiddleware(["admin", "accountant", "client"]), updateClient);
clientRoute.delete("/:id", roleMiddleware(["admin", "accountant", "client"]), deleteClient);

export default clientRoute;