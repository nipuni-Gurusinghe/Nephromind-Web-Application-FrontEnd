import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';

/* ─── Inline styles matching FAQ / FarmerSafety aesthetic ─── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap');

.hh-layout {
    display: flex;
    background: #f0f4f8;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
}

.hh-container {
    flex: 1;
    margin-left: 300px;
    padding: 40px;
    width: calc(100% - 300px);
}

/* ── Header ── */
.hh-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 20px;
}
.hh-header-left { display: flex; flex-direction: column; gap: 4px; }

.hh-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #8b5cf6;
    text-transform: uppercase;
}
.hh-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}
.hh-subtitle { font-size: 14px; color: #64748b; margin: 0; }

.hh-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

/* ── Search ── */
.hh-search-wrap { position: relative; display: flex; align-items: center; }
.hh-search-icon { position: absolute; left: 12px; font-size: 14px; }
.hh-search {
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
.hh-search:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}

.hh-count-pill {
    background: #1e293b;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.hh-add-btn {
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
.hh-add-btn:hover { background: #7c3aed; }

/* ── Category Tabs ── */
.hh-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.hh-tab {
    padding: 8px 18px;
    border-radius: 50px;
    border: 1.5px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}
.hh-tab:hover { border-color: #8b5cf6; color: #8b5cf6; }
.hh-tab-active { background: #8b5cf6; border-color: #8b5cf6; color: white !important; font-weight: 600; }

/* ── Empty ── */
.hh-empty { text-align: center; padding: 80px; color: #94a3b8; font-size: 15px; }
.hh-empty span { font-size: 48px; display: block; margin-bottom: 12px; }

/* ── List ── */
.hh-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.hh-item {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
    animation: hh-fadeup 0.35s ease both;
    border: 1.5px solid transparent;
}
.hh-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }
.hh-item-open {
    box-shadow: 0 4px 24px rgba(139,92,246,0.13);
    border-color: rgba(139,92,246,0.13);
}
@keyframes hh-fadeup {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Row ── */
.hh-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    cursor: pointer;
    gap: 12px;
    user-select: none;
}
.hh-row-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}
.hh-index {
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
.hh-habit-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.hh-row-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

/* Category badge colours */
.hh-cat-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 50px;
    white-space: nowrap;
}

.hh-tips-count {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    background: #f0fdf4;
    color: #16a34a;
    white-space: nowrap;
}

.hh-status {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 50px;
    white-space: nowrap;
}
.hh-status-active { background: #dcfce7; color: #15803d; }
.hh-status-inactive { background: #f1f5f9; color: #64748b; }

.hh-delete-btn {
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
.hh-delete-btn:hover { background: #fecaca; }

.hh-chevron {
    font-size: 22px;
    color: #94a3b8;
    font-weight: 300;
    transition: transform 0.25s ease;
    display: inline-block;
    line-height: 1;
    flex-shrink: 0;
}
.hh-chevron-open { transform: rotate(90deg); color: #8b5cf6; }

/* ── Expanded Panel ── */
.hh-panel {
    border-top: 1px solid #f1f5f9;
    animation: hh-expand 0.22s ease;
}
@keyframes hh-expand {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
.hh-panel-inner {
    padding: 16px 22px 20px 68px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.hh-panel-desc {
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    margin: 0;
}
.hh-panel-image {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 4px;
}
.hh-tips-list { display: flex; flex-direction: column; gap: 6px; }
.hh-tips-label {
    font-size: 11px;
    font-weight: 700;
    color: #8b5cf6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}
.hh-tip-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
}
.hh-tip-dot {
    width: 6px;
    height: 6px;
    background: #8b5cf6;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
}

/* ── Modal Overlay ── */
.hh-modal-overlay {
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
.hh-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 580px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
    animation: hh-modal-in 0.25s ease;
}
.hh-modal-sm {
    max-width: 400px;
    padding: 32px;
    text-align: center;
    overflow: visible;
}
@keyframes hh-modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}
.hh-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px 28px 0;
}
.hh-modal-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #1e293b;
    margin: 0 0 4px 0;
}
.hh-modal-header p { font-size: 13px; color: #94a3b8; margin: 0; }

.hh-modal-close {
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
.hh-modal-close:hover { background: #e2e8f0; }

.hh-modal-form {
    padding: 20px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.hh-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hh-form-group { display: flex; flex-direction: column; gap: 6px; }
.hh-form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.hh-form-group input,
.hh-form-group select,
.hh-form-group textarea {
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
.hh-form-group input:focus,
.hh-form-group select:focus,
.hh-form-group textarea:focus {
    border-color: #8b5cf6;
    background: white;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
.hh-input-readonly {
    background: #f4f7fe !important;
    color: #94a3b8 !important;
    cursor: not-allowed;
}

/* Tips input rows */
.hh-tip-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
}
.hh-tip-input-row input { flex: 1; }
.hh-tip-remove-btn {
    background: #fee2e2;
    color: #ef4444;
    border: none;
    width: 32px;
    height: 36px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hh-tip-remove-btn:hover { background: #fecaca; }

.hh-add-tip-btn {
    background: #ede9fe;
    color: #7c3aed;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
    align-self: flex-start;
    margin-top: 4px;
}
.hh-add-tip-btn:hover { background: #ddd6fe; }

/* Active checkbox row */
.hh-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
}
.hh-checkbox-row input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #8b5cf6;
    cursor: pointer;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
}
.hh-checkbox-row label {
    font-size: 13px;
    font-weight: 500;
    color: #334155;
    cursor: pointer;
    text-transform: none;
    letter-spacing: 0;
}

.hh-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 28px 24px;
}
.hh-footer-center { justify-content: center; padding: 0; margin-top: 24px; }

.hh-btn-cancel {
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
.hh-btn-cancel:hover { background: #e2e8f0; }

.hh-btn-save {
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
.hh-btn-save:hover { background: #7c3aed; }
.hh-btn-save:disabled,
.hh-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

.hh-btn-danger {
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
.hh-btn-danger:hover { background: #dc2626; }
.hh-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.hh-delete-icon-wrap { font-size: 48px; margin-bottom: 12px; }
.hh-delete-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e293b; margin: 0 0 8px 0; }
.hh-delete-msg { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }

@media (max-width: 1024px) {
    .hh-container { margin-left: 80px; width: calc(100% - 80px); padding: 24px; }
}
@media (max-width: 768px) {
    .hh-habit-title { white-space: normal; }
    .hh-header { flex-direction: column; }
    .hh-search { width: 100%; }
    .hh-form-row { grid-template-columns: 1fr; }
    .hh-panel-inner { padding-left: 22px; }
}
`;

/* Category badge colour map */
const CATEGORY_COLORS = {
    Hydration:   { bg: '#dbeafe', color: '#1d4ed8' },
    Nutrition:   { bg: '#fce7f3', color: '#9d174d' },
    Exercise:    { bg: '#d1fae5', color: '#065f46' },
    Sleep:       { bg: '#fef3c7', color: '#92400e' },
    Mindfulness: { bg: '#ede9fe', color: '#5b21b6' },
    Hygiene:     { bg: '#e0f2fe', color: '#0369a1' },
};
const getCatStyle = (cat) => CATEGORY_COLORS[cat] || { bg: '#f1f5f9', color: '#475569' };

const HealthyHabitsDashboard = () => {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedHabitId, setSelectedHabitId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openId, setOpenId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Hydration',
        imageUrl: '',
        isActive: true,
        tips: [''],
        slug: ''
    });

    const API_URL = 'http://localhost:5003/admin/community/healthy-habits';

    const fetchHabits = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setHabits(Array.isArray(data) ? data : []))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchHabits(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'title') {
                updated.slug = value.toLowerCase().trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            return updated;
        });
    };

    const handleTipChange = (index, value) => {
        const newTips = [...formData.tips];
        newTips[index] = value;
        setFormData({ ...formData, tips: newTips });
    };

    const addTipField = () => setFormData({ ...formData, tips: [...formData.tips, ''] });

    const removeTipField = (index) => {
        setFormData({ ...formData, tips: formData.tips.filter((_, i) => i !== index) });
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
                fetchHabits();
                setFormData({ title: '', description: '', category: 'Hydration', imageUrl: '', isActive: true, tips: [''], slug: '' });
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => { setSelectedHabitId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedHabitId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedHabitId}`, { method: 'DELETE' });
            if (res.ok) {
                setIsDeleteModalOpen(false);
                setSelectedHabitId(null);
                fetchHabits();
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

    const categories = ['All', ...new Set(habits.map(h => h.category).filter(Boolean))];

    const filtered = habits.filter(h => {
        const matchCat = activeCategory === 'All' || h.category === activeCategory;
        const matchSearch = h.title?.toLowerCase().includes(search.toLowerCase()) ||
                            h.description?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <>
            <style>{styles}</style>
            <div className="hh-layout">
                <Sidebar />
                <div className="hh-container">

                    {/* ── Header ── */}
                    <div className="hh-header">
                        <div className="hh-header-left">
                            <span className="hh-tag">ADMIN PANEL</span>
                            <h1 className="hh-title">Healthy Habits</h1>
                            <p className="hh-subtitle">Promote wellness and healthy lifestyle choices</p>
                        </div>
                        <div className="hh-header-right">
                            <div className="hh-search-wrap">
                                <span className="hh-search-icon">🔍</span>
                                <input
                                    className="hh-search"
                                    type="text"
                                    placeholder="Search habits..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="hh-count-pill">{filtered.length} Habits</div>
                            <button className="hh-add-btn" onClick={() => setIsModalOpen(true)}>
                                + Add Habit
                            </button>
                        </div>
                    </div>

                    {/* ── Category Tabs ── */}
                    <div className="hh-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`hh-tab ${activeCategory === cat ? 'hh-tab-active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* ── Empty State ── */}
                    {filtered.length === 0 && (
                        <div className="hh-empty">
                            <span>🌿</span>
                            <p>{search ? 'No habits match your search.' : 'No habits yet. Add the first one!'}</p>
                        </div>
                    )}

                    {/* ── Accordion List ── */}
                    {filtered.length > 0 && (
                        <div className="hh-list">
                            {filtered.map((habit, idx) => {
                                const id = habit._id || habit.id;
                                const isOpen = openId === id;
                                const catStyle = getCatStyle(habit.category);

                                return (
                                    <div
                                        key={id}
                                        className={`hh-item ${isOpen ? 'hh-item-open' : ''}`}
                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                    >
                                        <div className="hh-row" onClick={() => toggleOpen(id)}>
                                            <div className="hh-row-left">
                                                <span className="hh-index">#{idx + 1}</span>
                                                <span className="hh-habit-title">{habit.title}</span>
                                            </div>
                                            <div className="hh-row-right">
                                                {habit.category && (
                                                    <span className="hh-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                                                        {habit.category}
                                                    </span>
                                                )}
                                                <span className="hh-tips-count">
                                                    {habit.tips?.length || 0} Tips
                                                </span>
                                                <span className={`hh-status ${habit.isActive ? 'hh-status-active' : 'hh-status-inactive'}`}>
                                                    {habit.isActive ? '● Active' : '○ Inactive'}
                                                </span>
                                                <button
                                                    className="hh-delete-btn"
                                                    onClick={e => { e.stopPropagation(); confirmDelete(id); }}
                                                >
                                                    🗑
                                                </button>
                                                <span className={`hh-chevron ${isOpen ? 'hh-chevron-open' : ''}`}>›</span>
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="hh-panel">
                                                <div className="hh-panel-inner">
                                                    {habit.imageUrl && (
                                                        <img
                                                            src={habit.imageUrl}
                                                            alt={habit.title}
                                                            className="hh-panel-image"
                                                            onError={e => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <p className="hh-panel-desc">{habit.description}</p>
                                                    {habit.tips?.length > 0 && (
                                                        <div className="hh-tips-list">
                                                            <div className="hh-tips-label">Actionable Tips</div>
                                                            {habit.tips.map((tip, i) => (
                                                                <div key={i} className="hh-tip-item">
                                                                    <span className="hh-tip-dot" />
                                                                    {tip}
                                                                </div>
                                                            ))}
                                                        </div>
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

                {/* ── ADD MODAL ── */}
                {isModalOpen && (
                    <div className="hh-modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="hh-modal" onClick={e => e.stopPropagation()}>
                            <div className="hh-modal-header">
                                <div>
                                    <h2>Add Healthy Habit</h2>
                                    <p>Create a new wellness habit for the community</p>
                                </div>
                                <button className="hh-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="hh-modal-form">
                                <div className="hh-form-row">
                                    <div className="hh-form-group">
                                        <label>Habit Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Drink More Water"
                                            required
                                        />
                                    </div>
                                    <div className="hh-form-group">
                                        <label>Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange}>
                                            {Object.keys(CATEGORY_COLORS).map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="hh-form-group">
                                    <label>Slug (Auto-generated)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        readOnly
                                        className="hh-input-readonly"
                                    />
                                </div>

                                <div className="hh-form-group">
                                    <label>Image URL (optional)</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="hh-form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Briefly describe this habit and its benefits..."
                                        required
                                    />
                                </div>

                                <div className="hh-form-group">
                                    <label>Actionable Tips</label>
                                    {formData.tips.map((tip, index) => (
                                        <div key={index} className="hh-tip-input-row" style={{ marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                value={tip}
                                                onChange={e => handleTipChange(index, e.target.value)}
                                                placeholder={`Tip #${index + 1}`}
                                                required
                                            />
                                            {formData.tips.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="hh-tip-remove-btn"
                                                    onClick={() => removeTipField(index)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="hh-add-tip-btn" onClick={addTipField}>
                                        + Add Another Tip
                                    </button>
                                </div>

                                <div className="hh-form-group">
                                    <label>Status</label>
                                    <div className="hh-checkbox-row">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="isActive">Mark as Active (visible in the app)</label>
                                    </div>
                                </div>

                                <div className="hh-modal-footer">
                                    <button type="button" className="hh-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="hh-btn-save" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Habit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── DELETE MODAL ── */}
                {isDeleteModalOpen && (
                    <div className="hh-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                        <div className="hh-modal hh-modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="hh-delete-icon-wrap">🗑️</div>
                            <h2 className="hh-delete-title">Delete Habit?</h2>
                            <p className="hh-delete-msg">This action cannot be undone. The habit and all its tips will be permanently removed from the app.</p>
                            <div className="hh-modal-footer hh-footer-center">
                                <button className="hh-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Keep it</button>
                                <button className="hh-btn-danger" onClick={handleDelete} disabled={loading}>
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

export default HealthyHabitsDashboard;
