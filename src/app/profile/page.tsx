"use client";
import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
    const router = useRouter();

    const [userId, setUserId] = React.useState("No user id");

    const logout = async () => {
        try {
            await axios.get("api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message);
            console.log(error.message);
        }
    };

    const getUserDetails = async () => {
        if (userId !== "No user id") {
            return;
        }
        try {
            const response = await axios.get("api/users/currentUser");
            console.log(response.data);
            console.log(response.data.user._id);
            setUserId(response.data.user._id);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className="">
            <h1>Profile</h1>
            <p>This is the profile page</p>
            <p>{userId ? userId : "can't get user"} </p>
            <button
                onClick={getUserDetails}
                className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to my page
            </button>
            <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mx-3 px-4 rounded"
            >
                logout
            </button>
        </div>
    );
}
