import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
connectDB();

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { email, password } = requestBody;

        // checking for required fields
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
        if (!existingUser) {
            return NextResponse.json(
                { error: "User with this email does not exist" },
                { status: 400 }
            );
        }
        // checking for password
        const validPassword = await bcryptjs.compare(
            password,
            existingUser.password
        );
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }
        // creating token
        const tokenData = {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });

        // setting cookie

        const response = NextResponse.json({
            message: "logged in successfully",
            status: 200,
            user: existingUser,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
