import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const HealthyHabitsDashboard = () => {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedHabitId, setSelectedHabitId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Hydration',
        imageUrl: '',
        isActive: true,
        tips: [''], // Initial empty tip
        slug: ''
    });

    const API_URL = 'http://localhost:5003/admin/community/healthy-habits';

    const fetchHabits = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setHabits(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'title') {
                newData.slug = value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
            }
            return newData;
        });
    };

    // Tips array handlers
    const handleTipChange = (index, value) => {
        const newTips = [...formData.tips];
        newTips[index] = value;
        setFormData({ ...formData, tips: newTips });
    };

    const addTipField = () => setFormData({ ...formData, tips: [...formData.tips, ''] });
    
    const removeTipField = (index) => {
        const newTips = formData.tips.filter((_, i) => i !== index);
        setFormData({ ...formData, tips: newTips });
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
                alert("Healthy Habit Added!");
                setIsModalOpen(false);
                fetchHabits();
                setFormData({ title: '', description: '', category: 'Hydration', imageUrl: '', isActive: true, tips: [''], slug: '' });
            }
        } catch (error) {
            console.error("Error saving habit:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setSelectedHabitId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedHabitId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedHabitId}`, { method: 'DELETE' });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                fetchHabits();
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
                        <h1>Healthy Habits</h1>
                        <p>Promote wellness and healthy lifestyle choices.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Habit</button>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>TITLE</th>
                                <th>CATEGORY</th>
                                <th>TIPS COUNT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit._id || habit.id}>
                                    <td><strong>{habit.title}</strong></td>
                                    <td>{habit.category}</td>
                                    <td>{habit.tips?.length || 0} Tips</td>
                                    <td><span className={`status-badge ${habit.isActive ? 'Active' : 'Draft'}`}>{habit.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon">✏️</span> */}
                                        <span className="delete-icon" onClick={() => confirmDelete(habit._id || habit.id)}>🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- ADD MODAL --- */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '600px' }}>
                            <div className="modal-header">
                                <h2>Add Healthy Habit</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Habit Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Actionable Tips</label>
                                    {formData.tips.map((tip, index) => (
                                        <div key={index} style={{ display: 'flex', marginBottom: '8px', gap: '8px' }}>
                                            <input 
                                                type="text" 
                                                value={tip} 
                                                onChange={(e) => handleTipChange(index, e.target.value)} 
                                                placeholder={`Tip #${index + 1}`} 
                                                required 
                                            />
                                            {formData.tips.length > 1 && (
                                                <button type="button" onClick={() => removeTipField(index)} className="btn-danger" style={{ padding: '0 10px' }}>×</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addTipField} className="btn-secondary" style={{ fontSize: '0.8rem' }}>+ Add Another Tip</button>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Habit"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- DELETE MODAL --- */}
                {isDeleteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content confirm-modal">
                            <h2>Delete Habit?</h2>
                            <p>This will remove the habit and all associated tips from the mobile app.</p>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                                <button className="btn-danger" onClick={handleDelete} disabled={loading}>{loading ? "Deleting..." : "Yes, Delete"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HealthyHabitsDashboard;