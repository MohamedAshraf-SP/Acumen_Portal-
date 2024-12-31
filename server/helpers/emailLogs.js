import EmailLog from "../models/helpers/emailLogs.js"

export const addEmailLog = (emailedTo, emailSubject, clientName, companyName, period = null, deadline =null) => {

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