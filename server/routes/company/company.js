import express from "express";
import {
    getCompanyById,
    getCompaniesCount,
    getCompanies,
    getCompaniesAbstracted,
    updateCompany,
    deleteCompany,
    addCompany,
    updateCompanyDuedates,
    getDueDateByCompanyId
} from "../../controllers/company/company.js";

import { directorRouter, directorRouterWithCID } from "./director.js"
import { shareholderRouter, shareholderRouterWithCID } from "./shareholder.js";
import { documentRouter, documentRouterWithCID } from "./companyDocs.js";
import { roleMiddleware } from "../../middlewares/autherization.js";

export const companyRoute = express.Router();


companyRoute.get("/", roleMiddleware(["admin", "accountant"]), getCompanies);
companyRoute.get("/count", roleMiddleware(["admin", "accountant"]), getCompaniesCount);
companyRoute.get("/abstracted", roleMiddleware(["admin", "accountant", "client"]), getCompaniesAbstracted);
companyRoute.get("/:id/duedates", roleMiddleware(["admin", "accountant", "client"]), getDueDateByCompanyId);
companyRoute.get("/:id", roleMiddleware(["admin", "accountant", "client"]), getCompanyById);
companyRoute.post("/", addCompany);
companyRoute.put("/:id/duedates", roleMiddleware(["admin", "accountant", "client"]), updateCompanyDuedates);
companyRoute.put("/:id", roleMiddleware(["admin", "accountant", "client"]), updateCompany);
companyRoute.delete("/:id", roleMiddleware(["admin", "accountant", "client"]), deleteCompany);


//directors
companyRoute.use("/:id/directors", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, directorRouterWithCID)

companyRoute.use("/directors", roleMiddleware(["admin", "accountant", "client"]), directorRouter)


//shareholders
companyRoute.use("/:id/shareholders", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, shareholderRouterWithCID)
companyRoute.use("/shareholders", roleMiddleware(["admin", "accountant", "client"]), shareholderRouter)



//documents
companyRoute.use("/:id/documents", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, documentRouterWithCID)
companyRoute.use("/documents", roleMiddleware(["admin", "accountant", "client"]), documentRouter)






export default companyRoute;