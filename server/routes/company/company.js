import express from "express";
import {
    getCompanyById,
    getCompaniesCount,
    getCompanies,
    updateCompany,
    deleteCompany,
    addCompany,
} from "../../controllers/company/company.js";

export const companyRoute = express.Router();


companyRoute.get("/count", getCompaniesCount);
companyRoute.get("/:id", getCompanyById);
companyRoute.get("/", getCompanies);
companyRoute.post("/", addCompany);
companyRoute.put("/:id", updateCompany);
companyRoute.delete("/:id", deleteCompany);


export default companyRoute;