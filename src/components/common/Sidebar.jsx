import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // COMMUNITY PORTAL items - Multimedia now points to the correct dashboard path
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Events', path: '/events', icon: '📅' },
        { name: 'Multimedia', path: '/multimedia', icon: '🎬' },
        { name: 'FAQ', path: '/faq', icon: '❓' },
        { name: 'Farmer Safety', path: '/farmer-safety', icon: '🚜' },
        { name: 'Healthy Habits', path: '/healthy-habits', icon: '🌿' },
    ];

    const adminItems = [
        { name: 'Doctors', path: '/doctors', icon: '👨‍⚕️' },
        { name: 'Reports', path: '/reports', icon: '📈' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">E</div>
                <span>EventMgr</span>
            </div>
            
            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">COMMUNITY PORTAL</p>
                    {menuItems.map((item) => (
                        <div 
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="nav-icon">{item.icon}</span> 
                            <span className="nav-text">{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="nav-group">
                    <p className="nav-label">ADMINISTRATION</p>
                    {adminItems.map((item) => (
                        <div 
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="nav-icon">{item.icon}</span> 
                            <span className="nav-text">{item.name}</span>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={() => navigate('/')}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;