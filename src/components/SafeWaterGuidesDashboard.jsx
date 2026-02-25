import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap');

.sw-layout {
    display: flex;
    background: #f0f4f8;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
}

.sw-container {
    flex: 1;
    margin-left: 300px;
    padding: 40px;
    width: calc(100% - 300px);
}

/* ── Header ── */
.sw-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 20px;
}
.sw-header-left { display: flex; flex-direction: column; gap: 4px; }

.sw-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #8b5cf6;
    text-transform: uppercase;
}
.sw-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}
.sw-subtitle { font-size: 14px; color: #64748b; margin: 0; }

.sw-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

/* ── Search ── */
.sw-search-wrap { position: relative; display: flex; align-items: center; }
.sw-search-icon { position: absolute; left: 12px; font-size: 14px; }
.sw-search {
    padding: 10px 16px 10px 36px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    background: white;
    color: #1e293b;
    outline: none;
    width: 220px;
    transition: border 0.2s, box-shadow 0.2s;
}
.sw-search:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}

.sw-count-pill {
    background: #1e293b;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.sw-add-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
}
.sw-add-btn:hover { background: #7c3aed; }

/* ── Empty ── */
.sw-empty { text-align: center; padding: 80px; color: #94a3b8; font-size: 15px; }
.sw-empty span { font-size: 48px; display: block; margin-bottom: 12px; }

/* ── List ── */
.sw-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.sw-item {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
    animation: sw-fadeup 0.35s ease both;
    border: 1.5px solid transparent;
}
.sw-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }
.sw-item-open {
    box-shadow: 0 4px 24px rgba(139,92,246,0.13);
    border-color: rgba(139,92,246,0.13);
}
@keyframes sw-fadeup {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Row ── */
.sw-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    cursor: pointer;
    gap: 12px;
    user-select: none;
}
.sw-row-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}
.sw-index {
    font-size: 11px;
    font-weight: 700;
    color: #8b5cf6;
    background: #ede9fe;
    padding: 4px 10px;
    border-radius: 50px;
    white-space: nowrap;
    letter-spacing: 0.5px;
    flex-shrink: 0;
}
.sw-guide-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.sw-row-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.sw-slug-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    background: #e0f2fe;
    color: #0369a1;
    font-family: monospace;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sw-date {
    font-size: 11px;
    color: #94a3b8;
    white-space: nowrap;
}

.sw-delete-btn {
    background: #fee2e2;
    color: #ef4444;
    border: none;
    padding: 5px 10px;
    border-radius: 7px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
}
.sw-delete-btn:hover { background: #fecaca; }

.sw-chevron {
    font-size: 22px;
    color: #94a3b8;
    font-weight: 300;
    transition: transform 0.25s ease;
    display: inline-block;
    line-height: 1;
    flex-shrink: 0;
}
.sw-chevron-open { transform: rotate(90deg); color: #8b5cf6; }

/* ── Expanded Panel ── */
.sw-panel {
    border-top: 1px solid #f1f5f9;
    animation: sw-expand 0.22s ease;
}
@keyframes sw-expand {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
.sw-panel-inner {
    padding: 16px 22px 20px 68px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.sw-panel-image {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 10px;
}
.sw-panel-content {
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    margin: 0;
    white-space: pre-line;
}

/* ── Modal Overlay ── */
.sw-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}
.sw-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
    animation: sw-modal-in 0.25s ease;
}
.sw-modal-sm {
    max-width: 400px;
    padding: 32px;
    text-align: center;
    overflow: visible;
}
@keyframes sw-modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}

.sw-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px 28px 0;
}
.sw-modal-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #1e293b;
    margin: 0 0 4px 0;
}
.sw-modal-header p { font-size: 13px; color: #94a3b8; margin: 0; }

.sw-modal-close {
    background: #f1f5f9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    color: #64748b;
    transition: background 0.2s;
    flex-shrink: 0;
}
.sw-modal-close:hover { background: #e2e8f0; }

.sw-modal-form {
    padding: 20px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.sw-form-group { display: flex; flex-direction: column; gap: 6px; }
.sw-form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.sw-form-group input,
.sw-form-group textarea {
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    outline: none;
    background: #f8fafc;
    transition: border 0.2s;
    resize: none;
}
.sw-form-group input:focus,
.sw-form-group textarea:focus {
    border-color: #8b5cf6;
    background: white;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
.sw-input-readonly {
    background: #f4f7fe !important;
    color: #94a3b8 !important;
    cursor: not-allowed;
}

.sw-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 28px 24px;
}
.sw-footer-center { justify-content: center; padding: 0; margin-top: 24px; }

.sw-btn-cancel {
    background: #f1f5f9;
    color: #64748b;
    border: none;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
}
.sw-btn-cancel:hover { background: #e2e8f0; }
.sw-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

.sw-btn-save {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
}
.sw-btn-save:hover { background: #7c3aed; }
.sw-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.sw-btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
}
.sw-btn-danger:hover { background: #dc2626; }
.sw-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.sw-delete-icon-wrap { font-size: 48px; margin-bottom: 12px; }
.sw-delete-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e293b; margin: 0 0 8px 0; }
.sw-delete-msg { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }

@media (max-width: 1024px) {
    .sw-container { margin-left: 80px; width: calc(100% - 80px); padding: 24px; }
}
@media (max-width: 768px) {
    .sw-guide-title { white-space: normal; }
    .sw-header { flex-direction: column; }
    .sw-search { width: 100%; }
    .sw-slug-badge { display: none; }
    .sw-panel-inner { padding-left: 22px; }
}
`;

const SafeWaterGuidesDashboard = () => {
    const [guides, setGuides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGuideId, setSelectedGuideId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState(null);

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
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchGuides(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title') {
                updated.slug = value.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchGuides();
                setFormData({ title: '', content: '', imageUrl: '', slug: '' });
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => { setSelectedGuideId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedGuideId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedGuideId}`, { method: 'DELETE' });
            if (res.ok) {
                setIsDeleteModalOpen(false);
                setSelectedGuideId(null);
                fetchGuides();
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

    const filtered = guides.filter(g =>
        g.title?.toLowerCase().includes(search.toLowerCase()) ||
        g.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{styles}</style>
            <div className="sw-layout">
                <Sidebar />
                <div className="sw-container">

                    {/* ── Header ── */}
                    <div className="sw-header">
                        <div className="sw-header-left">
                            <span className="sw-tag">ADMIN PANEL</span>
                            <h1 className="sw-title">Safe Water Guides</h1>
                            <p className="sw-subtitle">Essential information for maintaining safe water sources</p>
                        </div>
                        <div className="sw-header-right">
                            <div className="sw-search-wrap">
                                <span className="sw-search-icon">🔍</span>
                                <input
                                    className="sw-search"
                                    type="text"
                                    placeholder="Search guides..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="sw-count-pill">{filtered.length} Guides</div>
                            <button className="sw-add-btn" onClick={() => setIsModalOpen(true)}>
                                + Add New Guide
                            </button>
                        </div>
                    </div>

                    {/* ── Empty State ── */}
                    {filtered.length === 0 && (
                        <div className="sw-empty">
                            <span>💧</span>
                            <p>{search ? 'No guides match your search.' : 'No water guides yet. Add the first one!'}</p>
                        </div>
                    )}

                    {/* ── Accordion List ── */}
                    {filtered.length > 0 && (
                        <div className="sw-list">
                            {filtered.map((guide, idx) => {
                                const id = guide._id || guide.id;
                                const isOpen = openId === id;
                                return (
                                    <div
                                        key={id}
                                        className={`sw-item ${isOpen ? 'sw-item-open' : ''}`}
                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                    >
                                        <div className="sw-row" onClick={() => toggleOpen(id)}>
                                            <div className="sw-row-left">
                                                <span className="sw-index">#{idx + 1}</span>
                                                <span className="sw-guide-title">{guide.title}</span>
                                            </div>
                                            <div className="sw-row-right">
                                                <span className="sw-slug-badge">{guide.slug}</span>
                                                <span className="sw-date">
                                                    {new Date(guide.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <button
                                                    className="sw-delete-btn"
                                                    onClick={e => { e.stopPropagation(); confirmDelete(id); }}
                                                >
                                                    🗑
                                                </button>
                                                <span className={`sw-chevron ${isOpen ? 'sw-chevron-open' : ''}`}>›</span>
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="sw-panel">
                                                <div className="sw-panel-inner">
                                                    {guide.imageUrl && (
                                                        <img
                                                            src={guide.imageUrl}
                                                            alt={guide.title}
                                                            className="sw-panel-image"
                                                            onError={e => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <p className="sw-panel-content">{guide.content}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── ADD MODAL ── */}
                {isModalOpen && (
                    <div className="sw-modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="sw-modal" onClick={e => e.stopPropagation()}>
                            <div className="sw-modal-header">
                                <div>
                                    <h2>Add Water Guide</h2>
                                    <p>Create a new safe water guide for the community</p>
                                </div>
                                <button className="sw-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="sw-modal-form">
                                <div className="sw-form-group">
                                    <label>Guide Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. How to Purify Drinking Water"
                                        required
                                    />
                                </div>
                                <div className="sw-form-group">
                                    <label>Slug (Auto-generated)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        readOnly
                                        className="sw-input-readonly"
                                    />
                                </div>
                                <div className="sw-form-group">
                                    <label>Header Image URL (optional)</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div className="sw-form-group">
                                    <label>Detailed Instructions</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Write clear and actionable water safety instructions..."
                                        required
                                    />
                                </div>
                                <div className="sw-modal-footer">
                                    <button type="button" className="sw-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="sw-btn-save" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Guide'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── DELETE MODAL ── */}
                {isDeleteModalOpen && (
                    <div className="sw-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                        <div className="sw-modal sw-modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="sw-delete-icon-wrap">🗑️</div>
                            <h2 className="sw-delete-title">Delete Guide?</h2>
                            <p className="sw-delete-msg">This action cannot be undone. The water safety guide will be permanently removed from the portal.</p>
                            <div className="sw-modal-footer sw-footer-center">
                                <button className="sw-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Keep it</button>
                                <button className="sw-btn-danger" onClick={handleDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SafeWaterGuidesDashboard;
