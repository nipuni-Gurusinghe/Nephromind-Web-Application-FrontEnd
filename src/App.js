import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import EventDashboard from './components/EventDashboard';
import MultimediaDashboard from './components/MultimediaDashboard';
import FAQDashboard from './components/FAQDashboard';
import FarmerSafetyTipsDashboard from './components/FarmerSafetyTipsDashboard';
import HealthyHabitsDashboard from './components/HealthyHabitsDashboard';

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
            </Routes>
        </Router>
    );
}

export default App;