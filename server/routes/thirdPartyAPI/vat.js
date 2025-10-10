//import { getCompany, searchCompanies, getOfficers } from "../../controllers/thirdPartyAPI/vatAPI.js";
import express from "express";
const vatRouter = express.Router();

vatRouter.get("/callback", (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    res.send("received   ")

});



export default vatRouter;

