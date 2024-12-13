import EmailTemplate from "../models/emailTemplate.js";


// Create a new email template
export const addTemplate = async (req, res) => {
    try {
        const { name, subject, content } = req.body;
        const newTemplate = await EmailTemplate.create({ name, subject, content });
        res.status(201).json({ success: true, data: newTemplate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all email templates
export const getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        res.status(200).json({ success: true, data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single email template by ID
export const getTemplateById = async (req, res) => {
    try {
        const template = await EmailTemplate.findById(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: "Template not found" });
        res.status(200).json({ success: true, data: template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        res.status(200).json({ success: true, data: updatedTemplate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete an email template by ID
export const deleteTemplate = async (req, res) => {
    try {
        const deletedTemplate = await EmailTemplate.findByIdAndDelete(req.params.id);
        if (!deletedTemplate) return res.status(404).json({ success: false, message: "Template not found" });
        res.status(200).json({ success: true, message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
