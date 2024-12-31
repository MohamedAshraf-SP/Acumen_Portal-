import Director from "../../models/company/director.js";

// Create a new director
export const addDirector = async (req, res) => {
    try {
        const companyId = req.id


        if (!companyId) {
            return res.status(400).json({ message: "Company id is required!!" })
        }

        const directorObj = {
            companyId,
            ...req.body
        }
        // console.log(directorObj);
        const director = new Director(directorObj);
        await director.save();
        res.status(201).json({ message: "Director created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating director!!", error });
    }
};

// Get all directors
export const getAllDirectorsOfCompany = async (req, res) => {
    try {
        const companyId = req.id


        const { page = 1, limit = 100 } = req.query; // Default page = 1, limit = 10

        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate total count for pagination metadata
        const totalDirectors = await Director.countDocuments({ companyId });

        // Fetch companies with pagination
        const directors = await Director.find({ companyId })
            .skip((pageNumber - 1) * limitNumber) // Skip documents for the previous pages
            .limit(limitNumber); // Limit the number of documents per page

        console.log(directors.length);
        // Return paginated response
        res.status(200).json({
            totalDirectors: totalDirectors,
            CurrentPage: pageNumber,
            TotalPages: Math.ceil(totalDirectors / limitNumber),
            directors,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error retrieving directors!", error });
    }
};

// Get a single director by ID
export const getDirectorById = async (req, res) => {
    try {
        const director = await Director.findById(req.params.id).populate("companyId");
        if (!director) return res.status(404).json({ message: "Director not found!!" });
        res.status(200).json(director);
    } catch (error) {
        res.status(500).json({ message: "Error fetching director!!" });
    }
};

// Update a director by ID
export const updateDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!director) return res.status(404).json({ message: "Director not found!!" });
        res.status(200).json({ message: "Director updated successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating director!!" });
    }
};

// Delete a director by ID
export const deleteDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        if (!director) return res.status(404).json({ message: "Director not found!!" });
        res.status(200).json({ message: "Director deleted successfully!!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting director!!" });
    }
};


export const getCompanyDirectorsCount = async (req, res) => {
    try {
        const count = (await Director.countDocuments({ companyId: req.id }));
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};