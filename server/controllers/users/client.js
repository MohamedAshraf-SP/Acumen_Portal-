import User from "../../models/users/user.js";
import Client from "../../models/users/clients.js"; // Import the Client model
import { sendEmail } from "../../helpers/emailSender.js";
import { addEmailLog } from "../../helpers/emailLogs.js";
import TasksDocument from "../../models/tasksDocuments.js";
import {
  checkIfEmailExist,
  generateRandomPassword,
  hashPassword,
} from "../../Services/auth/authentication.js";
import {
  Company,
  Director,
  Shareholder,
  DueDate,
} from "../../models/company/index.js";
import mongoose from "mongoose";

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

// Add a new client
export const addClient = async (req, res) => {
  try {
    let department = req.body.department;
    let userDepartment = req.user?.department;
    if (userDepartment) {
      department = userDepartment;
    }

    const departmentForTasks = department;

    const departments = Array.isArray(department) ? department : [department];

    if (!req.file) {
      return res.status(400).json({ message: "LEO File is required!!" });
    }

    if (await checkIfEmailExist(req.body.email)) {
      return res.status(400).json({ message: "Email already exists!!" });
    }

    const plainPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(plainPassword);

    const nUser = new User({
      userName: req.body.email,
      password: hashedPassword,
      userRole: "client",
    });
    const newUser = await nUser.save();
    //create default company
    const company = new Company({
      companyName: `default company`,
    });
    const newCompany = await company.save();
    const dueDate = new DueDate({
      companyId: newCompany._id,
      vatNumber: "",
    });
    dueDate.save();
    //create the new client
    const newClient = new Client({
      userID: newUser._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || "-",
      notification: req.body.notification,
      departments: departments || [],
      companies: [newCompany._id],
    });

    //sent the email notification

    if (
      !(await sendEmail(
        "AMS portal New User Notification!",
        `Hello ${req.body.name}, `,
        req.body.email,
        `
            these are your credintials to ACCUMEN PORTAL :
            Email: ${req.body.email}
            Password: ${plainPassword} 


            Thank you
            AMS team.
        `,
        "reply to Accumen Portal Email"
      ))
    ) {
      await User.findByIdAndDelete(newUser._id);
      await Company.findByIdAndDelete(newCompany._id);
      return res
        .status(400)
        .json({ message: "Client not added Check Your internet connection" });
    }

    //add the email log
    addEmailLog(req.body.email, "AMS New User Notification!", req.body.name);

    const clientData = await newClient.save();

    //add the task of the loE

    const newTask = new TasksDocument({
      clientID: clientData._id,
      clientName: clientData.name,
      companyName: "default",
      companyID: newCompany._id,
      path: req.file.path,
      department: departmentForTasks,
      title: "LOE",
    });
    const savedTask = await newTask.save();

    return res.status(201).json({ message: "Client added successfully!!" });
  } catch (error) {
    // console.log(error);
    res.status(400).json(error.message);
  }
};

export const deleteClient = async (req, res) => {
  try {
    const result = await Client.findByIdAndDelete(req.params.id);

    // console.log(result, result1);
    // if (result) {
    //   let companies = await Company.deleteMany({ clientID: result._id });
    //     console.log(companies);
    //   let companiesIds = companies.map((company) => company._id);
    //   await TasksDocument.deleteMany({
    //     $or: [{ clientID: result._id }, { companyID: { $in: companiesIds } }],
    //   });
    //   await Shareholder.deleteMany({ companyID: { $in: companiesIds } });
    //   await Director.deleteMany({ companyID: { $in: companiesIds } });
    //   await DueDate.deleteMany({ companyID: { $in: companiesIds } });

    //   await User.findByIdAndDelete(result.userID);
    // }

    // console.log(result, result1)
    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }
    await User.findByIdAndDelete(result.userID);

    // 

    res.status(200).json({
      message:
        "Client  deleted successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

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

export const getClients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let filter = {};

    if (req.user?.department) {
      filter.departments = { $in: [req.user.department] };
    }
    //console.log(req?.query);
    ///console.log(req.user.department);

    const clients = await Client.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
        },
      },
      {
        $addFields: {
          Department: req.user?.department ? req.user.department : "-", // Add department field
        },
      },
    ])
      .skip(skip)
      .limit(limit);

    console.log(clients);

    const pagesCount = Math.ceil(clients.length / limit) || 0;

    // Skip the specified number of documents.limit(limit);
    res.status(200).json({
      clientCount: clients.length,
      currentPage: page,
      pagesCount: pagesCount,
      clients: clients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientLOE = async (req, res) => {
  try {
    const clientID = req.params.id;
    const LOE = await TasksDocument.findOne({ clientID, title: "LOE" });
    if (!LOE)
      return res
        .status(400)
        .json({ message: "LOE not found or Client not exits!" });
    res.sendPdfUrl(LOE.path);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClientCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query; // Default: page 1, limit 10
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    let filter = { _id: req.params.id };

    // Fetch client and populate companies with department filter
    const client = await Client.findOne(filter).populate({
      path: "companies",
      select: "companyName clientName email telephone departments",
      match: department ? { departments: { $in: [department] } } : {}, // Filter companies by department
    });

    if (!client || !client.companies) {
      return res
        .status(200)
        .json({ message: "No companies found for this client." });
    }

    // Apply pagination
    const totalCompanies = client.companies.length; // Total before pagination
    const paginatedCompanies = client.companies.slice(
      skip,
      skip + Number(limit)
    );

    res.status(200).json({
      totalCount: totalCompanies,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCompanies / limit),
      companies: paginatedCompanies,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Error retrieving companies!", error });
  }
};

export const getClientsCount = async (req, res) => {
  try {
    const count = await Client.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentClients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    //console.log(req?.query);
    ///console.log(req.user.department);
    if (!req.query.department) {
      return res.status(400).json({ message: "department required" });
    }

    const clients = await Client.aggregate([
      {
        $match: {
          departments: { $in: [req.query.department] },
        },
      },
      {
        $project: {
          _id: 1, // Exclude _id if not needed
          name: 1,
          email: 1,
          phone: 1,
        },
      },
      {
        $addFields: {
          Department: req.user.department, // Add the requested department
        },
      },
    ])
      .skip(skip)
      .limit(limit);

    const pagesCount = Math.ceil(clients.length / limit) || 0;

    // Skip the specified number of documents.limit(limit);
    res.status(200).json({
      clientCount: clients.length,
      currentPage: page,
      pagesCount: pagesCount,
      clients: clients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientsDashboardCounts = async (req, res) => {
  try {
    const documentsCount = await TasksDocument.countDocuments({
      clientID: req.user.id,
    });
    const companiesCount = await Company.countDocuments({
      clientID: req.user.id,
    });

    res.status(200).json([
      { label: "Documents", count: documentsCount },
      { label: "Companies", count: companiesCount },
      { label: "Engagement", count: "1" },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
// Get all client
export const getClients = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 100;
  const skip = (page - 1) * limit;

  const clientCount = await Client.countDocuments();
  // console.log(clientCount)

  const pagesCount = Math.ceil(clientCount / limit) || 0;

  try {
    const clients = await Client.find({})
      // .populate("userID")
      // .populate("companies")
      .skip(skip)
      .limit(limit);


    // let resp = clients.map((client) => {
    //   const clientObj = client.toObject();

    //   clientObj["department"] = req.user?.department || "-"
    //   return clientObj
    // });

    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      clients: resp[0],
      clientCount: clientCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
// Add a new client

/*
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
*/
