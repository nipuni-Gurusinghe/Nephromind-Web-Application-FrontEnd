import React, { useState } from 'react';
import axios from 'axios';
import './AddDoctorModal.css';

const AddDoctorModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '', name: '', specialistArea: '', area: '', 
        hospital: '', phone: '', password: ''
    });

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
        "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
        "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", 
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ];

    const hospitals = [
        "Colombo East Base Hospital Mulleriyawa",
  "National Hospital of Sri Lanka",
  "Wellawaya Base Hospital",
  "Karapitiya Teaching Hospital",
  "National Institute for Nephrology Dialysis & Transplantation (NINDT)",
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5003/admin/doctor/register', formData);
            alert("Doctor Registered Successfully!");
            onClose();
        } catch (err) {
            alert("Failed to register doctor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Register Doctor</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    
                    <select required onChange={(e) => setFormData({...formData, area: e.target.value})}>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select required onChange={(e) => setFormData({...formData, hospital: e.target.value})}>
                        <option value="">Select Hospital</option>
                        {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>

                    <input type="text" placeholder="Specialist Area" required onChange={(e) => setFormData({...formData, specialistArea: e.target.value})} />
                    <input type="text" placeholder="Phone" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Register"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDoctorModal;