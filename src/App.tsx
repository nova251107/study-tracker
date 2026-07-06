import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { useGlobalContext } from './context/useGlobalContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DsaTracker from './pages/DsaTracker';
import WebTracker from './pages/WebTracker';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, authLoading } = useGlobalContext();
  
  if (authLoading) return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      Loading...
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
    <GlobalProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dsa" element={<DsaTracker />} />
            <Route path="web" element={<WebTracker />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </GlobalProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
