import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const MultimediaDashboard = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'video',
        category: 'Education',
        url: '',
        description: '',
        duration: '',
        isActive: true,
        plays: 0
    });

    const API_URL = 'http://localhost:5003/admin/community/multimedia';

    // 1. Fetch Multimedia
    const fetchMultimedia = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setMediaItems(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchMultimedia();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 2. Add Multimedia
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
                alert("Multimedia Added Successfully!");
                setIsModalOpen(false);
                fetchMultimedia();
                setFormData({
                    title: '', type: 'video', category: 'Education',
                    url: '', description: '', duration: '', 
                    isActive: true, plays: 0
                });
            }
        } catch (error) {
            console.error("Error adding media:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete Multimedia Logic
    const confirmDelete = (id) => {
        console.log("Selected ID for deletion:", id); // Check if this is undefined in console
        setSelectedMediaId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedMediaId) {
            console.error("No selectedMediaId found in state!");
            return;
        }

        setLoading(true);
        const deleteUrl = `${API_URL}/${selectedMediaId}`;
        console.log("Attempting DELETE to:", deleteUrl);

        try {
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log("Delete successful");
                setIsDeleteModalOpen(false);
                setSelectedMediaId(null); // Clear state
                fetchMultimedia(); // Refresh table
            } else {
                const errData = await response.json();
                console.error("Delete failed:", errData);
                alert(`Delete failed: ${errData.message || 'Unknown server error'}`);
            }
        } catch (error) {
            console.error("Network error during delete:", error);
            alert("Network error. Check if your backend is running on port 5003.");
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
                        <h1>Multimedia Management</h1>
                        <p>Manage audio and video resources.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add Multimedia
                    </button>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>TYPE</th>
                                <th>CATEGORY</th>
                                <th>DURATION</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mediaItems.map((item) => (
                                // Check for _id from Firestore
                                <tr key={item._id || item.id}>
                                    <td><strong>{item.title}</strong></td>
                                    <td><span className="type-badge">{item.type}</span></td>
                                    <td>{item.category}</td>
                                    <td>{item.duration || "N/A"}</td>
                                    <td>
                                        <span className={`status-badge ${item.isActive ? 'Active' : 'Draft'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon" style={{cursor: 'pointer'}}>✏️</span> */}
                                        <span 
                                            className="delete-icon" 
                                            onClick={() => confirmDelete(item._id || item.id)}
                                            style={{ cursor: 'pointer', marginLeft: '12px' }}
                                        >
                                            🗑️
                                        </span>
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
                                <h2>Add New Multimedia</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select name="type" value={formData.type} onChange={handleChange}>
                                            <option value="video">Video</option>
                                            <option value="audio">Audio</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>URL (Source Link)</label>
                                    <input type="url" name="url" value={formData.url} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2"></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="00:00" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save Content"}
                                    </button>
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
                                    Are you sure you want to delete this media? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={loading}
                                >
                                    No, Keep it
                                </button>
                                <button 
                                    className="btn-danger" 
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
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

export default MultimediaDashboard;