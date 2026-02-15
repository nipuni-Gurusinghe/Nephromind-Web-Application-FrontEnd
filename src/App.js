import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import EventDashboard from './components/EventDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/events" element={<EventDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;