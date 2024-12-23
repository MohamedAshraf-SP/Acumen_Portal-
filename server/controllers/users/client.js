import User from "../../models/users/user.js";
import Client from "../../models/users/clients.js"; // Import the Client model
import { sendEmail } from "../../helpers/emailSender.js";
import company from "../../models/company/company.js";
import { Company } from "../../models/company/index.js";
import user from "../../models/users/user.js";
import { addEmailLog } from "../../helpers/emailLogs.js";
import mongoose from "mongoose";
import TasksDocument from "../../models/tasksDocuments.js";

// Get a Client by ID
export const getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all client
export const getClients = async (req, res) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const clientCount = await Client.countDocuments();
    // console.log(clientCount)

    const pagesCount = Math.ceil(clientCount / limit) || 0;

    try {
        const clients = await Client.find(
            {}
        ).populate('userID')
            .populate('companies')
            .skip(skip)
            .limit(limit); // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            currentPage: page,
            pagesCount: pagesCount,
            clients: clients,
            clientCount: clientCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// Add a new client
export const addClient = async (req, res) => {
    try {
        const email = await User.findOne({ userName: req.body.email })
        if (email) {
            return res.status(400).json({ message: "email already exist", email })
        }
        // create user
        const nUser = new User({
            userName: req.body.email,
            userRole: 'client'
        })
        const newUser = await nUser.save();
        //create default company
        const company = new Company({
            companyName: `default company for client ${req.body.name} `
        })
        const newCompany = await company.save();
        //create the new client
        const newClient = new Client({
            userID: newUser._id,
            name: req.body.name,
            email: req.body.email,
            notification: req.body.notification,
            department: req.body.department,
            companies: [newCompany._id]
        });

        //sent the email notification

        await sendEmail(
            'Accumen portal New User Notification!',
            `Hello ${req.body.name}, `,
            req.body.email,
            `
            these are your credintials to ACCUMEN PORTAL :
            EMAIL: ${req.body.email}
            Password: ${newUser.password} 


            Thank you
            accumen portal team.
        `, 'reply to Accumen Portal Email'
        )


        //add the email log
        addEmailLog(req.body.email, "Accumen portal New User Notification!", req.body.name)





        const clientData = await newClient.save();


        //add the task of the loE
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }
        const newTask = new TasksDocument({
            clientID: clientData._id,
            clientName: clientData.name,
            companyName: "default",
            path: req.file.path,
            department: clientData.department,
            title: "LOE",
        });
        const savedTask = await newTask.save();

        return res.status(201).json({ client: clientData.toJSON(), task: savedTask.toJSON() });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
};

// Delete a client by ID
export const deleteClient = async (req, res) => {
    try {
        const result = await Client.findByIdAndDelete(req.params.id);
        let result1
        if (result) {
            result1 = await user.findByIdAndDelete(result.userID);
        }

        console.log(result, result1)
        if (!result) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a client by ID
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you use ID to find the client
        const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found!!" });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get the number of client
export const getClientsCount = async (req, res) => {
    try {
        const count = (await Client.countDocuments());
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getClientCompanies = async (req, res) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;


    // console.log(clientCount)


    try {
        const client = JSON.parse(JSON.stringify(await Client.findById(
            req.params.id
        ).populate('companies')
            .skip(skip)
            .limit(limit)));

        console.log(client)

        const companyCount = client.companies.length
        const pagesCount = Math.ceil(companyCount / limit) || 0;
        // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            currentPage: page,
            pagesCount,
            companies: client.companies,
            companyCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getDepartmentClients = async (req, res) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;


    // console.log(clientCount)



    try {
        const clients = await Client.find(
            { department: req.body.department }
        ).skip(skip)
            .limit(limit);

        const pagesCount = Math.ceil(clients.length / limit) || 0;

        // Skip the specified number of documents.limit(limit);
        res.status(200).json({
            currentPage: page,
            pagesCount: pagesCount,
            clients: clients,
            clientCount: clients.length,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

