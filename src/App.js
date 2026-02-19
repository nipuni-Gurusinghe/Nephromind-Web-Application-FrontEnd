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
            </Routes>
        </Router>
    );
}

export default App;