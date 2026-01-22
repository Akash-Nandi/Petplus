import React, { useState } from 'react';
import { Calendar, CheckCircle, Activity, Syringe, Stethoscope, Utensils, Filter } from 'lucide-react';

const History = () => {
  // Sample Data with Types
  const [events] = useState([
    { id: 1, type: 'medical', title: 'Monthly Vet Checkup', desc: 'Routine physical exam. Weight is stable.', date: 'Oct 24, 2:00 PM', doctor: 'Dr. Emily' },
    { id: 2, type: 'vaccine', title: 'Rabies Vaccination', desc: 'Booster shot administered successfully.', date: 'Oct 24, 2:30 PM', doctor: 'Dr. Emily' },
    { id: 3, type: 'activity', title: 'High Activity Alert', desc: 'Sustained running for 45 mins at park.', date: 'Oct 22, 5:15 PM', duration: '45m' },
    { id: 4, type: 'diet', title: 'Diet Plan Updated', desc: 'Increased protein intake by 10%.', date: 'Oct 20, 9:00 AM', source: 'AI Suggestion' },
    { id: 5, type: 'vitals', title: 'Heart Rate Spike', desc: 'Brief spike to 160 BPM during play.', date: 'Oct 18, 6:30 PM', value: '160 BPM' },
  ]);

  // Helper to get icon and color based on event type
  const getEventStyle = (type) => {
    switch (type) {
      case 'medical': return { icon: Stethoscope, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.2)' };
      case 'vaccine': return { icon: Syringe, color: '#f472b6', bg: 'rgba(244, 114, 182, 0.2)' };
      case 'activity': return { icon: Activity, color: '#34d399', bg: 'rgba(52, 211, 153, 0.2)' };
      case 'diet': return { icon: Utensils, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)' };
      default: return { icon: CheckCircle, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)' };
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Health History</h2>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Timeline of medical and activity events.</p>
        </div>
        <button style={{ 
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', 
          padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
        }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '5px' }}>
        {events.map((e) => {
          const style = getEventStyle(e.type);
          const Icon = style.icon;

          return (
            <div key={e.id} style={{ 
              display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' 
            }}>
              
              {/* Timeline Line & Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', background: style.bg, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: style.color,
                  zIndex: 2, border: `2px solid ${style.color}`
                }}>
                  <Icon size={18} />
                </div>
                {/* Vertical Line */}
                <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.1)', minHeight: '40px', marginTop: '5px' }}></div>
              </div>

              {/* Card Content */}
              <div style={{ 
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px', padding: '20px', marginBottom: '10px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{e.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.6 }}>
                    <Calendar size={14} /> {e.date}
                  </div>
                </div>
                
                <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.5' }}>{e.desc}</p>
                
                {/* Optional Metadata Tags */}
                {(e.doctor || e.value || e.source) && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                    {e.doctor && <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px' }}>👨‍⚕️ {e.doctor}</span>}
                    {e.value && <span style={{ fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '4px 10px', borderRadius: '6px' }}>❤️ {e.value}</span>}
                    {e.source && <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '4px 10px', borderRadius: '6px' }}>🤖 {e.source}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default History;