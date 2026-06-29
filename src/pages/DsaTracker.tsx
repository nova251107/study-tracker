
import { useGlobalContext } from '../context/GlobalContext';
import { CheckCircle2, Circle } from 'lucide-react';
import './DsaTracker.css';

const DsaTracker = () => {
  const { dsaData, toggleDsaPattern } = useGlobalContext();

  const totalDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.length, 0);
  const completedDsa = dsaData.reduce((acc, cat) => acc + cat.patterns.filter(p => p.completed).length, 0);
  const progress = totalDsa === 0 ? 0 : Math.round((completedDsa / totalDsa) * 100);

  return (
    <div className="dsa-tracker">
      <header className="page-header">
        <div>
          <h1>DSA Tracker</h1>
          <p>Master Data Structures and Algorithms Patterns</p>
        </div>
        <div className="progress-section">
          <div className="progress-text">
            <span>Overall Progress</span>
            <span className="progress-percentage">{progress}% ({completedDsa}/{totalDsa})</span>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </header>

      <div className="categories-grid grid-2">
        {dsaData.map((category) => {
          const catTotal = category.patterns.length;
          const catCompleted = category.patterns.filter(p => p.completed).length;
          const catProgress = catTotal === 0 ? 0 : Math.round((catCompleted / catTotal) * 100);

          return (
            <div key={category.id} className="glass-card category-card animate-fade-in">
              <div className="category-header">
                <h3>{category.title}</h3>
                <span className="category-stats">{catCompleted}/{catTotal}</span>
              </div>
              <div className="progress-bg small">
                <div className="progress-fill" style={{ width: `${catProgress}%` }}></div>
              </div>
              
              <ul className="pattern-list">
                {category.patterns.map(pattern => (
                  <li key={pattern.id} className={`pattern-item ${pattern.completed ? 'completed' : ''}`} onClick={() => toggleDsaPattern(category.id, pattern.id)}>
                    <button className="check-btn">
                      {pattern.completed ? <CheckCircle2 className="checked-icon" size={20} /> : <Circle className="unchecked-icon" size={20} />}
                    </button>
                    <span className="pattern-name">{pattern.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DsaTracker;
