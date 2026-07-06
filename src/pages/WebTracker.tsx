
import { useGlobalContext } from '../context/GlobalContext';
import { CheckSquare, Square } from 'lucide-react';
import './WebTracker.css';

const WebTracker = () => {
  const { webData, toggleWebTopic } = useGlobalContext();

  const total = webData.length;
  const completed = webData.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="web-tracker">
      <header className="page-header">
        <div>
          <h1>Web Development Roadmap</h1>
          <p>Track your Full Stack Web Development journey</p>
        </div>
        <div className="progress-section">
          <div className="progress-text">
            <span>Overall Progress</span>
            <span className="progress-percentage">{progress}% ({completed}/{total})</span>
          </div>
          <div className="progress-bg">
            <div className="progress-fill web-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </header>

      <div className="roadmap-container glass-card animate-fade-in">
        <ul className="roadmap-list">
          {webData.map((topic, index) => (
            <li 
              key={topic.id} 
              className={`roadmap-item ${topic.completed ? 'completed' : ''}`}
            >
              <div className="roadmap-line">
                <div className="roadmap-dot"></div>
                {index !== webData.length - 1 && <div className="roadmap-connector"></div>}
              </div>
              
              <button className="roadmap-content check-btn" onClick={() => toggleWebTopic(topic.id)} aria-label={topic.completed ? `Mark ${topic.name} incomplete` : `Mark ${topic.name} complete`}>
                {topic.completed ? (
                  <CheckSquare className="checked-icon web-icon" size={24} />
                ) : (
                  <Square className="unchecked-icon" size={24} />
                )}
                <div className="topic-info">
                  <h3>{topic.name}</h3>
                  <p>Step {index + 1} of {total}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebTracker;
