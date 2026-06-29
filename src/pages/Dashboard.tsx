
import { useGlobalContext } from '../context/GlobalContext';
import { Flame, Clock, Code, Layout as LayoutIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { stats, dsaData, webData } = useGlobalContext();

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

      <div className="dashboard-content grid-2">
        <div className="glass-card chart-card">
          <h2>Overall Progress</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151518', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="no-activity">No recent activity recorded today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
