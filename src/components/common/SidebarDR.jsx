import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const SidebarDR = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Doctor Dashboard', path: '/doctor-dashboard', icon: '🩺' },
        { name: 'View Events', path: '/doctor-events', icon: '📅' },
        { name: 'FAQ', path: '/doctor-faq', icon: '❓' },
        { name: 'Multimedia', path: '/doctor-multimedia', icon: '🎬' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">E</div>
                <span className="brand-name">DoctorPortal</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">MEDICAL PANEL</p>
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item logout" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default SidebarDR;