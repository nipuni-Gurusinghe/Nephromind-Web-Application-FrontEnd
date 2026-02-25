import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import EventDashboard from './components/EventDashboard';
import MultimediaDashboard from './components/MultimediaDashboard';
import FAQDashboard from './components/FAQDashboard';
import FarmerSafetyTipsDashboard from './components/FarmerSafetyTipsDashboard';
import HealthyHabitsDashboard from './components/HealthyHabitsDashboard';
import SafeWaterGuidesDashboard from './components/SafeWaterGuidesDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorEvents from './components/DoctorEvents';
import DoctorFAQ from './components/DoctorFAQ';
import DoctorMultimedia from './components/DoctorMultimedia';
import DoctorQuestions from './components/DoctorQuestions';
import AddDoctor from './components/AddDoctor';
import DoctorBookings from './components/DoctorBookings';
import PatientHistory from './components/PatientHistory';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/events" element={<EventDashboard />} />
                <Route path="/multimedia" element={<MultimediaDashboard />} />
                <Route path="/faq" element={<FAQDashboard />} />
                <Route path="/farmer-safety" element={<FarmerSafetyTipsDashboard />} />
                <Route path="/healthy-habits" element={<HealthyHabitsDashboard />} />
                <Route path="/safe-water-guide" element={<SafeWaterGuidesDashboard />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-events" element={<DoctorEvents />} />
                <Route path="/doctor-faq" element={<DoctorFAQ />} />
                <Route path="/doctor-multimedia" element={<DoctorMultimedia />} />
                <Route path="/doctor-questions" element={<DoctorQuestions />} />
                <Route path="/doctor-handle" element={<AddDoctor />} />
                <Route path="/doctor-bookings" element={<DoctorBookings />} />
                <Route path="/patient-history/:patientId" element={<PatientHistory />} />
            </Routes>
        </Router>
    );
}

export default App;