import user from "../../models/users/user.js"; // Import the user model
import { hashPassword } from "../../Services/auth/authentication.js";
import bcrypt from "bcrypt"


// Get a user by ID
export const getUser = async (req, res) => {
  try {
    const usr = await user.findById(req.params.id);
    if (!usr) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(usr);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {

    const hashedPassword = await hashPassword(req.body.password)

    const newUser = new user({
      userName: req.body.userName,
      password: hashedPassword, 
      userRole: req.body.role,
    });

    const ans = await newUser.save();

    res.status(201).json(ans.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const result = await user.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const current = await user.findById(id)
    if (!current) {
      return res.status(404).json({ message: "user not found" });
    }



    const data = {
      userName: req.body.userName
    }

    if (req.body.newPassword && (await bcrypt.compare(req.body.oldPassword, current.password))) {
      data.password = await hashPassword(req.body.newPassword)
    } else {
      return res.status(401).json({ message: "invalid old password or new password is missing!" })
    }

    console.log(data);
    const updateduser = await user.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updateduser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(updateduser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
