import React, { useEffect, useState } from 'react';
import SidebarDR from './common/SidebarDR';
import './DoctorMultimedia.css';

const TYPE_CONFIG = {
    video:    { icon: '▶', color: '#ef4444', bg: '#fee2e2', label: 'Video' },
    audio:    { icon: '🎵', color: '#8b5cf6', bg: '#ede9fe', label: 'Audio' },
    document: { icon: '📄', color: '#3b82f6', bg: '#dbeafe', label: 'Document' },
    image:    { icon: '🖼', color: '#10b981', bg: '#d1fae5', label: 'Image' },
};

const getTypeConfig = (type) => TYPE_CONFIG[type?.toLowerCase()] || { icon: '📁', color: '#64748b', bg: '#f1f5f9', label: type || 'Media' };

// Extract YouTube video ID from various URL formats
const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
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

const DoctorMultimedia = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [playingId, setPlayingId] = useState(null);

    const API_URL = 'http://localhost:5003/admin/doctor/community/multimedia';

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => { setMedia(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(err => { console.error('Fetch error:', err); setLoading(false); });
    }, []);

    const types = ['All', ...new Set(media.map(m => m.type?.toLowerCase()).filter(Boolean))];

    const filtered = media.filter(m => {
        const matchType = activeType === 'All' || m.type?.toLowerCase() === activeType;
        const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const handlePlay = (id) => setPlayingId(prev => prev === id ? null : id);

    return (
        <div className="dm-layout">
            <SidebarDR />
            <div className="dm-container">

                {/* Header */}
                <div className="dm-header">
                    <div className="dm-header-left">
                        <span className="dm-tag">MEDICAL PANEL</span>
                        <h1 className="dm-title">Multimedia Gallery</h1>
                        <p className="dm-subtitle">Educational videos and awareness materials for community health</p>
                    </div>
                    <div className="dm-header-right">
                        <div className="dm-search-wrap">
                            <span className="dm-search-icon">🔍</span>
                            <input
                                className="dm-search"
                                type="text"
                                placeholder="Search media..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="dm-count-pill">{filtered.length} Items</div>
                    </div>
                </div>

                {/* Type Filter Tabs */}
                <div className="dm-tabs">
                    {types.map(type => (
                        <button
                            key={type}
                            className={`dm-tab ${activeType === type ? 'dm-tab-active' : ''}`}
                            onClick={() => setActiveType(type)}
                        >
                            {type === 'All' ? 'All' : (TYPE_CONFIG[type]?.icon + ' ' + (TYPE_CONFIG[type]?.label || type))}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="dm-loading">
                        <div className="dm-spinner"></div>
                        <p>Loading media...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="dm-empty">
                        <span>🎬</span>
                        <p>{search ? 'No media matches your search.' : 'No media content available.'}</p>
                    </div>
                )}

                {/* Media Grid */}
                {!loading && filtered.length > 0 && (
                    <div className="dm-grid">
                        {filtered.map((item, idx) => {
                            const id = item._id || item.id;
                            const typeConf = getTypeConfig(item.type);
                            const thumbnail = getThumbnail(item);
                            const ytId = getYouTubeId(item.url);
                            const isPlaying = playingId === id;

                            return (
                                <div
                                    key={id}
                                    className="dm-card"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    {/* Media Preview Area */}
                                    <div className="dm-media-area">
                                        {/* If YouTube video is playing, show embed */}
                                        {isPlaying && ytId ? (
                                            <iframe
                                                className="dm-iframe"
                                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                title={item.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : thumbnail ? (
                                            /* Thumbnail with play button overlay */
                                            <div className="dm-thumb-wrap" onClick={() => ytId && handlePlay(id)}>
                                                <img src={thumbnail} alt={item.title} className="dm-thumbnail" />
                                                {ytId && (
                                                    <div className="dm-play-overlay">
                                                        <div className="dm-play-btn">▶</div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* No thumbnail - show icon placeholder */
                                            <div className="dm-placeholder" style={{ background: typeConf.bg }}>
                                                <span className="dm-placeholder-icon" style={{ color: typeConf.color }}>
                                                    {typeConf.icon}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="dm-card-body">
                                        <div className="dm-card-top-row">
                                            <span
                                                className="dm-type-badge"
                                                style={{ background: typeConf.bg, color: typeConf.color }}
                                            >
                                                {typeConf.icon} {typeConf.label}
                                            </span>
                                            <span className={`dm-status ${item.isActive ? 'dm-status-active' : 'dm-status-inactive'}`}>
                                                {item.isActive ? '● Active' : '○ Inactive'}
                                            </span>
                                        </div>

                                        <h3 className="dm-card-title">{item.title}</h3>

                                        {item.description && (
                                            <p className="dm-card-desc">{item.description}</p>
                                        )}

                                        <div className="dm-card-footer">
                                            <span className="dm-card-date">🗓 {formatTimestamp(item.createdAt)}</span>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="dm-view-btn"
                                            >
                                                Open ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorMultimedia;
