import { Shareholder } from "../../models/company/index.js";
import { countDocuments } from "../../services/public/countDocuments.js";


// Create a new Shareholder
export const addShareholder = async (req, res) => {
    try {
        const companyId = req.id


        if (!companyId) {
            return res.status(400).json({ message: "Company id is required!!" })
        }

        const ShareholderObj = {
            companyId,
            ...req.body
        }
        // console.log(ShareholderObj);
        const newShareholder = new Shareholder(ShareholderObj);
        await newShareholder.save();
        res.status(201).json({ message: "Shareholder created successfully!!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating Shareholder!!", error });
    }
};

// Get all Shareholders
export const getAllShareholdersOfCompany = async (req, res) => {
    try {
        const companyId = req.id


        const { page = 1, limit = 100 } = req.query; // Default page = 1, limit = 10

        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate total count for pagination metadata
        const totalShareholders = await Shareholder.countDocuments({ companyId });

        // Fetch companies with pagination
        const Shareholders = await Shareholder.find({ companyId })
            .skip((pageNumber - 1) * limitNumber) // Skip documents for the previous pages
            .limit(limitNumber); // Limit the number of documents per page

        console.log(Shareholders.length);
        // Return paginated response
        res.status(200).json({
            totalShareholders: totalShareholders,
            CurrentPage: pageNumber,
            TotalPages: Math.ceil(totalShareholders / limitNumber),
            Shareholders,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error retrieving Shareholders!", error });
    }
};

// Get a single Shareholder by ID
export const getShareholderById = async (req, res) => {
    try {
        const resultShareholder = await Shareholder.findById(req.params.id);
        if (!resultShareholder) return res.status(404).json({ message: "Shareholder not found!!" });
        res.status(200).json(resultShareholder);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Shareholder!!" });
    }
};

// Update a Shareholder by ID
export const updateShareholder = async (req, res) => {
    try {

        const updatedShareholder = await Shareholder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedShareholder) return res.status(404).json({ message: "Shareholder not found!!" });
        res.status(200).json({ message: "Shareholder updated successfully!!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating Shareholder!!", error });
    }
};

// Delete a Shareholder by ID
export const deleteShareholder = async (req, res) => {
    try {
        const deletedShareholder = await Shareholder.findByIdAndDelete(req.params.id);
        if (!deletedShareholder) return res.status(404).json({ message: "Shareholder not found!!" });
        res.status(200).json({ message: "Shareholder deleted successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Shareholder!!" });
    }
};


export const getCompanyShareholdersCount = async (req, res) => {
    try {

        res.status(200).json({ count: (await countDocuments(Shareholder, { companyId: req.id })) });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};