import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarDR from './common/SidebarDR';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap');

.dq-layout {
    display: flex;
    background: #f0f4f8;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
}

.dq-container {
    flex: 1;
    margin-left: 300px;
    padding: 40px;
    width: calc(100% - 300px);
}

/* ── Header ── */
.dq-header {
    margin-bottom: 28px;
}
.dq-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #8b5cf6;
    text-transform: uppercase;
}
.dq-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #1e293b;
    margin: 4px 0 0 0;
    line-height: 1.2;
}
.dq-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0 0; }

/* ── Empty ── */
.dq-empty {
    text-align: center;
    padding: 80px;
    color: #94a3b8;
    font-size: 15px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.dq-empty span { font-size: 48px; display: block; margin-bottom: 12px; }

/* ── Loading ── */
.dq-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 15px;
    color: #94a3b8;
}

/* ── Cards ── */
.dq-list { display: flex; flex-direction: column; gap: 12px; }

.dq-card {
    background: white;
    border-radius: 14px;
    padding: 22px 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1.5px solid transparent;
    transition: box-shadow 0.2s, border-color 0.2s;
    animation: dq-fadeup 0.35s ease both;
}
.dq-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.09);
    border-color: rgba(139,92,246,0.1);
}

@keyframes dq-fadeup {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.dq-card-top {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.dq-patient-badge {
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

.dq-category-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 50px;
    background: #dbeafe;
    color: #1d4ed8;
    white-space: nowrap;
    flex-shrink: 0;
}

.dq-question-text {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.5;
    flex: 1;
}

.dq-card-bottom {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.dq-textarea {
    flex: 1;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    outline: none;
    background: #f8fafc;
    resize: none;
    transition: border 0.2s, box-shadow 0.2s;
    line-height: 1.5;
}
.dq-textarea:focus {
    border-color: #8b5cf6;
    background: white;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
.dq-textarea::placeholder { color: #cbd5e1; }

.dq-send-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: flex-end;
}
.dq-send-btn:hover { background: #7c3aed; }
.dq-send-btn:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 1024px) {
    .dq-container { margin-left: 80px; width: calc(100% - 80px); padding: 24px; }
}
@media (max-width: 768px) {
    .dq-card-bottom { flex-direction: column; align-items: stretch; }
    .dq-send-btn { width: 100%; }
}
`;

const DoctorQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState({});

    useEffect(() => {
        fetchPendingQuestions();
    }, []);

    const fetchPendingQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5003/admin/doctor/questions/pending');
            setQuestions(response.data.data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const submitAnswer = async (questionId) => {
        const loggedInDoctorId = localStorage.getItem('doctorId');
        const answerText = answers[questionId];

        if (!loggedInDoctorId) return alert('Error: No doctor session found. Please log out and log in again.');
        if (!answerText) return alert('Please enter an answer first.');

        setSubmitting(prev => ({ ...prev, [questionId]: true }));
        try {
            await axios.patch(`http://localhost:5003/admin/doctor/questions/answer/${questionId}`, {
                doctorId: loggedInDoctorId,
                answerText
            });
            fetchPendingQuestions();
            setAnswers(prev => ({ ...prev, [questionId]: '' }));
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit answer.');
        } finally {
            setSubmitting(prev => ({ ...prev, [questionId]: false }));
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="dq-layout">
                <SidebarDR />
                <div className="dq-container">

                    {/* ── Header ── */}
                    <div className="dq-header">
                        <span className="dq-tag">MEDICAL PANEL</span>
                        <h1 className="dq-title">Pending Consultations</h1>
                        <p className="dq-subtitle">Review and respond to patient questions</p>
                    </div>

                    {/* ── Loading ── */}
                    {loading && (
                        <div className="dq-loading">Loading questions...</div>
                    )}

                    {/* ── Empty ── */}
                    {!loading && questions.length === 0 && (
                        <div className="dq-empty">
                            <span>📭</span>
                            <p>No pending questions at the moment.</p>
                        </div>
                    )}

                    {/* ── Question Cards ── */}
                    {!loading && questions.length > 0 && (
                        <div className="dq-list">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className="dq-card"
                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                >
                                    <div className="dq-card-top">
                                        <span className="dq-patient-badge">👤 {q.name}</span>
                                        <span className="dq-category-badge">{q.category}</span>
                                        <span className="dq-question-text">{q.question}</span>
                                    </div>
                                    <div className="dq-card-bottom">
                                        <textarea
                                            className="dq-textarea"
                                            rows="3"
                                            placeholder="Write your medical advice here..."
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                                        />
                                        <button
                                            className="dq-send-btn"
                                            onClick={() => submitAnswer(q.id)}
                                            disabled={submitting[q.id]}
                                        >
                                            {submitting[q.id] ? 'Sending...' : 'Send Advice'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DoctorQuestions;
