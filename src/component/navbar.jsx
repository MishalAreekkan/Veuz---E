import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const nav = useNavigate();
    const location = useLocation();

    const logoutUser = () => {
        localStorage.removeItem('token');
        nav('/login');
    };

    return (
        <nav className="bg-gray-800 text-white py-4 px-6 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left: Profile and Dashboard Buttons */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => nav('/profile')}
                        className="text-lg font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                        Profile
                    </button>

                    {/* Conditionally Render Back to Dashboard */}
                    {location.pathname !== '/dashboard' && (
                        <button
                            onClick={() => nav("/dashboard")}
                            className="text-lg font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
                        >
                            Dashboard
                        </button>
                    )}
                </div>

                {/* Right: Logout Button */}
                <button
                    onClick={logoutUser}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
