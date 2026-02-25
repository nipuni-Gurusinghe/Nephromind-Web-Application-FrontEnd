import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';

/* ─── Inline styles mirroring FAQDashboard aesthetic ─── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap');

.fs-layout {
    display: flex;
    background: #f0f4f8;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
}

.fs-container {
    flex: 1;
    margin-left: 300px;
    padding: 40px;
    width: calc(100% - 300px);
}

/* ── Header ── */
.fs-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 20px;
}

.fs-header-left { display: flex; flex-direction: column; gap: 4px; }

.fs-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #8b5cf6;
    text-transform: uppercase;
}

.fs-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}

.fs-subtitle { font-size: 14px; color: #64748b; margin: 0; }

.fs-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.fs-count-pill {
    background: #1e293b;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.fs-add-btn {
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
.fs-add-btn:hover { background: #7c3aed; }

/* ── Search ── */
.fs-search-wrap { position: relative; display: flex; align-items: center; }
.fs-search-icon { position: absolute; left: 12px; font-size: 14px; }

.fs-search {
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
.fs-search:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}

/* ── Empty ── */
.fs-empty { text-align: center; padding: 80px; color: #94a3b8; font-size: 15px; }
.fs-empty span { font-size: 48px; display: block; margin-bottom: 12px; }

/* ── List ── */
.fs-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.fs-item {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
    animation: fs-fadeup 0.35s ease both;
    border: 1.5px solid transparent;
}
.fs-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }
.fs-item-open {
    box-shadow: 0 4px 24px rgba(139,92,246,0.13);
    border-color: rgba(139,92,246,0.13);
}

@keyframes fs-fadeup {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Row ── */
.fs-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    cursor: pointer;
    gap: 12px;
    user-select: none;
}

.fs-row-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}

.fs-index {
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

.fs-tip-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fs-row-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.fs-slug-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    background: #f1f5f9;
    color: #64748b;
    font-family: monospace;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fs-date {
    font-size: 11px;
    color: #94a3b8;
    white-space: nowrap;
}

.fs-delete-btn {
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
.fs-delete-btn:hover { background: #fecaca; }

.fs-chevron {
    font-size: 22px;
    color: #94a3b8;
    font-weight: 300;
    transition: transform 0.25s ease;
    display: inline-block;
    line-height: 1;
    flex-shrink: 0;
}
.fs-chevron-open { transform: rotate(90deg); color: #8b5cf6; }

/* ── Answer / Content Panel ── */
.fs-content-panel {
    border-top: 1px solid #f1f5f9;
    animation: fs-expand 0.22s ease;
}
@keyframes fs-expand {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
.fs-content-inner {
    padding: 16px 22px 18px 68px;
}
.fs-content-inner p {
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    margin: 0;
}

/* ── Modal Overlay ── */
.fs-modal-overlay {
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

.fs-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 540px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
    overflow: hidden;
    animation: fs-modal-in 0.25s ease;
}

.fs-modal-sm {
    max-width: 400px;
    padding: 32px;
    text-align: center;
    overflow: visible;
}

@keyframes fs-modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}

.fs-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px 28px 0;
}
.fs-modal-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #1e293b;
    margin: 0 0 4px 0;
}
.fs-modal-header p { font-size: 13px; color: #94a3b8; margin: 0; }

.fs-modal-close {
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
.fs-modal-close:hover { background: #e2e8f0; }

.fs-modal-form {
    padding: 20px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.fs-form-group { display: flex; flex-direction: column; gap: 6px; }

.fs-form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.fs-form-group input,
.fs-form-group textarea {
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
.fs-form-group input:focus,
.fs-form-group textarea:focus {
    border-color: #8b5cf6;
    background: white;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
.fs-input-readonly {
    background: #f4f7fe !important;
    color: #94a3b8 !important;
    cursor: not-allowed;
}

.fs-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 28px 24px;
}
.fs-footer-center { justify-content: center; padding: 0; margin-top: 24px; }

.fs-btn-cancel {
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
.fs-btn-cancel:hover { background: #e2e8f0; }

.fs-btn-save {
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
.fs-btn-save:hover { background: #7c3aed; }
.fs-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.fs-btn-danger {
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
.fs-btn-danger:hover { background: #dc2626; }
.fs-btn-danger:disabled,
.fs-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

.fs-delete-icon-wrap { font-size: 48px; margin-bottom: 12px; }
.fs-delete-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e293b; margin: 0 0 8px 0; }
.fs-delete-msg { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }

@media (max-width: 1024px) {
    .fs-container { margin-left: 80px; width: calc(100% - 80px); padding: 24px; }
}
@media (max-width: 768px) {
    .fs-tip-title { white-space: normal; }
    .fs-header { flex-direction: column; }
    .fs-search { width: 100%; }
    .fs-slug-badge { display: none; }
}
`;

const FarmerSafetyTipsDashboard = () => {
    const [tips, setTips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTipId, setSelectedTipId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState(null);

    const [formData, setFormData] = useState({ title: '', content: '', slug: '' });

    const API_URL = 'http://localhost:5003/admin/community/farmer-safety';

    const fetchTips = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setTips(Array.isArray(data) ? data : []))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchTips(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title') {
                updated.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
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
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchTips();
                setFormData({ title: '', content: '', slug: '' });
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => { setSelectedTipId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedTipId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedTipId}`, { method: 'DELETE' });
            if (res.ok) {
                setIsDeleteModalOpen(false);
                setSelectedTipId(null);
                fetchTips();
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

    const filtered = tips.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{styles}</style>
            <div className="fs-layout">
                <Sidebar />
                <div className="fs-container">

                    {/* Header */}
                    <div className="fs-header">
                        <div className="fs-header-left">
                            <span className="fs-tag">ADMIN PANEL</span>
                            <h1 className="fs-title">Farmer Safety Tips</h1>
                            <p className="fs-subtitle">Guidelines for safe agricultural practices</p>
                        </div>
                        <div className="fs-header-right">
                            <div className="fs-search-wrap">
                                <span className="fs-search-icon">🔍</span>
                                <input
                                    className="fs-search"
                                    type="text"
                                    placeholder="Search tips..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="fs-count-pill">{filtered.length} Tips</div>
                            <button className="fs-add-btn" onClick={() => setIsModalOpen(true)}>
                                + Add New Tip
                            </button>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filtered.length === 0 && (
                        <div className="fs-empty">
                            <span>🌾</span>
                            <p>{search ? 'No tips match your search.' : 'No safety tips yet. Add the first one!'}</p>
                        </div>
                    )}

                    {/* Tips Accordion List */}
                    {filtered.length > 0 && (
                        <div className="fs-list">
                            {filtered.map((tip, idx) => {
                                const id = tip._id || tip.id;
                                const isOpen = openId === id;
                                return (
                                    <div
                                        key={id}
                                        className={`fs-item ${isOpen ? 'fs-item-open' : ''}`}
                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                    >
                                        <div className="fs-row" onClick={() => toggleOpen(id)}>
                                            <div className="fs-row-left">
                                                <span className="fs-index">#{idx + 1}</span>
                                                <span className="fs-tip-title">{tip.title}</span>
                                            </div>
                                            <div className="fs-row-right">
                                                <span className="fs-slug-badge">{tip.slug}</span>
                                                <span className="fs-date">
                                                    {new Date(tip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <button
                                                    className="fs-delete-btn"
                                                    onClick={e => { e.stopPropagation(); confirmDelete(id); }}
                                                >
                                                    🗑
                                                </button>
                                                <span className={`fs-chevron ${isOpen ? 'fs-chevron-open' : ''}`}>›</span>
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="fs-content-panel">
                                                <div className="fs-content-inner">
                                                    <p>{tip.content}</p>
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
                    <div className="fs-modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="fs-modal" onClick={e => e.stopPropagation()}>
                            <div className="fs-modal-header">
                                <div>
                                    <h2>Add Safety Tip</h2>
                                    <p>Create a new guideline for agricultural safety</p>
                                </div>
                                <button className="fs-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="fs-modal-form">
                                <div className="fs-form-group">
                                    <label>Tip Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Proper Pesticide Handling"
                                        required
                                    />
                                </div>
                                <div className="fs-form-group">
                                    <label>Slug (Auto-generated)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        readOnly
                                        className="fs-input-readonly"
                                    />
                                </div>
                                <div className="fs-form-group">
                                    <label>Detailed Content</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Write clear and actionable safety guidance..."
                                        required
                                    />
                                </div>
                                <div className="fs-modal-footer">
                                    <button type="button" className="fs-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="fs-btn-save" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Tip'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── DELETE MODAL ── */}
                {isDeleteModalOpen && (
                    <div className="fs-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                        <div className="fs-modal fs-modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="fs-delete-icon-wrap">🗑️</div>
                            <h2 className="fs-delete-title">Delete Tip?</h2>
                            <p className="fs-delete-msg">This action cannot be undone. The safety tip will be permanently removed from the portal.</p>
                            <div className="fs-modal-footer fs-footer-center">
                                <button className="fs-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Keep it</button>
                                <button className="fs-btn-danger" onClick={handleDelete} disabled={loading}>
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

export default FarmerSafetyTipsDashboard;
