import React, { useState, useEffect } from 'react';
import SidebarDR from './common/SidebarDR';
import './MarkAvailability.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5003';

const DEFAULT_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
];

const MarkAvailability = () => {
    const doctorId = localStorage.getItem('doctorId') || '';
    const today    = new Date().toISOString().split('T')[0];

    const [doctorName, setDoctorName] = useState('');
    const [hospital, setHospital]     = useState('');
    const [date, setDate]               = useState(today);
    const [isAvailable, setIsAvailable] = useState(true);
    const [slots, setSlots]             = useState(
        DEFAULT_SLOTS.reduce((acc, s) => ({ ...acc, [s]: 5 }), {})
    );
    const [customSlot, setCustomSlot] = useState('');
    const [loading, setLoading]       = useState(false);
    const [fetching, setFetching]     = useState(true);
    const [message, setMessage]       = useState(null);

    useEffect(() => {
        if (!doctorId) { setFetching(false); return; }

        fetch(`${API_BASE}/admin/doctor/profile/${doctorId}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'success' && json.data) {
                    const name = json.data.username || json.data.name || json.data.doctorName || '';
                    const hosp = json.data.hospital || json.data.hospitalName || '';
                    setDoctorName(name);
                    setHospital(hosp);
                    localStorage.setItem('doctorName', name);
                    localStorage.setItem('hospital', hosp);
                }
            })
            .catch(() => {
                setDoctorName(localStorage.getItem('doctorName') || '');
                setHospital(localStorage.getItem('hospital') || '');
            })
            .then(() => {
                return fetch(`${API_BASE}/admin/doctor/availability/${doctorId}`)
                    .then(res => res.json())
                    .then(json => {
                        if (json.status === 'success' && json.data) {
                            const d = json.data;
                            setIsAvailable(d.isAvailable ?? true);
                            if (d.slots && Object.keys(d.slots).length > 0) setSlots(d.slots);
                            if (d.date) setDate(d.date.slice(0, 10));
                        }
                    })
                    .catch(() => {});
            })
            .finally(() => setFetching(false));
    }, [doctorId]);

    const handleSlotChange = (slotName, value) => {
        const num = parseInt(value, 10);
        setSlots(prev => ({ ...prev, [slotName]: isNaN(num) ? 1 : Math.max(1, num) }));
    };

    const removeSlot = (slotName) => {
        setSlots(prev => { const c = { ...prev }; delete c[slotName]; return c; });
    };

    const addCustomSlot = () => {
        const trimmed = customSlot.trim();
        if (!trimmed) return;
        if (slots[trimmed] !== undefined) {
            setMessage({ type: 'error', text: `Slot "${trimmed}" already exists.` });
            return;
        }
        setSlots(prev => ({ ...prev, [trimmed]: 5 }));
        setCustomSlot('');
    };

    const handleToggle = async (val) => {
        setIsAvailable(val);
        if (!doctorId) return;
        try {
            const res = await fetch(`${API_BASE}/admin/doctor/availability/${doctorId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: val }),
            });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message);
            setMessage({ type: 'success', text: `Availability turned ${val ? 'ON' : 'OFF'}.` });
        } catch (err) {
            setMessage({ type: 'error', text: `Toggle failed: ${err.message}` });
        }
    };

    const handleSave = async () => {
        if (!doctorId || !doctorName || !hospital) {
            setMessage({ type: 'error', text: 'Missing profile data. Please refresh.' });
            return;
        }
        if (Object.keys(slots).length === 0) {
            setMessage({ type: 'error', text: 'Please add at least one time slot.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_BASE}/admin/doctor/availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId,
                    doctorName,
                    hospitalName: hospital,
                    date,
                    isAvailable,
                    slots,
                }),
            });
            const json = await res.json();
            if (!res.ok || json.status !== 'success') throw new Error(json.message);
            setMessage({ type: 'success', text: '✅ Availability saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: `❌ Save failed: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="av-layout">
                <SidebarDR />
                <main className="av-main">
                    <div className="av-loading">Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="av-layout">
            <SidebarDR />
            <main className="av-main">
                <div className="av-container">
                    {/* Header */}
                    <div className="av-header">
                        <div className="av-header-left">
                            <h1 className="av-title">Mark Availability</h1>
                            <p className="av-subtitle">Set your available date and time slots for patient bookings.</p>
                        </div>
                        <div className="av-toggle-row">
                            <span className="av-toggle-label">Available</span>
                            <button
                                className={`av-toggle-btn ${isAvailable ? 'on' : 'off'}`}
                                onClick={() => handleToggle(!isAvailable)}
                            >
                                {isAvailable ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`av-message ${message.type}`}>{message.text}</div>
                    )}

                    {/* Date Card */}
                    <div className="av-card">
                        <h2 className="av-section-title">📅 Select Date</h2>
                        <input
                            type="date"
                            className="av-date-input"
                            value={date}
                            min={today}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    {/* Slots Card */}
                    <div className="av-card">
                        <h2 className="av-section-title">⏰ Time Slots & Max Patients</h2>
                        <p className="av-section-sub">Set how many patients can book each slot.</p>

                        <div className="av-slots-list">
                            {Object.entries(slots).map(([slotName, maxPat]) => (
                                <div className="av-slot-row" key={slotName}>
                                    <span className="av-slot-name">{slotName}</span>
                                    <div className="av-slot-right">
                                        <label className="av-slot-cap-label">Max patients</label>
                                        <input
                                            type="number"
                                            className="av-slot-input"
                                            min={1}
                                            value={maxPat}
                                            onChange={e => handleSlotChange(slotName, e.target.value)}
                                        />
                                        <button className="av-remove-btn" onClick={() => removeSlot(slotName)}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="av-add-slot-row">
                            <input
                                type="text"
                                className="av-custom-input"
                                placeholder="e.g. 02:00 PM - 03:00 PM"
                                value={customSlot}
                                onChange={e => setCustomSlot(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addCustomSlot()}
                            />
                            <button className="av-add-btn" onClick={addCustomSlot}>+ Add Slot</button>
                        </div>
                    </div>

                    <button className="av-save-btn" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : '💾 Save Availability'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MarkAvailability;