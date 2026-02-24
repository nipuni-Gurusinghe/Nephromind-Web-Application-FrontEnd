import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import loginIllustration from '../assets/images/A.png';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // For the eye icon
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loginData = { email, password };

        try {
            // 1. Try Admin Login
            const adminRes = await fetch('http://localhost:5003/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (adminRes.ok) {
                const data = await adminRes.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', 'admin');
                navigate('/dashboard');
                return;
            }

            // 2. Try Doctor Login
            const doctorRes = await fetch('http://localhost:5003/admin/doctor/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (doctorRes.ok) {
                const data = await doctorRes.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', 'doctor');
                localStorage.setItem('doctorId', data.doctorId || data.uid || data.id);                
                navigate('/doctor-dashboard');
                return;
            }

            setError('Invalid credentials for Admin or Doctor.');
        } catch (err) {
            setError('Connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Left Section: Image/Illustration */}
                <div className="login-image-section">
    <div className="illustration">
        <img 
            src={loginIllustration} 
            alt="Login Illustration" 
            style={{ maxWidth: '100%', height: 'auto' }} 
        />
    </div>
</div>

                {/* Right Section: Form */}
                <div className="login-form-section">
                    <div className="form-header">
                        <h2>NephroMind Login</h2>
                        <p>Please enter your details to continue.</p>
                        {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <span className="icon">📧</span>
                                <input 
                                    type="email" 
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <span className="icon">🔒</span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <span 
                                    className="eye-icon" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </span>
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? 'Checking...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    {/* <a href="#" className="forgot-link">Forgot your password? Contact IT</a> */}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;