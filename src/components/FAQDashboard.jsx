import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './AdminDashboard.css';

const FAQDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'Prevention',
        isActive: true,
        order: 1
    });

    const API_URL = 'http://localhost:5003/admin/community/faq';

    // 1. Fetch all FAQs
    const fetchFAQs = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setFaqs(Array.isArray(data) ? data : []))
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 2. Add New FAQ
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    order: parseInt(formData.order),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            });

            if (response.ok) {
                alert("FAQ Added Successfully!");
                setIsModalOpen(false);
                fetchFAQs();
                setFormData({ question: '', answer: '', category: 'Prevention', isActive: true, order: faqs.length + 1 });
            }
        } catch (error) {
            console.error("Error adding FAQ:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete FAQ Logic
    const confirmDelete = (id) => {
        console.log("Preparing to delete FAQ with ID:", id);
        setSelectedFaqId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedFaqId) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedFaqId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIsDeleteModalOpen(false);
                setSelectedFaqId(null);
                fetchFAQs();
            } else {
                alert("Failed to delete FAQ.");
            }
        } catch (error) {
            console.error("Delete error:", error);
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
                        <h1>FAQ Management</h1>
                        <p>Manage community questions and answers.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add FAQ
                    </button>
                </header>

                <div className="data-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ORDER</th>
                                <th>QUESTION</th>
                                <th>CATEGORY</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <tr key={faq._id || faq.id}>
                                    <td>{faq.order}</td>
                                    <td><strong>{faq.question}</strong></td>
                                    <td>{faq.category}</td>
                                    <td>
                                        <span className={`status-badge ${faq.isActive ? 'Active' : 'Draft'}`}>
                                            {faq.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="action-icons">
                                        {/* <span className="edit-icon" style={{cursor: 'pointer'}}>✏️</span> */}
                                        <span 
                                            className="delete-icon" 
                                            onClick={() => confirmDelete(faq._id || faq.id)}
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
                                <h2>Create New FAQ</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label>Question</label>
                                    <input type="text" name="question" value={formData.question} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Answer</label>
                                    <textarea name="answer" value={formData.answer} onChange={handleChange} rows="4" required></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange}>
                                            <option value="Prevention">Prevention</option>
                                            <option value="Treatment">Treatment</option>
                                            <option value="Lifestyle">Lifestyle</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Display Order</label>
                                        <input type="number" name="order" value={formData.order} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save FAQ"}
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
                                    Are you sure you want to delete this FAQ?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Cancel</button>
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

export default FAQDashboard;