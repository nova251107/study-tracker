import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((_auth: unknown, cb: (user: unknown) => void) => {
      cb(null);
      return () => {};
    }),
  },
  signInWithGoogle: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth: unknown, cb: (user: unknown) => void) => {
    cb(null);
    return () => {};
  }),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(() => ({})),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

import { renderHook, act } from '@testing-library/react';
import { GlobalProvider, useGlobalContext } from '../context/GlobalContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <GlobalProvider>{children}</GlobalProvider>
);

beforeEach(() => {
  window.localStorage.clear();
});

describe('GlobalContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    expect(result.current.tasks).toEqual([]);
    expect(result.current.stats.totalHours).toBe(0);
    expect(result.current.stats.streak).toBe(0);
    expect(result.current.user).toBeNull();
    expect(result.current.authLoading).toBe(false);
  });

  it('adds a task', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.addTask({ title: 'Test Task', deadline: '2026-07-10' });
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it('toggles a task', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.addTask({ title: 'Test', deadline: '2026-07-10' });
    });
    const taskId = result.current.tasks[0].id;
    act(() => {
      result.current.toggleTask(taskId);
    });
    expect(result.current.tasks[0].completed).toBe(true);
  });

  it('deletes a task', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.addTask({ title: 'Test', deadline: '2026-07-10' });
    });
    const taskId = result.current.tasks[0].id;
    act(() => {
      result.current.deleteTask(taskId);
    });
    expect(result.current.tasks).toHaveLength(0);
  });

  it('updates stats and increments streak', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.updateStats(2);
    });
    expect(result.current.stats.totalHours).toBe(2);
    expect(result.current.stats.streak).toBe(1);
  });

  it('toggles DSA patterns', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.toggleDsaPattern('c0', 'p1');
    });
    const category = result.current.dsaData.find(c => c.id === 'c0')!;
    const pattern = category.patterns.find(p => p.id === 'p1')!;
    expect(pattern.completed).toBe(true);
  });

  it('toggles web topics', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.toggleWebTopic('w1');
    });
    const topic = result.current.webData.find(t => t.id === 'w1')!;
    expect(topic.completed).toBe(true);
  });

  it('exports and imports data', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    act(() => {
      result.current.addTask({ title: 'Backup', deadline: '2026-07-10' });
    });
    const exported = result.current.exportData();
    const parsed = JSON.parse(exported);
    expect(parsed.tasks).toHaveLength(1);
    expect(parsed.tasks[0].title).toBe('Backup');
  });
});
