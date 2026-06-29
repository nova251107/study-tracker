import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../config/firebase';
import { useGlobalContext } from '../context/GlobalContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to sign in. Check console for details.');
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
        
        <button onClick={handleLogin} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
