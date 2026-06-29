import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, MonitorPlay, BarChart3, Settings, CheckSquare, LogOut } from 'lucide-react';
import { logout } from '../config/firebase';
import './Sidebar.css';

const Sidebar = () => {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { to: '/dsa', icon: <Code2 size={20} />, label: 'DSA Tracker' },
    { to: '/web', icon: <MonitorPlay size={20} />, label: 'Web Dev' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>StudyTracker</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
        <button onClick={logout} className="nav-link logout-btn" style={{ marginTop: 'auto', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
      
      <div className="sidebar-footer">
        <p>Premium Learning</p>
      </div>
    </aside>
  );
};

export default Sidebar;
