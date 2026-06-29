
import { useGlobalContext } from '../context/GlobalContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const { stats, dsaData, webData } = useGlobalContext();

  // Mock data for the area chart (in a real app, we would store daily completion history)
  const activityData = [
    { name: 'Mon', hours: 1, tasks: 2 },
    { name: 'Tue', hours: 2, tasks: 4 },
    { name: 'Wed', hours: 1.5, tasks: 3 },
    { name: 'Thu', hours: 3, tasks: 6 },
    { name: 'Fri', hours: 2.5, tasks: 5 },
    { name: 'Sat', hours: 4, tasks: 8 },
    { name: 'Sun', hours: stats.totalHours > 14 ? 3 : stats.totalHours, tasks: 4 },
  ];

  const totalDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.length, 0);
  const completedDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.filter(p => p.completed).length, 0);
  
  const totalWeb = webData.length;
  const completedWeb = webData.filter(t => t.completed).length;

  return (
    <div className="analytics-page">
      <header className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Detailed breakdown of your learning progress</p>
        </div>
      </header>

      <div className="analytics-grid">
        <div className="glass-card chart-card full-width">
          <h2>Study Hours (This Week)</h2>
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151518', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '1.5rem' }}>
          <div className="glass-card stat-detail-card">
            <div className="stat-detail-header">
              <h3>DSA Mastery</h3>
              <span className="badge success">{Math.round((completedDsa / totalDsa) * 100) || 0}%</span>
            </div>
            <p>You have mastered <strong>{completedDsa}</strong> out of <strong>{totalDsa}</strong> patterns.</p>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${(completedDsa / totalDsa) * 100}%` }}></div>
            </div>
          </div>

          <div className="glass-card stat-detail-card">
            <div className="stat-detail-header">
              <h3>Web Dev Journey</h3>
              <span className="badge danger">{Math.round((completedWeb / totalWeb) * 100) || 0}%</span>
            </div>
            <p>You have completed <strong>{completedWeb}</strong> out of <strong>{totalWeb}</strong> topics.</p>
            <div className="progress-bg">
              <div className="progress-fill web-fill" style={{ width: `${(completedWeb / totalWeb) * 100}%` }}></div>
            </div>
          </div>

          <div className="glass-card stat-detail-card">
            <div className="stat-detail-header">
              <h3>Activity Heatmap</h3>
              <span className="badge">Last 30 Days</span>
            </div>
            <p>Your recent daily study sessions.</p>
            <div className="heatmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', marginTop: '1rem' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    aspectRatio: '1', 
                    background: Math.random() > 0.7 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    opacity: Math.random() > 0.7 ? 1 : 0.5
                  }} 
                  title={`Day ${30 - i}`}
                />
              ))}
            </div>
          </div>

          <div className="glass-card stat-detail-card">
            <div className="stat-detail-header">
              <h3>Web Dev Journey</h3>
              <span className="badge danger">{Math.round((completedWeb / totalWeb) * 100) || 0}%</span>
            </div>
            <p>You have completed <strong>{completedWeb}</strong> out of <strong>{totalWeb}</strong> topics.</p>
            <div className="progress-bg">
              <div className="progress-fill web-fill" style={{ width: `${(completedWeb / totalWeb) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
