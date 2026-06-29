
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DsaTracker from './pages/DsaTracker';
import WebTracker from './pages/WebTracker';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
