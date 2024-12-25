
import { Router } from "express";
import { upload } from "../config/multer.js";
import { addForm, updateForm, deleteForm, downloadFile, getFormById, getForms, getFormsCount } from "../controllers/formsFiles.js"

export const formsRoute = Router();

formsRoute.post('/', upload.single('file'), addForm); // CREATE
formsRoute.get('/count', getFormsCount); // READ all
formsRoute.get('/', getForms); // READ all
formsRoute.get('/:id', getFormById); // READ by ID
formsRoute.put('/:id', upload.single('file'), updateForm); // UPDATE
formsRoute.delete('/:id', deleteForm); // DELETE

// DOWNLOAD Route
formsRoute.get('/download/:id', downloadFile);

export default formsRoute