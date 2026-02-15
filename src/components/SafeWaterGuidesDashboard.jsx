import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const SafeWaterGuidesDashboard = () => {
    const [guides, setGuides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGuideId, setSelectedGuideId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        slug: ''
    });

    const API_URL = 'http://localhost:5003/admin/community/safe-water-guide';

    const fetchGuides = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setGuides(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Automatic slug generation logic
            if (name === 'title') {
                newData.slug = value.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
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
                body: JSON.stringify({
                    ...formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            });

            if (response.ok) {
                alert("Safe Water Guide Added!");
                setIsModalOpen(false);
                fetchGuides();
                setFormData({ title: '', content: '', imageUrl: '', slug: '' });
            }
        } catch (error) {
            console.error("Error saving guide:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setSelectedGuideId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedGuideId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedGuideId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                fetchGuides();
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
                        <h1>Safe Water Guides</h1>
                        <p>Essential information for maintaining safe water sources.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add New Guide
                    </button>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>SLUG</th>
                                <th>LAST UPDATED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guides.map((guide) => (
                                <tr key={guide._id || guide.id}>
                                    <td><strong>{guide.title}</strong></td>
                                    <td><code>{guide.slug}</code></td>
                                    <td>{new Date(guide.updatedAt).toLocaleDateString()}</td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon">✏️</span> */}
                                        <span className="delete-icon" onClick={() => confirmDelete(guide._id || guide.id)}>🗑️</span>
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
                                <h2>Add Water Guide</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label>Guide Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Header Image URL</label>
                                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <label>Detailed Instructions (Content)</label>
                                    <textarea name="content" value={formData.content} onChange={handleChange} rows="6" required></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save Guide"}
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
                            <h2>Delete Guide?</h2>
                            <p>Are you sure you want to remove this water safety guide?</p>
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

export default SafeWaterGuidesDashboard;