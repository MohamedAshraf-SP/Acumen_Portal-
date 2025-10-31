
import { checkDueDatesAndSendEmails } from "../../helpers/dueDateNotificaions.js";
import dueDates from "../../models/company/dueDates.js";
import {
    Company,
    Shareholder,
    DueDate,
    Director,
    Address,
    Document,
    BankDetail,
    RMdepartment,
} from "../../models/company/index.js";
import Client from "../../models/users/clients.js";
import User from "../../models/users/user.js";
import { countDocuments } from "../../services/public/countDocuments.js";




// Add a new company
export const addCompany = async (req, res) => {
    try {
        const {
            clientID,
            clientName,
            AccountsOfficeReference,
            AuthCode,
            CISRegistrationNumber,
            // RMdepartments,
            departments,
            VATRegistered,
            accountingReferenceDate,
            bankDetails,
            companyName,
            contactName,
            corporationTax_UTR,
            employerPAYEReference,
            entryDate,
            incorporationDate,
            natureOfBusiness,
            phone,
            registrationDate,
            registrationNumber,
            status,
            businessAddress,
            registeredOfficeAddress,
            telephone,
            email,
            website,
            bName,
            accountNumber,
            accountHolder,
            sortCode
        } = req.body;
        const bodyDueDates = req.body?.dueDate;
        let updatedDepartments = req.body?.departments || [];
        if (req.user.role == "accountant") {
            updatedDepartments.push(req.user.department)
        }

        const targetClient = await Client.findById(clientID)
        // console.log(targetClient, clientID)
        if ((!clientID) || !(targetClient)) {
            return res.status(400).json({ message: "Company Client  not Found !!" })
        }

        // Create the company
        const company = new Company({
            clientID,
            clientName,
            AccountsOfficeReference,
            AuthCode,
            CISRegistrationNumber,
            departments: updatedDepartments,
            VATRegistered,
            accountingReferenceDate,
            bankDetails,
            companyName,
            contactName,
            corporationTax_UTR,
            employerPAYEReference,
            entryDate,
            incorporationDate,
            natureOfBusiness,
            phone: targetClient.phone || req.body.phone,
            registrationDate,
            registrationNumber,
            status,
            businessAddress,
            registeredOfficeAddress,
            telephone,
            email,
            website,
            bName,
            accountNumber,
            accountHolder,
            sortCode
        });
        const savedCompanyID = (await company.save())._id;

        const dueDate = new DueDate({
            companyId: savedCompanyID,
            companyEmail: company.email,
            ...bodyDueDates
        })
        const newDueDate = await dueDate.save()
        //console.log(newDueDate);

        await Client.findByIdAndUpdate(clientID, { $push: { companies: savedCompanyID }, $addToSet: { departments: { $each: departments } } })



        res.status(201).json({ message: "Company added successfully" });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Error adding company", "Error": error.message });
    }
};

// Get all companies
export const getCompanies = async (req, res) => {
    try {
        let filter = {}
        const { page = 1, limit = 100 } = req.query;

        if (req.user.role == "accountant") {
            filter.departments = { $in: req.user.department }
        }

        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate total count for pagination metadata
        const totalCompanies = await Company.countDocuments(filter);

        // Fetch companies with pagination
        const companies = await Company.find(filter)

            .populate({ path: "shareholder", strictPopulate: false })
            .populate({ path: "director", strictPopulate: false })
            .populate({ path: "document", strictPopulate: false })
            .skip((pageNumber - 1) * limitNumber) // Skip documents for the previous pages
            .limit(limitNumber); // Limit the number of documents per page

        // Return paginated response
        res.status(200).json({
            TotalCompanies: totalCompanies,
            CurrentPage: pageNumber,
            TotalPages: Math.ceil(totalCompanies / limitNumber),
            companies,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).json({ message: "Error retrieving companies!", error });
    }
};


export const getCompaniesAbstracted = async (req, res) => {
    try {
        let filter = {}

        if (req.user.role == "accountant") {
            filter.departments = { $in: req.user.department }
        }
        if (req.user.role == "client") {
            filter.clientID = req.user.clientID
        }

        const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10

        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate total count for pagination metadata
        const totalCompanies = await Company.countDocuments(filter);

        // Fetch companies with pagination
        const companies = await Company.find(filter)
            //  .populate({ path: "Client", strictPopulate: false })
            .select({
                companyName: 1,
                clientName: 1,
                contactName: 1,
                phone: 1,
                email: 1,
                telephone: 1
            }).skip((pageNumber - 1) * limitNumber) // Skip documents for the previous pages
            .limit(limitNumber);

        // Return paginated response
        res.status(200).json({
            TotalCompanies: totalCompanies,
            CurrentPage: pageNumber,
            TotalPages: Math.ceil(totalCompanies / limitNumber),
            companies,
        });
    } catch (error) {
        //console.log(error)
        res.status(500).json({ message: "Error retrieving companies!!", error });
    }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id

        const company = await Company.findById(req.params.id)
            .populate({ path: "shareholder", strictPopulate: false })
            .populate({ path: "director", strictPopulate: false })
            .populate({ path: "address", strictPopulate: false })
            .populate({ path: "document", strictPopulate: false })
            .populate({ path: "BankDetail", strictPopulate: false })
            .populate({ path: "dueDates", strictPopulate: false })
        // .populate({ path: "RMdepartment", strictPopulate: false })

        const shareholders = await Shareholder.find({ companyId })
        const dueDate = await DueDate.find({ companyId })
        const documents = await Document.find({ companyId })
        const directors = await Director.find({ companyId })
        // console.log(dueDate[0]);
        company.shareholders = shareholders
        company.dueDates = dueDate[0]
        // company.documents = documents[0]
        company.directors = directors

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving company", error });
    }
};

// Update a company
export const updateCompany = async (req, res) => {
    try {
        const { ...companyData } = req.body;
        let updateCompanyData = {}

        // Update company
        const company = await Company.findByIdAndUpdate(req.params.id, companyData, { new: true });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        //  console.log(company.clientID);
        if (companyData.departments) {
            updateCompanyData = { $addToSet: { departments: { $each: companyData.departments } } }
        }

        if (company?.companyEmail) {
            await DueDate.updateOne({ companyId: req.params.id }, { companyEmail: company.companyEmail })
        }

        if (company?.clientID) {

            await Client.findByIdAndUpdate(company.clientID, updateCompanyData)
        }


        res.status(200).json({ message: "Company updated successfully!!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating company", error });
    }
};




// Delete a company
export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        // await Company.deleteMany()
        // await Client.deleteMany()
        // await User.deleteMany()


        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Optionally delete related schemas (if required)
        await Shareholder.deleteMany({ _id: { $in: company.shareholders } });
        await Director.deleteMany({ _id: { $in: company.directors } });
        await Document.deleteMany({ _id: { $in: company.documents } });

        await DueDate.deleteMany({ _id: company.dueDates });
        // await Address.deleteMany({ _id: company.address });
        // await RMdepartment.deleteMany({ _id: company.RMdepartments });
        //await BankDetail.deleteMany({ _id: company.bankDetails });

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting company", error });
    }
};

export const getCompaniesCount = async (req, res) => {
    try {
        res.status(200).json({ count: (await countDocuments(Company)) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//update duedates
export const updateCompanyDuedates = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await Company.findOne({ _id: companyId });

        if (!company) {
            return res.status(404).json({ message: "Due dates for this company not found or company does not exits!!" });
        }

        const dueDate = {
            vatNumber: req.body.vatNumber,
            vatReturnsPeriod: req.body.vatReturnsPeriod,
            companyEmail: company.email,

            // annual, quarterly
            quarter1DueBy: Date.parse(req.body.quarter1DueBy),
            quarter2DueBy: Date.parse(req.body.quarter2DueBy),
            quarter3DueBy: Date.parse(req.body.quarter3DueBy),
            quarter4DueBy: Date.parse(req.body.quarter4DueBy),
            confirmationStatementDueBy: Date.parse(req.body.confirmationStatementDueBy),
            annualVatDueBy: Date.parse(req.body.annualVatDueBy),

        }

        // Update company
        await DueDate.updateOne({ companyId }, dueDate, { new: true });

        res.status(200).json({ message: "Duedates updated successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating company", error });
    }
};

export const getDueDateByCompanyId = async (req, res) => {
    try {
        const companyId = req.params.id
        const due = await DueDate.findOne({ companyId });
        //  console.log(companyId);
        if (!due) {
            return res.status(404).json({ message: "Due dates for this company not found or company does not exits!!" });
        }
        res.status(200).json(due);
    } catch (error) {
        res.status(500).json({ message: "Error fetching DueDate!!" });
    }
};


export const dueDateCornJob = async (req, res) => {
    try {
        const result = await checkDueDatesAndSendEmails()
        //  console.log(companyId);
        if (!result.success) {
            return result.status(404).json({ message: "Due dates not success" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Sending DueDate emails!!" });
    }
};

