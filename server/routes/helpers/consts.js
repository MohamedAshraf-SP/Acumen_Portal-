
import { importClientsFromCSV } from "../../controllers/helpers/clientsFormCSV.js";
import { upload } from "../../middlewares/multer.js";

import { Router } from 'express';
import { getEmailLogs, getLogsCount } from "../../controllers/helpers/emailLogs.js";


import { addHelper, updateHelper, getHelpers, deleteHelper, getHelperById, checkEmail } from "../../controllers/helpers/consts.js"
import { roleMiddleware } from "../../middlewares/autherization.js";
const helpersRoute = new Router()

//check if email exits
helpersRoute.post("/checkEmail", roleMiddleware(["admin", "accountant", "client"]), checkEmail)
helpersRoute.post('/importCSV', roleMiddleware(["admin", "accountant"]), upload.single('clients'), importClientsFromCSV)

//email logs
helpersRoute.get("/email/logs/count", roleMiddleware(["admin", "accountant"]), getLogsCount)
helpersRoute.get("/email/logs", roleMiddleware(["admin", "accountant"]), getEmailLogs)



//helpers
helpersRoute.get('/consts/:id', roleMiddleware(["admin"]), getHelperById);          
helpersRoute.get('/consts', roleMiddleware(["admin"]), getHelpers);  
helpersRoute.post('/consts', roleMiddleware(["admin"]), addHelper);          
helpersRoute.put('/consts/:id', roleMiddleware(["admin"]), updateHelper);     
helpersRoute.delete('/consts/:id', roleMiddleware(["admin"]), deleteHelper);


export default helpersRoute

