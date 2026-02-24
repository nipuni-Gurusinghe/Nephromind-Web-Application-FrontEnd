import React from 'react';
import SidebarDR from './common/SidebarDR';
import './AdminDashboard.css';

const DoctorDashboard = () => {
    const currentDateTime = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="admin-full-screen-bg">
            <SidebarDR />
            <main className="main-content-fluid">
                {/* Medical Hero Section */}
                <div className="glass-header-panel">
                    <div className="protocol-container">
                        <span className="system-tag">NEPHROMIND: DOCTOR PROTOCOL ACTIVE</span>
                        <h1 className="main-title">Welcome to NephroMind, Doctor.</h1>
                        <p className="date-display">Clinical Session: {currentDateTime}</p>
                        
                        <div className="status-indicator">
                            <span className="live-dot"></span>
                            Medical Management & CKD Oversight Initialized
                        </div>
                    </div>
                </div>

                <div className="content-body">
                    {/* Specialized Medical Insight Row */}
                    <div className="dashboard-cards-row">
                        <div className="metric-glass-card">
                            <span className="card-icon">🧪</span>
                            <div className="card-data">
                                <p>Patient Interaction</p>
                                <h3>CKD Analysis</h3>
                            </div>
                        </div>
                        <div className="metric-glass-card">
                            <span className="card-icon">📋</span>
                            <div className="card-data">
                                <p>Active Outreach</p>
                                <h3>Health Events</h3>
                            </div>
                        </div>
                        <div className="metric-glass-card">
                            <span className="card-icon">🔬</span>
                            <div className="card-data">
                                <p>Research Module</p>
                                <h3>Wellness Tips</h3>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Mission Statement Card */}
                    <div className="welcome-card-enhanced doctor-special glass-card">
                        <div className="card-header">
                            <div className="title-group">
                                <span className="medical-icon">🏥</span>
                                <h2>Clinical Overview</h2>
                            </div>
                            <span className="tag medical-tag">Medical Suite v1.0</span>
                        </div>
                        
                        <div className="card-body-content">
                            <p className="medical-desc">
                                Welcome to your specialized dashboard for <span className="highlight-text">Chronic Kidney Disease (CKD)</span> Patient Management. 
                                This application is engineered to streamline community outreach and preventative care.
                            </p>
                            
                            <div className="protocol-list">
                                <div className="protocol-item">
                                    <span className="check-icon">✔</span>
                                    <p>Audit community healthy habits and wellness guidelines.</p>
                                </div>
                                <div className="protocol-item">
                                    <span className="check-icon">✔</span>
                                    <p>Review and validate educational multimedia resources.</p>
                                </div>
                                <div className="protocol-item">
                                    <span className="check-icon">✔</span>
                                    <p>Coordinate medical presence for upcoming community events.</p>
                                </div>
                            </div>
                        </div>

                        <div className="action-footer">
                            <div className="footer-status">
                                <span className="status-indicator-small"></span>
                                <p>Select a medical module from the navigation panel to begin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;