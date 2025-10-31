import mongoose from "mongoose";
import Company from "../models/company/company.js";
import DueDate from "../models/company/dueDates.js";
import EmailTemplate from "../models/emailTemplate.js";
import dueDates from "../models/company/dueDates.js";
import { sendEmail } from "./emailSender.js";
import Helper from "../models/helpers/helpers.js";
import Client from "../models/users/clients.js";





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
function replacePlaceholders(template = "", data = {}) {
    if (typeof template !== "string") template = String(template ?? "");
    let result = template;

    for (const [key, value] of Object.entries(data || {})) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`#${escapedKey}#`, "gi");
        result = result.replace(regex, value ?? "");
    }

    return result;
}

// Main checker and sender
export async function checkDueDatesAndSendEmails() {
    try {
        const dueDates = await DueDate.find()//.populate("companyId", "companyEmail");
        if(!dueDates){
            return{
                success:false,
                message:"No dueDates found"
            }
        }
        for (const dueDateItem of dueDates) {
            const company = await Company.findOne({ _id: dueDateItem.companyId })
            const companyName = company?.companyName || "The Company";
            const clientName = company?.clientName || "";
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
                    let template = await EmailTemplate.find({ name: templateName });
                    console.log(template);

                    if (!template[0]) {
                        console.log(`⚠️ No template found for ${templateName}`);
                        continue;
                    }
                    template = template[0]

                    const signture = await Helper.findOne({ name: "SIGNATURE" })||"AMS"


                    // Replace placeholders
                    const message = replacePlaceholders(template.content, {
                        NAME: clientName,
                        COMPANYNAME: companyName,
                        LOGINLINK: `<a href=${process.env.LOGIN_LINK}>Login here</a>`,
                        ACCOUNTANTNAME: accountantName,
                        SIGNATURE: signture?.value,
                    });

                    const subject = template.name;
                    const text = `Reminder: ${template.name} is due soon.`;
                    const email = dueDateItem?.companyEmail;

                    // Use your sendEmail function
                    const success = await sendEmail(subject, text, email, undefined, message);
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
            success: true,
            message: "✅ All due date reminders processed successfully"
        }
    } catch (error) {
        console.log(error)
        return error
    }
}
