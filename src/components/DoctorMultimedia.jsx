import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './AdminDashboard.css';

const DoctorMultimedia = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5003/admin/doctor/community/multimedia';

    // Helper: Formats Firestore Timestamp objects to prevent React crashes
    const formatTimestamp = (ts) => {
        if (!ts) return "N/A";
        if (ts._seconds) {
            return new Date(ts._seconds * 1000).toLocaleDateString();
        }
        const date = new Date(ts);
        return date.toString() === 'Invalid Date' ? "N/A" : date.toLocaleDateString();
    };

    const fetchMultimedia = () => {
        setLoading(true);
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setMedia(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMultimedia();
    }, []);

    return (
        <div className="dashboard-container">
            <SidebarDR />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Multimedia Gallery</h1>
                        <p>Educational videos and awareness materials for community health.</p>
                    </div>
                </header>

                <div className="data-card">
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading Multimedia...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>TITLE</th>
                                    <th>TYPE</th>
                                    <th>PREVIEW / LINK</th>
                                    <th>CREATED AT</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {media.length > 0 ? (
                                    media.map((item) => (
                                        <tr key={item._id || item.id}>
                                            <td><strong>{item.title}</strong></td>
                                            <td><span className="type-badge">{item.type || 'Video'}</span></td>
                                            <td>
                                                <a 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#10b981', textDecoration: 'underline', fontSize: '13px' }}
                                                >
                                                    View Content
                                                </a>
                                            </td>
                                            <td>{formatTimestamp(item.createdAt)}</td>
                                            <td>
                                                <span className={`status-badge ${item.isActive ? 'Active' : 'Draft'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                            No multimedia content available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorMultimedia;