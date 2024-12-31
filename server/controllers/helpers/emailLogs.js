import EmailLog from "../../models/helpers/emailLogs.js";

export const getEmailLogs = async (req, res) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;

    const emailLogsCount = await EmailLog.countDocuments();
    // console.log(emailLogsCount)

    const pagesCount = Math.ceil(emailLogsCount / limit) || 0;

    try {
        const emailLogs = await EmailLog.find(
            {}
        ).select({
            emailedTo: 1, // Recipient email address
            emailSubject: 1, // Subject of the email
            clientName: 1, // Client name
            companyName: 1, // Company name
            date: 1, // Date when the email was sent
            deadline: 1, // Deadline for the task or action
            period: 1
        })
            .skip(skip)
            .limit(limit); // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            currentPage: page,
            pagesCount: pagesCount,
            emailLogs,
            emailLogsCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getLogsCount = async (req, res) => {
    const emailLogsCount = await EmailLog.countDocuments();

    if (emailLogsCount) {
        res.status(200).json({ emailLogsCount })
    } else {
        res.status(400).json(0)
    }

}