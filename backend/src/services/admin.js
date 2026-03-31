import User from "../models/Auths/userModel.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email !== "admin@nursing123gmail.com" || password !== "Admin@2025") {
            return res.status(403).json({ message: "Unauthorized admin creation attempt" });
        }

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newAdmin = new User({
            username: "Super Admin",
            email,
            password: hashedPassword,
            comfirmPassword: hashedPassword,
            role: "admin",
            verified: true
        });

        await newAdmin.save();

        res.status(201).json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        console.error("Admin Creation Error:", error);
        res.status(500).json({ success: false, message: "Failed to create admin", error: error.message });
    }
};
