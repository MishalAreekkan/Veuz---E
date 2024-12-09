import React, { createContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ManageForm from "./component/forms";
import EmpCreation from "./component/empCreation";
import EmpList from "./component/empList";
import Register from "./pages/register";
import Profile from "./component/Profile";

export const NewContext = createContext();

const App = () => {
    const [isAuth, setAuth] = useState(!!localStorage.getItem("token"));

    return (
        <NewContext.Provider value={{ isAuth, setAuth }}>
            <Routes>
                <Route
                    path="/login"
                    element={isAuth ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                    path="/dashboard"
                    element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/EmplList"
                    element={isAuth ? <EmpList /> : <Navigate to="/login" />}
                />
                <Route
                    path="/"
                    element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/profile"
                    element={isAuth ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                    path="/ManageForm"
                    element={isAuth ? <ManageForm /> : <Navigate to="/login" />}
                />
                <Route
                    path="/EmpCreation"
                    element={isAuth ? <EmpCreation /> : <Navigate to="/login" />}
                />
                <Route
                    path="/EmpEdit/:id"
                    element={isAuth ? <EmpCreation /> : <Navigate to="/login" />}
                />
            </Routes>
        </NewContext.Provider>
    );
};

export default App;
