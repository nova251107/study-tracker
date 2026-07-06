import { useState, useMemo } from 'react';
import { useGlobalContext } from '../context/useGlobalContext';
import { CheckSquare, Square, Search, ChevronDown, ChevronUp, Lightbulb, Code2 } from 'lucide-react';
import './WebTracker.css';

const WebTracker = () => {
  const { webData, toggleWebTopic } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return webData.filter(topic =>
      topic.name.toLowerCase().includes(search.toLowerCase()) ||
      topic.subtopics?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
  }, [webData, search]);

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

      <div className="web-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search topics or subtopics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="roadmap-container glass-card animate-fade-in">
        <ul className="roadmap-list">
          {filteredData.map((topic, index) => {
            const isExpanded = expandedTopics.has(topic.id);
            const hasDetails = (topic.subtopics && topic.subtopics.length > 0) ||
              (topic.projects && topic.projects.length > 0);

            return (
              <li key={topic.id} className={`roadmap-item ${topic.completed ? 'completed' : ''}`}>
                <div className="roadmap-line">
                  <div className="roadmap-dot"></div>
                  {index !== filteredData.length - 1 && <div className="roadmap-connector"></div>}
                </div>

                <div className="roadmap-content-wrapper">
                  <button
                    className="roadmap-content check-btn"
                    onClick={() => toggleWebTopic(topic.id)}
                    aria-label={topic.completed ? `Mark ${topic.name} incomplete` : `Mark ${topic.name} complete`}
                  >
                    {topic.completed ? (
                      <CheckSquare className="checked-icon web-icon" size={24} />
                    ) : (
                      <Square className="unchecked-icon" size={24} />
                    )}
                    <div className="topic-info">
                      <h3>{topic.name}</h3>
                      <p>Step {webData.findIndex(t => t.id === topic.id) + 1} of {total}</p>
                    </div>
                  </button>

                  {hasDetails && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleTopic(topic.id)}
                      aria-label={isExpanded ? 'Hide details' : 'Show details'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  )}

                  {isExpanded && (
                    <div className="topic-details">
                      {topic.subtopics && topic.subtopics.length > 0 && (
                        <div className="detail-section">
                          <h4><Lightbulb size={14} /> Subtopics</h4>
                          <ul className="subtopic-list">
                            {topic.subtopics.map((sub, i) => (
                              <li key={i}>{sub}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {topic.projects && topic.projects.length > 0 && (
                        <div className="detail-section projects-section">
                          <h4><Code2 size={14} /> Projects</h4>
                          <ul className="project-list">
                            {topic.projects.map((proj, i) => (
                              <li key={i}>{proj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default WebTracker;
