import EmailLog from "../models/helpers/emailLogs.js"

export const addEmailLog = (emailedTo, emailSubject, clientName, companyName, period = "N.A", deadline = Date.parse("9999-09-09")) => {

    const newLog = new EmailLog({
        emailedTo,
        emailSubject,
        period,
        clientName,
        companyName,
        deadline,
        date: Date.now()
    })

    const addedLog = newLog.save()

    if (addedLog) {
        return true
    } else {
        return false
    }
}