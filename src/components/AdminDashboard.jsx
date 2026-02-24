import React from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="admin-full-screen-bg">
            <Sidebar />
            <main className="main-content-fluid">
                <div className="glass-header-panel">
                    <div className="protocol-container">
                        <span className="system-tag">SYSTEM PROTOCOL: ACTIVE</span>
                        <h1 className="main-title">Welcome, NephroMind Admin</h1>
                        <p className="date-display">{currentDate}</p>
                        <div className="status-indicator">
                            <span className="live-dot"></span>
                            Secure Management Environment Initialized
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;