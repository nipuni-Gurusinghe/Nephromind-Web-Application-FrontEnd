import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: 'NephroMind Foundation',
        type: 'Community Event',
        maxCapacity: 500,
        isActive: true
    });

    // 1. Fetch Events
    const fetchEvents = () => {
        fetch('/admin/community/event')
            .then(res => res.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 2. Add New Event
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/admin/community/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Event Added Successfully!");
                setIsModalOpen(false);
                fetchEvents();
                setFormData({
                    title: '', description: '', date: '', time: '',
                    location: '', organizer: 'NephroMind Foundation',
                    type: 'Community Event', maxCapacity: 500, isActive: true
                });
            }
        } catch (error) {
            console.error("Error posting event:", error);
        }
    };

    // 3. Prepare Deletion
    const confirmDelete = (id) => {
        console.log("Setting selectedEventId to:", id);
        setSelectedEventId(id);
        setIsDeleteModalOpen(true);
    };

    // 4. Execute Delete Function
    const handleDelete = async () => {
        if (!selectedEventId) {
            console.error("No ID selected!");
            return;
        }

        setIsDeleting(true);
        try {
            // Using full URL to ensure port 5003 is hit
            const response = await fetch(`http://localhost:5003/admin/community/event/${selectedEventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log("Event deleted successfully");
                setIsDeleteModalOpen(false);
                setSelectedEventId(null);
                fetchEvents(); // Refresh the list
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Could not delete event"}`);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
            alert("Network error. Check if backend is running.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Event Management</h1>
                        <p>Manage your community outreach programs.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add Event
                    </button>
                </header>

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
                            {events.map((event) => (
                                <tr key={event._id || event.id}>
                                    <td><strong>{event.title}</strong></td>
                                    <td>{event.location}</td>
                                    <td>{event.date && event.date !== "Invalid Date" ? new Date(event.date).toLocaleDateString() : "TBD"}</td>
                                    <td>
                                        <span className={`status-badge ${event.isActive ? 'Active' : 'Draft'}`}>
                                            {event.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon" style={{cursor: 'pointer'}}>✏️</span> */}
                                        <span 
                                            className="delete-icon" 
                                            onClick={() => confirmDelete(event._id || event.id)}
                                            style={{ cursor: 'pointer', marginLeft: '15px' }}
                                        >
                                            🗑️
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- ADD EVENT MODAL --- */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Create New Event</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Event Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select name="type" value={formData.type} onChange={handleChange}>
                                            <option value="Community Event">Community Event</option>
                                            <option value="Workshop">Workshop</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Time</label>
                                        <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="6:00 AM - 10:00 AM" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Capacity</label>
                                        <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Save Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- DELETE CONFIRMATION MODAL --- */}
                {isDeleteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content confirm-modal">
                            <div className="modal-header">
                                <h2>Confirm Delete</h2>
                            </div>
                            <div className="modal-body">
                                <p style={{color: '#2b3674', margin: '20px 0'}}>
                                    Are you sure you want to delete this event? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleting}
                                >
                                    No, Keep it
                                </button>
                                <button 
                                    className="btn-danger" 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete Event"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EventDashboard;