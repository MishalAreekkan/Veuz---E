import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", { email, password });
            localStorage.setItem("token", JSON.stringify(response.data.access));
            setAuth(true);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
