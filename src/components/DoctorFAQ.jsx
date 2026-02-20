import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './AdminDashboard.css';

const DoctorFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5003/admin/doctor/community/faq';

    // Helper: Converts Firestore Timestamp objects {_seconds} to strings
    const formatTimestamp = (ts) => {
        if (!ts) return "N/A";
        if (ts._seconds) {
            return new Date(ts._seconds * 1000).toLocaleDateString();
        }
        const date = new Date(ts);
        return date.toString() === 'Invalid Date' ? "N/A" : date.toLocaleDateString();
    };

    const fetchFaqs = () => {
        setLoading(true);
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setFaqs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return (
        <div className="dashboard-container">
            <SidebarDR />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Community FAQ</h1>
                        <p>Frequently asked questions and medical clarifications.</p>
                    </div>
                </header>

                <div className="data-card">
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading FAQs...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>QUESTION</th>
                                    <th>ANSWER</th>
                                    <th>CATEGORY</th>
                                    <th>LAST UPDATED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.length > 0 ? (
                                    faqs.map((faq) => (
                                        <tr key={faq._id || faq.id}>
                                            <td style={{ width: '30%' }}><strong>{faq.question}</strong></td>
                                            <td style={{ color: '#64748b', fontSize: '14px' }}>{faq.answer}</td>
                                            <td><span className="type-badge">{faq.category || 'General'}</span></td>
                                            {/* Fix for Firestore Object error */}
                                            <td>{formatTimestamp(faq.updatedAt)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                            No FAQs found in the system.
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

export default DoctorFAQ;