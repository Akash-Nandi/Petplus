import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartSection = ({ title, subtitle, data, dataKey = 'bpm', color = '#8b5cf6' }) => {
  return (
    <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0 }}>{title || 'Weekly Trends'}</h3>
          {subtitle && <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '0.9rem' }}>{subtitle}</p>}
        </div>
        <select style={{ background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '8px', padding: '5px' }}>
          <option>Last 7 Days</option>
          <option>Last Month</option>
        </select>
      </div>
      
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="time" stroke="#fff" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#fff" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #333', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorHeart)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;