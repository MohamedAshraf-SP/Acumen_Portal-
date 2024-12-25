import express from "express";
import {
    addShareholder,
    getAllShareholders,
    getShareholderById,
    updateShareholder,
    deleteShareholder,
} from "../../controllers/company/shareholder.js";

const shareholderRouter = express.Router();

// CRUD routes
shareholderRouter.post("/", addShareholder); // Add
shareholderRouter.get("/", getAllShareholders); // Read all
shareholderRouter.get("/:id", getShareholderById); // Read one
shareholderRouter.put("/:id", updateShareholder); // Update
shareholderRouter.delete("/:id", deleteShareholder); // Delete

export default shareholderRouter;
