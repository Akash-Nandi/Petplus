import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DietLog from './components/Dietlog';
import Community from './pages/Community';
import History from './pages/History';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const Layout = ({ children }) => (
    <div className="app-container">
      <Sidebar onLogout={() => setIsAuthenticated(false)} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <Layout><History /></Layout> : <Navigate to="/login" />} />
        <Route path="/community" element={isAuthenticated ? <Layout><Community /></Layout> : <Navigate to="/login" />} />
        <Route path="/diet" element={isAuthenticated ? <Layout><DietLog /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;