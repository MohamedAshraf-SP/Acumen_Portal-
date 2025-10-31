import EmailLog from "../models/helpers/emailLogs.js"

export const addEmailLog = (emailedTo, emailSubject, clientName, companyName, period = "N.A", deadline = "N.A") => {

    const newLog = new EmailLog({
        emailedTo,
        emailSubject,
        period,
        clientName,
        companyName,
        deadline,
        date: new Date()
    })

    const addedLog = newLog.save()

    if (addedLog) {
        return true
    } else {
        return false
    }
}