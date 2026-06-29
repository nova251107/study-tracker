import React, { createContext, useContext, useState, useEffect } from 'react';
import dsaPatternsRaw from '../data/dsaPatterns.json';
import webDevRoadmapRaw from '../data/webDevRoadmap.json';

// Types
import type { User } from 'firebase/auth';

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
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

interface GlobalState {
  dsaData: PatternCategory[];
  webData: WebTopic[];
  tasks: Task[];
  stats: Stats;
  user: User | null;
  authLoading: boolean;
}

interface GlobalContextType extends GlobalState {
  toggleDsaPattern: (categoryId: string, patternId: string) => void;
  toggleWebTopic: (topicId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateStats: (hours: number) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
}

const initialState: GlobalState = {
  dsaData: dsaPatternsRaw as PatternCategory[],
  webData: webDevRoadmapRaw as WebTopic[],
  tasks: [],
  stats: {
    totalHours: 0,
    streak: 0,
    lastStudyDate: ''
  },
  user: null,
  authLoading: true
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalState>(() => {
    const saved = localStorage.getItem('studyTrackerData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('studyTrackerData', JSON.stringify(state));
  }, [state]);

  const toggleDsaPattern = (categoryId: string, patternId: string) => {
    setState(prev => {
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
    setState(prev => ({
      ...prev,
      webData: prev.webData.map(topic => 
        topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
      )
    }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: Date.now().toString(), completed: false }]
    }));
  };

  const toggleTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const updateStats = (hours: number) => {
    setState(prev => {
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

      return {
        ...prev,
        stats: {
          totalHours: prev.stats.totalHours + hours,
          streak: newStreak,
          lastStudyDate: today
        }
      };
    });
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      setState({
        ...state,
        dsaData: parsed.dsaData || initialState.dsaData,
        webData: parsed.webData || initialState.webData,
        tasks: parsed.tasks || initialState.tasks,
        stats: parsed.stats || initialState.stats
      });
    } catch (e) {
      console.error('Failed to import data', e);
    }
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setAuthLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, authLoading: loading }));
  };

  useEffect(() => {
    import('../config/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setAuthLoading(false);
        });
        return () => unsubscribe();
      });
    });
  }, []);

  return (
    <GlobalContext.Provider value={{
      ...state,
      toggleDsaPattern,
      toggleWebTopic,
      addTask,
      toggleTask,
      deleteTask,
      updateStats,
      exportData,
      importData,
      setUser,
      setAuthLoading
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
