import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcyrptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcyrptjs.hash(userId.toString(), 10);
        if (emailType === "VERIFY") {
            await User.findOneAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else if (emailType === "FORGET_PASSWORD") {
            await User.findOneAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 360000,
            });
        }
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "a1f28c8cffacdd",
                pass: "4268066bacbf6c",
            },
        });
        const mailOptions = {
            from: "atharvsankpal799@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}">here</a> ${
                emailType === "VERIFY"
                    ? "to verify your email "
                    : "reset your password"
            }</p>
            <hr />
            <p>Or copy paste this link</p>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            `,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        console.log(mailResponse);
        return mailResponse;
    } catch (error: any) {
        console.log(error);
    }
};
