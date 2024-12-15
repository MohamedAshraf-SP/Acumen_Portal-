import Client from "../../models/users/clients.js"
import { deleteFileWithPath } from "../../helpers/deleteFile.js"
import { readCsvAsync } from "../../helpers/importFormCSV.js"
import User from "../../models/users/user.js"
import { Company, DueDate, Shareholder, Address, RMdepartment, Director, BankDetail } from "../../models/company/index.js"

import { sendEmail } from "../../helpers/emailSender.js"


export const importClientsFromCSV = async (req, res) => {
    try {
        const path = req.file.path;
        const results = await readCsvAsync(`./${path}`);

        const importedClients = [];

        // Ensure CSV import limit is within bounds
        const csvImportLimit = Math.min(results.length, process.env.CSV_import_limit || results.length);

        for (let i = 1; i <= csvImportLimit; i++) {
            try {
                // 1. Create and save the company
                const company = await saveCompany(results[i]);

                // 2. Create and save the user
                const user = await saveUser(results[i]);

                // 3. Send an email with credentials
                sendClientEmail(user);

                // 4. Create related entities (Departments, DueDates, etc.)
                const relatedEntities = await createRelatedEntities(company._id, results[i]);

                // 5. Update the company with related entities
                const updatedCompany = await updateCompanyWithEntities(company, relatedEntities);

                // 6. Create and save the client
                const client = await saveClient(user._id, results[i], updatedCompany);
                importedClients.push(client);
            } catch (err) {
                console.error(`Error processing row ${i}:`, err.message);
                // Continue to the next row without breaking
                continue;
            }
        }

        deleteFileWithPath(`./${path}`);

        res.status(200).json({ importedClients });
    } catch (e) {
        console.error(e);
        res.status(400).json({ Error: e.message });
    }
};

// Function to save a company
async function saveCompany(data) {
    const newCompany = new Company({});
    return await newCompany.save();
}

// Function to save a user
async function saveUser(data) {
    const newUser = new User({
        userName: data['Email'],
        userRole: 'client',
    });
    return await newUser.save();
}

// Function to send an email
function sendClientEmail(user) {
    sendEmail(
        "Welcome to ACCUMEN Portal",
        `This is your ${user.userRole} Credentials:

        UserName: ${user.userName},
        Password: ${user.password}
        
        `,
        user.userName,
        "ACCUMEN Portal Team"
    );
}

// Function to create related entities
async function createRelatedEntities(companyId, data) {
    const department = new RMdepartment({
        companyID: companyId,
        departmentName: data['RMdepartmentName'] || "",
        description: data['description'] || "",
    });

    const dueDate = new DueDate({
        companyId,
        vatNumber: data['vatNumber'] || "",
        vatReturnsPeriod: data['vatReturnsPeriod'] || "",
        quarter1DueBy: parseDate(data.quarter1DueBy),
        quarter2DueBy: parseDate(data.quarter2DueBy),
        quarter3DueBy: parseDate(data.quarter3DueBy),
        quarter4DueBy: parseDate(data.quarter4DueBy),
        confirmationStatementDueBy: parseDate(data.confirmationStatementDueBy),
        annualVatDueBy: parseDate(data.annualVatDueBy),
    });

    const address = new Address({
        companyId,
        businessAddress: data['businessAddress'] || "",
        registeredOfficeAddress: data['registeredOfficeAddress'] || "",
        telephone: data['telephone'] || "",
        email: data['email'] || "",
        website: data['website'] || "",
    });

    const [savedDepartment, savedDueDate, savedAddress] = await Promise.all([
        department.save(),
        dueDate.save(),
        address.save(),
    ]);

    return { savedDepartment, savedDueDate, savedAddress };
}

// Function to update a company with related entities
async function updateCompanyWithEntities(company, entities) {
    return await Company.findByIdAndUpdate(
        company._id,
        {
            RMdepartments: entities.savedDepartment._id,
            dueDates: entities.savedDueDate._id,
            address: entities.savedAddress._id,
        },
        { new: true }
    );
}

// Function to save a client
async function saveClient(userId, data, company) {
    const newClient = new Client({
        userID: userId,
        name: data['clientName'] || "",
        email: data['Email'] || "",
        notification: 1,
        companies: [company],
    });
    return await newClient.save();
}

// Utility function for parsing dates
function parseDate(dateString) {
    return dateString ? Date.parse(dateString) : null;
}
