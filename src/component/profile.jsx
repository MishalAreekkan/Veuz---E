import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/register/");
                setUser(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchUserProfile();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/change_password/",
                { old_password: oldPassword, new_password: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(response.data.message);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsPasswordFormVisible(false); 
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">User Profile</h2>

                    {user && (
                        <div className="space-y-4 mb-6">
                            <p><strong>Name:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    )}

                    <button
                        onClick={() => setIsPasswordFormVisible(!isPasswordFormVisible)}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Change Password
                    </button>
                    {isPasswordFormVisible && (
                        <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
                            <div>
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <ToastContainer />
        </>
    );
}

export default Profile;
