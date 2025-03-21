import { getCompany, searchCompanies, getOfficers } from "../../controllers/thirdPartyAPI/companyHouseAPI.js";
import express from "express";
const companyHouseRouter = express.Router();

companyHouseRouter.get("/company/:companyNumber", getCompany);
companyHouseRouter.get("/search/companies/:companyName", searchCompanies);
companyHouseRouter.get("/company/:companyNumber/officers", getOfficers);


export default companyHouseRouter;

