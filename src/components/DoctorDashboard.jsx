import React from 'react';
import SidebarDR from './common/SidebarDR'; // Use the new Sidebar
import './AdminDashboard.css';

const DoctorDashboard = () => {
    return (
        <div className="dashboard-container">
            <SidebarDR />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Doctor Dashboard</h1>
                        <p>Welcome to your medical management panel.</p>
                    </div>
                </header>
                <div className="data-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Medical Overview</h2>
                    <p>Select "View Events" from the sidebar to see upcoming community outreach.</p>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;