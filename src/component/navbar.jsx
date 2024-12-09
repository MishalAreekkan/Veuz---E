import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NewContext } from "../App";

function Navbar() {
    const nav = useNavigate();
    const location = useLocation();
    const {setAuth} = useContext(NewContext)
    const logoutUser = () => {
        localStorage.removeItem('token');
        setAuth(false)
        nav('/login');
    };

    return (
        <nav className="bg-gray-800 text-white py-4 px-6 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <button
                        onClick={() => nav('/profile')}
                        className="text-lg font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                        Profile
                    </button>

                    {location.pathname !== '/dashboard' && (
                        <button
                            onClick={() => nav("/dashboard")}
                            className="text-lg font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
                        >
                            Dashboard
                        </button>
                    )}
                </div>

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
