import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: 8,
    },

    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },

    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
