import { fileURLToPath } from 'url';
import Form from '../models/formsFiles.js';
import path from "path"
import { deleteFileWithPath } from "../helpers/deleteFile.js"
import fs from "fs"


const __filename = fileURLToPath(import.meta.url); ///Users/john/app/index.mjs
const __dirname = path.dirname(__filename);     ///Users/john/app/


// CREATE - Add a new form with file upload
export const addForm = async (req, res) => {
    try {
        const { name, additionalName } = req.body;
        const filePath = req.file ? req.file.path : 0

        if (!filePath) {
            return res.status(400).json({ error: 'File is required' });
        }

        const form = new Form({
            name,
            PATH: filePath,
            additionalName
        });

        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get all forms
export const getForms = async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get a single form by ID
export const getFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await Form.findById(id);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - Update a form (with optional file replacement)
export const updateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, additionalName } = req.body;
        const filePath = req.file ? req.file.path : null;

        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        if (filePath && form.PATH) {
            // Delete the old file if a new file is uploaded
            deleteFileWithPath(__dirname + "/../" + form.PATH)
        }

        form.name = name || form.name;
        form.additionalName = additionalName || form.additionalName;
        form.PATH = filePath || form.PATH;

        await form.save();
        res.status(200).json({ message: "Form updated successfully!!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Delete a form and its associated file
export const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;

        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Delete the file from the server
        if (form.PATH) {
            deleteFileWithPath(__dirname + "/../" + form.PATH)
        }
        await Form.deleteOne({ _id: id });

        res.status(200).json({ message: 'Form deleted successfully!!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export const downloadFile = async (req, res) => {
    try {


        const { id } = req.params;


        const form = await Form.findById(id)

        if (!form) {
            return res.status(404).send("File Not Found!!")
        }


        //const filePath = path.join('uploads', form.path); // Construct the file path

        // res.download(filePath, (err) => {
        //     if (err) {
        //         console.error('Error downloading file:', err.message);
        //         res.status(500).json({ error: 'File could not be downloaded' });
        //     }
        // });


        var file = fs.readFileSync(__dirname + "\\..\\" + form.PATH, 'binary');

        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        res.end();
    } catch (e) {
        res.status(400).json(e.message)
    }



};


export const getFormsCount = async (req, res) => {

    try {
        const count = await Form.countDocuments()
        res.json({ count })
    } catch (e) {
        res.status(500).json(e.message)
    }
}