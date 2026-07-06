import React, { createContext, useContext, useState, useEffect } from 'react';
import dsaPatternsRaw from '../data/dsaPatterns.json';
import webDevRoadmapRaw from '../data/webDevRoadmap.json';
import { auth } from '../config/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export interface Pattern {
  id: string;
  name: string;
  completed: boolean;
}

export interface PatternCategory {
  id: string;
  title: string;
  patterns: Pattern[];
}

export interface WebTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Stats {
  totalHours: number;
  streak: number;
  lastStudyDate: string;
  weeklyActivity: Record<string, number>;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

interface PersistedState {
  dsaData: PatternCategory[];
  webData: WebTopic[];
  tasks: Task[];
  stats: Stats;
}

interface GlobalContextType {
  dsaData: PatternCategory[];
  webData: WebTopic[];
  tasks: Task[];
  stats: Stats;
  user: User | null;
  authLoading: boolean;
  toggleDsaPattern: (categoryId: string, patternId: string) => void;
  toggleWebTopic: (topicId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateStats: (hours: number) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

const defaultPersisted: PersistedState = {
  dsaData: dsaPatternsRaw as PatternCategory[],
  webData: webDevRoadmapRaw as WebTopic[],
  tasks: [],
  stats: {
    totalHours: 0,
    streak: 0,
    lastStudyDate: '',
    weeklyActivity: {}
  }
};

const STORAGE_KEY = 'studyTrackerData';

function loadPersistedState(): PersistedState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        dsaData: parsed.dsaData || defaultPersisted.dsaData,
        webData: parsed.webData || defaultPersisted.webData,
        tasks: parsed.tasks || defaultPersisted.tasks,
        stats: parsed.stats || defaultPersisted.stats
      };
    }
  } catch (e) {
    console.error('Failed to load localStorage', e);
  }
  return defaultPersisted;
}

function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useState<PersistedState>(loadPersistedState);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    savePersistedState(persisted);
  }, [persisted]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleDsaPattern = (categoryId: string, patternId: string) => {
    setPersisted(prev => {
      const newData = prev.dsaData.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            patterns: cat.patterns.map(p =>
              p.id === patternId ? { ...p, completed: !p.completed } : p
            )
          };
        }
        return cat;
      });
      return { ...prev, dsaData: newData };
    });
  };

  const toggleWebTopic = (topicId: string) => {
    setPersisted(prev => ({
      ...prev,
      webData: prev.webData.map(topic =>
        topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
      )
    }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setPersisted(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: Date.now().toString(), completed: false }]
    }));
  };

  const toggleTask = (taskId: string) => {
    setPersisted(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (taskId: string) => {
    setPersisted(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const updateStats = (hours: number) => {
    setPersisted(prev => {
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.stats.streak;

      if (prev.stats.lastStudyDate) {
        const lastDate = new Date(prev.stats.lastStudyDate);
        const currDate = new Date(today);
        const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const weeklyActivity = { ...prev.stats.weeklyActivity };
      weeklyActivity[today] = (weeklyActivity[today] || 0) + hours;

      return {
        ...prev,
        stats: {
          totalHours: prev.stats.totalHours + hours,
          streak: newStreak,
          lastStudyDate: today,
          weeklyActivity
        }
      };
    });
  };

  const exportData = () => {
    return JSON.stringify(persisted, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid data format');
      }
      setPersisted({
        dsaData: parsed.dsaData || defaultPersisted.dsaData,
        webData: parsed.webData || defaultPersisted.webData,
        tasks: parsed.tasks || defaultPersisted.tasks,
        stats: parsed.stats || defaultPersisted.stats
      });
    } catch (e) {
      console.error('Failed to import data', e);
      throw new Error('Failed to import data. File may be corrupted.');
    }
  };

  return (
    <GlobalContext.Provider value={{
      dsaData: persisted.dsaData,
      webData: persisted.webData,
      tasks: persisted.tasks,
      stats: persisted.stats,
      user,
      authLoading,
      toggleDsaPattern,
      toggleWebTopic,
      addTask,
      toggleTask,
      deleteTask,
      updateStats,
      exportData,
      importData
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
