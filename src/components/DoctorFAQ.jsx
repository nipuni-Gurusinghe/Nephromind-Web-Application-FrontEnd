import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './DoctorFAQ.css';

const DoctorFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openId, setOpenId] = useState(null);

    const API_URL = 'http://localhost:5003/admin/doctor/community/faq';

    useEffect(() => {
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
    }, []);

    // Get unique categories
    const categories = ['All', ...new Set(faqs.map(f => f.category).filter(Boolean))];

    // Category colors
    const categoryColors = {
        Prevention: { bg: '#dbeafe', text: '#1d4ed8' },
        Treatment:  { bg: '#fce7f3', text: '#9d174d' },
        Lifestyle:  { bg: '#d1fae5', text: '#065f46' },
        General:    { bg: '#fef3c7', text: '#92400e' },
        Diagnosis:  { bg: '#ede9fe', text: '#5b21b6' },
    };

    const getCatStyle = (cat) => categoryColors[cat] || { bg: '#f1f5f9', text: '#475569' };

    const filtered = faqs.filter(f => {
        const matchCat = activeCategory === 'All' || f.category === activeCategory;
        const matchSearch = f.question?.toLowerCase().includes(search.toLowerCase()) ||
                            f.answer?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

    return (
        <div className="df-layout">
            <SidebarDR />
            <div className="df-container">

                {/* Header */}
                <div className="df-header">
                    <div className="df-header-left">
                        <span className="df-tag">MEDICAL PANEL</span>
                        <h1 className="df-title">Community FAQ</h1>
                        <p className="df-subtitle">Frequently asked questions and medical clarifications</p>
                    </div>
                    <div className="df-header-right">
                        <div className="df-search-wrap">
                            <span className="df-search-icon">🔍</span>
                            <input
                                className="df-search"
                                type="text"
                                placeholder="Search questions..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="df-count-pill">{filtered.length} Questions</div>
                    </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="df-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`df-tab ${activeCategory === cat ? 'df-tab-active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="df-loading">
                        <div className="df-spinner"></div>
                        <p>Loading FAQs...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="df-empty">
                        <span>❓</span>
                        <p>{search ? 'No FAQs match your search.' : 'No FAQs found.'}</p>
                    </div>
                )}

                {/* FAQ Accordion */}
                {!loading && filtered.length > 0 && (
                    <div className="df-list">
                        {filtered.map((faq, idx) => {
                            const id = faq._id || faq.id;
                            const isOpen = openId === id;
                            const catStyle = getCatStyle(faq.category);

                            return (
                                <div
                                    key={id}
                                    className={`df-item ${isOpen ? 'df-item-open' : ''}`}
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <button className="df-question-row" onClick={() => toggleOpen(id)}>
                                        <div className="df-question-left">
                                            <span className="df-q-number">Q{faq.order || idx + 1}</span>
                                            <span className="df-question-text">{faq.question}</span>
                                        </div>
                                        <div className="df-question-right">
                                            {faq.category && (
                                                <span
                                                    className="df-cat-badge"
                                                    style={{ background: catStyle.bg, color: catStyle.text }}
                                                >
                                                    {faq.category}
                                                </span>
                                            )}
                                            <span className={`df-chevron ${isOpen ? 'df-chevron-open' : ''}`}>
                                                ›
                                            </span>
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="df-answer">
                                            <div className="df-answer-inner">
                                                <p>{faq.answer}</p>
                                                {faq.updatedAt && (
                                                    <span className="df-updated">
                                                        Last updated: {new Date(faq.updatedAt).toLocaleDateString('en-GB', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorFAQ;
