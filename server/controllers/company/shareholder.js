import Shareholder from "../../models/company/shareholder.js";

import Shareholder from "../models/shareholder.js";

// Add a new shareholder
export const addShareholder = async (req, res) => {
    try {
        const shareholder = new Shareholder(req.body);
        await shareholder.save();
        res.status(201).json({ message: "Shareholder added successfully", shareholder });
    } catch (error) {
        res.status(500).json({ message: "Error adding shareholder", error });
    }
};

// Get all shareholders
export const getAllShareholders = async (req, res) => {
    try {
        const shareholders = await Shareholder.find().populate("companyId");
        res.status(200).json(shareholders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shareholders", error });
    }
};

// Get a single shareholder by ID
export const getShareholderById = async (req, res) => {
    try {
        const shareholder = await Shareholder.findById(req.params.id).populate("companyId");
        if (!shareholder) return res.status(404).json({ message: "Shareholder not found" });
        res.status(200).json(shareholder);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shareholder", error });
    }
};

// Update a shareholder by ID
export const updateShareholder = async (req, res) => {
    try {
        const shareholder = await Shareholder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shareholder) return res.status(404).json({ message: "Shareholder not found" });
        res.status(200).json({ message: "Shareholder updated successfully", shareholder });
    } catch (error) {
        res.status(500).json({ message: "Error updating shareholder", error });
    }
};

// Delete a shareholder by ID
export const deleteShareholder = async (req, res) => {
    try {
        const shareholder = await Shareholder.findByIdAndDelete(req.params.id);
        if (!shareholder) return res.status(404).json({ message: "Shareholder not found" });
        res.status(200).json({ message: "Shareholder deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shareholder", error });
    }
};
