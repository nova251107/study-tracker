import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import './WelcomeTour.css';

const STEPS = [
  { title: 'Welcome to StudyTracker!', content: 'Track your DSA patterns, web dev journey, daily study hours, and tasks all in one place.' },
  { title: 'DSA Tracker', content: 'Browse 110 patterns across 18 categories. Each pattern has LeetCode questions, notes, and difficulty badges. Mark them as you complete them!' },
  { title: 'Web Dev Roadmap', content: 'Follow 18 topics from HTML to System Design. Each topic has subtopics and project ideas to build.' },
  { title: 'Dashboard & Analytics', content: 'View your streak, log study hours, use the Pomodoro timer, and track progress on the analytics page.' },
  { title: 'Settings & Backup', content: 'Export/import your data as JSON backup. Switch between dark and light mode. Never lose your progress!' },
];

interface WelcomeTourProps {
  onDismiss: () => void;
}

const WelcomeTour = ({ onDismiss }: WelcomeTourProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
      if (e.key === 'ArrowRight') setStep(s => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setStep(s => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  const isLast = step === STEPS.length - 1;

  return (
    <div className="tour-overlay" onClick={onDismiss}>
      <div className="tour-card" onClick={e => e.stopPropagation()}>
        <button className="tour-close" onClick={onDismiss}><X size={20} /></button>
        <div className="tour-steps">
          {STEPS.map((_, i) => (
            <div key={i} className={`tour-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
          ))}
        </div>
        <h2>{STEPS[step].title}</h2>
        <p>{STEPS[step].content}</p>
        <div className="tour-actions">
          <button className="btn btn-secondary" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={onDismiss}>Get Started!</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}>
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour;
