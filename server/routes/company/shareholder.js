import express from "express";
import {
    addShareholder,
    getAllShareholdersOfCompany,
    getShareholderById,
    updateShareholder,
    deleteShareholder,
    getCompanyShareholdersCount,
} from "../../controllers/company/shareholder.js";

export const shareholderRouter = express.Router();
export const shareholderRouterWithCID = express.Router();

// CRUD routes
shareholderRouterWithCID.post("/", addShareholder); // Create
shareholderRouterWithCID.get("/count", getCompanyShareholdersCount); // Read all
shareholderRouterWithCID.get("/", getAllShareholdersOfCompany); // Read all

shareholderRouter.get("/:id", getShareholderById); // Read one
shareholderRouter.put("/:id", updateShareholder); // Update
shareholderRouter.delete("/:id", deleteShareholder); // Delete



