import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './DoctorEvents.css';

const DoctorEvents = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5003/admin/doctor/community/event';

    const formatFirestoreDate = (dateObj) => {
        if (!dateObj) return "N/A";
        if (dateObj._seconds) {
            return new Date(dateObj._seconds * 1000).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }
        const date = new Date(dateObj);
        return date.toString() === 'Invalid Date' ? "N/A" : date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Get month abbreviation for the date badge
    const getDateParts = (dateObj) => {
        if (!dateObj) return { day: '--', month: '---' };
        const d = dateObj._seconds ? new Date(dateObj._seconds * 1000) : new Date(dateObj);
        if (d.toString() === 'Invalid Date') return { day: '--', month: '---' };
        return {
            day: d.getDate(),
            month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
            year: d.getFullYear()
        };
    };

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setEvents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching doctor events:", err);
                setLoading(false);
            });
    }, []);

    const filtered = events.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase())
    );

    // Color palette for cards (cycles through)
    const cardAccents = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

    return (
        <div className="de-layout">
            <SidebarDR />
            <div className="de-container">

                {/* Page Header */}
                <div className="de-header">
                    <div className="de-header-left">
                        <span className="de-header-tag">MEDICAL PANEL</span>
                        <h1 className="de-title">Community Events</h1>
                        <p className="de-subtitle">Events requiring medical supervision or attendance</p>
                    </div>
                    <div className="de-header-right">
                        <div className="de-search-wrap">
                            <span className="de-search-icon">🔍</span>
                            <input
                                className="de-search"
                                type="text"
                                placeholder="Search events or locations..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="de-stats-pill">
                            <span>{events.length} Events</span>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="de-loading">
                        <div className="de-spinner"></div>
                        <p>Loading events...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="de-empty">
                        <span>📅</span>
                        <p>{search ? 'No events match your search.' : 'No events found.'}</p>
                    </div>
                )}

                {/* Event Cards Grid */}
                {!loading && filtered.length > 0 && (
                    <div className="de-grid">
                        {filtered.map((event, idx) => {
                            const accent = cardAccents[idx % cardAccents.length];
                            const dateParts = getDateParts(event.date);
                            const isActive = event.isActive;

                            return (
                                <div
                                    className="de-card"
                                    key={event._id || event.id}
                                    style={{ '--accent': accent }}
                                >
                                    <div className="de-card-top">
                                        {/* Date Badge */}
                                        <div className="de-date-badge" style={{ background: accent }}>
                                            <span className="de-date-day">{dateParts.day}</span>
                                            <span className="de-date-month">{dateParts.month}</span>
                                            <span className="de-date-year">{dateParts.year}</span>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`de-status ${isActive ? 'de-status-active' : 'de-status-upcoming'}`}>
                                            {isActive ? '● Active' : '○ Upcoming'}
                                        </span>
                                    </div>

                                    <div className="de-card-body">
                                        <h3 className="de-event-title">{event.title}</h3>
                                        <div className="de-event-location">
                                            <span className="de-loc-icon">📍</span>
                                            <span>{event.location}</span>
                                        </div>
                                        {event.description && (
                                            <p className="de-event-desc">{event.description}</p>
                                        )}
                                    </div>

                                    <div className="de-card-footer" style={{ borderTop: `2px solid ${accent}22` }}>
                                        <span className="de-card-date-full">
                                            🗓 {formatFirestoreDate(event.date)}
                                        </span>
                                    </div>

                                    {/* Accent bar on left */}
                                    <div className="de-card-accent-bar" style={{ background: accent }}></div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorEvents;
