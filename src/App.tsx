import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DsaTracker from './pages/DsaTracker';
import WebTracker from './pages/WebTracker';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import Login from './pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, authLoading } = useGlobalContext();
  
  if (authLoading) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
