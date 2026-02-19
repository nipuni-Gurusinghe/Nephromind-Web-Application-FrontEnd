import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './AdminDashboard.css';

const DoctorEvents = () => {
    const [events, setEvents] = useState([]);
    const API_URL = 'http://localhost:5003/admin/doctor/community/event';

    // Helper function to handle Firestore Timestamp objects or standard strings
    const formatFirestoreDate = (dateObj) => {
        if (!dateObj) return "N/A";
        
        // If it's a Firestore Timestamp object {_seconds, _nanoseconds}
        if (dateObj._seconds) {
            return new Date(dateObj._seconds * 1000).toLocaleDateString();
        }
        
        // If it's already a string or numeric timestamp
        const date = new Date(dateObj);
        return date.toString() === 'Invalid Date' ? "Invalid Date" : date.toLocaleDateString();
    };

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error fetching doctor events:", err));
    }, []);

    return (
        <div className="dashboard-container">
            <SidebarDR />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Community Events</h1>
                        <p>Events requiring medical supervision or attendance.</p>
                    </div>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>EVENT TITLE</th>
                                <th>LOCATION</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id || event.id}>
                                    <td><strong>{event.title}</strong></td>
                                    <td>{event.location}</td>
                                    {/* Using the helper function to prevent rendering objects */}
                                    <td>{formatFirestoreDate(event.date)}</td>
                                    <td>
                                        <span className={`status-badge ${event.isActive ? 'Active' : 'Draft'}`}>
                                            {event.isActive ? 'Active' : 'Upcoming'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default DoctorEvents;