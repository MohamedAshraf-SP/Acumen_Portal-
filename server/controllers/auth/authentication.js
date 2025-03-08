import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "./../../models/users/user.js"
import { generateRefreshToken, generateAccessToken, hashPassword, generateRandomPassword } from "../../Services/auth/authentication.js";
import { sendEmail } from "../../helpers/emailSender.js";

import { createClient } from '@redis/client';

// Initialize Redis client


import dotenv from "dotenv"

dotenv.config()
const redisExpirePeriod = process.env.REDIS_EXPIRATION_PERIOD




export const login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ userName: email });
 
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password!!" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: false,
            secure: false, // Use true in production for HTTPS
            sameSite: "none",
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).json({ message: "Refresh token required!!" });

    const user = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token!!" });

            const userObj = await User.findById(user.id);
            if (!userObj) return res.status(404).json({ message: 'User not found!' });

            const newAccessToken = generateAccessToken(userObj);
            const newRefreshToken = generateRefreshToken({ id: userObj.id });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: false,
                secure: false,
                sameSite: "Strict",
            });

            res.json({ newAccessToken });
        });

};




export const resetPassword = async (req, res) => {
    try {


        const email = req.body.email
        if (!email) {
            res.status(400).json({ message: "Email is required!!" })
        }

        const plainPassword = generateRandomPassword()
        const hashedPassword = await hashPassword(plainPassword)
        const user = await User.findOneAndUpdate({ userName: email }, { password: hashedPassword })

        if (user) {
            if (! await sendEmail(
                'Accumen portal reset password Notification!',
                `Hello, `,
                req.body.email,
                `
                these are your credintials to ACCUMEN PORTAL :
                Email: ${email}
                New Password: ${plainPassword} 
    
    
                Thank you
                accumen portal team.
            `, 'reply to Accumen Portal Email'
            )) {
                return res.status(400).json({ message: "Invalid Email!!" })

            }
        }


        return res.status(200).json({ message: "New Password sent to your Email!!" })
    } catch (e) {
       
        return res.status(400).json({ message: "Error resetting the password!!" })
    }
}





// create redis client



export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: "Logged out successfully" });
}





// console.log(generateToken({ id: 124, role: "admin" }));
