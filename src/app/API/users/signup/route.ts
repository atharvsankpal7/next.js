import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { username, email, password } = requestBody;
        // checking for required fields
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        // checking for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // creating new user
        let newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        newUser = await newUser.save();

        // sending verification email
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

        return NextResponse.json({
            message: "User created successfully",
            status: 201,
            user: newUser,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
