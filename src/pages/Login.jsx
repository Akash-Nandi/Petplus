import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div style={{ 
        position: 'absolute', width: '500px', height: '500px', 
        background: 'purple', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2 
      }}></div>

      <motion.div 
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '3rem', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>PetPlus</h1>
        <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '2rem' }}>
          {isRegistering ? 'Create your account' : 'Smart Pet Monitoring'}
        </p>

        <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          
          {/* Animated Name Field for Registration */}
          <AnimatePresence>
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
            <input type="email" placeholder="user@petplus.com" required />
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button className="btn-primary" style={{ marginTop: '1.5rem' }}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ opacity: 0.7 }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#a78bfa', 
              cursor: 'pointer', 
              marginLeft: '5px',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;