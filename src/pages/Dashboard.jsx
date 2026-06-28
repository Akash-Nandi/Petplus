import React, { useState, useEffect, useRef } from 'react';
import { Heart, Thermometer, Activity, Droplets, Zap, Brain, AlertTriangle, Target } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartSection from '../components/ChartSection';
import AppointmentCard from '../components/AppointmentCard';

// IMPORT FIREBASE
import { db } from '../components/firebase'; 
import { ref, onValue } from 'firebase/database';

const Dashboard = () => {
  const [selectedAnimal, setSelectedAnimal] = useState('dog');
  const [stats, setStats] = useState({ heartRate: 0, temp: 38.5, spo2: 98, activity: "Still", rawPulse: 0 });
  
  const [alert, setAlert] = useState(null);
  const [aiStatus, setAiStatus] = useState(0); 

  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [suggestion, setSuggestion] = useState('Waiting for sensor data...');

  // --- Real-time Data States ---
  const [bpmHistory, setBpmHistory] = useState([]);     
  const [pulseStrength, setPulseStrength] = useState(1); 
  const [displayBpm, setDisplayBpm] = useState(0);     
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [mobileAlertsEnabled, setMobileAlertsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const bpmBufferRef = useRef([]);                      
  const prevAiStatusRef = useRef(0);
  const mobileAlertsEnabledRef = useRef(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  // --- Weekly & Daily Trend States ---
  const [dailyBpmData, setDailyBpmData] = useState([]);
  const [weeklyBpmData, setWeeklyBpmData] = useState([]);
  const [trendTimeRange, setTrendTimeRange] = useState('daily');

  // --- 1 Minute Collection States ---
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionTime, setCollectionTime] = useState(0);
  const [collectedData, setCollectedData] = useState([]);
  const [averages, setAverages] = useState({ avgBpm: null, avgMotion: null });
  const [collectionComplete, setCollectionComplete] = useState(false);

  const collectionTimerRef = useRef(null);
  const isCollectingRef = useRef(false);
  const latestDataRef = useRef(null); // To store latest Firebase data for the 1-min collection

  const generateRealAdvice = (data, currentAiStatus) => {
    const rawPulse = data.AnalogPulse || data.AnalogPulseRaw || 0;
    const reasons = [];
    if (data.HeartRate > 120) reasons.push('elevated heart rate');
    if (data.Movement > 1.5) reasons.push('high activity');
    if (data.Movement < 0.5 && data.HeartRate > 110) reasons.push('elevated resting heart rate');
    if (data.SpO2 !== undefined && data.SpO2 < 92) reasons.push('low blood oxygen');
    if (rawPulse && (rawPulse < 450 || rawPulse > 570)) reasons.push('abnormal raw pulse signal');

    const reasonText = reasons.length > 0 ? reasons.join(', ') : 'unexpected vital pattern';

    if (currentAiStatus === 1) {
      return `AI WARNING: Anomaly detected for a ${selectedAnimal}. Likely cause: ${reasonText}. Please inspect the pet immediately.`;
    }

    if (data.Movement > 1.5 && data.HeartRate > 120) return 'High activity detected with elevated heart rate. Monitor for over-exertion.';
    if (data.Movement < 0.5 && data.HeartRate > 110) return 'Elevated resting heart rate detected. Check for stress or discomfort.';
    return `Vitals stable. ${selectedAnimal} is currently resting/normal.`;
  };

  const startCollection = () => {
    if (connectionStatus !== 'Online') return;
    isCollectingRef.current = true;
    setIsCollecting(true);
    setCollectionTime(60);
    setCollectedData([]);
    setAverages({ avgBpm: null, avgMotion: null });
    setCollectionComplete(false);

    collectionTimerRef.current = setInterval(() => {
      setCollectionTime(prev => {
        if (prev <= 1) {
          clearInterval(collectionTimerRef.current);
          isCollectingRef.current = false;
          calculateAverages();
          setIsCollecting(false);
          setCollectionComplete(true);
          return 0;
        }
        // Push the latest data into the collection array every second
        if (latestDataRef.current) {
          setCollectedData(current => [...current, { 
            bpm: latestDataRef.current.HeartRate || 0, 
            motion: latestDataRef.current.Movement > 1 ? "Active" : "Still" 
          }]);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calculateAverages = () => {
    setCollectedData(currentData => {
      if (currentData.length === 0) return currentData;
      const totalBpm = currentData.reduce((sum, item) => sum + item.bpm, 0);
      const avgBpm = Math.round(totalBpm / currentData.length);
      
      const motionCounts = {};
      currentData.forEach(item => {
        motionCounts[item.motion] = (motionCounts[item.motion] || 0) + 1;
      });
      const avgMotion = Object.keys(motionCounts).reduce((a, b) => 
        motionCounts[a] > motionCounts[b] ? a : b
      );
      
      setAverages({ avgBpm, avgMotion });
      return currentData;
    });
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setMobileAlertsEnabled(permission === 'granted');
    mobileAlertsEnabledRef.current = permission === 'granted';
  };

  const sendMobileAlert = (title, body) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try {
      new Notification(title, { body });
    } catch (error) {
      console.warn('Mobile alert failed:', error);
    }
  };

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => setIsCalibrating(false), 2000);
  };

  useEffect(() => {
    // CONNECT TO FIREBASE FOR ALL LIVE SENSOR AND AI DATA
    const vitalsRef = ref(db, '/Vitals');
    
    const unsubscribeFirebase = onValue(vitalsRef, (snapshot) => {
      const dbData = snapshot.val();
      
      if (dbData) {
        setConnectionStatus('Online');
        latestDataRef.current = dbData; // Update ref for the 1-min collection loop

        // 1. Process AI Status
        const currentAiStatus = dbData.AI_Status || 0;
        setAiStatus(currentAiStatus);

        const alertMessage = generateRealAdvice(dbData, currentAiStatus);
        setSuggestion(alertMessage);

        if (currentAiStatus === 1) {
          setAlert({ message: "AI Model detected physiological anomaly!" });
        } else {
          setAlert(null);
        }

        const shouldSendMobileAlert = currentAiStatus === 1 && prevAiStatusRef.current !== 1 && mobileAlertsEnabledRef.current;
        if (shouldSendMobileAlert) {
          sendMobileAlert(
            `PetPulse Alert: ${selectedAnimal}`,
            alertMessage
          );
        }
        prevAiStatusRef.current = currentAiStatus;

        // 2. Process Heart Rate (BPM)
        const rawBpm = dbData.HeartRate || 0;
        bpmBufferRef.current = [...bpmBufferRef.current, rawBpm].slice(-5);
        const smoothedBpm = Math.round(
          bpmBufferRef.current.reduce((a, b) => a + b, 0) / bpmBufferRef.current.length
        );
        setDisplayBpm(smoothedBpm);

        // 3. Process Stats
        setStats({
          heartRate: smoothedBpm,
          temp: dbData.Temperature || 38.5, 
          spo2: dbData.SpO2 ? Math.round(dbData.SpO2) : 0, // Usually static unless you have full SpO2 calculation 
          activity: dbData.Movement > 1.0 ? "Active" : "Still"
        });

        // 4. Update Heartbeat Animation (Using AnalogPulse from Firebase)
        const analogPulse = dbData.AnalogPulse || dbData.AnalogPulseRaw || 512;
        const scale = 1 + ((analogPulse - 512) / 1024) * 2;
        setPulseStrength(scale > 1 ? scale : 1);

        // 4b. Update raw pulse stat
        setStats(prev => ({
          ...prev,
          rawPulse: Math.round(analogPulse)
        }));

        // 5. Update Advice
        setSuggestion(generateRealAdvice(dbData, dbData.AI_Status || 0));

        // 6. Update BPM Trend History
        setBpmHistory(prev => {
          const newPoint = { 
            time: new Date().toLocaleTimeString().split(' ')[0], 
            bpm: smoothedBpm 
          };
          return [...prev, newPoint].slice(-20);
        });

        // 7. Update Daily/Weekly Trends
        const now = new Date();
        const hourKey = `${now.getHours()}:00`;
        setDailyBpmData(prev => {
          const existing = prev.find(p => p.time === hourKey);
          if (existing) {
            return prev.map(p => p.time === hourKey 
              ? { ...p, bpm: Math.round((p.bpm + smoothedBpm) / 2) } : p
            );
          }
          return [...prev, { time: hourKey, bpm: smoothedBpm }].slice(-24);
        });

        const dayKey = now.toLocaleDateString('en-US', { weekday: 'short' });
        setWeeklyBpmData(prev => {
          const existing = prev.find(p => p.time === dayKey);
          if (existing) {
            return prev.map(p => p.time === dayKey 
              ? { ...p, bpm: Math.round((p.bpm + smoothedBpm) / 2) } : p
            );
          }
          return [...prev, { time: dayKey, bpm: smoothedBpm }].slice(-7);
        });
      } else {
        setConnectionStatus('Offline');
      }
    });

    return () => {
      unsubscribeFirebase(); 
      if (collectionTimerRef.current) clearInterval(collectionTimerRef.current);
    };
  }, [selectedAnimal]); 

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>PetPulse AI</h1>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Monitoring: <b>{selectedAnimal.toUpperCase()}</b></p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            className={`calibrate-btn ${isCalibrating ? 'loading' : ''}`}
            onClick={handleCalibrate}
            disabled={connectionStatus !== 'Online'}
          >
            <Target size={18} /> {isCalibrating ? 'Calibrating...' : 'Reset Baseline'}
          </button>

          <button
            className="calibrate-btn"
            onClick={requestNotificationPermission}
            disabled={notificationPermission === 'granted'}
            style={{ background: notificationPermission === 'granted' ? '#6b7280' : undefined }}
          >
            <Zap size={18} />
            {notificationPermission === 'granted' ? 'Alerts Enabled' : 'Enable Mobile Alerts'}
          </button>

          <select value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)} className="animal-select">
            <option value="dog">🐶 Dog</option>
            <option value="cat">🐱 Cat</option>
            <option value="cow">🐮 Cow</option>
            <option value="goat">🐐 Goat</option>
          </select>

          <div className={`status-badge ${connectionStatus.toLowerCase()}`}>
            <div className="pulse-dot"></div>
            <span>{connectionStatus}</span>
          </div>
        </div>
      </header>

      {/* Live Pulse Visualization Card */}
      

      {/* AI Health Insight Section */}
      <div className="glass-card" style={{ 
        background: alert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
        border: alert ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
        display: 'flex', gap: '20px', padding: '20px', borderRadius: '15px', marginBottom: '25px'
      }}>
        <div style={{ background: alert ? '#ef4444' : '#10b981', padding: '15px', borderRadius: '12px' }}>
          {alert ? <AlertTriangle size={32} color="white" /> : <Brain size={32} color="white" />}
        </div>
        <div>
          <h3 style={{ margin: 0, color: alert ? '#fca5a5' : '#6ee7b7' }}>
            {alert ? 'ML Anomaly Detected' : 'AI Health Insight'}
          </h3>
          <p style={{ margin: '5px 0 0 0' }}><Zap size={14} fill="gold" color="gold" /> {suggestion}</p>
        </div>
      </div>

      {/* 1 Minute Collection Control */}
      <div className="glass-card" style={{ 
        marginBottom: '25px', padding: '20px', border: isCollecting ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px'
      }}>
        <div>
          <h3 style={{ margin: 0 }}>📊 1-Minute Data Collection</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            {isCollecting ? `Collecting data... ${collectionTime}s remaining` : collectionComplete ? 'Collection complete! View averages below.' : 'Start collecting to get average BPM and motion over 1 minute.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isCollecting && (
            <div style={{ background: '#10b981', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {collectionTime}s
            </div>
          )}
          <button 
            onClick={startCollection}
            disabled={isCollecting || connectionStatus !== 'Online'}
            style={{
              padding: '12px 24px', background: isCollecting ? '#6b7280' : '#10b981', border: 'none', borderRadius: '10px',
              color: 'white', fontWeight: 'bold', cursor: isCollecting ? 'not-allowed' : 'pointer', fontSize: '1rem'
            }}
          >
            {isCollecting ? 'Collecting...' : collectionComplete ? 'Restart Collection' : 'Start 1-Min Collection'}
          </button>
        </div>
      </div>

      {/* Average Results Display */}
      {collectionComplete && averages.avgBpm && (
        <div className="glass-card" style={{ 
          marginBottom: '25px', padding: '25px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '15px', display: 'flex', justifyContent: 'space-around', alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>AVERAGE BPM</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '3rem', fontWeight: '900', color: '#10b981' }}>{averages.avgBpm}</h2>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.2)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>PREDOMINANT MOTION</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{averages.avgMotion}</h2>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.2)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>DATA POINTS</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{collectedData.length}</h2>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Heart Rate" value={stats.heartRate} unit="BPM" icon={Heart} color="rgba(239, 68, 68, 0.2)" />
        <StatCard title="Activity" value={stats.activity} unit="" icon={Activity} color="rgba(16, 185, 129, 0.2)" />
        <StatCard title="Temperature" value={stats.temp} unit="°C" icon={Thermometer} color="rgba(59, 130, 246, 0.2)" />
        <StatCard title="Raw Pulse" value={stats.rawPulse} unit="" icon={Zap} color="rgba(245, 158, 11, 0.2)" />
        <StatCard title="Blood Oxygen" value={stats.spo2} unit="%" icon={Droplets} color="rgba(56, 189, 248, 0.2)" />
      </div>

      <div className="main-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
        <ChartSection 
          title="Heart Rate History" 
          subtitle="Minute-by-minute BPM trend"
          data={bpmHistory} 
          dataKey="bpm"
          color="#ef4444"
        />
      </div>


      <div style={{ marginTop: '25px' }}>
        <AppointmentCard />
      </div>
    </div>
  );
};

export default Dashboard;