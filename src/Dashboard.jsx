import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserProfile, subscribeToUserProfile } from "./firebase";
import DailyTasks from "./DailyTasks";
import Leaderboard from "./Leaderboard";

function Dashboard({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    tasksCompleted: 0,
    skillsUnlocked: 0,
    mindfulMinutes: 0
  });
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  // Set default profile for demo purposes
  useEffect(() => {
    setProfile({
      name: "Growth Seeker",
      email: "demo@example.com",
      photoURL: null,
    });
    setLoading(false);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "#f1f5f9",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "20px",
        }}
      >
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          marginBottom: "10px",
          background: "linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Daily Growth Hub
        </h1>
        <p style={{
          fontSize: "1.1rem",
          opacity: 0.8,
          marginBottom: "20px"
        }}>
          Welcome back, <strong style={{ color: "#60a5fa" }}>{profile?.name || "Champion"}</strong> 👋
        </p>
      </motion.div>

      {/* Main Dashboard Grid - Single Responsive Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 20px",
      }}>
        {/* Overview Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => setActiveSection('overview')}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "28px",
            border: activeSection === 'overview' ? "2px solid #60a5fa" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeSection === 'overview'
              ? "0 8px 32px rgba(96, 165, 250, 0.3), 0 0 0 1px rgba(96, 165, 250, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #60a5fa, #a855f7, #ec4899)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #60a5fa, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              📊
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Overview</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: 0 }}>Your progress at a glance</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "12px"
          }}>
            <div style={{
              background: "rgba(96, 165, 250, 0.1)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#60a5fa" }}>Level {userStats.level}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Current</div>
            </div>
            <div style={{
              background: "rgba(245, 158, 11, 0.1)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f59e0b" }}>{userStats.xp}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>XP</div>
            </div>
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>{userStats.streak}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Daily Tasks Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => setActiveSection('tasks')}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "28px",
            border: activeSection === 'tasks' ? "2px solid #10b981" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeSection === 'tasks'
              ? "0 8px 32px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #10b981, #059669, #047857)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              ✅
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Daily Tasks</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: 0 }}>Complete your goals</p>
            </div>
          </div>

          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981", marginBottom: "5px" }}>
              {userStats.tasksCompleted}
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Tasks Completed Today</div>
          </div>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => setActiveSection('leaderboard')}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "28px",
            border: activeSection === 'leaderboard' ? "2px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeSection === 'leaderboard'
              ? "0 8px 32px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              🏆
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Leaderboard</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: 0 }}>See how you rank</p>
            </div>
          </div>

          <div style={{
            background: "rgba(245, 158, 11, 0.1)",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f59e0b", marginBottom: "5px" }}>
              #{Math.floor(Math.random() * 100) + 1}
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Your Ranking</div>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => setActiveSection('actions')}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "28px",
            border: activeSection === 'actions' ? "2px solid #ec4899" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeSection === 'actions'
              ? "0 8px 32px rgba(236, 72, 153, 0.3), 0 0 0 1px rgba(236, 72, 153, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #ec4899, #db2777, #be185d)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              ⚡
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Quick Actions</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: 0 }}>Jump to features</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "8px"
          }}>
            {[
              { icon: "⭐", label: "Levels", color: "#60a5fa" },
              { icon: "🗺️", label: "Adventure", color: "#f59e0b" },
              { icon: "🎮", label: "Game", color: "#ec4899" },
              { icon: "🤖", label: "AI", color: "#8b5cf6" },
            ].map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: `${action.color}20`,
                  padding: "8px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  border: `1px solid ${action.color}40`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.label === "Levels") navigate("/levels");
                  if (action.label === "Adventure") navigate("/adventure");
                  if (action.label === "Game") navigate("/game");
                  if (action.label === "AI") navigate("/ai-assistant");
                }}
              >
                {action.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Active Section Content */}
      <motion.div
        key={activeSection}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          marginTop: "40px",
          maxWidth: "1200px",
          margin: "40px auto 0",
          padding: "0 20px",
        }}
      >
        {activeSection === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DailyTasks />
          </motion.div>
        )}

        {activeSection === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Leaderboard />
          </motion.div>
        )}

        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #60a5fa, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Your Growth Journey
            </h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "30px" }}>
              Track your progress, complete daily tasks, and climb the leaderboard to become a growth champion!
            </p>
            <div style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/levels")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #60a5fa, #a855f7)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(96, 165, 250, 0.4)",
                }}
              >
                View Level Roadmap
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                }}
              >
                View Profile
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
