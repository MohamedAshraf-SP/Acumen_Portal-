import User from "../../models/users/user.js";
import Accountant from "../../models/users/accountants.js"; // Import the Accountant model
import { sendEmail } from "../../helpers/emailSender.js";
import { addEmailLog } from "../../helpers/emailLogs.js";

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
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const accountantCount = await Accountant.countDocuments();
  // console.log(accountantCount)

  const pagesCount = Math.ceil(accountantCount / limit) || 0;

  try {
    const accountants = await Accountant.find(
      {}
    ).populate('userID')
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
    //console.log(req);


    const password = Math.floor(Math.random() * 100000000000)

    const nUser = new User({
      userName: req.body.email,
      password: password,
      userRole: 'accountant'

    })
    const newUser = await nUser.save();

    const newAccountant = new Accountant({
      userID: newUser._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department

    });


    await sendEmail(
      'Accumen portal New User Notification!',
      `Hello ${req.body.name}, `,
      req.body.email,
      `
        these are your credintials to ACCUMEN PORTAL :
        EMAIL: ${req.body.email}
        Password: ${password} 


        Thank you
        accumen portal team.
       `
    )

    addEmailLog(req.body.email, "Accumen portal New User Notification!", req.body.name)

    const ans = await newAccountant.save();

    res.status(201).json(ans.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a accountant by ID
export const deleteAccountant = async (req, res) => {
  try {
    const result = await Accountant.findByIdAndDelete(req.params.id);
    let result1
    if (result) {
      result1 = await User.findByIdAndDelete(result.userID);
    }

    if (!result) {
      return res.status(404).json({ message: "Accountant not found" });
    }
    res.status(200).json({ message: "Accountant deleted successfully" });
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
    res.status(200).json(updatedAccountant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the number of accountant
export const getAccountantsCount = async (req, res) => {
  try {
    const count = (await Accountant.countDocuments());
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
