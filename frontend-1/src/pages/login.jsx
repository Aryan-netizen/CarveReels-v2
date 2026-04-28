import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Auth.css";

function Login() {
  const [userType, setUserType] = useState('user'); // 'user' or 'foodpartner'
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      const accessToken = tokenResponse.access_token;
      
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      
      const { email, name, picture } = userRes.data;
      
      const endpoint = userType === 'foodpartner' ? 'foodpartner' : 'user';
      const url = `http://localhost:3000/auth/${endpoint}/google-login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, picture })
      });
      
      const result = await response.json();
      const { success, message, jwtToken, role } = result;
      
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userRole', role);
        setTimeout(() => {
          navigate('/reels')
        }, 1000)
      } else {
        handleError(message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during Google login:', err);
      handleError('Error during Google login');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => handleError("Google login failed"),
    flow: "implicit",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }
    
    setLoading(true);
    try {
      const endpoint = userType === 'foodpartner' ? 'foodpartner' : 'user';
      const url = `http://localhost:3000/auth/${endpoint}/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, role, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userRole", role);
        setTimeout(() => {
          navigate("/reels");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-brand">
            <h1>🍕 CraveReels</h1>
            <p>Discover delicious food content</p>
          </div>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🎬</span>
              <p>Watch amazing food reels</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📤</span>
              <p>Share your culinary creations</p>
            </div>
            <div className="feature">
              <span className="feature-icon">❤️</span>
              <p>Connect with food lovers</p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            {/* User Type Selector */}
            <div className="user-type-selector">
              <button 
                type="button"
                className={`type-btn ${userType === 'user' ? 'active' : ''}`}
                onClick={() => setUserType('user')}
              >
                👤 User
              </button>
              <button 
                type="button"
                className={`type-btn ${userType === 'foodpartner' ? 'active' : ''}`}
                onClick={() => setUserType('foodpartner')}
              >
                👨‍🍳 Food Partner
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginInfo.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginInfo.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button 
              type="button"
              className="google-btn"
              onClick={() => googleLogin()}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              Continue with Google
            </button>

            <p className="auth-footer">
              Don't have an account? <Link to="/role-selection">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
