import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Profile from "./ProfilePage";
import Leaderboard from "./Leaderboard";
import AdventureMap from "./AdventureMap.jsx";
import Game from "./Game";
import AIAssistant from "./AIAssistant";
import LevelRoadmap from "./LevelRoadmap";
import { onAuthStateChange } from "./firebase";

function AnimatedRoutes({ user, setUser }) {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 20
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: {
      opacity: 0,
      scale: 1.02,
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Dashboard - No auth required */}
        <Route
          path="/"
          element={
            <motion.div
              custom="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Dashboard user={user} setUser={setUser} />
            </motion.div>
          }
        />

        {/* Auth - Optional */}
        <Route
          path="/auth"
          element={
            <motion.div
              custom="auth"
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                in: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.3, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Auth setUser={setUser} />
            </motion.div>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <motion.div
              custom="profile"
              variants={{
                initial: { opacity: 0, x: 50 },
                in: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.3, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Profile user={user} setUser={setUser} />
            </motion.div>
          }
        />

        {/* Leaderboard */}
        <Route
          path="/leaderboard"
          element={
            <motion.div
              custom="leaderboard"
              variants={{
                initial: { opacity: 0, scale: 0.9, y: 30 },
                in: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  scale: 0.95,
                  y: -30,
                  transition: { duration: 0.3, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Leaderboard />
            </motion.div>
          }
        />

        {/* Adventure Map */}
        <Route
          path="/adventure"
          element={
            <motion.div
              custom="adventure"
              variants={{
                initial: { opacity: 0, scale: 0.8 },
                in: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.4, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <AdventureMap />
            </motion.div>
          }
        />

        {/* Game */}
        <Route
          path="/game"
          element={
            <motion.div
              custom="game"
              variants={{
                initial: { opacity: 0, rotateY: -90 },
                in: {
                  opacity: 1,
                  rotateY: 0,
                  transition: { duration: 0.6, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  rotateY: 90,
                  transition: { duration: 0.4, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <Game />
            </motion.div>
          }
        />

        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={
            <motion.div
              custom="ai"
              variants={{
                initial: { opacity: 0, x: -100 },
                in: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  x: 100,
                  transition: { duration: 0.3, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <AIAssistant />
            </motion.div>
          }
        />

        {/* Level Roadmap */}
        <Route
          path="/levels"
          element={
            <motion.div
              custom="levels"
              variants={{
                initial: { opacity: 0, y: 100, scale: 0.8 },
                in: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: "easeOut" }
                },
                out: {
                  opacity: 0,
                  y: -100,
                  scale: 0.9,
                  transition: { duration: 0.4, ease: "easeIn" }
                }
              }}
              initial="initial"
              animate="in"
              exit="out"
            >
              <LevelRoadmap user={user} />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false since no auth required

  // Optional: Listen to Firebase auth state changes (but don't enforce login)
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Optional logout function (users can still logout if they want)
  const handleLogout = async () => {
    try {
      const { logout } = await import("./firebase");
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          color: "#fff",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid #fff",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading your growth journey...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Optional Navbar - Only show if user is logged in */}
      {user && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            padding: "16px 40px",
            marginBottom: "20px",
            backdropFilter: "blur(20px) saturate(180%)",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}
        >
          {[
            { to: "/", label: "🏠 Dashboard" },
            { to: "/levels", label: "⭐ Levels" },
            { to: "/leaderboard", label: "🏆 Leaderboard" },
            { to: "/profile", label: "👤 Profile" },
            { to: "/adventure", label: "🗺 Adventure" },
            { to: "/game", label: "🎮 Game" },
            { to: "/ai-assistant", label: "🤖 AI" },
          ].map((link) => (
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} key={link.to}>
              <Link
                to={link.to}
                style={{
                  fontWeight: 600,
                  color: "#1d1d1f",
                  textDecoration: "none",
                  fontSize: "1rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                onMouseLeave={(e) => (e.target.style.color = "#1d1d1f")}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ff4d4d",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Logout
          </motion.button>
        </motion.nav>
      )}

      {/* Routes - All accessible without authentication */}
      <AnimatedRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
