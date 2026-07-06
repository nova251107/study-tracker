import React, { useRef } from 'react';
import { useGlobalContext } from '../context/useGlobalContext';
import { useTheme } from '../context/ThemeContext';
import { Download, Upload, Trash2, Sun, Moon } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { exportData, importData } = useGlobalContext();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'study-tracker-backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          importData(content);
          alert('Data imported successfully!');
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Import failed');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone!")) {
      localStorage.removeItem('studyTrackerData');
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your data and preferences</p>
        </div>
      </header>

      <div className="settings-container">
        <div className="glass-card settings-section">
          <h2>Appearance</h2>
          <p className="settings-desc">Toggle between dark and light mode.</p>
          <div className="settings-actions">
            <button className="btn btn-secondary" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>

        <div className="glass-card settings-section">
          <h2>Data Management</h2>
          <p className="settings-desc">Export your progress to save a backup, or import a previous backup to restore your data.</p>
          
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleExport}>
              <Download size={18} />
              Export JSON Data
            </button>
            
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImport}
            />
            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} />
              Import JSON Data
            </button>
          </div>
        </div>

        <div className="glass-card settings-section danger-zone">
          <h2>Danger Zone</h2>
          <p className="settings-desc">Permanently delete all your progress. Make sure to export your data first if you want to keep a backup.</p>
          
          <button className="btn btn-danger" onClick={handleReset}>
            <Trash2 size={18} />
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
