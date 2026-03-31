import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [6, "your email must have 5 characters"],
        lowercase: true, 
        trim: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
        select: false,
        trim: true,
    },
    comfirmPassword: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
     phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
     image: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String, 
        enum: ["patient", "doctor", "admin", "pharmacist", "technician"],
        default: "patient"
    }
}, { timestamps: true }); 

const User = mongoose.model("User", userSchema);
export default User;
