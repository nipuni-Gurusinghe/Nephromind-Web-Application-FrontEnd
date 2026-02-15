import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetching data via the proxy defined in package.json
        fetch('/admin/community/event')
            .then(res => res.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    }, []);

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">E</div>
                    <span>EventMgr</span>
                </div>
                
                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <p className="nav-label">COMMUNITY PORTAL</p>
                        <div className="nav-item">📊 Dashboard</div>
                        <div className="nav-item active">📅 Events</div>
                        <div className="nav-item">📁 Multimedia</div>
                        <div className="nav-item">❓ FAQ</div>
                    </div>

                    <div className="nav-group">
                        <p className="nav-label">ADMINISTRATION</p>
                        <div className="nav-item">👨‍⚕️ Doctors</div>
                        <div className="nav-item">📈 Reports</div>
                        <div className="nav-item">⚙️ Settings</div>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn">🚪 Logout</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="search-wrapper">
                        <input type="text" placeholder="Search events, locations..." className="search-input" />
                    </div>
                    <div className="user-info">
                        <div className="notification-bell">🔔</div>
                        <div className="profile-details">
                            <span className="user-name">Alex Thompson</span>
                            <span className="user-role">Admin</span>
                        </div>
                        <div className="user-avatar"></div>
                    </div>
                </header>

                <section className="content-body">
                    <div className="page-header">
                        <div className="header-text">
                            <h1>Event Management</h1>
                            <p>Create, edit and monitor community outreach events.</p>
                        </div>
                        <button className="btn-primary">+ Add Event</button>
                    </div>

                    <div className="data-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>EVENT TITLE</th>
                                    <th>LOCATION</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length > 0 ? events.map((event, index) => (
                                    <tr key={event._id || index}>
                                        <td className="title-cell">
                                            <strong>{event.title}</strong>
                                            <span>Community Outreach</span>
                                        </td>
                                        <td>{event.location}</td>
                                        <td className="date-cell">
                                            {new Date(event.date).toLocaleDateString('en-US', { 
                                                month: 'short', day: 'numeric', year: 'numeric' 
                                            })}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${event.status}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="action-cell">
                                            <button className="icon-btn">✏️</button>
                                            <button className="icon-btn delete">🗑️</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="empty-state">No events found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;