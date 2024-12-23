import Director from "../../models/company/director.js";

// Create a new director
export const addDirector = async (req, res) => {
    try {
        const director = new Director(req.body);
        await director.save();
        res.status(201).json({ message: "Director created successfully", director });
    } catch (error) {
        res.status(500).json({ message: "Error creating director", error });
    }
};

// Get all directors
export const getAllDirectors = async (req, res) => {
    try {
        const directors = await Director.find().populate("companyId");
        res.status(200).json(directors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching directors", error });
    }
};

// Get a single director by ID
export const getDirectorById = async (req, res) => {
    try {
        const director = await Director.findById(req.params.id).populate("companyId");
        if (!director) return res.status(404).json({ message: "Director not found" });
        res.status(200).json(director);
    } catch (error) {
        res.status(500).json({ message: "Error fetching director", error });
    }
};

// Update a director by ID
export const updateDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!director) return res.status(404).json({ message: "Director not found" });
        res.status(200).json({ message: "Director updated successfully", director });
    } catch (error) {
        res.status(500).json({ message: "Error updating director", error });
    }
};

// Delete a director by ID
export const deleteDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        if (!director) return res.status(404).json({ message: "Director not found" });
        res.status(200).json({ message: "Director deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting director", error });
    }
};
