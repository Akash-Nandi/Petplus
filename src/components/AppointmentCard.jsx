import React, { useState } from 'react';
import { Calendar, ChevronRight, Plus, Stethoscope, Syringe, Scissors, X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentCard = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [appointments, setAppointments] = useState([
    { id: 1, type: 'Vet Checkup', time: 'Tomorrow, 10:00 AM', category: 'medical' },
    { id: 2, type: 'Vaccination', time: 'Oct 24, 02:00 PM', category: 'vaccine' },
    { id: 3, type: 'Grooming', time: 'Oct 28, 04:30 PM', category: 'grooming' },
  ]);

  // helper to get icon based on category
  const getIcon = (category) => {
    switch (category) {
      case 'medical': return <Stethoscope size={18} color="#a78bfa" />;
      case 'vaccine': return <Syringe size={18} color="#f472b6" />;
      case 'grooming': return <Scissors size={18} color="#fbbf24" />;
      default: return <Calendar size={18} color="#fff" />;
    }
  };

  const handleBook = (e) => {
    e.preventDefault();
    // Simulate adding an appointment
    const newApt = { 
      id: Date.now(), 
      type: 'General Checkup', 
      time: 'Nov 01, 09:00 AM', 
      category: 'medical' 
    };
    setAppointments([...appointments, newApt]);
    setIsBooking(false);
  };

  const removeAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <div className="glass-card" style={{ height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(244, 114, 182, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <Calendar size={20} color="#f472b6" />
          </div>
          <h3 style={{ margin: 0 }}>Shedule</h3>
        </div>
        {isBooking && (
          <button onClick={() => setIsBooking(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Content Area with Animation Switch */}
      <div style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          
          {/* VIEW MODE: List of Appointments */}
          {!isBooking ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}
            >
              {appointments.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>No upcoming appointments.</div>
              )}

              {appointments.map((apt) => (
                <div key={apt.id} className="apt-item" style={{ 
                  background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
                      {getIcon(apt.category)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{apt.type}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {apt.time}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => removeAppointment(apt.id)}
                      title="Mark Done"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, hover: { opacity: 1 } }}
                    >
                      <Check size={18} color="#34d399" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* BOOKING MODE: Simple Form */
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, display: 'block', marginBottom: '5px' }}>Shedule for</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgb(20, 29, 48)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                    <option>General Checkup</option>
                    <option>Vaccination</option>
                    <option>Grooming</option>
                    <option>Surgery Consult</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', opacity: 0.7, display: 'block', marginBottom: '5px' }}>Date & Time</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                </div>
                <button className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
                  Confirm
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer Button (Only visible in list mode) */}
      {!isBooking && (
        <button 
          onClick={() => setIsBooking(true)}
          className="btn-primary" 
          style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}
        >
          <Plus size={18} /> Add Shedule
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;