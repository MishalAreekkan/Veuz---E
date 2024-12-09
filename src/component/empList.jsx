import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

function EmpList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [searchParams, setSearchParams] = useState({});
    const nav = useNavigate();

    const fetchData = async (searchParams = {}) => {
        setLoading(true);

        const searchQuery = new URLSearchParams(searchParams).toString();

        try {
            const response = await axios.get(`http://127.0.0.1:8000/employee/profile/?${searchQuery}`);
            const employeeList = response.data.dynamic_data;
            setEmployees(employeeList);

            // Extract unique keys for table headers
            const allKeys = new Set();
            employeeList.forEach((employee) => {
                if (employee.dynamic_data) {
                    Object.keys(employee.dynamic_data).forEach((key) => allKeys.add(key));
                }
            });

            setHeaders(Array.from(allKeys));
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const { searchField, searchValue } = searchParams;

        if (!searchField || !searchValue) {
            alert("Please select a field and enter a value to search!");
            return;
        }

        fetchData({ [searchField]: searchValue });
    };

    const handleEdit = (id) => {
        nav(`/EmpEdit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/employee/profile/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee.");
            }
        }
    };

    const handleClearSearch = () => {
        setSearchParams({});
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <Navbar/>
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Employee List</h2>

            <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-4">
                <select
                    name="searchField"
                    onChange={handleSearchChange}
                    className="border px-4 py-2 rounded-md"
                    >
                    <option value="">Select Field</option>
                    {headers.map((header, index) => (
                        <option key={index} value={header}>
                            {header}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="searchValue"
                    value={searchParams.searchValue || ""}
                    onChange={handleSearchChange}
                    placeholder="Enter value"
                    className="border px-4 py-2 rounded-md flex-grow"
                    />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                    Clear
                </button>
            </form>

            <button
                onClick={() => nav("/EmpCreation")}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-green-600 transition duration-200 ease-in-out mb-6"
                >
                Add Employee
            </button>

            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : employees.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className="px-4 py-2 text-left border-b">
                                        {header}
                                    </th>
                                ))}
                                <th className="px-4 py-2 text-left border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    {headers.map((header, index) => (
                                        <td key={index} className="px-4 py-2 border-b">
                                            {employee.dynamic_data[header] || "N/A"}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => handleEdit(employee.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="text-red-500 hover:text-red-700"
                                            >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employees found.</p>
                )}
            </div>
        </div>
        </>
    );
}

export default EmpList;
