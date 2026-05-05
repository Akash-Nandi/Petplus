import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './components/firebase'; // Import your Firebase auth instance

// Component Imports
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
  const [isLoading, setIsLoading] = useState(true); // Prevents flickering on reload

  // --- NEW: Firebase Authentication Listener ---
  useEffect(() => {
    // This listens for login/logout events from Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is logged out
      }
      setIsLoading(false); // Stop the loading screen
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // --- NEW: Secure Logout Function ---
  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsAuthenticated(false);
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const Layout = ({ children }) => (
    <div className="app-container">
      {/* Pass the secure logout function to the Sidebar */}
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );

  // Show a blank screen or a loading spinner while checking Firebase Auth status
  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading PetPulse...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Login Route: Passes a manual override if you still want to fake login temporarily */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
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