import express from "express";
import {
    addDocument,
    getAllDocumentsOfCompany,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocumentsCount,
    downloadFile
} from "../../controllers/company/document.js";
import { upload } from "../../middlewares/multer.js"

export const documentRouter = express.Router();
export const documentRouterWithCID = express.Router();

// CRUD routes
documentRouterWithCID.post("/", upload.single("file"), addDocument); // Create
documentRouterWithCID.get("/count", getDocumentsCount); // Read all
documentRouterWithCID.get("/", getAllDocumentsOfCompany); // Read all

documentRouter.get("/:id", getDocumentById); // Read one
documentRouter.get("/download/:id", downloadFile); // Read one
documentRouter.put("/:id", upload.single("file"), updateDocument); // Update
documentRouter.delete("/:id", deleteDocument); // Delete



