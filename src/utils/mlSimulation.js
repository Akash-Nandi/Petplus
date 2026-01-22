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

export const generateLiveStats = (animalType = 'dog') => {
  const ranges = ANIMAL_RANGES[animalType] || ANIMAL_RANGES.dog;

  // Generate values based on specific animal ranges
  const heartRate = Math.floor(Math.random() * (ranges.hr.max - ranges.hr.min + 1)) + ranges.hr.min;
  const temp = (ranges.temp.min + Math.random() * (ranges.temp.max - ranges.temp.min)).toFixed(1);
  const spo2 = Math.floor(Math.random() * (ranges.spo2.max - ranges.spo2.min + 1)) + ranges.spo2.min;
  const activity = Math.floor(Math.random() * 20) + 60; // 60-80% baseline

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