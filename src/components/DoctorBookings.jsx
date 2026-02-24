import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarDR from './common/SidebarDR';
import './DoctorBookings.css';

const DoctorBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const doctorId = localStorage.getItem('doctorId');
    const navigate = useNavigate();

    const fetchBookings = useCallback(async () => {
        if (!doctorId) return;
        try {
            const res = await axios.get(`http://localhost:5003/admin/doctor/appointments/${doctorId}`);
            setBookings(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleComplete = async (appointmentId) => {
        if (window.confirm("Mark this appointment as completed?")) {
            try {
                await axios.patch(`http://localhost:5003/admin/doctor/appointments/status/${appointmentId}`, {
                    status: 'Completed'
                });
                fetchBookings();
            } catch (err) {
                console.error("Update Error:", err);
                alert("Failed to update status");
            }
        }
    };

    // Navigate to patient history page, passing patientId in URL and name in state
    const handleViewHistory = (patientId, patientName) => {
        navigate(`/patient-history/${patientId}`, { state: { patientName } });
    };

    return (
        <div className="doctor-bookings-layout">
            <SidebarDR />
            <div className="booking-container">
                <div className="booking-header">
                    <h2>My Appointments</h2>
                </div>

                <div className="table-wrapper">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Status</th>
                                <th>View History</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                            ) : bookings.length > 0 ? (
                                bookings.map((book) => (
                                    <tr key={book.id}>
                                        <td className="patient-name">{book.patientName}</td>
                                        <td>{book.date}</td>
                                        <td>{book.timeSlot}</td>
                                        <td>
                                            <span className={`status-badge status-${book.status?.toLowerCase()}`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td>
                                            {/* NEW: View Patient History Button */}
                                            <button
                                                className="btn-history"
                                                onClick={() => handleViewHistory(book.patientId, book.patientName)}
                                            >
                                                📋 View History
                                            </button>
                                        </td>
                                        <td>
                                            {book.status?.toLowerCase() === 'pending' && (
                                                <button
                                                    className="btn-complete"
                                                    onClick={() => handleComplete(book.id)}
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No appointments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorBookings;
