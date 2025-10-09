import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function Auth({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/auth';

  // Check for existing token on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      axios.get(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setToken(token);
        navigate("/");
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        navigate("/");
      } else {
        // Register
        if (password.length < 6) {
          setMessage("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        if (!name.trim()) {
          setMessage("Name is required");
          setIsLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/register`, { 
          email, 
          password, 
          name: name.trim() 
        });
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Authentication failed. Please try again.';
      setMessage(errorMessage);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate("/auth");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          padding: "50px 40px",
          borderRadius: "25px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#fff",
            fontWeight: "600",
            marginBottom: "25px",
            letterSpacing: "1px",
          }}
        >
          {isLogin ? "Welcome Back 👋" : "Create Your Account ✨"}
        </h2>

        {!isLogin && (
          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <motion.input
          whileFocus={{ scale: 1.03 }}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuth}
          disabled={isLoading}
          style={{
            ...btnStyle,
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
        </motion.button>


        <motion.p
          whileHover={{ scale: 1.05 }}
          style={{
            marginTop: "15px",
            cursor: "pointer",
            color: "#61dafb",
            fontWeight: "500",
            fontSize: "0.9rem",
          }}
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Create an account →" : "Already have an account? Login →"}
        </motion.p>

        {message && (
          <p style={{
            color: "salmon",
            marginTop: "15px",
            fontSize: "0.9rem",
            padding: "8px",
            borderRadius: "8px",
            background: "rgba(0,0,0,0.2)"
          }}>
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.95rem",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background:
    "linear-gradient(135deg, rgba(106,17,203,1) 0%, rgba(37,117,252,1) 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  letterSpacing: "0.5px",
  transition: "0.3s",
};

export default Auth;