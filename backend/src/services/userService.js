import User from "../models/Auths/userModel.js";
import bcrypt from "bcryptjs";
import { signupSchema } from "../middleware/validator.js";
import jwt from "jsonwebtoken";
import { signinSchema } from "../middleware/validator.js";


export const signupService = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        const { error } = signupSchema.validate({ username, email, password, confirmPassword });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword, comfirmPassword: hashedPassword });
        const result = await newUser.save();

        const userWithoutPassword = result.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
            success: true,
            message: "User user authentication, uploading medical documents, doctor-patient communicationaccount created successfully",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: error.message });
    }
};
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const value = await signinSchema.validateAsync({ email, password });

        const existUser = await User.findOne({ email }).select("+password");
        if (!existUser) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { userId: existUser._id, email: existUser.email, role: existUser.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

         const refreshToken = jwt.sign(
            { userId: existUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "lax",
            path: "/api/refresh_token", 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, 
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            role: existUser.role,
            username: existUser.username,
            email: existUser.email,
        });
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logggout = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/refresh_token" });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};

export const getUsers = async (req, res) =>{
    try {
    const users = await User.find({});
        res.status(200).json({success : true, data : users, message: "users retrieved successfully"});
    } catch (error) {
        res.status(200).json({success : false,  message: "users retrieved failure"});
        
    }

}

export const getSingleUser = async (req, res) => {
    try {
      const userId = req.params.id;  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve user" });
    }
};

  


