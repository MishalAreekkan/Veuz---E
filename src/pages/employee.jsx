import React, { useEffect, useState } from "react";
import axios from "axios";

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get("/api/employees/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEmployees(response.data);
        };

        fetchEmployees();
    }, []);

    return (
        <div className="employee-list">
            <h1>Employee List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Employees;
