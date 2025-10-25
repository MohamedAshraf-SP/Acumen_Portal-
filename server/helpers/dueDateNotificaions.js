import mongoose from "mongoose";
import Company from "../models/company/company.js";
import DueDate from "../models/company/dueDates.js";
import EmailTemplate from "../models/emailTemplate.js";





/**
 * Utility to calculate difference in days
 */

// Helper to calculate days until a date
function daysUntil(date) {
    if (!date) return Infinity;
    const now = new Date();
    return Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24));
}

// Replace placeholders like #NAME#, #COMPANYNAME#, etc.
function replacePlaceholders(template, data) {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`#${key.toUpperCase()}#`, "g");
        result = result.replace(regex, value || "");
    }
    return result;
}

// Main checker and sender
export async function checkDueDatesAndSendEmails() {

    const dueDates = await DueDate.find().populate("companyId", "companyEmail");

    for (const dueDateItem of dueDates) {
        const company = await Company.findOne({ _id: dueDateItem._id })
        const companyName = company?.companyName || "The Company";
        const accountantName = "Account Manager";

        // Define due fields and corresponding email templates
        const checks = [
            { field: "quarter1DueBy", templateName: "Vat Returns Due", maxDays: 37 },
            { field: "quarter2DueBy", templateName: "Vat Returns Due", maxDays: 37 },
            { field: "quarter3DueBy", templateName: "Vat Returns Due", maxDays: 37 },
            { field: "quarter4DueBy", templateName: "Vat Returns Due", maxDays: 37 },
            { field: "confirmationStatementDueBy", templateName: "Confirmation Statement Due", maxDays: 7 },
            { field: "annualVatDueBy", templateName: "Self Assessment Due", maxDays: 270 },
            { field: "AccountsDueBy", templateName: "Account Returns Due", maxDays: 270 },
        ];

        // Iterate over each due field
        for (const { field, templateName, maxDays } of checks) {
            const dueDate = dueDateItem[field];
            if (!dueDate) continue;

            const daysLeft = daysUntil(dueDate);

            if (daysLeft <= maxDays && daysLeft >= 0) {
                const template = EmailTemplate.findOne({ subject: templateName });
                if (!template) {
                    console.log(`⚠️ No template found for ${templateName}`);
                    continue;
                }

                // Replace placeholders
                const message = replacePlaceholders(template.content, {
                    NAME: companyName,
                    COMPANYNAME: companyName,
                    LOGINLINK: "<a href='https://yourportal.com/login'>Login here</a>",
                    ACCOUNTANTNAME: accountantName,
                    SIGNATURE: "Kind regards,<br>AMS",
                });

                const subject = template.name;
                const text = `Reminder: ${template.content} is due soon.`;
                const email = dueDateItem?.companyEmail;

                // Use your sendEmail function
                const success = await sendEmail(subject, text, email, message);
                if (success) {
                    console.log(`✅ Sent "${templateName}" email to ${email}`);
                } else {
                    console.log(`❌ Failed to send "${templateName}" email to ${email}`);
                }
            }
        }
    }

    console.log("✅ All due date reminders processed successfully");

    return {
        message: "success operation"
    }
}
