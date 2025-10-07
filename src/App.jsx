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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          color: "#f1f5f9",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Orbs */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute",
          bottom: "30%",
          left: "20%",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 7s ease-in-out infinite",
        }} />

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.1); }
            }
          `}
        </style>
        <div style={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid rgba(96, 165, 250, 0.1)",
        }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(96, 165, 250, 0.2)",
              borderTop: "4px solid #60a5fa",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize: "1.1rem",
              color: "#60a5fa",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Loading your growth journey...
          </motion.p>
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              height: "2px",
              background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
              borderRadius: "1px",
              width: "200px",
              margin: "0 auto",
            }}
          />
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
            background: "rgba(15, 23, 42, 0.95)",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(96, 165, 250, 0.2)",
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
            <motion.div
              key={link.to}
              whileHover={{
                scale: 1.15,
                y: -2,
                boxShadow: "0 4px 15px rgba(96, 165, 250, 0.3)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to={link.to}
                style={{
                  fontWeight: 600,
                  color: "#f1f5f9",
                  textDecoration: "none",
                  fontSize: "1rem",
                  transition: "color 0.3s ease",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#60a5fa";
                  e.target.style.background = "rgba(96, 165, 250, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#f1f5f9";
                  e.target.style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
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
