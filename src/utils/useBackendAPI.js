/**
 * Custom React Hook for Backend API
 * Simplifies API usage in React components
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { petPlusAPI } from './apiClient';

/**
 * useBackendAPI Hook
 * Provides connection status and data fetching for backend
 */
export const useBackendAPI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check connection on mount
    const checkConnection = async () => {
      const result = await petPlusAPI.healthCheck();
      setIsConnected(result.success);
      setError(result.error || null);
      setIsLoading(false);
    };

    checkConnection();

    // Periodic health check
    const healthCheckInterval = setInterval(checkConnection, 10000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return {
    isConnected,
    isLoading,
    error,
  };
};

/**
 * usePrediction Hook
 * Fetches latest AI prediction
 */
export const usePrediction = (pollInterval = 3000) => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const result = await petPlusAPI.getLatestPrediction();
        if (result.success) {
          setPrediction(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchPrediction();

    // Poll for updates
    const pollInterval_id = setInterval(fetchPrediction, pollInterval);
    return () => clearInterval(pollInterval_id);
  }, [pollInterval]);

  return { prediction, isLoading, error };
};

/**
 * useVitals Hook
 * Fetches current vitals from backend
 */
export const useVitals = (pollInterval = 3000) => {
  const [vitals, setVitals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const result = await petPlusAPI.getVitals();
        if (result.success) {
          setVitals(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchVitals();

    // Poll for updates
    const pollInterval_id = setInterval(fetchVitals, pollInterval);
    return () => clearInterval(pollInterval_id);
  }, [pollInterval]);

  return { vitals, isLoading, error };
};

/**
 * useAPIStats Hook
 * Fetches API statistics
 */
export const useAPIStats = (pollInterval = 5000) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await petPlusAPI.getStats();
        if (result.success) {
          setStats(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchStats();

    // Poll for updates
    const pollInterval_id = setInterval(fetchStats, pollInterval);
    return () => clearInterval(pollInterval_id);
  }, [pollInterval]);

  return { stats, isLoading, error };
};

/**
 * usePredictionSubscription Hook
 * Real-time subscription to AI predictions
 */
export const usePredictionSubscription = (pollInterval = 3000) => {
  const [prediction, setPrediction] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Subscribe to updates
    unsubscribeRef.current = petPlusAPI.subscribeToUpdates((data) => {
      setPrediction(data);
      setIsConnected(true);
    }, pollInterval);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [pollInterval]);

  return { prediction, isConnected };
};

/**
 * useManualPredict Hook
 * Manually trigger prediction for sensor data
 */
export const useManualPredict = () => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (vitals) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await petPlusAPI.predict(vitals);
      if (result.success) {
        setPrediction(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { prediction, isLoading, error, predict };
};
