import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import ImageA from '../assets/images/A.png'; 

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // CHANGED: URL changed from /admin/register to /admin/login
        // and using the proxy path
        const response = await fetch('/admin/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token if your backend sends one (common practice)
            if(data.token) localStorage.setItem('adminToken', data.token);
            
            console.log("Login success!");
            navigate('/dashboard');
        } else {
            alert(data.message || "Login failed! Please check your credentials.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Cannot connect to server. Make sure backend is running on 5003.");
    }
};

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-image-section">
                    <img src={ImageA} alt="Login Illustration" className="illustration" />
                </div>
                <div className="login-form-section">
                    <div className="form-header">
                        <h2>Admin Login</h2>
                        <p>Enter your details to access the Event Manager</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="admin@example.com" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn-login">Login ➔</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;