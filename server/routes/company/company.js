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

export const companyRoute = express.Router();



companyRoute.get("/count", getCompaniesCount);
companyRoute.get("/abstracted", getCompaniesAbstracted);
companyRoute.get("/:id", getCompanyById);
companyRoute.get("/", getCompanies);
companyRoute.post("/", addCompany);

companyRoute.put("/:id", updateCompany);
companyRoute.put("/:id/duedates", updateCompanyDuedates);

companyRoute.delete("/:id", deleteCompany);


//directors
companyRoute.use("/directors", directorRouter)
companyRoute.use("/:id/directors", (req, res, next) => {
    req.id = req.params.id
    next()
}, directorRouterWithCID)


//shareholders
companyRoute.use("/shareholders", shareholderRouter)
companyRoute.use("/:id/shareholders", (req, res, next) => {
    req.id = req.params.id
    next()
}, shareholderRouterWithCID)


//documents
companyRoute.use("/documents", documentRouter)
companyRoute.use("/:id/documents", (req, res, next) => {
    req.id = req.params.id
    next()
}, documentRouterWithCID)


export default companyRoute;