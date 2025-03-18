import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./../../models/users/user.js";
import {
  generateRefreshToken,
  generateAccessToken,
  hashPassword,
  generateRandomPassword,
} from "../../Services/auth/authentication.js";
import { sendEmail } from "../../helpers/emailSender.js";

import dotenv from "dotenv";
import Client from "../../models/users/clients.js";
import Accountant from "../../models/users/accountants.js";

dotenv.config();
const redisExpirePeriod = process.env.REDIS_EXPIRATION_PERIOD;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ userName: email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password!!" });
    }
    let dataObj = {};
    if (user.userRole == "client") {
      dataObj = await Client.findOne({ userID: user._id }).select({
        name: 1,
        _id: 1,
      });
    } else if (user.userRole == "accountant") {
      dataObj = await Accountant.findOne({ userID: user._id }).select({
        name: 1,
        _id: 1,
        department: 1,
      });
    }
    let fullUser = {
      id: user._id,
      role: user.userRole,
      dataId: dataObj?._id || null,
      name: dataObj?.name || null,
      department: dataObj?.department || null,
    };
    ///  console.log(fullUser);
    const accessToken = generateAccessToken(fullUser);
    const refreshToken = generateRefreshToken(fullUser);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: false, // Use true in production for HTTPS
      sameSite: "strict",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(403).json({ message: "Refresh token required!!" });

  const user = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET,
    async (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token!!" });

      const userObj = await User.findById(user.id);
      if (!userObj) return res.status(404).json({ message: "User not found!" });

      let dataObj = {};
      if (userObj.userRole == "client") {
        dataObj = await Client.findOne({ userID: userObj._id }).select({
          name: 1,
          _id: 1,
        });
      } else if (userObj.userRole == "accountant") {
        dataObj = await Accountant.findOne({ userID: userObj._id }).select({
          name: 1,
          _id: 1,
          department: 1,
        });
      }

      let fullUser = {
        id: userObj._id,
        role: userObj.userRole,
        dataId: dataObj?._id || null,
        name: dataObj?.name || null,
        department: dataObj?.department || null,
      };

      const newAccessToken = generateAccessToken(fullUser);
      const newRefreshToken = generateRefreshToken({ id: userObj.id });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Strict",
      });

      res.json({ newAccessToken });
    }
  );
};

export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({ message: "Email is required!!" });
    }

    const plainPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(plainPassword);
    const user = await User.findOneAndUpdate(
      { userName: email },
      { password: hashedPassword }
    );

    if (user) {
      if (
        !(await sendEmail(
          "Accumen portal reset password Notification!",
          `Hello, `,
          req.body.email,
          `
                these are your credintials to ACCUMEN PORTAL :
                Email: ${email}
                New Password: ${plainPassword} 
    
    
                Thank you
                accumen portal team.
            `,
          "reply to Accumen Portal Email"
        ))
      ) {
        return res.status(400).json({ message: "Invalid Email!!" });
      }
    }

    return res
      .status(200)
      .json({ message: "New Password sent to your Email!!" });
  } catch (e) {
    return res.status(400).json({ message: "Error resetting the password!!" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/", // Ensure it's properly set
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

//   // create redis client

// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import User from "../../models/users/user.js";
// import {
//   generateRefreshToken,
//   generateAccessToken,
//   hashPassword,
//   generateRandomPassword,
// } from "../../Services/auth/authentication.js";
// import { sendEmail } from "../../helpers/emailSender.js";
// import dotenv from "dotenv";
// import Client from "../../models/users/clients.js";
// import Accountant from "../../models/users/accountants.js";

// dotenv.config();
// const redisExpirePeriod = process.env.REDIS_EXPIRATION_PERIOD;

// // ✅ Login function (Fixed)
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ userName: email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: "Invalid email or password!!" });
//     }

//     let dataObj = {};
//     if (user?.userRole === "client") {
//       dataObj = await Client.findOne({ userID: user._id }).select({
//         name: 1,
//         _id: 1,
//       });
//     } else if (user.userRole === "accountant") {
//       dataObj = await Accountant.findOne({ userID: user._id }).select({
//         name: 1,
//         _id: 1,
//         department: 1,
//       });
//     }

//     let fullUser = {
//       id: user._id,
//       role: user.userRole,
//       dataId: dataObj?._id || null,
//       name: dataObj?.name || null,
//       department: dataObj?.department || null,
//     };

//     const accessToken = generateAccessToken(fullUser);
//     const refreshToken = generateRefreshToken(fullUser);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//     });

//     res.json({ accessToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ Refresh token function (Fixed)
// export const refreshToken = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken)
//     return res.status(403).json({ message: "Refresh token required!!" });

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
//     const userObj = await User.findById(decoded.id);
//     if (!userObj) return res.status(404).json({ message: "User not found!" });

//     let dataObj = {};
//     if (userObj.userRole === "client") {
//       dataObj = await Client.findOne({ userID: userObj._id }).select({
//         name: 1,
//         _id: 1,
//       });
//     } else if (userObj.userRole === "accountant") {
//       dataObj = await Accountant.findOne({ userID: userObj._id }).select({
//         name: 1,
//         _id: 1,
//         department: 1,
//       });
//     }

//     let fullUser = {
//       id: userObj._id,
//       role: userObj.userRole,
//       dataId: dataObj?._id || null,
//       name: dataObj?.name || null,
//       department: dataObj?.department || null,
//     };

//     const newAccessToken = generateAccessToken(fullUser);
//     const newRefreshToken = generateRefreshToken(fullUser);

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//     });

//     res.json({ newAccessToken });
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid refresh token!!" });
//   }
// };
// export const resetPassword = async (req, res) => {
//   try {
//     const email = req.body.email;
//     if (!email) {
//       res.status(400).json({ message: "Email is required!!" });
//     }

//     const plainPassword = generateRandomPassword();
//     const hashedPassword = await hashPassword(plainPassword);
//     const user = await User.findOneAndUpdate(
//       { userName: email },
//       { password: hashedPassword }
//     );

//     if (user) {
//       if (
//         !(await sendEmail(
//           "Accumen portal reset password Notification!",
//           `Hello, `,
//           req.body.email,
//           `
//                 these are your credintials to ACCUMEN PORTAL :
//                 Email: ${email}
//                 New Password: ${plainPassword}

//                 Thank you
//                 accumen portal team.
//             `,
//           "reply to Accumen Portal Email"
//         ))
//       ) {
//         return res.status(400).json({ message: "Invalid Email!!" });
//       }
//     }

//     return res
//       .status(200)
//       .json({ message: "New Password sent to your Email!!" });
//   } catch (e) {
//     return res.status(400).json({ message: "Error resetting the password!!" });
//   }
// };

// // ✅ Logout function (Fixed)
// export const logout = async (req, res) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//   });
//   res.json({ message: "Logged out successfully" });
// };
