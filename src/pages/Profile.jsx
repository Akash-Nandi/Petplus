import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Battery, Settings, Edit3, Shield, Zap, Camera, Save, X } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // State to hold profile data
  const [profileData, setProfileData] = useState({
    name: 'Buddy',
    details: 'Golden Retriever • 3 Years Old',
    weight: '28',
    gender: 'Male',
    email: 'owner@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Puppy Lane, CA'
  });

  // Backup state for canceling edits
  const [backupData, setBackupData] = useState(profileData);

  const handleEditToggle = () => {
    if (isEditing) {
      // Saving...
      setBackupData(profileData); // Update backup on save
      setIsEditing(false);
    } else {
      // Entering Edit Mode
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setProfileData(backupData); // Revert changes
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Helper style for inputs to match glass theme
  const inputStyle = {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '8px',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: 'inherit'
  };

  return (
    <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      
      {/* --- Header Section --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Pet Profile</h2>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Manage your pet's identity and device.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing && (
            <button 
              onClick={handleCancel}
              style={{ 
                background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', 
                padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
              }}>
              <X size={18} /> Cancel
            </button>
          )}
          <button 
            onClick={handleEditToggle}
            className="btn-primary" 
            style={{ 
              width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px',
              background: isEditing ? 'rgba(16, 185, 129, 0.8)' : undefined // Green when saving
            }}>
            {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Details</>}
          </button>
        </div>
      </div>

      {/* --- Main Pet Identity --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
        
        {/* Avatar Container */}
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <div style={{ 
            width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', 
            border: '4px solid rgba(255,255,255,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' 
          }}>
             <img 
               src="https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy" 
               alt="Pet" 
               style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fef3c7' }} 
             />
          </div>
          <div style={{ 
            position: 'absolute', bottom: '10px', right: '10px', 
            background: '#10b981', width: '24px', height: '24px', 
            borderRadius: '50%', border: '4px solid #1e1e2e', 
            boxShadow: '0 0 10px #10b981'
          }} title="Collar Connected"></div>
          
          <button style={{ 
            position: 'absolute', bottom: '0', right: '-10px', background: '#8b5cf6', 
            border: 'none', borderRadius: '50%', width: '36px', height: '36px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <Camera size={16} color="white" />
          </button>
        </div>

        {/* Name & Stats */}
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          {isEditing ? (
            <input 
              name="name" 
              value={profileData.name} 
              onChange={handleChange} 
              style={{ ...inputStyle, fontSize: '2rem', fontWeight: '900', textAlign: 'center', marginBottom: '10px' }} 
            />
          ) : (
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 5px 0' }}>{profileData.name}</h1>
          )}

          {isEditing ? (
            <input 
              name="details" 
              value={profileData.details} 
              onChange={handleChange} 
              style={{ ...inputStyle, textAlign: 'center' }} 
            />
          ) : (
            <p style={{ opacity: 0.7, margin: 0, fontSize: '1.1rem' }}>{profileData.details}</p>
          )}
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '120px' }}>
               <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Weight (kg)</div>
               {isEditing ? (
                 <input name="weight" value={profileData.weight} onChange={handleChange} style={{ ...inputStyle, textAlign: 'center', marginTop: '5px' }} />
               ) : (
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profileData.weight} kg</div>
               )}
             </div>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '120px' }}>
               <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Gender</div>
               {isEditing ? (
                 <input name="gender" value={profileData.gender} onChange={handleChange} style={{ ...inputStyle, textAlign: 'center', marginTop: '5px' }} />
               ) : (
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profileData.gender}</div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* --- Info Grid --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
        {/* Owner Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ 
            borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', 
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', margin: '0 0 20px 0' 
          }}>
            <User size={20} color="#a78bfa" /> Owner Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Email Field */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px' }}><Mail size={16} /></div>
              {isEditing ? (
                <input name="email" value={profileData.email} onChange={handleChange} style={inputStyle} />
              ) : (
                <span style={{ opacity: 0.8 }}>{profileData.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px' }}><Phone size={16} /></div>
              {isEditing ? (
                <input name="phone" value={profileData.phone} onChange={handleChange} style={inputStyle} />
              ) : (
                <span style={{ opacity: 0.8 }}>{profileData.phone}</span>
              )}
            </div>

            {/* Address Field */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px' }}><MapPin size={16} /></div>
              {isEditing ? (
                <input name="address" value={profileData.address} onChange={handleChange} style={inputStyle} />
              ) : (
                <span style={{ opacity: 0.8 }}>{profileData.address}</span>
              )}
            </div>

          </div>
        </div>

        {/* Device Status Card (Read Only) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ 
            borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', 
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', margin: '0 0 20px 0' 
          }}>
            <Zap size={20} color="#fbbf24" /> Device Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
               <span style={{ opacity: 0.7 }}>Battery Level</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 'bold' }}>
                 <Battery size={20} /> 94%
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px' }}>
               <span style={{ opacity: 0.7 }}>Firmware</span>
               <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>v2.4.1</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px' }}>
               <span style={{ opacity: 0.7 }}>Subscription</span>
               <span style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(167, 139, 250, 0.3)' }}>PREMIUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button style={{ 
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', 
          padding: '14px 24px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: '500'
        }}>
          <Settings size={18} /> General Settings
        </button>
        <button style={{ 
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', 
          padding: '14px 24px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: '500'
        }}>
          <Shield size={18} /> Unpair Device
        </button>
      </div>

    </div>
  );
};

export default Profile;