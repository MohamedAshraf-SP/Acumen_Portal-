import express from "express";
import {
    getCompanyById,
    getCompaniesCount,
    getCompanies,
    getCompaniesAbstracted,
    updateCompany,
    deleteCompany,
    addCompany,
    updateCompanyDuedates
} from "../../controllers/company/company.js";

import { directorRouter, directorRouterWithCID } from "./director.js"
import { shareholderRouter, shareholderRouterWithCID } from "./shareholder.js";
import { documentRouter, documentRouterWithCID } from "./companyDocs.js";
import { roleMiddleware } from "../../middlewares/autherization.js";

export const companyRoute = express.Router();



companyRoute.get("/count", roleMiddleware(["admin", "accountant"]), getCompaniesCount);
companyRoute.get("/abstracted", roleMiddleware(["admin", "accountant", "client"]), getCompaniesAbstracted);
companyRoute.get("/:id", roleMiddleware(["admin", "accountant", "client"]), getCompanyById);
companyRoute.get("/", roleMiddleware(["admin", "accountant", "client"]), getCompanies);
companyRoute.post("/", addCompany);

companyRoute.put("/:id", roleMiddleware(["admin", "accountant", "client"]), updateCompany);
companyRoute.put("/:id/duedates", roleMiddleware(["admin", "accountant", "client"]), updateCompanyDuedates);

companyRoute.delete("/:id", roleMiddleware(["admin", "accountant", "client"]), deleteCompany);


//directors
companyRoute.use("/directors", roleMiddleware(["admin", "accountant", "client"]), directorRouter)
companyRoute.use("/:id/directors", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, directorRouterWithCID)


//shareholders
companyRoute.use("/shareholders", roleMiddleware(["admin", "accountant", "client"]), shareholderRouter)
companyRoute.use("/:id/shareholders", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, shareholderRouterWithCID)


//documents
companyRoute.use("/documents", roleMiddleware(["admin", "accountant", "client"]), documentRouter)
companyRoute.use("/:id/documents", roleMiddleware(["admin", "accountant", "client"]), (req, res, next) => {
    req.id = req.params.id
    next()
}, documentRouterWithCID)


export default companyRoute;