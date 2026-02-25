import React, { useEffect, useState } from 'react';
import Sidebar from './common/Sidebar';
import './MultimediaDashboard.css';

const TYPE_CONFIG = {
    video:    { icon: '▶', color: '#ef4444', bg: '#fee2e2', label: 'Video' },
    audio:    { icon: '🎵', color: '#8b5cf6', bg: '#ede9fe', label: 'Audio' },
    document: { icon: '📄', color: '#3b82f6', bg: '#dbeafe', label: 'Document' },
};
const getTypeConfig = (type) => TYPE_CONFIG[type?.toLowerCase()] || { icon: '📁', color: '#64748b', bg: '#f1f5f9', label: type || 'Media' };

const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
};

const getThumbnail = (item) => {
    if (item.thumbnail) return item.thumbnail;
    const ytId = getYouTubeId(item.url);
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return null;
};

const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const d = new Date(ts);
    return d.toString() === 'Invalid Date' ? 'N/A' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const MultimediaDashboard = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [playingId, setPlayingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', type: 'video', category: 'Education',
        url: '', description: '', duration: '', isActive: true, plays: 0
    });

    const API_URL = 'http://localhost:5003/admin/community/multimedia';

    const fetchMultimedia = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setMediaItems(Array.isArray(data) ? data : []))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => { fetchMultimedia(); }, []);

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
                body: JSON.stringify({ ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
            });
            if (response.ok) {
                setIsModalOpen(false);
                fetchMultimedia();
                setFormData({ title: '', type: 'video', category: 'Education', url: '', description: '', duration: '', isActive: true, plays: 0 });
            }
        } catch (error) {
            console.error('Error adding media:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => { setSelectedMediaId(id); setIsDeleteModalOpen(true); };

    const handleDelete = async () => {
        if (!selectedMediaId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${selectedMediaId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                setIsDeleteModalOpen(false);
                setSelectedMediaId(null);
                fetchMultimedia();
            } else {
                const errData = await response.json();
                alert(`Delete failed: ${errData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    const types = ['All', ...new Set(mediaItems.map(m => m.type?.toLowerCase()).filter(Boolean))];
    const filtered = mediaItems.filter(m => {
        const matchType = activeType === 'All' || m.type?.toLowerCase() === activeType;
        const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <div className="md-layout">
            <Sidebar />
            <div className="md-container">

                {/* Header */}
                <div className="md-header">
                    <div className="md-header-left">
                        <span className="md-tag">ADMIN PANEL</span>
                        <h1 className="md-title">Multimedia Management</h1>
                        <p className="md-subtitle">Manage audio, video and document resources</p>
                    </div>
                    <div className="md-header-right">
                        <div className="md-search-wrap">
                            <span className="md-search-icon">🔍</span>
                            <input
                                className="md-search"
                                type="text"
                                placeholder="Search media..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="md-count-pill">{filtered.length} Items</div>
                        <button className="md-add-btn" onClick={() => setIsModalOpen(true)}>
                            + Add Multimedia
                        </button>
                    </div>
                </div>

                {/* Type Filter Tabs */}
                <div className="md-tabs">
                    {types.map(type => (
                        <button
                            key={type}
                            className={`md-tab ${activeType === type ? 'md-tab-active' : ''}`}
                            onClick={() => setActiveType(type)}
                        >
                            {type === 'All' ? 'All' : (TYPE_CONFIG[type]?.icon + ' ' + (TYPE_CONFIG[type]?.label || type))}
                        </button>
                    ))}
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                    <div className="md-empty">
                        <span>🎬</span>
                        <p>{search ? 'No media matches your search.' : 'No media content yet. Add some!'}</p>
                    </div>
                )}

                {/* Media Grid */}
                {filtered.length > 0 && (
                    <div className="md-grid">
                        {filtered.map((item, idx) => {
                            const id = item._id || item.id;
                            const typeConf = getTypeConfig(item.type);
                            const thumbnail = getThumbnail(item);
                            const ytId = getYouTubeId(item.url);
                            const isPlaying = playingId === id;

                            return (
                                <div className="md-card" key={id} style={{ animationDelay: `${idx * 0.05}s` }}>
                                    {/* Media Preview */}
                                    <div className="md-media-area">
                                        {isPlaying && ytId ? (
                                            <iframe
                                                className="md-iframe"
                                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                title={item.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : thumbnail ? (
                                            <div className="md-thumb-wrap" onClick={() => ytId && setPlayingId(prev => prev === id ? null : id)}>
                                                <img src={thumbnail} alt={item.title} className="md-thumbnail" />
                                                {ytId && (
                                                    <div className="md-play-overlay">
                                                        <div className="md-play-btn">▶</div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="md-placeholder" style={{ background: typeConf.bg }}>
                                                <span className="md-placeholder-icon" style={{ color: typeConf.color }}>{typeConf.icon}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="md-card-body">
                                        <div className="md-card-top-row">
                                            <span className="md-type-badge" style={{ background: typeConf.bg, color: typeConf.color }}>
                                                {typeConf.icon} {typeConf.label}
                                            </span>
                                            <span className={`md-status ${item.isActive ? 'md-status-active' : 'md-status-inactive'}`}>
                                                {item.isActive ? '● Active' : '○ Inactive'}
                                            </span>
                                        </div>
                                        <h3 className="md-card-title">{item.title}</h3>
                                        {item.description && <p className="md-card-desc">{item.description}</p>}
                                        <div className="md-card-meta">
                                            {item.category && <span>🏷 {item.category}</span>}
                                            {item.duration && <span>⏱ {item.duration}</span>}
                                        </div>
                                        <div className="md-card-footer">
                                            <span className="md-card-date">🗓 {formatTimestamp(item.createdAt)}</span>
                                            <div className="md-card-actions">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="md-view-btn">Open ↗</a>
                                                <button className="md-delete-btn" onClick={() => confirmDelete(id)}>🗑 Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ADD MODAL */}
            {isModalOpen && (
                <div className="md-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="md-modal" onClick={e => e.stopPropagation()}>
                        <div className="md-modal-header">
                            <div>
                                <h2>Add New Multimedia</h2>
                                <p>Add a new audio, video or document resource</p>
                            </div>
                            <button className="md-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="md-modal-form">
                            <div className="md-form-row">
                                <div className="md-form-group">
                                    <label>Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Kidney Health Basics" required />
                                </div>
                                <div className="md-form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="document">Document</option>
                                    </select>
                                </div>
                            </div>
                            <div className="md-form-group">
                                <label>URL (Source Link)</label>
                                <input type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." required />
                            </div>
                            <div className="md-form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Brief description..."></textarea>
                            </div>
                            <div className="md-form-row">
                                <div className="md-form-group">
                                    <label>Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Education" />
                                </div>
                                <div className="md-form-group">
                                    <label>Duration</label>
                                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="00:00" />
                                </div>
                            </div>
                            <div className="md-modal-footer">
                                <button type="button" className="md-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="md-btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="md-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="md-modal md-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="md-delete-icon-wrap">🗑️</div>
                        <h2 className="md-delete-title">Delete Media?</h2>
                        <p className="md-delete-msg">This action cannot be undone. The content will be permanently removed.</p>
                        <div className="md-modal-footer md-modal-footer-center">
                            <button className="md-btn-cancel" onClick={() => setIsDeleteModalOpen(false)} disabled={loading}>Keep it</button>
                            <button className="md-btn-danger" onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultimediaDashboard;
