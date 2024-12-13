import { fileURLToPath } from 'url';
import TasksDocument from '../models/tasksDocuments.js';
import path from "path"
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// CREATE - Add a new tasksDocument with file upload
export const addTasksDocument = async (req, res) => {
    try {
        const { name, additionalName } = req.body;
        const filePath = req.file ? req.file.path : null;

        if (!filePath) {
            return res.status(400).json({ error: 'File is required' });
        }

        const tasksDocument = new TasksDocument({
            name,
            path: filePath,
            additionalName
        });

        await tasksDocument.save();
        res.status(201).json(tasksDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get all tasksDocuments
export const getTasksDocuments = async (req, res) => {
    try {
        const tasksDocuments = await TasksDocument.find();
        res.status(200).json(tasksDocuments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ - Get a single tasksDocument by ID
export const getTasksDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const tasksDocument = await TasksDocument.findById(id);

        if (!tasksDocument) {
            return res.status(404).json({ error: 'TasksDocument not found' });
        }

        res.status(200).json(tasksDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - Update a tasksDocument (with optional file replacement)
export const updateTasksDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientName, companyName, path, title, dateTime, status, userKey, accountantName, action } = req.body;
        const filePath = req.file ? req.file.path : null;

        const tasksDocument = await TasksDocument.findById(id);
        if (!tasksDocument) {
            return res.status(404).json({ error: 'TasksDocument not found' });
        }

        if (filePath && tasksDocument.path) {
            // Delete the old file if a new file is uploaded
            deleteFileWithPath(tasksDocument.path);
        }



        await TasksDocument.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    clientName,
                    companyName,
                    path,
                    title,
                    dateTime,
                    status,
                    userKey,
                    accountantName,
                    action
                }
            },
            { new: true } // Return the updated document
        );
        res.status(200).json(tasksDocument);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Delete a tasksDocument and its associated file
export const deleteTasksDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const tasksDocument = await TasksDocument.findById(id);
        if (!tasksDocument) {
            return res.status(404).json({ error: 'TasksDocument not found' });
        }

        // Delete the file from the server
        if (tasksDocument.path) {
            deleteFileWithPath(tasksDocument.path)
        }
        await tasksDocument.remove();

        res.status(200).json({ message: 'TasksDocument deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export const downloadFile = async (req, res) => {
    const { id } = req.params;


    const tasksDocument = await TasksDocument.findById(id)





    var file = fs.readFileSync(__dirname + "\\..\\" + tasksDocument.path, 'binary');

    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();



};