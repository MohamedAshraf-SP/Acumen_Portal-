import EmailTemplate from "../models/emailTemplate.js";


// Create a new email template
export const addTemplate = async (req, res) => {
    try {
        const { name, documentType, content } = req.body;
        const newTemplate = await EmailTemplate.create({ name, documentType, content });
        res.status(201).json({ message: "New Template added successfully!!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all email templates
export const getTemplates = async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;

        // Convert page and limit to integers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // Calculate the number of documents to skip
        const skip = (pageNum - 1) * limitNum;

        // Fetch templates with pagination
        const templates = await EmailTemplate.find()
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination metadata
        const totalTemplates = await EmailTemplate.countDocuments();

        res.status(200).json({
            totalTemplates,
            currentPage: pageNum,
            totalPages: Math.ceil(totalTemplates / limitNum),
            templates,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single email template by ID
export const getTemplateById = async (req, res) => {
    try {
        const template = await EmailTemplate.findById(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: "Template not found" });
        res.status(200).json({ template });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an email template by ID
export const updateTemplate = async (req, res) => {
    try {
        const { name, subject, content } = req.body;
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
            req.params.id,
            { name, subject, content, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document
        );
        if (!updatedTemplate) return res.status(404).json({ success: false, message: "Template not found" });
        res.status(200).json({ message: "Template updated successfully!!" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete an email template by ID
export const deleteTemplate = async (req, res) => {
    try {
        const deletedTemplate = await EmailTemplate.findByIdAndDelete(req.params.id);
        if (!deletedTemplate) return res.status(404).json({ success: false, message: "Template not found" });
        res.status(200).json({ success: true, message: "Template deleted successfully!!" });
    } catch (error) {

        // General error
        res.status(500).json({ message: error.message });


    }
};

export const getTemplatesCount = async (req, res) => {

    try {
        const count = await EmailTemplate.countDocuments()
        res.json({ count })
    } catch (e) {
        res.status(500).json(e)
    }
}
