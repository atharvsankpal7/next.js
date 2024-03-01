"use client";
import React, { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
export default function VerifyEmailPage() {
    const [token, setToken] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    const [error, setError] = React.useState(false);
    const verifyEmail = async () => {
        try {
            const response = await axios.post("/api/users/verifytoken", {
                token,
            });
            if (response.status === 500) {
                toast.error("Server error");
                return;
            }
            if (response.status === 400) {
                toast.error(response.data.error);
                return;
            }
            setError(false);
            toast.success("Email verified successfully");
            setVerified(true);
            console.log(response.data);
        } catch (err: any) {
            setVerified(false);
            toast.error(err.message);
            setError(true);
            console.error(err);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
        verifyEmail();
    }, []);

    const userVerifiedJSX = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                
                <h1>Email Verified Successfully</h1>
              
                <Link href="/login">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px
                        rounded-full mt-4"
                    >
                        Login
                    </button>
                </Link>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Verify Email</h1>
            <p>{token}</p>

            {verified ? userVerifiedJSX() : "Loading..."}
            
            {error ? (
                <div className="flex flex-col items-center justify-center min-h-screen py-2">
                    <h1>Email Verification Failed</h1>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
