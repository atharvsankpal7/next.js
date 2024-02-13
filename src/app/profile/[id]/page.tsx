import React from "react";

export default function UserProfile({ params }: any) {
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <p className="text-4xl">
                This is the profile page for user with id:{" "}
                <span className="bg-yellow-600">{params.id}</span>
            </p>
        </div>
    );
}
