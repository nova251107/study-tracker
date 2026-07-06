import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../config/firebase';
import { useGlobalContext } from '../context/GlobalContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="logo-container">
            <LogIn size={40} className="logo-icon" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Personal Study Tracker</p>
        </div>

        {error && <div className="login-error">{error}</div>}
        
        <button onClick={handleLogin} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
