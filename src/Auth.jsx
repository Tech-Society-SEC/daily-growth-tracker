import { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ for animations

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
        });
      }

      setUser(userCredential.user);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #000, #111, #222)",
      }}
    >
      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          padding: "50px 40px",
          borderRadius: "25px",
          width: "380px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        }}
      >
        {/* Title */}
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

        {/* Inputs */}
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

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuth}
          style={btnStyle}
        >
          {isLogin ? "Login" : "Sign Up"}
        </motion.button>

        {/* Switch Auth Mode */}
        <motion.p
          whileHover={{ scale: 1.05 }}
          style={{
            marginTop: "20px",
            cursor: "pointer",
            color: "#61dafb",
            fontWeight: "500",
          }}
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Create an account →" : "Already have an account? Login →"}
        </motion.p>

        {/* Error Message */}
        {message && (
          <p style={{ color: "salmon", marginTop: "15px", fontSize: "0.9rem" }}>
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
