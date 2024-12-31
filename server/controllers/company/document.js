import { fileURLToPath } from 'url';
import Document from '../../models/company/companyDocs.js';
import path from "path"
import { deleteFileWithPath } from "../../helpers/deleteFile.js"
import fs from "fs"


const __filename = fileURLToPath(import.meta.url); ///Users/john/app/index.mjs
const __dirname = path.dirname(__filename);     ///Users/john/app/


// CREATE - Add a new document with file upload
export const addDocument = async (req, res) => {
    try {
        const { title } = req.body;
        const companyId = req.id
        const path = req.file ? req.file.path : 0

        if (!path) {
            return res.status(400).json({ error: 'File is required!!' });
        }

        const document = new Document({
            companyId,
            title,
            path
        });

        await document.save();
        res.status(201).json({ message: "Document added Successfully!!", document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get all documents
export const getAllDocumentsOfCompany = async (req, res) => {
    try {
       

        // const documents = await Document.find({ companyId });
        // res.status(200).json(documents);

        const companyId = req.id
        
        if (!companyId) {
            return res.status(400).json({ message: "Company id is required" })
        }


        const { page = 1, limit = 100 } = req.query; // Default page = 1, limit = 10

        // Parse page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate total count for pagination metadata
        const totalDocuments = await Document.countDocuments({ companyId });

        // Fetch companies with pagination
        const documents = await Document.find({ companyId })
            .skip((pageNumber - 1) * limitNumber) // Skip documents for the previous pages
            .limit(limitNumber); // Limit the number of documents per page

  
        // Return paginated response
        res.status(200).json({
            totalDocuments: totalDocuments,
            CurrentPage: pageNumber,
            TotalPages: Math.ceil(totalDocuments / limitNumber),
            documents,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get a single document by ID
export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found!!' });
        }

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - Update a document (with optional file replacement)
export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, additionalName } = req.body;
        const filePath = req.file ? req.file.path : null;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        if (filePath && document.path) {
            // Delete the old file if a new file is uploaded
            deleteFileWithPath(__dirname + "/../" + document.path)
        }

        document.name = name || document.name;
        document.additionalName = additionalName || document.additionalName;
        document.path = filePath || document.path;

        await document.save();
        res.status(200).json({ message: "Document updated successfully!!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Delete a document and its associated file
export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found!!' });
        }

        // Delete the file from the server
        if (document.path) {
            deleteFileWithPath(__dirname + "/../" + document.path)
        }
        await Document.deleteOne({ _id: id });

        res.status(200).json({ message: 'Document deleted successfully!!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export const downloadFile = async (req, res) => {
    try {


        const { id } = req.params;


        const document = await Document.findById(id)

        if (!document) {
            return res.status(404).send("File Not Found!!")
        }




        var file = fs.readFileSync(__dirname + "\\..\\..\\" + document.path, 'binary');

        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        res.end();
    } catch (e) {
        res.status(400).json(e.message)
    }



};


export const getDocumentsCount = async (req, res) => {

    try {
        const count = await Document.countDocuments()
        res.json({ count })
    } catch (e) {
        res.status(500).json(e.message)
    }
}