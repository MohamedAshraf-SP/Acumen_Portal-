import Client from "../../models/users/clients.js"
import { deleteFileWithPath } from "../../helpers/deleteFile.js"
import { readCsvAsync } from "../../helpers/importFormCSV.js"
import User from "../../models/users/user.js"
import { Company, DueDate, Shareholder, Address, RMdepartment, Director, BankDetail } from "../../models/company/index.js"

import { sendEmail } from "../../helpers/emailSender.js"






export const importClientsFromCSV = async (req, res) => {
    try {
        const path = req.file.path
        // console.log(path)
        const results = await readCsvAsync(`./${path}`)


        for (let i = 1; i <= process.env.CSV_import_limit; i++) {
            //  console.log(results[i])
            let newCompany = new Company({})

            // const companyID = await newCompany.save()._id
            const companyID = (await newCompany.save())._id




            // console.log(results[0]);
            const newUser = new User({
                userName: results[i]['Email'],
                userRole: 'client'
            })
            const savedUser = await newUser.save()

            sendEmail(
                "welcome to ACCUMEN Portal",
                `this is your ${savedUser.userRole} Credentials:

                UserName: ${savedUser.userName}  ,
                password: ${savedUser.password}
                
                
                `, savedUser.userName, "accumen portal team"
            )


            //console.log(`xxxxxxxxxx${results[i]['description']}`);

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
                //vatNumber: "xx",
                //vatReturnsPeriod: "xx",
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
            // console.log("diessssssxrctos", Date.parse(results[i]['entryDate']), results[i]['entryDate']);



            let vat = results[i]['VATRegistered']
            if (vat == 0 || vat == '0' || vat == "false" || vat == "False" || vat == "FALSE") {
                vat == false
            } else {
                vat == true
            }

            const savedCompany = await Company.findByIdAndUpdate(
                companyID,
                {
                    companyName: results[i]['companyName'] || "",
                    contactName: results[i]['contactName'] || "",
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

            // console.log("saved", savedCompany)


            const newClient = new Client({
                userID: newUser._id,
                name: results[i]['clientName'] || "",
                email: results[i]['Email'] || "",
                notification: 1,
                companies: [savedCompany]

            })



            var savedClient = await newClient.save()

        }


        deleteFileWithPath(`./${path}`)

        res.status(200).json({ savedClient })
    } catch (e) {
        console.log(e)

        res.status(400).json({ Error: ` ${e.message}` })
    }



}




