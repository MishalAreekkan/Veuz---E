import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EmpCreation = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState([]);
    const { id } = useParams()
    const nav = useNavigate()
    useEffect(() => {
        if (id) {

            // Fetch the employee data using the ID
            axios.get(`http://127.0.0.1:8000/employee/profile/${id}/`)
                .then(response => {
                    console.warn(response.data.dynamic_data[0])
                    setEmployee(response.data.dynamic_data[0].dynamic_data);
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Error fetching employee data:', error);
                });
        }
    }, [id]);
    useEffect(() => {
        console.error(employee)
    }, [loading]);


    useEffect(() => {
        // Fetch dynamic fields from the backend API
        axios.get('http://127.0.0.1:8000/employee/forms/')
            .then(response => {
                const fields = response.data.dynamic_data[0]?.dynamic_fields || [];
                console.log('Fetched dynamic fields:', fields); // Log the fetched data
                setFormFields(fields);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching dynamic fields:', error);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const url = id
            ? `http://127.0.0.1:8000/employee/profile/${id}/` // Update profile if ID exists
            : 'http://127.0.0.1:8000/employee/profile/';     // Create new profile if no ID
    
        const method = id ? axios.patch : axios.post; // Choose the correct HTTP method
    
        method(url, formData)
            .then(response => {
                console.log('Profile saved successfully:', response.data);
                nav("/EmplList"); // Navigate to employee list after success
            })
            .catch(error => {
                console.error('Error saving profile:', error);
            });
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Create Employee Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field, index) => {
                    const { label, type } = field;
                    return (
                        <div key={index} className="flex flex-col">
                            <label htmlFor={label} className="text-sm font-medium text-gray-700 mb-2">{label}</label>
                            <input
                                type={type}
                                id={label}
                                name={label}
                                defaultValue={employee && employee[label] ? employee[label] : formData[label] || ''}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    );
                })}

            </div>
            <div className="mt-6 flex justify-center">
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default EmpCreation;
