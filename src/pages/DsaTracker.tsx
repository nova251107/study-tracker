import { useState, useMemo } from 'react';
import { useGlobalContext } from '../context/useGlobalContext';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Search, ExternalLink, BookOpen, Filter } from 'lucide-react';
import './DsaTracker.css';

const DsaTracker = () => {
  const { dsaData, toggleDsaPattern } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(dsaData.map(c => c.id)));

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return dsaData.map(cat => ({
      ...cat,
      patterns: cat.patterns.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesDiff = difficultyFilter === 'all' ||
          (p.difficulty?.toLowerCase() === difficultyFilter);
        return matchesSearch && matchesDiff;
      })
    })).filter(cat => cat.patterns.length > 0);
  }, [dsaData, search, difficultyFilter]);

  const allPatterns = dsaData.flatMap(c => c.patterns);
  const totalDsa = allPatterns.length;
  const completedDsa = allPatterns.filter(p => p.completed).length;
  const progress = totalDsa === 0 ? 0 : Math.round((completedDsa / totalDsa) * 100);

  const needsReview = allPatterns.filter(p => {
    if (!p.completed || !p.lastReviewed) return false;
    const daysSinceReview = (Date.now() - new Date(p.lastReviewed).getTime()) / (1000 * 3600 * 24);
    return daysSinceReview > 7;
  }).length;

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
          {needsReview > 0 && (
            <p className="review-hint">{needsReview} pattern(s) due for review</p>
          )}
        </div>
      </header>

      <div className="dsa-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="categories-grid">
        {filteredData.map((category) => {
          const catTotal = category.patterns.length;
          const catCompleted = category.patterns.filter(p => p.completed).length;
          const catProgress = catTotal === 0 ? 0 : Math.round((catCompleted / catTotal) * 100);
          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="glass-card category-card animate-fade-in">
              <button className="category-header clickable" onClick={() => toggleCategory(category.id)}>
                <div className="category-title-row">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <h3>{category.title}</h3>
                </div>
                <span className="category-stats">{catCompleted}/{catTotal}</span>
              </button>
              <div className="progress-bg small">
                <div className="progress-fill" style={{ width: `${catProgress}%` }}></div>
              </div>

              {isExpanded && (
                <ul className="pattern-list">
                  {category.patterns.map(pattern => (
                    <li key={pattern.id} className={`pattern-item ${pattern.completed ? 'completed' : ''}`}>
                      <button
                        className="check-btn"
                        onClick={() => toggleDsaPattern(category.id, pattern.id)}
                        aria-label={pattern.completed ? `Mark ${pattern.name} incomplete` : `Mark ${pattern.name} complete`}
                      >
                        {pattern.completed ? <CheckCircle2 className="checked-icon" size={20} /> : <Circle className="unchecked-icon" size={20} />}
                      </button>
                      <div
                        className="pattern-content"
                        onClick={() => {
                          if (pattern.questions && pattern.questions.length > 0) {
                            pattern.questions.forEach(q => window.open(q.url, '_blank'));
                          }
                        }}
                        title={pattern.questions?.length ? `Open all ${pattern.questions.length} LC questions` : ''}
                      >
                        <div className="pattern-name-row">
                          <span className="pattern-name">{pattern.name}</span>
                          {pattern.difficulty && (
                            <span className={`diff-badge diff-${pattern.difficulty.toLowerCase()}`}>
                              {pattern.difficulty}
                            </span>
                          )}
                          {pattern.questions && pattern.questions.length > 1 && (
                            <span className="lc-count" title={`${pattern.questions.length} questions`}>
                              {pattern.questions.length} LC
                            </span>
                          )}
                          {pattern.completed && pattern.lastReviewed && (
                            <span className="reviewed-badge" title={`Last reviewed: ${new Date(pattern.lastReviewed).toLocaleDateString()}`}>
                              <BookOpen size={12} />
                            </span>
                          )}
                        </div>
                        {pattern.notes && (
                          <p className="pattern-notes">{pattern.notes}</p>
                        )}
                        {pattern.questions && pattern.questions.length > 0 && (
                          <div className="lc-questions">
                            {pattern.questions.map((q, i) => (
                              <a
                                key={i}
                                href={q.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`lc-link lc-${q.difficulty.toLowerCase()}`}
                                onClick={e => e.stopPropagation()}
                              >
                                <ExternalLink size={12} />
                                {q.name}
                              </a>
                            ))}
                          </div>
                        )}
                        {pattern.resources && pattern.resources.length > 0 && (
                          <div className="pattern-resources">
                            {pattern.resources.map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link" onClick={e => e.stopPropagation()}>
                                {r.type === 'video' ? '▶' : '📄'} {r.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DsaTracker;
