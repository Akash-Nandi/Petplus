/**
 * Backend API Client Utility
 * Handles communication with the PetPlus Flask API backend
 */

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ===== API CLIENT CLASS =====
export class PetPlusAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.isConnected = false;
  }

  /**
   * Health check - verify backend is running
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      this.isConnected = response.ok;
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.isConnected = false;
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get latest AI prediction
   */
  async getLatestPrediction() {
    try {
      const response = await fetch(`${this.baseURL}/api/latest-prediction`);
      const data = await response.json();
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('❌ Failed to get latest prediction:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get prediction for sensor data
   * @param {Object} vitals - { temperature, heart_rate, movement, analog_pulse }
   */
  async predict(vitals) {
    try {
      const response = await fetch(`${this.baseURL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vitals),
      });
      const data = await response.json();
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('❌ Prediction request failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get current vitals from Firebase
   */
  async getVitals() {
    try {
      const response = await fetch(`${this.baseURL}/api/vitals`);
      const data = await response.json();
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('❌ Failed to get vitals:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get API statistics
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseURL}/api/stats`);
      const data = await response.json();
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Batch operation - get latest prediction and vitals together
   */
  async getFullStatus() {
    try {
      const [predictionRes, vitalsRes, statsRes] = await Promise.all([
        this.getLatestPrediction(),
        this.getVitals(),
        this.getStats(),
      ]);

      return {
        success: predictionRes.success && vitalsRes.success,
        prediction: predictionRes.data,
        vitals: vitalsRes.data,
        stats: statsRes.data,
      };
    } catch (error) {
      console.error('❌ Failed to get full status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Subscribe to real-time predictions with polling
   * @param {Function} callback - Called with prediction data
   * @param {Number} interval - Polling interval in milliseconds
   */
  subscribeToUpdates(callback, interval = 3000) {
    const pollInterval = setInterval(async () => {
      const result = await this.getLatestPrediction();
      if (result.success) {
        callback(result.data);
      }
    }, interval);

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  }
}

// ===== SINGLETON INSTANCE =====
export const petPlusAPI = new PetPlusAPI();

// ===== CONVENIENCE FUNCTIONS =====
export const apiClient = {
  healthCheck: () => petPlusAPI.healthCheck(),
  getLatestPrediction: () => petPlusAPI.getLatestPrediction(),
  predict: (vitals) => petPlusAPI.predict(vitals),
  getVitals: () => petPlusAPI.getVitals(),
  getStats: () => petPlusAPI.getStats(),
  getFullStatus: () => petPlusAPI.getFullStatus(),
  subscribe: (callback, interval) => petPlusAPI.subscribeToUpdates(callback, interval),
  isConnected: () => petPlusAPI.isConnected,
};
