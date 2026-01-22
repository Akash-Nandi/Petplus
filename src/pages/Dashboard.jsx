import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Activity, Droplets, Zap, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartSection from '../components/ChartSection';
import AppointmentCard from '../components/AppointmentCard';
import { generateLiveStats, getHistoryData } from '../utils/mlSimulation';

const Dashboard = () => {
  const [selectedAnimal, setSelectedAnimal] = useState('dog');
  const [stats, setStats] = useState({ heartRate: 0, temp: 0, spo2: 0, activity: 0 });
  const [alert, setAlert] = useState(null);
  const [history] = useState(getHistoryData());
  const [suggestion, setSuggestion] = useState('');

  // --- Logic to Generate AI Advice based on Animal & Vitals ---
  const generateSuggestion = (animal, currentStats) => {
    // Critical Conditions
    if (currentStats.temp > 39.5) {
      return `Critical Heat Warning: Apply cool (not ice) water to ${animal}'s paws/hooves immediately. Move to a shaded, ventilated area and provide fresh water.`;
    }
    if (currentStats.heartRate > 130) {
      return `High Stress Detected: Reduce ${animal}'s physical activity. Check for environmental stressors or pain. Keep the environment calm.`;
    }
    if (currentStats.spo2 < 92) {
      return `Hypoxia Alert: Oxygen levels are low. Check for airway obstructions or respiratory distress. Consult a vet immediately.`;
    }
    
    // Healthy Advice (Randomized for variety)
    const healthyTips = [
      `Vitals are optimal. Great day for a walk or light exercise!`,
      `${animal.charAt(0).toUpperCase() + animal.slice(1)} is in great shape. Maintain current hydration and feeding schedule.`,
      `Perfect condition. Consider a grooming session today to maintain hygiene.`,
      `All systems normal. Good time for training or social interaction.`
    ];
    return healthyTips[Math.floor(Math.random() * healthyTips.length)];
  };

  useEffect(() => {
    const updateStats = () => {
      const data = generateLiveStats(selectedAnimal);
      setStats(data);
      
      // Update Alert & Suggestion
      if (data.anomaly) {
        setAlert(data.anomaly);
        setSuggestion(data.anomaly.message + " Follow emergency protocols."); // Fallback if anomaly has message
      } else {
        setAlert(null);
        // Generate dynamic advice if no critical anomaly
        setSuggestion(generateSuggestion(selectedAnimal, data));
      }
    };

    updateStats(); 
    const interval = setInterval(updateStats, 3000); 

    return () => clearInterval(interval);
  }, [selectedAnimal]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Dashboard</h1>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Monitoring Vitals: <b>{selectedAnimal.toUpperCase()}</b></p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select 
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(23, 29, 60, 0.9)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '1rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="dog">🐶 Dog</option>
            <option value="cat">🐱 Cat</option>
            <option value="cow">🐮 Cow</option>
            <option value="goat">🐐 Goat</option>
          </select>

          <div className="status-badge">
            <div className="pulse-dot"></div>
            <span>Online</span>
          </div>
        </div>
      </header>

      {/* --- AI Health Analysis & Alert Section --- */}
      <div className="glass-card" style={{ 
        marginBottom: '25px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        background: alert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
        border: alert ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
        transition: 'all 0.5s ease'
      }}>
        {/* Icon Box */}
        <div style={{ 
          background: alert ? '#ef4444' : '#10b981', 
          padding: '15px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: alert ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 0 20px rgba(16, 185, 129, 0.4)'
        }}>
          {alert ? <AlertTriangle size={32} color="white" /> : <Brain size={32} color="white" />}
        </div>

        {/* Text Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: alert ? '#fca5a5' : '#6ee7b7' }}>
              {alert ? 'Anomaly Detected' : 'AI Health Insight'}
            </h3>
            {!alert && <CheckCircle size={16} color="#6ee7b7" />}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
             {/* Suggestion Text */}
             <p style={{ margin: 0, opacity: 0.9, lineHeight: '1.5', fontSize: '1rem' }}>
               <Zap size={14} style={{ display: 'inline', marginRight: '5px', fill: 'gold', color: 'gold' }} />
               {alert ? (
                 <span><strong>Action Required:</strong> {suggestion}</span>
               ) : (
                 <span><strong>Suggestion:</strong> {suggestion}</span>
               )}
             </p>
          </div>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard 
          title="Heart Rate" 
          value={stats.heartRate} 
          unit="BPM" 
          icon={Heart} 
          color="rgba(239, 68, 68, 0.2)" 
        />
        <StatCard 
          title="Temperature" 
          value={stats.temp} 
          unit="°C" 
          icon={Thermometer} 
          color="rgba(59, 130, 246, 0.2)" 
        />
        <StatCard 
          title="Blood Oxygen" 
          value={stats.spo2} 
          unit="%" 
          icon={Droplets} 
          color="rgba(56, 189, 248, 0.2)" 
        />
        <StatCard 
          title="Daily Activity" 
          value={stats.activity} 
          unit="%" 
          icon={Activity} 
          color="rgba(16, 185, 129, 0.2)" 
        />
      </div>

      <div className="main-grid">
        <ChartSection data={history} />
        <AppointmentCard />
      </div>
    </div>
  );
};

export default Dashboard;