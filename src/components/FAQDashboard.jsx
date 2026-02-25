import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './FAQDashboard.css';

const CATEGORY_COLORS = {
    Prevention: { bg: '#dbeafe', color: '#1d4ed8' },
    Treatment:  { bg: '#fce7f3', color: '#9d174d' },
    Lifestyle:  { bg: '#d1fae5', color: '#065f46' },
    General:    { bg: '#fef3c7', color: '#92400e' },
    Diagnosis:  { bg: '#ede9fe', color: '#5b21b6' },
};
const getCatStyle = (cat) => CATEGORY_COLORS[cat] || { bg: '#f1f5f9', color: '#475569' };

const FAQDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openId, setOpenId] = useState(null);

    const [formData, setFormData] = useState({
        question: '', answer: '', category: 'Prevention', isActive: true, order: 1
    });

    const API_URL = 'http://localhost:5003/admin/community/faq';

    const fetchFAQs = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setFaqs(Array.isArray(data) ? data : []))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchFAQs(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
                    order: parseInt(formData.order),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            });
            if (response.ok) {
                setIsModalOpen(false);
                fetchFAQs();
                setFormData({ question: '', answer: '', category: 'Prevention', isActive: true, order: faqs.length + 1 });
            }
        } catch (error) {
            console.error('Error adding FAQ:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => { setSelectedFaqId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedFaqId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedFaqId}`, { method: 'DELETE' });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                setSelectedFaqId(null);
                fetchFAQs();
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(faqs.map(f => f.category).filter(Boolean))];

    const filtered = faqs.filter(f => {
        const matchCat = activeCategory === 'All' || f.category === activeCategory;
        const matchSearch = f.question?.toLowerCase().includes(search.toLowerCase()) ||
                            f.answer?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

    return (
        <div className="fq-layout">
            <Sidebar />
            <div className="fq-container">

                {/* Header */}
                <div className="fq-header">
                    <div className="fq-header-left">
                        <span className="fq-tag">ADMIN PANEL</span>
                        <h1 className="fq-title">FAQ Management</h1>
                        <p className="fq-subtitle">Manage community questions and answers</p>
                    </div>
                    <div className="fq-header-right">
                        <div className="fq-search-wrap">
                            <span className="fq-search-icon">🔍</span>
                            <input
                                className="fq-search"
                                type="text"
                                placeholder="Search FAQs..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="fq-count-pill">{filtered.length} FAQs</div>
                        <button className="fq-add-btn" onClick={() => setIsModalOpen(true)}>
                            + Add FAQ
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="fq-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`fq-tab ${activeCategory === cat ? 'fq-tab-active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                    <div className="fq-empty">
                        <span>❓</span>
                        <p>{search ? 'No FAQs match your search.' : 'No FAQs yet. Add the first one!'}</p>
                    </div>
                )}

                {/* FAQ Accordion List */}
                {filtered.length > 0 && (
                    <div className="fq-list">
                        {filtered.map((faq, idx) => {
                            const id = faq._id || faq.id;
                            const isOpen = openId === id;
                            const catStyle = getCatStyle(faq.category);

                            return (
                                <div
                                    key={id}
                                    className={`fq-item ${isOpen ? 'fq-item-open' : ''}`}
                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                >
                                    <div className="fq-question-row" onClick={() => toggleOpen(id)}>
                                        <div className="fq-question-left">
                                            <span className="fq-q-number">Q{faq.order || idx + 1}</span>
                                            <span className="fq-question-text">{faq.question}</span>
                                        </div>
                                        <div className="fq-question-right">
                                            {faq.category && (
                                                <span className="fq-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                                                    {faq.category}
                                                </span>
                                            )}
                                            <span className={`fq-status ${faq.isActive ? 'fq-status-active' : 'fq-status-inactive'}`}>
                                                {faq.isActive ? '● Active' : '○ Inactive'}
                                            </span>
                                            <button
                                                className="fq-delete-btn"
                                                onClick={(e) => { e.stopPropagation(); confirmDelete(id); }}
                                            >
                                                🗑
                                            </button>
                                            <span className={`fq-chevron ${isOpen ? 'fq-chevron-open' : ''}`}>›</span>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="fq-answer">
                                            <div className="fq-answer-inner">
                                                <p>{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ADD MODAL */}
            {isModalOpen && (
                <div className="fq-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="fq-modal" onClick={e => e.stopPropagation()}>
                        <div className="fq-modal-header">
                            <div>
                                <h2>Create New FAQ</h2>
                                <p>Add a question and answer for the community</p>
                            </div>
                            <button className="fq-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="fq-modal-form">
                            <div className="fq-form-group">
                                <label>Question</label>
                                <input type="text" name="question" value={formData.question} onChange={handleChange} placeholder="e.g. What is CKD?" required />
                            </div>
                            <div className="fq-form-group">
                                <label>Answer</label>
                                <textarea name="answer" value={formData.answer} onChange={handleChange} rows="4" placeholder="Write a clear and helpful answer..." required></textarea>
                            </div>
                            <div className="fq-form-row">
                                <div className="fq-form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange}>
                                        <option value="Prevention">Prevention</option>
                                        <option value="Treatment">Treatment</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="General">General</option>
                                        <option value="Diagnosis">Diagnosis</option>
                                    </select>
                                </div>
                                <div className="fq-form-group">
                                    <label>Display Order</label>
                                    <input type="number" name="order" value={formData.order} onChange={handleChange} min="1" />
                                </div>
                            </div>
                            <div className="fq-modal-footer">
                                <button type="button" className="fq-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="fq-btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="fq-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="fq-modal fq-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fq-delete-icon-wrap">🗑️</div>
                        <h2 className="fq-delete-title">Delete FAQ?</h2>
                        <p className="fq-delete-msg">This action cannot be undone. The FAQ will be permanently removed.</p>
                        <div className="fq-modal-footer fq-footer-center">
                            <button className="fq-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Keep it</button>
                            <button className="fq-btn-danger" onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQDashboard;
