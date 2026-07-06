import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WelcomeTour from './WelcomeTour';

const Layout = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('tourSeen');
    if (!seen) {
      setShowTour(true);
    }
  }, []);

  const dismissTour = () => {
    localStorage.setItem('tourSeen', 'true');
    setShowTour(false);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      {showTour && <WelcomeTour onDismiss={dismissTour} />}
    </div>
  );
};

export default Layout;
