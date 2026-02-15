import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const FarmerSafetyTipsDashboard = () => {
    const [tips, setTips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTipId, setSelectedTipId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        slug: ''
    });

    const API_URL = 'http://localhost:5003/admin/community/farmer-safety';

    const fetchTips = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setTips(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchTips();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Automatically generate slug from title
            if (name === 'title') {
                newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Safety Tip Added!");
                setIsModalOpen(false);
                fetchTips();
                setFormData({ title: '', content: '', slug: '' });
            }
        } catch (error) {
            console.error("Error saving tip:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setSelectedTipId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedTipId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedTipId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                fetchTips();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <div className="header-text">
                        <h1>Farmer Safety Tips</h1>
                        <p>Guidelines for safe agricultural practices.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add New Tip
                    </button>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>SLUG</th>
                                <th>CREATED AT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tips.map((tip) => (
                                <tr key={tip.id || tip._id}>
                                    <td><strong>{tip.title}</strong></td>
                                    <td><code>{tip.slug}</code></td>
                                    <td>{new Date(tip.createdAt).toLocaleDateString()}</td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon">✏️</span> */}
                                        <span className="delete-icon" onClick={() => confirmDelete(tip.id || tip._id)}>🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- ADD MODAL --- */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Add Safety Tip</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label>Tip Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Slug (Auto-generated)</label>
                                    <input type="text" name="slug" value={formData.slug} readOnly style={{backgroundColor: '#f4f7fe'}} />
                                </div>
                                <div className="form-group">
                                    <label>Detailed Content</label>
                                    <textarea name="content" value={formData.content} onChange={handleChange} rows="6" required></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save Tip"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- DELETE MODAL --- */}
                {isDeleteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content confirm-modal">
                            <h2>Delete Tip?</h2>
                            <p>Are you sure? This safety information will be removed from the portal.</p>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                                <button className="btn-danger" onClick={handleDelete} disabled={loading}>
                                    {loading ? "Deleting..." : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FarmerSafetyTipsDashboard;