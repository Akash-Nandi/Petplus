import React, { useState } from 'react';
import { Utensils, Flame, Plus, Trash2, TrendingUp, Apple } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DietLog = () => {
  // Simulated "Calories Burned" based on the activity tracker
  const [caloriesBurned] = useState(450); 
  const [dailyGoal] = useState(800); // Target calorie intake for the pet

  const [meals, setMeals] = useState([
    { id: 1, name: 'Morning Kibble', calories: 300, time: '08:00 AM' },
    { id: 2, name: 'Chicken Treat', calories: 50, time: '10:30 AM' },
  ]);

  const [newMeal, setNewMeal] = useState({ name: '', calories: '' });

  // Calculate Totals
  const totalConsumed = meals.reduce((acc, curr) => acc + parseInt(curr.calories), 0);
  const netBalance = totalConsumed - caloriesBurned;
  
  // Data for Chart
  const chartData = [
    { name: 'Intake', value: totalConsumed, color: '#8b5cf6' }, // Purple
    { name: 'Burned', value: caloriesBurned, color: '#f59e0b' }, // Orange
  ];

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;

    const meal = {
      id: Date.now(),
      name: newMeal.name,
      calories: parseInt(newMeal.calories),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMeals([meal, ...meals]);
    setNewMeal({ name: '', calories: '' });
  };

  const handleDelete = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  return (
    <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Nutrition Tracker</h2>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Log meals and monitor calorie balance.</p>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', 
          display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Apple size={20} color="#8b5cf6" />
          <span style={{ fontWeight: 'bold' }}>Goal: {dailyGoal} kcal</span>
        </div>
      </div>

      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Consumed Card */}
        <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#c4b5fd', fontWeight: 'bold', fontSize: '0.9rem' }}>CONSUMED</span>
            <Utensils size={20} color="#a78bfa" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>{totalConsumed}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>kcal today</div>
        </div>

        {/* Burned Card */}
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#fcd34d', fontWeight: 'bold', fontSize: '0.9rem' }}>BURNED (Est.)</span>
            <Flame size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>{caloriesBurned}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>kcal active</div>
        </div>

        {/* Balance Card */}
        <div style={{ 
          background: netBalance > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
          border: `1px solid ${netBalance > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`, 
          padding: '20px', borderRadius: '20px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: netBalance > 0 ? '#6ee7b7' : '#93c5fd', fontWeight: 'bold', fontSize: '0.9rem' }}>NET BALANCE</span>
            <TrendingUp size={20} color={netBalance > 0 ? '#34d399' : '#60a5fa'} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>
            {netBalance > 0 ? `+${netBalance}` : netBalance}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{netBalance > 0 ? 'Surplus' : 'Deficit'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left Column: Input & List */}
        <div>
          {/* Input Form */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Log a Meal</h3>
            <form onSubmit={handleAddMeal} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Meal Name (e.g. Beef Jerky)" 
                value={newMeal.name}
                onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
              />
              <input 
                type="number" 
                placeholder="Calories" 
                value={newMeal.calories}
                onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
              />
              <button className="btn-primary" style={{ width: 'auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} />
              </button>
            </form>
          </div>

          {/* Meal List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {meals.map((meal) => (
              <div key={meal.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                background: 'rgba(255,255,255,0.03)', padding: '15px 20px', borderRadius: '15px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px' }}>
                    <Utensils size={18} color="#a78bfa" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{meal.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{meal.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{meal.calories} kcal</span>
                  <button onClick={() => handleDelete(meal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Balance Overview</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.7, marginTop: '20px' }}>
            {netBalance > 0 
              ? `You are ${netBalance} kcal OVER burn.` 
              : `You have ${Math.abs(netBalance)} kcal remaining to burn.`}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DietLog;