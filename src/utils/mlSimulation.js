const ANIMAL_RANGES = {
  dog: { 
    hr: { min: 60, max: 140 }, 
    temp: { min: 37.5, max: 39.2 }, 
    spo2: { min: 95, max: 100 } 
  },
  cat: { 
    hr: { min: 140, max: 220 }, 
    temp: { min: 38.0, max: 39.2 }, 
    spo2: { min: 95, max: 100 } 
  },
  cow: { 
    hr: { min: 48, max: 84 }, 
    temp: { min: 38.0, max: 39.0 }, 
    spo2: { min: 90, max: 100 } 
  },
  goat: { 
    hr: { min: 70, max: 90 }, 
    temp: { min: 38.5, max: 40.0 }, 
    spo2: { min: 90, max: 100 } 
  }
};

// Fetch real sensor data from ESP32 bridge
export const fetchSensorData = async () => {
  try {
    const response = await fetch('http://localhost:3000/pet_data.csv');
    if (!response.ok) throw new Error('Sensor not connected');
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    if (lines.length < 2) return null;
    
    // Parse last data point (most recent)
    const lastLine = lines[lines.length - 1];
    const [pulse, accelX, accelY, accelZ] = lastLine.split(',').map(Number);
    
    // Calculate motion from accelerometer (magnitude)
    const motion = Math.sqrt(accelX**2 + accelY**2 + accelZ**2).toFixed(1);
    
    return { heartRate: pulse, motion, accelX, accelY, accelZ };
  } catch (error) {
    console.log('Using simulated data:', error.message);
    return null;
  }
};

export const generateLiveStats = async (animalType = 'dog') => {
  const ranges = ANIMAL_RANGES[animalType] || ANIMAL_RANGES.dog;

  // Try to get real sensor data first
  const sensorData = await fetchSensorData();
  
  let heartRate, temp, spo2, activity;
  
  if (sensorData) {
    // Use real sensor data from ESP32
    heartRate = sensorData.heartRate;
    // Map motion to activity percentage (0-100)
    activity = Math.min(100, Math.max(0, (sensorData.motion / 20) * 100));
    // Estimate temp/spo2 (not measured by ESP32)
    temp = (ranges.temp.min + Math.random() * (ranges.temp.max - ranges.temp.min)).toFixed(1);
    spo2 = 97 + Math.floor(Math.random() * 3);
  } else {
    // Generate simulated values based on specific animal ranges
    heartRate = Math.floor(Math.random() * (ranges.hr.max - ranges.hr.min + 1)) + ranges.hr.min;
    temp = (ranges.temp.min + Math.random() * (ranges.temp.max - ranges.temp.min)).toFixed(1);
    spo2 = Math.floor(Math.random() * (ranges.spo2.max - ranges.spo2.min + 1)) + ranges.spo2.min;
    activity = Math.floor(Math.random() * 20) + 60; // 60-80% baseline
  }

  // Anomaly Logic
  let anomaly = null;
  if (temp > ranges.temp.max + 0.5) {
    anomaly = { type: 'Hyperthermia', message: `Temp dangerously high for a ${animalType}.` };
  } else if (heartRate > ranges.hr.max + 10) {
    anomaly = { type: 'Tachycardia', message: 'Heart rate elevated. Check stress levels.' };
  } else if (spo2 < 92) {
    anomaly = { type: 'Hypoxia', message: 'Oxygen levels low. Check breathing.' };
  }

  return { heartRate, temp, spo2, activity, anomaly };
};

export const getHistoryData = () => {
  // Generates generic history for the chart
  return Array.from({ length: 7 }, (_, i) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    heartRate: 70 + Math.floor(Math.random() * 40),
    temp: 38 + Math.random(),
    activity: 40 + Math.floor(Math.random() * 50),
  }));
};