import mongoose from 'mongoose';
import TasksDocument from '../models/tasksDocuments.js';
import fs from "fs"
import { deleteFileWithPath } from "../helpers/deleteFile.js"
import { fileURLToPath } from 'url';
import path from "path"
import Client from '../models/users/clients.js';
import { Company } from '../models/company/index.js';




const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// CREATE: Add a new task
export const addTask = async (req, res) => {
    try {
        // console.log(req.file.path)
        const { clientID, clientName, companyName, title, status, userKey, department, companyID, accountantName, action } = req.body;
        const client = await Client.findById(clientID)

        if (companyID) {
            if (!(await Company.findById(companyID))) return res.status(400).json({ message: "company don't exits" });
        }
        if (clientID) {
            if (!(await Client.findById(clientID))) return res.status(400).json({ message: "client don't exits" });
        }

        //  console.log(client);


        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const newTask = new TasksDocument({
            clientID: clientID,///user id
            companyID: companyID,///user id
            clientName,
            companyName,
            department: department || client.departments[0],
            path: req.file.path,
            title,
            status: status || "pending",
            userKey,
            accountantName,
            action,
        });


        const savedTask = await newTask.save();
        res.status(201).json({ message: "Task added successfully!!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 100;
        const skip = (page - 1) * limit;

        let filter = {}
        const clientID = req.query.clientID
        const companyID = req.query.companyID
        const department = req.query.department
        const sort = req.query.sort === "true";
        //console.log(sort);
        if (clientID) filter.clientID = req.query.clientID
        if (companyID) filter.companyID = req.query.companyID
        if (department) filter.department = req.query.department




        const TasksDocumentCount = await TasksDocument.countDocuments(filter);
        /// console.log(sort ,sort ? { createdAt: -1 } : { createdAt: 1 })

        const pagesCount = Math.ceil(TasksDocumentCount / limit) || 0;



        const TasksDocuments = await TasksDocument.find(filter)
            .sort((sort) ? { createdAt: -1 } : { createdAt: 1 })
            .skip(skip)
            .limit(limit);


        // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            TasksDocumentCount,
            currentPage: page,
            pagesCount: pagesCount,
            TasksDocuments: TasksDocuments

        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Get task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await TasksDocument.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const downloadTaskById = async (req, res) => {
    try {
        const task = await TasksDocument.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const biFile = fs.readFileSync(task.path, "binary")



        res.setHeader("Content-Length", biFile.length)
        res.status(200).write(biFile, "binary")
        res.end()

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Update a task
export const updateTask = async (req, res) => {
    try {
        const { clientID, clientName, companyName, title, status, userKey, accountantName, action } = req.body;


        let updatedTask = await TasksDocument.findById(req.params.id)
        const updateData = {
            clientID: clientID,
            clientName,
            companyName,
            title,
            status,
            userKey,
            accountantName,
            action,
        };

        if (req.file && updatedTask) {
            deleteFileWithPath(__dirname + "/../" + updatedTask.path)
            updateData.path = req.file.path;
        }

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        updatedTask = await TasksDocument.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: "Task updated successfully!!" });
    } catch (error) {
        //  console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Delete a task
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await TasksDocument.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        deleteFileWithPath(__dirname + "/../" + deletedTask.path)
        res.status(200).json({ message: 'Task deleted successfully!!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getTasksCount = async (req, res) => {
    try {
        const count = (await TasksDocument.countDocuments());
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};