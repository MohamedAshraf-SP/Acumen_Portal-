/*
// import Client from "../../models/users/clients.js"
// import { deleteFileWithPath } from "../../helpers/deleteFile.js"
// import { readCsvAsync } from "../../helpers/importFormCSV.js"
// import User from "../../models/users/user.js"
// import { Company, DueDate, Shareholder, Address, RMdepartment, Director, BankDetail } from "../../models/company/index.js"

// import { sendEmail } from "../../helpers/emailSender.js"


// export const importClientsFromCSV = async (req, res) => {
//     try {
//         const path = req.file.path;
//         const results = await readCsvAsync(`./${path}`);

//         const importedClients = [];

//         // Ensure CSV import limit is within bounds
//         const csvImportLimit = Math.min(results.length, process.env.CSV_import_limit || results.length);

//         for (let i = 1; i <= csvImportLimit; i++) {
//             try {
//                 // 1. Create and save the company
//                 const company = await saveCompany(results[i]);

//                 // 2. Create and save the user
//                 const user = await saveUser(results[i]);

//                 // 3. Send an email with credentials
//                 sendClientEmail(user);

//                 // 4. Create related entities (Departments, DueDates, etc.)
//                 const relatedEntities = await createRelatedEntities(company._id, results[i]);

//                 // 5. Update the company with related entities
//                 const updatedCompany = await updateCompanyWithEntities(company, relatedEntities);

//                 // 6. Create and save the client
//                 const client = await saveClient(user._id, results[i], updatedCompany);
//                 importedClients.push(client);
//             } catch (err) {
//                 console.error(`Error processing row ${i}:`, err.message);
//                 // Continue to the next row without breaking
//                 continue;
//             }
//         }

//         deleteFileWithPath(`./${path}`);

//         res.status(200).json({ importedClients });
//     } catch (e) {

//         console.error(e);
//         res.status(400).json({ Error: e.message });
//     }
// };

// // Function to save a company
// async function saveCompany(data) {
//     const newCompany = new Company({});
//     return await newCompany.save();
// }

// // Function to save a user
// async function saveUser(data) {
//     const newUser = new User({
//         userName: data['Email'],
//         userRole: 'client',
//     });
//     return await newUser.save();
// }

// // Function to send an email
// function sendClientEmail(user) {
//     sendEmail(
//         "Welcome to ACCUMEN Portal",
//         `This is your ${user.userRole} Credentials:

//         UserName: ${user.userName},
//         Password: ${user.password}

//         `,
//         user.userName,
//         "ACCUMEN Portal Team"
//     );
// }

// // Function to create related entities
// async function createRelatedEntities(companyId, data) {
//     const department = new RMdepartment({
//         companyID: companyId,
//         departmentName: data['RMdepartmentName'] || "",
//         description: data['description'] || "",
//     });

//     const dueDate = new DueDate({
//         companyId,
//         vatNumber: data['vatNumber'] || "",
//         vatReturnsPeriod: data['vatReturnsPeriod'] || "",
//         quarter1DueBy: parseDate(data.quarter1DueBy),
//         quarter2DueBy: parseDate(data.quarter2DueBy),
//         quarter3DueBy: parseDate(data.quarter3DueBy),
//         quarter4DueBy: parseDate(data.quarter4DueBy),
//         confirmationStatementDueBy: parseDate(data.confirmationStatementDueBy),
//         annualVatDueBy: parseDate(data.annualVatDueBy),
//     });

//     const address = new Address({
//         companyId,
//         businessAddress: data['businessAddress'] || "",
//         registeredOfficeAddress: data['registeredOfficeAddress'] || "",
//         telephone: data['telephone'] || "",
//         email: data['email'] || "",
//         website: data['website'] || "",
//     });

//     const [savedDepartment, savedDueDate, savedAddress] = await Promise.all([
//         department.save(),
//         dueDate.save(),
//         address.save(),
//     ]);

//     return { savedDepartment, savedDueDate, savedAddress };
// }

// // Function to update a company with related entities
// async function updateCompanyWithEntities(company, entities) {
//     return await Company.findByIdAndUpdate(
//         company._id,
//         {
//             RMdepartments: entities.savedDepartment._id,
//             dueDates: entities.savedDueDate._id,
//             address: entities.savedAddress._id,
//         },
//         { new: true }
//     );
// }

// // Function to save a client
// async function saveClient(userId, data, company) {
//     const newClient = new Client({
//         userID: userId,
//         name: data['clientName'] || "",
//         email: data['Email'] || "",
//         notification: 1,
//         companies: [company],
//     });
//     return await newClient.save();
// }

// // Utility function for parsing dates
// function parseDate(dateString) {
//     return dateString ? Date.parse(dateString) : null;
// }



import mongoose from "mongoose"; // Ensure mongoose is imported
import Client from "../../models/users/clients.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";
import { readCsvAsync } from "../../helpers/importFormCSV.js";
import User from "../../models/users/user.js";
import { Company, DueDate, Shareholder, Address, RMdepartment, Director, BankDetail } from "../../models/company/index.js";
import { sendEmail } from "../../helpers/emailSender.js";

export const importClientsFromCSV = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const path = req.file.path;
        const results = await readCsvAsync(`./${path}`);
        const importedClients = [];

        // Ensure CSV import limit is within bounds
        const csvImportLimit = Math.min(results.length, process.env.CSV_import_limit || results.length);

        for (let i = 1; i <= csvImportLimit; i++) {
            await session.startTransaction(); // Start a new transaction for each record
            try {
                // 1. Create and save the company
                const company = await saveCompany(results[i], session);

                // 2. Create and save the user
                const user = await saveUser(results[i], session);

                // 3. Send an email with credentials
                const emailSent = await sendClientEmail(user);
                if (!emailSent) throw new Error(`Failed to send email to ${user.userName}`);

                // 4. Create related entities (Departments, DueDates, etc.)
                const relatedEntities = await createRelatedEntities(company._id, results[i], session);

                // 5. Update the company with related entities
                const updatedCompany = await updateCompanyWithEntities(company, relatedEntities, session);

                // 6. Create and save the client
                const client = await saveClient(user._id, results[i], updatedCompany, session);
                importedClients.push(client);

                await session.commitTransaction(); // Commit the transaction
            } catch (err) {
                await session.abortTransaction(); // Rollback the transaction
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
    } finally {
        session.endSession();
    }
};

// Function to save a company
async function saveCompany(data, session) {
    const newCompany = new Company({});
    return await newCompany.save({ session });
}

// Function to save a user
async function saveUser(data, session) {
    const newUser = new User({
        userName: data['Email'],
        userRole: 'client',
    });
    return await newUser.save({ session });
}

// Function to send an email
async function sendClientEmail(user) {
    try {
        await sendEmail(
            "Welcome to ACCUMEN Portal",
            `This is your ${user.userRole} Credentials:

            UserName: ${user.userName},
            Password: ${user.password}
            
            `,
            user.userName,
            "ACCUMEN Portal Team"
        );
        return true;
    } catch (err) {
        console.error(`Error sending email to ${user.userName}:`, err.message);
        return false;
    }
}

// Function to create related entities
async function createRelatedEntities(companyId, data, session) {
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
        department.save({ session }),
        dueDate.save({ session }),
        address.save({ session }),
    ]);

    return { savedDepartment, savedDueDate, savedAddress };
}

// Function to update a company with related entities
async function updateCompanyWithEntities(company, entities, session) {
    return await Company.findByIdAndUpdate(
        company._id,
        {
            RMdepartments: entities.savedDepartment._id,
            dueDates: entities.savedDueDate._id,
            address: entities.savedAddress._id,
        },
        { new: true, session }
    );
}

// Function to save a client
async function saveClient(userId, data, company, session) {
    const newClient = new Client({
        userID: userId,
        name: data['clientName'] || "",
        email: data['Email'] || "",
        notification: 1,
        companies: [company],
    });
    return await newClient.save({ session });
}

// Utility function for parsing dates
function parseDate(dateString) {
    return dateString ? Date.parse(dateString) : null;
}

*/

/****************************************/
import Client from "../../models/users/clients.js"
import { deleteFileWithPath } from "../../helpers/deleteFile.js"
import { readCsvAsync } from "../../helpers/importFormCSV.js"
import User from "../../models/users/user.js"
import { Company, DueDate, Shareholder, Address, RMdepartment, Director, BankDetail } from "../../models/company/index.js"

import { sendEmail } from "../../helpers/emailSender.js"






export const importClientsFromCSV = async (req, res) => {
    try {
        let envLimit = parseInt(process.env.CSV_import_limit)
        let start = parseInt(req.query.start) || 1
        let end = parseInt(req.query.end) || envLimit
        let clientsArr = []
        let emailNotSentRows = []
        let problems = []

        console.log(start, end);


        if (start < 1 || start > envLimit || start > end) {
            start = 1
        }

        if (end < start || end > envLimit) {
            end = envLimit
        }


        if (!req.file) {
            return res.status(400).json({ message: "File not found!!" })
        }


        const path = req.file.path
        const results = await readCsvAsync(`./${path}`)


        console.log(start, end);
        for (let i = start; i <= end; i++) {
            console.log(i);

            let newCompany = new Company({})
            const companyID = (await newCompany.save())._id

            const emailExist = await User.findOne({ userName: results[i]['Email'] })


            if (emailExist) {
                problems.push(i)
                continue
            }

            const newUser = new User({
                userName: results[i]['Email'],
                userRole: 'client'
            })
            const savedUser = await newUser.save()


            if (!sendEmail(
                "welcome to ACCUMEN Portal",
                `this is your ${savedUser.userRole} Credentials:

                UserName: ${savedUser.userName}  ,
                password: ${savedUser.password}
                
                
                `, savedUser.userName, "accumen portal team")
            ) {
                await User.findByIdAndDelete(newUser._id)
                await Company.findByIdAndDelete(newCompany._id)
                emailNotSentRows.push(i)

            }


            const newRMdepartments = new RMdepartment({
                companyID: companyID,
                departmentName: results[i]['RMdepartmentName'] || "",
                // departmentName: "xx",
                description: `${results[i]['description']}` || "",
                //description: "xx",

            })

            const savedRMdepartments = await newRMdepartments.save()


            const newDueDate = new DueDate({
                companyId: companyID,
                vatNumber: results[i]['vatNumber'] || "",
                vatReturnsPeriod: results[i]['vatReturnsPeriod'] || "", // annual, quarterly
                quarter1DueBy: Date.parse(results[i].quarter1DueBy) || "",
                quarter2DueBy: Date.parse(results[i]['quarter2DueBy']) || "",
                quarter3DueBy: Date.parse(results[i]['quarter3DueBy']) || "",
                quarter4DueBy: Date.parse(results[i]['quarter4DueBy']) || "",
                confirmationStatementDueBy: Date.parse(results[i]['confirmationStatementDueBy']) || "",
                annualVatDueBy: Date.parse(results[i]['annualVatDueBy']) || "",

            })
            const savedDueDate = await newDueDate.save()




            const newAddress = new Address({
                companyId: companyID,
                businessAddress: results[i]['businessAddress'] || "",
                vatReturnsPeriod: results[i]['vatReturnsPeriod'] || "", // annual, quarterly
                registeredOfficeAddress: results[i]['registeredOfficeAddress'] || "",
                telephone: results[i]['telephone'] || "",
                email: results[i]['email'] || "",
                website: results[i]['website'] || ""
            })
            const savedAddress = await newAddress.save()




            const newBankDetails = new BankDetail({
                bName: results[i]['bankName'] || "",
                accountNumber: results[i]['accountNumber'] || "", // annual, quarterly
                accountHolder: results[i]['accountHolder'] || "",
                sortCode: results[i]['sortCode'] || "",
            })
            const savedBankDetails = await newBankDetails.save()



            const newShareholder = new Shareholder({
                companyId: companyID,
                shName: results[i]['shName'] || "",
                numberOfShares: results[i]['numberOfShares'] || "",
                shareClass: results[i]['shareClass'] || "",

            })
            const savedShareholder = await newShareholder.save()



            const newDirector = new Director({
                companyId: companyID,
                companyId: companyID,
                dTitle: results[i]['directorTitle'] || "",
                dateOfAppointment: Date.parse(results[i]['dateOfAppointment']) || "", // annual, quarterly
                dateRegistrationForSE: Date.parse(results[i]['dateRegistrationForSE']) || "",
                dateOfResignation: Date.parse(results[i]['dateOfResignation']) || "",
                dName: results[i]['dName'] || "",
                dDateOfBirth: Date.parse(results[i]['dDateOfBirth']) || "",
                dUTR: results[i]['dUTR'] || "",
                dUTR_ID: results[i]['dUTR_ID'] || "",
                dUTR_Password: results[i]['dUTR_Password'] || "",
                dNIN: results[i]['dNIN'] || "",
            })
            const savedDirector = await newDirector.save()




            let vat = results[i]['VATRegistered']
            if (vat == 0 || vat == '0' || vat == "false" || vat == "False" || vat == "FALSE") {
                vat == false
            } else {
                vat == true
            }

            const savedCompany = await Company.findByIdAndUpdate(
                companyID,
                {

                    phone: results[i]['phone'] || "",
                    entryDate: Date.parse(results[i]['entryDate']) || "",
                    registrationNumber: results[i]['registrationNumber'] || "",
                    AuthCode: results[i]['AuthCode'] || "",
                    CISRegistrationNumber: results[i]['CISRegistrationNumber'] || "",
                    AccountsOfficeReference: results[i]['AccountsOfficeReference'] || "",
                    natureOfBusiness: results[i]['natureOfBusiness'] || "",
                    accountingReferenceDate: Date.parse(results[i]['accountingReferenceDate']) || "",
                    registrationDate: Date.parse(results[i]['registrationDate']) || "",
                    employerPAYEReference: results[i]['employerPAYEReference'] || "",
                    status: results[i]['status'] || "",
                    incorporationDate: Date.parse(results[i]['incorporationDate']) || "",
                    corporationTax_UTR: results[i]['corporationTax_UTR'] || "",
                    VATRegistered: vat,
                    dueDates: savedDueDate._id,
                    shareholders: [savedShareholder._id],
                    directors: [savedDirector._id],
                    address: savedAddress._id,
                    bankDetails: savedBankDetails._id,
                    RMdepartments: savedRMdepartments._id


                },
                { new: true } // Return the updated document
            ).populate()


            const newClient = new Client({
                userID: newUser._id,
                name: results[i]['clientName'] || "",
                department: results[i]['clientDepartment'] || "",
                email: results[i]['Email'] || "",
                notification: 1,
                companies: [savedCompany]

            })
            var savedClient = await newClient.save()

            await Company.findByIdAndUpdate(
                companyID,
                {
                    clientID: savedClient.id,
                    clientName: results[i]['clientName'] || "",
                }
            )






            clientsArr.push(i)

        }



        deleteFileWithPath(`./${path}`)

        res.status(200).json({
            "new clients:": clientsArr,
            "Email already exists for Rows:": problems,
            "Email not Correct for Rows :": emailNotSentRows
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ Error: ` ${e.message}` })
    }



}




