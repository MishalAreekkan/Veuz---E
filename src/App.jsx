import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // No need for BrowserRouter here
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ManageForm from "./component/forms"; // Assuming this is the correct path
import EmpCreation from "./component/empCreation";
import EmpList from "./component/empList";
import Register from "./pages/register";
import Profile from "./component/Profile";

const App = () => {
    const [isAuth, setAuth] = useState(!!localStorage.getItem("token"));

    return (
        <Routes>
            {/* Redirect to Dashboard if authenticated, else show login page */}
            <Route
                path="/login"
                element={isAuth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />}
            />

            {/* Protected route for Dashboard */}
            <Route
                path="/dashboard"
                element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
                path="/EmplList"
                element={isAuth ? <EmpList /> : <Navigate to="/login" />}
            />

            {/* Default route for home */}
            <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            {/* Other protected routes */}
            <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/ManageForm" element={isAuth ? <ManageForm /> : <Navigate to="/login" />} />
            <Route path="/EmpCreation" element={isAuth ? <EmpCreation /> : <Navigate to="/login" />} />
            <Route path="/EmpEdit/:id" element={isAuth ? <EmpCreation /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;
