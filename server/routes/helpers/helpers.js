
import { importClientsFromCSV } from "../../controllers/helpers/clientsFormCSV.js";
import { upload } from "../../config/multer.js";

import { Router } from 'express';
import { getEmailLogs, getLogsCount } from "../../controllers/helpers/emailLogs.js";


import { addHelper, updateHelper, getHelpers, deleteHelper, getHelperById, checkEmail } from "../../controllers/helpers/helpers.js"
const helpersRoute = new Router()

//check if email exits
helpersRoute.get("/checkEmail", checkEmail)

//csv import
helpersRoute.post('/importCSV', upload.single('clients'), importClientsFromCSV)

//email logs

helpersRoute.get("/email/logs", getEmailLogs)
helpersRoute.get("/email/logs/count", getLogsCount)


//helpers
helpersRoute.post('/consts', addHelper);          // CREATE
helpersRoute.get('/consts', getHelpers);            // READ all
helpersRoute.get('/consts/:id', getHelperById);     // READ by ID
helpersRoute.put('/consts/:id', updateHelper);      // UPDATE
helpersRoute.delete('/consts/:id', deleteHelper);


export default helpersRoute

