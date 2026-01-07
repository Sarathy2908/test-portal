import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserTest from './components/UserTest';
import AdminDashboard from './components/AdminDashboard';
import Setup from './components/Setup';
import './App.css';

function Home() {
  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>📝 Test Portal</h1>
          <p>Choose your role to continue</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/test" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary">
              👤 Take Test (Student)
            </button>
          </Link>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">
              🎯 Admin Dashboard
            </button>
          </Link>
          <Link to="/setup" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">
              🔧 Setup (First Time)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<UserTest />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </Router>
  );
}

export default App;
