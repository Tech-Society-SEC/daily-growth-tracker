import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  auth,
  db,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  logout,
  resetPassword,
  onAuthStateChange,
  testFirebaseConfig
} from "./firebase";

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Test Firebase configuration on component load
  useEffect(() => {
    const runFirebaseTest = async () => {
      console.log('🔍 Running Firebase configuration test...');
      const testResult = await testFirebaseConfig();
      console.log('Firebase test result:', testResult);

      if (!testResult.success) {
        setMessage(`Firebase configuration issue: ${testResult.message}`);
      }
    };

    runFirebaseTest();
  }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { user, error } = await signInWithEmail(email, password);

        if (error) {
          setMessage(error);
        } else {
          setUser(user);
          navigate("/");
        }
      } else {
        if (password.length < 6) {
          setMessage("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        const { user, error } = await signUpWithEmail(email, password, "User");

        if (error) {
          setMessage(error);
        } else {
          setUser(user);
          navigate("/");
        }
      }
    } catch (err) {
      setMessage('Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const { user, error } = await signInWithGoogle();

      if (error) {
        setMessage(error);
      } else {
        setUser(user);
        navigate("/");
      }
    } catch (err) {
      setMessage('Google authentication failed. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setIsLoading(false);
    }
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: "500",
            fontSize: "0.95rem",
            cursor: "pointer",
            letterSpacing: "0.5px",
            transition: "0.3s",
            marginTop: "15px",
            opacity: isLoading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
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