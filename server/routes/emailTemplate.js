import Router from "express";
import {
    addTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    getTemplatesCount,
} from "../controllers/emailTemplate.js";

const templatesRouter = Router();

// Create a new template
templatesRouter.post("/", addTemplate);

templatesRouter.get("/", getTemplates);
templatesRouter.get("/count", getTemplatesCount);

templatesRouter.get("/:id", getTemplateById);

templatesRouter.put("/:id", updateTemplate);

templatesRouter.delete("/:id", deleteTemplate);

export default templatesRouter;
