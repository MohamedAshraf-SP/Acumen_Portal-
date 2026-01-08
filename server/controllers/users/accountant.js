import User from "../../models/users/user.js";
import Accountant from "../../models/users/accountants.js"; // Import the Accountant model
import { sendEmail } from "../../helpers/emailSender.js";
import { addEmailLog } from "../../helpers/emailLogs.js";
import {
  checkIfEmailExist,
  generateRandomPassword,
  hashPassword,
} from "../../Services/auth/authentication.js";
import TasksDocument from "../../models/tasksDocuments.js";
import Client from "../../models/users/clients.js";
import { Company } from "../../models/company/index.js";

// Get a Accountant by ID
export const getAccountant = async (req, res) => {
  try {
    const accountant = await Accountant.findById(req.params.id);
    if (!accountant) {
      return res.status(404).json({ message: "Accountant not found" });
    }
    res.status(200).json(accountant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all accountant
export const getAccountants = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 100;
  const skip = (page - 1) * limit;

  const accountantCount = await Accountant.countDocuments();
  // console.log(accountantCount)

  const pagesCount = Math.ceil(accountantCount / limit) || 0;

  try {
    const accountants = await Accountant.find()
      .populate("userID")
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      accountants: accountants,
      accountantCount: accountantCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new accountant
export const addAccountant = async (req, res) => {
  try {
    if (!req.body.email || !req.body.department) {
      return res
        .status(400)
        .json({ message: "Email and Department are required!!" });
    }

    if (await checkIfEmailExist(req.body.email)) {
      return res.status(400).json({ message: "Email already exists!!" });
    }

    const plainPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(plainPassword);

    const nUser = new User({
      userName: req.body.email,
      password: hashedPassword,
      userRole: "accountant",
    });
    const newUser = await nUser.save();

    const newAccountant = new Accountant({
      userID: newUser._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
    });

    if (
      !(await sendEmail(
        "AMS New User Notification!",
        `Hello ${req.body.name}, `,
        req.body.email,
        `
               these are your credintials to AMS :
               Email: ${req.body.email}
               Password: ${plainPassword}  
   
   
               Thank you
               AMS team.
           `,
        "reply to AMS Email"
      ))
    ) {
      await User.findByIdAndDelete(newUser._id);
      return res
        .status(400)
        .json({ message: "Accountant not added Check Your internet connection!!" });
    }

    addEmailLog(
      req.body.email,
      "AMS New User Notification!",
      req.body.name
    );

    const ans = await newAccountant.save();

    res.status(201).json({ message: "New Accountant added successfully!!" });
  } catch (error) {
    //  console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a accountant by ID
export const deleteAccountant = async (req, res) => {
  try {
    const result = await Accountant.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(result.userID);
    let result1;
    if (result) {
      result1 = await User.findByIdAndDelete(result.userID);
    }

    if (!result) {
      return res.status(404).json({ message: "Accountant not found" });
    }
    res.status(200).json({ message: "Accountant deleted successfully!!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a accountant by ID
export const updateAccountant = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you use ID to find the accountant
    const updatedAccountant = await Accountant.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAccountant) {
      return res.status(404).json({ message: "Accountant not found!!" });
    }
    res.status(200).json({ message: "Accountant updated successfully!!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the number of accountant
export const getAccountantsCount = async (req, res) => {
  try {
    const count = await Accountant.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccountantsDashboardCounts = async (req, res) => {
  try {
    const documentsCount = await TasksDocument.countDocuments({
      department: { $in: [req.user.department] },
    });

    const CompaniesCount = await Company.countDocuments({
      departments: { $in: [req.user.department] },
    });

    const ClientsCount = await Client.countDocuments({
      departments: { $in: [req.user.department] },
    });

    // Return the response in the required format
    res.status(200).json([
      { label: "Clients", count: ClientsCount },
      { label: "Documents", count: documentsCount },
      { label: "Companies", count: CompaniesCount },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

