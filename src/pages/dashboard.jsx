import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome to the Admin Dashboard
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => nav('/ManageForm')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            Manage Forms
          </button>
          <button
            onClick={() => nav('/EmplList')}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-green-600 transition duration-200 ease-in-out"
          >
            Manage Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
