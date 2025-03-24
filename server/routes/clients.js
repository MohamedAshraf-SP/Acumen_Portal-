import express from "express";
import {
    getClient,
    getClientsCount,
    getClients,
    updateClient,
    deleteClient,
    addClient,
    getClientCompanies,
    //    getDepartmentClients,
    getClientsDashboardCounts,
    getClientLOE
} from "../controllers/users/client.js";
import { upload } from "../middlewares/multer.js";
import { accountantDepartmentSetMiddleware, accountantRoleMiddleware, authMiddleware, roleMiddleware } from "../middlewares/autherization.js";
export const clientRoute = express.Router();

// Clients Management
clientRoute.get("/", roleMiddleware(["admin", "accountant"]), getClients);

clientRoute.get("/count", roleMiddleware(["admin", "accountant"]), getClientsCount);
clientRoute.get("/dashboard/count", roleMiddleware(["admin", "accountant", "client"]), getClientsDashboardCounts);
//clientRoute.get("/ofdepartment", roleMiddleware(["admin", "accountant"]), accountantRoleMiddleware, getDepartmentClients);
clientRoute.get("/:id/companies", roleMiddleware(["admin", "accountant", "client"]), accountantDepartmentSetMiddleware, getClientCompanies);
clientRoute.get("/:id/engagement", roleMiddleware(["admin", "accountant", "client"]), getClientLOE);
clientRoute.get("/:id", roleMiddleware(["admin", "accountant"]), getClient);

clientRoute.post("/", roleMiddleware(["admin", "accountant", "client"]), upload.single("LOEfile"), addClient);
clientRoute.put("/:id", roleMiddleware(["admin", "accountant", "client"]), updateClient);
clientRoute.delete("/:id", roleMiddleware(["admin", "accountant", "client"]), deleteClient);

export default clientRoute;


