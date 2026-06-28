/**
 * System Monitor Component
 * Real-time monitoring of backend and Firebase connection status
 * Useful for debugging and system health checks
 */

import React, { useState, useEffect } from 'react';
import { useBackendAPI, useAPIStats, useVitals } from '../utils/useBackendAPI';
import { Activity, AlertCircle, CheckCircle, WifiOff, Database, Zap } from 'lucide-react';

export const SystemMonitor = () => {
  const { isConnected: backendConnected, error: backendError } = useBackendAPI();
  const { stats, isLoading: statsLoading } = useAPIStats(2000);
  const { vitals, error: vitalsError } = useVitals(2000);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    // Check if we have vitals data (indicates Firebase connection)
    if (vitals) {
      setFirebaseConnected(true);
    }
  }, [vitals]);

  const StatusIndicator = ({ connected, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
      {connected ? (
        <>
          <CheckCircle size={20} color="green" />
          <span style={{ color: 'green' }}>✅ {label}</span>
        </>
      ) : (
        <>
          <AlertCircle size={20} color="red" />
          <span style={{ color: 'red' }}>❌ {label}</span>
        </>
      )}
    </div>
  );

  const StatItem = ({ label, value, unit = '' }) => (
    <div style={{ 
      background: 'rgba(255,255,255,0.1)', 
      padding: '12px', 
      borderRadius: '8px', 
      marginBottom: '8px' 
    }}>
      <p style={{ margin: '0 0 4px 0', opacity: 0.7, fontSize: '0.85rem' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
        {value} {unit}
      </p>
    </div>
  );

  return (
    <div style={{
      background: 'rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      fontFamily: 'monospace',
      fontSize: '0.9rem'
    }}>
      <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={20} /> System Monitor
      </h3>

      {/* Connection Status */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '15px' 
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Connection Status</h4>
        <StatusIndicator 
          connected={backendConnected} 
          label="Backend API (localhost:5000)" 
        />
        <StatusIndicator 
          connected={firebaseConnected} 
          label="Firebase Realtime DB" 
        />
        {backendError && (
          <div style={{ color: '#ff6b6b', marginTop: '8px', fontSize: '0.85rem' }}>
            ⚠️ Backend Error: {backendError}
          </div>
        )}
        {vitalsError && (
          <div style={{ color: '#ff6b6b', marginTop: '8px', fontSize: '0.85rem' }}>
            ⚠️ Firebase Error: {vitalsError}
          </div>
        )}
      </div>

      {/* API Stats */}
      {stats && !statsLoading && (
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '15px' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>API Status</h4>
          <StatItem 
            label="Model Status" 
            value={stats.model_loaded ? 'Loaded' : 'Not Loaded'} 
          />
          <StatItem 
            label="Firebase" 
            value={stats.firebase_connected ? 'Connected' : 'Disconnected'} 
          />
          <StatItem 
            label="API Version" 
            value={stats.api_version || 'Unknown'} 
          />
        </div>
      )}

      {/* Latest Vitals */}
      {vitals && (
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '15px' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Current Vitals</h4>
          <StatItem 
            label="Temperature" 
            value={vitals.Temperature?.toFixed(1) || 'N/A'} 
            unit="°C" 
          />
          <StatItem 
            label="Heart Rate" 
            value={vitals.HeartRate || 'N/A'} 
            unit="BPM" 
          />
          <StatItem 
            label="Movement" 
            value={vitals.Movement?.toFixed(2) || 'N/A'} 
          />
          <StatItem 
            label="Analog Pulse" 
            value={vitals.AnalogPulseRaw || 'N/A'} 
          />
          {vitals.AI_Status !== undefined && (
            <div style={{
              background: vitals.AI_Status === 1 ? 'rgba(255,107,107,0.2)' : 'rgba(107,255,107,0.2)',
              padding: '10px',
              borderRadius: '8px',
              marginTop: '8px',
              color: vitals.AI_Status === 1 ? '#ff6b6b' : '#6bff6b'
            }}>
              <strong>AI Status:</strong> {vitals.AI_Status === 1 ? '🚨 Anomaly' : '✅ Normal'}
            </div>
          )}
          {vitals.AI_Message && (
            <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '0.85rem' }}>
              💬 {vitals.AI_Message}
            </p>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '0.8rem',
        opacity: 0.7
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Debug Info</h4>
        <p style={{ margin: '4px 0' }}>⏱️ Updated: {new Date().toLocaleTimeString()}</p>
        <p style={{ margin: '4px 0' }}>📡 Backend: {backendConnected ? 'Connected' : 'Disconnected'}</p>
        <p style={{ margin: '4px 0' }}>🔥 Firebase: {firebaseConnected ? 'Connected' : 'Disconnected'}</p>
        <p style={{ margin: '4px 0' }}>🤖 Model: {stats?.model_loaded ? 'Ready' : 'Not Ready'}</p>
      </div>
    </div>
  );
};

export default SystemMonitor;
