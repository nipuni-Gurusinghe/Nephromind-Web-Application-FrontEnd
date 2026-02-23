import React, { useState } from 'react';
import Sidebar from './common/Sidebar'; // Import the sidebar from the common folder
import AddDoctorModal from './AddDoctorModal'; 
import './AddDoctor.css';

const AddDoctor = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="dashboard-wrapper">
            {/* 1. Sidebar on the left */}
            <Sidebar />

            {/* 2. Main content on the right */}
            <div className="add-doctor-page">
                <div className="header-section">
                    <h1>Medical Staff Management</h1>
                    <p>Register new doctors to the Nephromind portal.</p>
                </div>

                <div className="action-container">
                    <div className="doctor-card-ui">
                        <div className="icon-circle">👨‍⚕️</div>
                        <h3>New Registration</h3>
                        <p>Enter doctor details including hospital and specialty.</p>
                        <button 
                            className="main-add-btn" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Add Doctor
                        </button>
                    </div>
                </div>

                {/* Popup Window */}
                <AddDoctorModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </div>
        </div>
    );
};

export default AddDoctor;