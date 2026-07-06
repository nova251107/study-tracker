import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../context/useGlobalContext';
import { Flame, Clock, Code, Layout as LayoutIcon, Plus, Play, Pause, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Dashboard.css';

const Timer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (mode === 'focus') {
              setMode('break');
              setTime(5 * 60);
            } else {
              setMode('focus');
              setTime(25 * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const toggleTimer = () => setIsRunning(prev => !prev);
  
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') setTime(25 * 60);
    else setTime(5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTime(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-card glass-card">
      <div className="timer-modes">
        <button className={`timer-mode-btn ${mode === 'focus' ? 'active' : ''}`} onClick={() => switchMode('focus')}>Focus</button>
        <button className={`timer-mode-btn ${mode === 'break' ? 'active' : ''}`} onClick={() => switchMode('break')}>Break</button>
      </div>
      <div className="timer-display" data-mode={mode}>
        <span className="timer-time">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      </div>
      <div className="timer-controls">
        <button className="btn btn-primary" onClick={toggleTimer}>
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={resetTimer}>
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { stats, dsaData, webData, updateStats, tasks } = useGlobalContext();
  const [showLogForm, setShowLogForm] = useState(false);
  const [hours, setHours] = useState('');

  const totalDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.length, 0);
  const completedDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.filter(p => p.completed).length, 0);
  const dsaProgress = totalDsa === 0 ? 0 : Math.round((completedDsa / totalDsa) * 100);

  const totalWeb = webData.length;
  const completedWeb = webData.filter(t => t.completed).length;
  const webProgress = totalWeb === 0 ? 0 : Math.round((completedWeb / totalWeb) * 100);

  const chartData = [
    { name: 'DSA', completed: completedDsa, total: totalDsa },
    { name: 'Web Dev', completed: completedWeb, total: totalWeb },
  ];

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!isNaN(h) && h > 0) {
      updateStats(h);
      setHours('');
      setShowLogForm(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const recentActivity: { time: string; text: string }[] = [];

  if (stats.lastStudyDate === today) {
    recentActivity.push({ time: 'Today', text: `Logged ${stats.weeklyActivity[today] || 0} study hour(s)` });
  }

  const completedToday = tasks.filter(t => t.completed).length;
  if (completedToday > 0) {
    recentActivity.push({ time: 'Today', text: `Completed ${completedToday} task(s)` });
  }

  const dsaToday = dsaData.flatMap(c => c.patterns).filter(p => p.completed).length;
  if (dsaToday > 0) {
    recentActivity.push({ time: 'Today', text: `Completed ${dsaToday} DSA pattern(s)` });
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your study overview.</p>
      </header>

      <div className="stats-grid grid-4">
        <div className="glass-card stat-card">
          <div className="stat-icon streak"><Flame size={24} /></div>
          <div className="stat-info">
            <h3>{stats.streak} Days</h3>
            <p>Current Streak</p>
          </div>
        </div>
        
        <div className="glass-card stat-card">
          <div className="stat-icon hours"><Clock size={24} /></div>
          <div className="stat-info">
            <h3>{stats.totalHours} Hrs</h3>
            <p>Total Study Hours</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon dsa"><Code size={24} /></div>
          <div className="stat-info">
            <h3>{dsaProgress}%</h3>
            <p>DSA Completion</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon web"><LayoutIcon size={24} /></div>
          <div className="stat-info">
            <h3>{webProgress}%</h3>
            <p>Web Dev Completion</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-content">
          <div className="glass-card chart-card">
            <h2>Overall Progress</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card activity-card">
            <div className="activity-header">
              <h2>Recent Activity</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowLogForm(true)}>
                <Plus size={16} />
                Log Hours
              </button>
            </div>

            {showLogForm && (
              <form onSubmit={handleLogHours} className="log-hours-form">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Study hours..."
                  className="hours-input"
                  autoFocus
                  required
                />
                <div className="log-form-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowLogForm(false); setHours(''); }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="activity-list">
              {recentActivity.length === 0 ? (
                <p className="no-activity">No recent activity recorded today. Log your study hours to get started!</p>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i} className="activity-item">
                    <span className="activity-time">{item.time}</span>
                    <p className="activity-text">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Timer />
      </div>
    </div>
  );
};

export default Dashboard;
