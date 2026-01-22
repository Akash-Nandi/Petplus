// src/mlSimulation.js

// Vital ranges for different animals (The "Knowledge Base")
export const ANIMAL_DATA = {
  dog: { minHR: 60, maxHR: 140, minTemp: 37.5, maxTemp: 39.2 },
  cat: { minHR: 140, maxHR: 220, minTemp: 38.0, maxTemp: 39.2 },
  goat: { minHR: 70, maxHR: 90, minTemp: 38.5, maxTemp: 39.7 },
  cow: { minHR: 48, maxHR: 84, minTemp: 38.0, maxTemp: 39.0 },
};

// Simulated AI Suggestion Generator
export const getAISuggestion = (animal, anomalyType, value) => {
  if (anomalyType === "temperature") {
    return value > ANIMAL_DATA[animal].maxTemp
      ? `High temp detected! Apply cool water to paws/ears. Ensure fresh water is available. Move ${animal} to a ventilated area.`
      : `Hypothermia risk. Wrap ${animal} in warm blankets and increase ambient temperature.`;
  }
  if (anomalyType === "heartRate") {
    return value > ANIMAL_DATA[animal].maxHR
      ? `Tachycardia detected. Reduce activity immediately. Check for signs of anxiety or pain.`
      : `Bradycardia detected. Monitor responsiveness. If lethargic, consult vet immediately.`;
  }
  return "Monitor closely.";
};