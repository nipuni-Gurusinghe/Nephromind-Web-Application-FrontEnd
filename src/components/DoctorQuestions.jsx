import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    // REMOVED: const loggedInDoctorId = localStorage.getItem('doctorId'); 
    // This was causing the warning because it wasn't being used here.

    useEffect(() => {
        fetchPendingQuestions();
    }, []);

    const fetchPendingQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5003/admin/doctor/questions/pending');
            setQuestions(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const submitAnswer = async (questionId) => {
        // We retrieve it here, exactly when the button is clicked.
        const loggedInDoctorId = localStorage.getItem('doctorId'); 
        const answerText = answers[questionId];

        if (!loggedInDoctorId) {
            return alert("Error: No doctor session found. Please log out and log in again.");
        }

        if (!answerText) return alert("Please enter an answer first.");

        try {
            await axios.patch(`http://localhost:5003/admin/doctor/questions/answer/${questionId}`, {
                doctorId: loggedInDoctorId, 
                answerText: answerText
            });
            
            alert("Answer submitted successfully!");
            fetchPendingQuestions(); 
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit answer.");
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Questions...</div>;

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
                🩺 Pending Patient Consultations
            </h2>
            
            {questions.length === 0 ? (
                <p>No pending questions found in the database.</p>
            ) : (
                <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Patient Name</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Question</th>
                                <th style={{ padding: '15px', width: '30%' }}>Medical Advice</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{q.name}</td>
                                    <td style={{ padding: '15px' }}>{q.category}</td>
                                    <td style={{ padding: '15px' }}>{q.question}</td>
                                    <td style={{ padding: '15px' }}>
                                        <textarea 
                                            rows="3" 
                                            style={{ width: '100%', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
                                            placeholder="Write your advice..."
                                            value={answers[q.id] || ''} 
                                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                                        />
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button 
                                            onClick={() => submitAnswer(q.id)}
                                            style={{ backgroundColor: '#2c3e50', color: 'white', padding: '10px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                        >
                                            Send Advice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DoctorQuestions;