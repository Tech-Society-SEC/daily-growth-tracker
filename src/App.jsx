import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Profile from "./profile";
import Leaderboard from "./Leaderboard";
import AdventureMap from "./AdventureMap.jsx";
import Game from "./Game";

function AnimatedRoutes({ user, setUser }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Dashboard */}
        <Route
          path="/"
          element={
            user ? (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Dashboard user={user} setUser={setUser} />
              </motion.div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {/* Auth */}
        <Route
          path="/auth"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Auth setUser={setUser} />
            </motion.div>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/auth" />}
        />

        {/* Leaderboard */}
        <Route
          path="/leaderboard"
          element={user ? <Leaderboard /> : <Navigate to="/auth" />}
        />

        {/* Adventure Map */}
        <Route
          path="/adventure"
          element={user ? <AdventureMap /> : <Navigate to="/auth" />}
        />

        {/* Game (protected just like adventure) */}
        <Route
          path="/game"
          element={
            user ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Game />
              </motion.div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {/* Navbar visible only if user is logged in */}
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
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}
        >
          {[
            { to: "/", label: "🏠 Dashboard" },
            { to: "/profile", label: "👤 Profile" },
            { to: "/leaderboard", label: "🏆 Leaderboard" },
            { to: "/adventure", label: "🗺 Adventure Map" },
            { to: "/game", label: "🎮 Game" },
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
        </motion.nav>
      )}

      {/* Routes */}
      <AnimatedRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
