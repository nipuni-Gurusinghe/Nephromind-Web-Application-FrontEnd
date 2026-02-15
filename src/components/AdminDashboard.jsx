import React from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back! Select a section from the sidebar to manage your portal.</p>
                    </div>
                </header>
                <div className="content-body">
                    {/* You can add summary cards here later */}
                    <div className="welcome-card">
                        <h2>Quick Statistics Overview</h2>
                        <p>Use the navigation panel on the left to manage Events, Doctors, and Settings.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;