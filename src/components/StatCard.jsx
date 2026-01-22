import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, unit, icon: Icon, color }) => {
  return (
    <motion.div 
      className="glass-card stat-card"
      style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, ${color} 100%)` }}
      whileHover={{ y: -5 }}
    >
      <div className="stat-card-header">
        <div className="icon-box">
          <Icon size={24} color="#fff" />
        </div>
        <span className="trend-badge">LIVE</span>
      </div>
      
      <h3 className="stat-value">
        {value} <span className="stat-unit">{unit}</span>
      </h3>
      <p className="stat-title">{title}</p>
    </motion.div>
  );
};

export default StatCard;