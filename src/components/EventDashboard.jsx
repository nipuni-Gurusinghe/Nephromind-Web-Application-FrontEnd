import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './EventDashboard.css';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState('');

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

    const TYPE_COLORS = {
        'Community Event': { bg: '#dbeafe', color: '#1d4ed8' },
        'Workshop':        { bg: '#d1fae5', color: '#065f46' },
        'Screening':       { bg: '#fce7f3', color: '#9d174d' },
    };
    const getTypeStyle = (type) => TYPE_COLORS[type] || { bg: '#f1f5f9', color: '#475569' };

    const fetchEvents = () => {
        fetch('/admin/community/event')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const futureEvents = data
                        .filter(e => e.date && !isNaN(new Date(e.date)) && new Date(e.date) >= today)
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                    setEvents(futureEvents);
                } else {
                    setEvents([]);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/admin/community/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                fetchEvents();
                setFormData({ title: '', description: '', date: '', time: '', location: '', organizer: 'NephroMind Foundation', type: 'Community Event', maxCapacity: 500, isActive: true });
            }
        } catch (error) {
            console.error('Error posting event:', error);
        }
    };

    const confirmDelete = (id) => { setSelectedEventId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedEventId) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:5003/admin/community/event/${selectedEventId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                setSelectedEventId(null);
                fetchEvents();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Could not delete event'}`);
            }
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filtered = events.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase())
    );

    // Get days until event
    const getDaysUntil = (dateStr) => {
        const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return { label: 'Today', cls: 'ev-today' };
        if (diff === 1) return { label: 'Tomorrow', cls: 'ev-soon' };
        if (diff <= 7) return { label: `In ${diff} days`, cls: 'ev-soon' };
        return { label: `In ${diff} days`, cls: 'ev-future' };
    };

    return (
        <div className="ev-layout">
            <Sidebar />
            <div className="ev-container">

                {/* Header */}
                <div className="ev-header">
                    <div className="ev-header-left">
                        <span className="ev-tag">ADMIN PANEL</span>
                        <h1 className="ev-title">Event Management</h1>
                        <p className="ev-subtitle">Manage your community outreach programs</p>
                    </div>
                    <div className="ev-header-right">
                        <div className="ev-search-wrap">
                            <span className="ev-search-icon">🔍</span>
                            <input
                                className="ev-search"
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="ev-count-pill">{filtered.length} Upcoming</div>
                        <button className="ev-add-btn" onClick={() => setIsModalOpen(true)}>
                            + Add Event
                        </button>
                    </div>
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                    <div className="ev-empty">
                        <span>📅</span>
                        <p>{search ? 'No events match your search.' : 'No upcoming events found.'}</p>
                    </div>
                )}

                {/* Event Cards */}
                {filtered.length > 0 && (
                    <div className="ev-grid">
                        {filtered.map((event, idx) => {
                            const id = event._id || event.id;
                            const typeStyle = getTypeStyle(event.type);
                            const d = new Date(event.date);
                            const daysUntil = getDaysUntil(event.date);

                            return (
                                <div className="ev-card" key={id} style={{ animationDelay: `${idx * 0.05}s` }}>
                                    {/* Top Row */}
                                    <div className="ev-card-top">
                                        {/* Date Badge */}
                                        <div className="ev-date-badge">
                                            <span className="ev-date-day">{d.getDate()}</span>
                                            <span className="ev-date-month">
                                                {d.toLocaleString('en-GB', { month: 'short' }).toUpperCase()}
                                            </span>
                                            <span className="ev-date-year">{d.getFullYear()}</span>
                                        </div>
                                        <div className="ev-card-badges">
                                            <span className="ev-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                                                {event.type || 'Event'}
                                            </span>
                                            <span className={`ev-days-badge ${daysUntil.cls}`}>
                                                {daysUntil.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="ev-card-body">
                                        <h3 className="ev-card-title">{event.title}</h3>
                                        {event.description && (
                                            <p className="ev-card-desc">{event.description}</p>
                                        )}
                                        <div className="ev-card-meta">
                                            <span>📍 {event.location}</span>
                                            {event.time && <span>🕐 {event.time}</span>}
                                            {event.maxCapacity && <span>👥 {event.maxCapacity} capacity</span>}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="ev-card-footer">
                                        <span className="ev-organizer">🏥 {event.organizer || 'NephroMind Foundation'}</span>
                                        <button
                                            className="ev-delete-btn"
                                            onClick={() => confirmDelete(id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ADD EVENT MODAL */}
            {isModalOpen && (
                <div className="ev-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="ev-modal" onClick={e => e.stopPropagation()}>
                        <div className="ev-modal-header">
                            <div>
                                <h2>Create New Event</h2>
                                <p>Fill in the details for the new community event</p>
                            </div>
                            <button className="ev-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="ev-modal-form">
                            <div className="ev-form-row">
                                <div className="ev-form-group">
                                    <label>Event Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. CKD Awareness Walk" required />
                                </div>
                                <div className="ev-form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="Community Event">Community Event</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Screening">Screening</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ev-form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the event..." required></textarea>
                            </div>
                            <div className="ev-form-row">
                                <div className="ev-form-group">
                                    <label>Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="ev-form-group">
                                    <label>Time</label>
                                    <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="6:00 AM - 10:00 AM" required />
                                </div>
                            </div>
                            <div className="ev-form-row">
                                <div className="ev-form-group">
                                    <label>Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Venue name and city" required />
                                </div>
                                <div className="ev-form-group">
                                    <label>Max Capacity</label>
                                    <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="ev-modal-footer">
                                <button type="button" className="ev-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="ev-btn-save">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="ev-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="ev-modal ev-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="ev-delete-icon-wrap">
                            <span>🗑️</span>
                        </div>
                        <h2 className="ev-delete-title">Delete Event?</h2>
                        <p className="ev-delete-msg">This action cannot be undone. The event will be permanently removed.</p>
                        <div className="ev-modal-footer">
                            <button className="ev-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                                Keep it
                            </button>
                            <button className="ev-btn-danger" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDashboard;
