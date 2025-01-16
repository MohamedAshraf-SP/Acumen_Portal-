
import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { addForm, updateForm, deleteForm, downloadFile, getFormById, getForms, getFormsCount } from "../controllers/formsFiles.js"
import { roleMiddleware } from "../middlewares/autherization.js";

export const formsRoute = Router();


formsRoute.get('/count', getFormsCount);
formsRoute.get('/', getForms);
formsRoute.get('/:id', getFormById);
formsRoute.get('/download/:id', roleMiddleware(["admin", "accountant", "client"]), downloadFile);



formsRoute.use(roleMiddleware(["admin"]))

// CREATE

formsRoute.post('/', upload.single('file'), addForm);
formsRoute.put('/:id', upload.single('file'), updateForm);
formsRoute.delete('/:id', deleteForm);

// DOWNLOAD Route


export default formsRoute