import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
connectDB();
export async function POST(req: NextRequest) {
    try {
        console.log('hello')
        const reqBody = await req.json();
        const { token } = reqBody;
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }, //`$gt` stands for greater than. so this line checks if the verifyTokenExpiry is greater than the current time.
        });

        // If token has expired or is invalid, return error
        if (!user) {
            return NextResponse.json(
                { error: "Token is invalid or has expired" },
                { status: 400 }
            );
        }
        // updating Database
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        
        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
