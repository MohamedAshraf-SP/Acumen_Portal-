import express from "express";
import {
    addDirector,
    getAllDirectors,
    getDirectorById,
    updateDirector,
    deleteDirector,
} from "../../controllers/company/director.js";

const directorRouter = express.Router();

// CRUD routes
directorRouter.post("/", addDirector); // Create
directorRouter.get("/", getAllDirectors); // Read all
directorRouter.get("/:id", getDirectorById); // Read one
directorRouter.put("/:id", updateDirector); // Update
directorRouter.delete("/:id", deleteDirector); // Delete

export default directorRouter;
