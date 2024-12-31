import express from "express";
import {
    addDirector,
    getAllDirectorsOfCompany,
    getDirectorById,
    updateDirector,
    deleteDirector,
    getCompanyDirectorsCount,
} from "../../controllers/company/director.js";

export const directorRouter = express.Router();
export const directorRouterWithCID = express.Router();

// CRUD routes
directorRouterWithCID.post("/", addDirector); // Create
directorRouterWithCID.get("/count", getCompanyDirectorsCount); // Read all
directorRouterWithCID.get("/", getAllDirectorsOfCompany); // Read all

directorRouter.get("/:id", getDirectorById); // Read one
directorRouter.put("/:id", updateDirector); // Update
directorRouter.delete("/:id", deleteDirector); // Delete



