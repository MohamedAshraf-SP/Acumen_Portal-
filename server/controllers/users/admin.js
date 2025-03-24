
import { Company } from "../../models/company/index.js";
import EmailLog from "../../models/helpers/emailLogs.js";
import TasksDocument from "../../models/tasksDocuments.js";
import Client from "../../models/users/clients.js";

export const getAdminDashboardCounts = async (req, res) => {
    try {
        const documentsCount = await TasksDocument.countDocuments({});

        const CompaniesCount = await Company.countDocuments({});

        const ClientsCount = await Client.countDocuments({});

        const emailLogs = await EmailLog.countDocuments({});

        // Return the response in the required format
        res.status(200).json([
            { label: "Clients", count: ClientsCount },
            { label: "Documents", count: documentsCount },
            { label: "Companies", count: CompaniesCount },
            { label: "Emails ", count: emailLogs },
        ]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};