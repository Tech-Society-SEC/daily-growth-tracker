import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile, subscribeToUserProfile, updateUserProfile, db } from "./firebase";
import DailyTasks from "./DailyTasks";
import Leaderboard from "./Leaderboard";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

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
  const [xpAnimations, setXpAnimations] = useState([]);
  const [toast, setToast] = useState(null);
  const [taskXP, setTaskXP] = useState({
    drink_water: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    take_break: 0,
    run: 0,
    coding: 0,
    reading: 0,
    meditation: 0,
    exercise: 0
  });
  const navigate = useNavigate();

  // Enhanced XP Task definitions with 10 tasks
  const xpTasks = [
    { id: 'drink_water', name: 'Drink Water', xp: 5, icon: '💧', color: '#06b6d4', category: 'health' },
    { id: 'breakfast', name: 'Breakfast', xp: 10, icon: '🥐', color: '#f59e0b', category: 'nutrition' },
    { id: 'lunch', name: 'Lunch', xp: 15, icon: '🍱', color: '#10b981', category: 'nutrition' },
    { id: 'dinner', name: 'Dinner', xp: 15, icon: '🍽️', color: '#ef4444', category: 'nutrition' },
    { id: 'take_break', name: 'Take Break', xp: 8, icon: '☕', color: '#8b5cf6', category: 'wellness' },
    { id: 'run', name: 'Run', xp: 20, icon: '🏃‍♂️', color: '#f97316', category: 'fitness' },
    { id: 'coding', name: 'Coding', xp: 25, icon: '💻', color: '#3b82f6', category: 'learning' },
    { id: 'reading', name: 'Reading', xp: 12, icon: '📚', color: '#6366f1', category: 'learning' },
    { id: 'meditation', name: 'Meditation', xp: 18, icon: '🧘‍♀️', color: '#14b8a6', category: 'wellness' },
    { id: 'exercise', name: 'Exercise', xp: 22, icon: '💪', color: '#ec4899', category: 'fitness' },
  ];

  // Set default profile for demo purposes
  useEffect(() => {
    setProfile({
      name: "Growth Seeker",
      email: "demo@example.com",
      photoURL: null,
    });
    setLoading(false);
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToUserProfile(user.uid, (data) => {
        setUserStats({
          level: data.level || 1,
          xp: data.xp || 0,
          streak: data.streak || 0,
          tasksCompleted: data.tasksCompleted || 0,
          skillsUnlocked: data.skillsUnlocked || 0,
          mindfulMinutes: data.mindfulMinutes || 0
        });
      });
      return unsubscribe;
    }
  }, [user]);

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        top: "60%",
        right: "8%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 25s ease-in-out infinite reverse",
      }} />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          textAlign: "center",
          marginBottom: "50px",
          padding: "30px",
          position: "relative",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            marginBottom: "15px",
            background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          🚀 Daily Growth Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            marginBottom: "30px",
            color: "#94a3b8",
          }}
        >
          Welcome back, <strong style={{ color: "#60a5fa" }}>{profile?.name || "Champion"}</strong> 👋
        </motion.p>

        {/* Enhanced Total XP Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 12px 40px rgba(245, 158, 11, 0.6)",
            transition: { duration: 0.3 }
          }}
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)",
            padding: "25px 50px",
            borderRadius: "25px",
            display: "inline-block",
            boxShadow: "0 10px 40px rgba(245, 158, 11, 0.4)",
            marginBottom: "20px",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
          }} />
          <div style={{
            fontSize: "3rem",
            fontWeight: "900",
            color: "#fff",
            textShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "2rem" }}>⭐</span>
            <span>{userStats.xp}</span>
            <span style={{ fontSize: "1.5rem", opacity: 0.8 }}>XP</span>
          </div>
          <div style={{
            fontSize: "1.1rem",
            opacity: 0.9,
            marginTop: "5px",
            fontWeight: "500"
          }}>
            Total Experience Points
          </div>
        </motion.div>
      </motion.div>

      {/* Main Dashboard Grid - Enhanced Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 20px",
      }}>
        {/* Overview Card - Enhanced */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "0 12px 40px rgba(96, 165, 250, 0.4)",
            transition: { duration: 0.3 }
          }}
          onClick={() => setActiveSection('overview')}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(25px) saturate(180%)",
            borderRadius: "25px",
            padding: "35px",
            border: activeSection === 'overview' ? "2px solid #60a5fa" : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: activeSection === 'overview'
              ? "0 12px 40px rgba(96, 165, 250, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.6)"
              : "0 8px 32px rgba(0, 0, 0, 0.12)",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #60a5fa, #a855f7, #ec4899)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                background: "linear-gradient(135deg, #60a5fa, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 4px 15px rgba(96, 165, 250, 0.3)",
              }}
            >
              📊
            </motion.div>
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                margin: 0,
                background: "linear-gradient(135deg, #60a5fa, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Overview
              </h3>
              <p style={{ fontSize: "1rem", opacity: 0.8, margin: 0 }}>Your progress at a glance</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px"
          }}>
            {[
              { label: "Level", value: userStats.level, color: "#60a5fa", icon: "🏆" },
              { label: "XP", value: userStats.xp, color: "#f59e0b", icon: "⭐" },
              { label: "Streak", value: userStats.streak, color: "#10b981", icon: "🔥" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                style={{
                  background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                  padding: "20px",
                  borderRadius: "15px",
                  textAlign: "center",
                  border: `1px solid ${stat.color}30`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  color: stat.color,
                  marginBottom: "5px"
                }}>
                  {stat.icon} {stat.value}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.8, fontWeight: "600" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced XP Tasks Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "0 12px 40px rgba(245, 158, 11, 0.4)",
            transition: { duration: 0.3 }
          }}
          onClick={() => setActiveSection('xp_tasks')}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(25px) saturate(180%)",
            borderRadius: "25px",
            padding: "35px",
            border: activeSection === 'xp_tasks' ? "2px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: activeSection === 'xp_tasks'
              ? "0 12px 40px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.6)"
              : "0 8px 32px rgba(0, 0, 0, 0.12)",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
              }}
            >
              ⭐
            </motion.div>
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                margin: 0,
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Daily XP Tasks
              </h3>
              <p style={{ fontSize: "1rem", opacity: 0.8, margin: 0 }}>Earn XP for healthy habits</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "15px"
          }}>
            {xpTasks.map((task, index) => (
              <motion.button
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: `0 8px 25px ${task.color}40`,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addXP(task.id, task.xp);
                }}
                style={{
                  background: `linear-gradient(135deg, ${task.color}15, ${task.color}05)`,
                  padding: "20px 15px",
                  borderRadius: "15px",
                  border: `2px solid ${task.color}30`,
                  color: "#f1f5f9",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  style={{ fontSize: "2rem" }}
                >
                  {task.icon}
                </motion.span>
                <span style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "1rem"
                }}>
                  {task.name}
                </span>
                <div style={{
                  background: `linear-gradient(135deg, ${task.color}, ${task.color}cc)`,
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: "800",
                  color: "#fff",
                  border: `1px solid ${task.color}60`,
                  boxShadow: `0 2px 8px ${task.color}40`,
                }}>
                  +{task.xp} XP
                </div>
                {taskXP[task.id] > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: task.color,
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: "800",
                      boxShadow: `0 2px 8px ${task.color}60`,
                    }}
                  >
                    {taskXP[task.id]}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Leaderboard Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "0 12px 40px rgba(245, 158, 11, 0.4)",
            transition: { duration: 0.3 }
          }}
          onClick={() => setActiveSection('leaderboard')}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(25px) saturate(180%)",
            borderRadius: "25px",
            padding: "35px",
            border: activeSection === 'leaderboard' ? "2px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: activeSection === 'leaderboard'
              ? "0 12px 40px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.6)"
              : "0 8px 32px rgba(0, 0, 0, 0.12)",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
              }}
            >
              🏆
            </motion.div>
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                margin: 0,
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Leaderboard
              </h3>
              <p style={{ fontSize: "1rem", opacity: 0.8, margin: 0 }}>See how you rank</p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: "linear-gradient(135deg, #f59e0b15, #f59e0b05)",
              padding: "25px",
              borderRadius: "15px",
              textAlign: "center",
              border: "1px solid #f59e0b30",
            }}
          >
            <div style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              color: "#f59e0b",
              marginBottom: "8px",
              textShadow: "0 2px 4px rgba(245, 158, 11, 0.3)"
            }}>
              #{Math.floor(Math.random() * 100) + 1}
            </div>
            <div style={{ fontSize: "1rem", opacity: 0.9, fontWeight: "600" }}>
              Your Ranking
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Actions Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.02,
            y: -8,
            boxShadow: "0 12px 40px rgba(236, 72, 153, 0.4)",
            transition: { duration: 0.3 }
          }}
          onClick={() => setActiveSection('actions')}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(25px) saturate(180%)",
            borderRadius: "25px",
            padding: "35px",
            border: activeSection === 'actions' ? "2px solid #ec4899" : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: activeSection === 'actions'
              ? "0 12px 40px rgba(236, 72, 153, 0.4), 0 0 0 1px rgba(236, 72, 153, 0.6)"
              : "0 8px 32px rgba(0, 0, 0, 0.12)",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #ec4899, #db2777, #be185d)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                background: "linear-gradient(135deg, #ec4899, #db2777)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
              }}
            >
              ⚡
            </motion.div>
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                margin: 0,
                background: "linear-gradient(135deg, #ec4899, #db2777)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Quick Actions
              </h3>
              <p style={{ fontSize: "1rem", opacity: 0.8, margin: 0 }}>Jump to features</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "12px"
          }}>
            {[
              { icon: "⭐", label: "Levels", color: "#60a5fa" },
              { icon: "🗺️", label: "Adventure", color: "#f59e0b" },
              { icon: "🎮", label: "Game", color: "#ec4899" },
              { icon: "🤖", label: "AI", color: "#8b5cf6" },
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.15,
                  y: -5,
                  boxShadow: `0 8px 25px ${action.color}40`,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: `linear-gradient(135deg, ${action.color}15, ${action.color}05)`,
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  border: `2px solid ${action.color}30`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

      {/* Enhanced Floating XP Animations */}
      <AnimatePresence>
        {xpAnimations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{
              opacity: 1,
              scale: 0.3,
              x: anim.x - 30,
              y: anim.y - 30,
              color: "#f59e0b",
              textShadow: "0 0 10px rgba(245, 158, 11, 0.8)"
            }}
            animate={{
              opacity: 0,
              scale: 1.8,
              y: anim.y - 120,
              x: anim.x - 30 + (Math.random() - 0.5) * 60,
              transition: {
                duration: 2.5,
                ease: "easeOut"
              }
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "fixed",
              fontSize: "1.5rem",
              fontWeight: "900",
              pointerEvents: "none",
              zIndex: 1000,
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
            }}
          >
            +{anim.xp} XP
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Enhanced Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              background: toast.type === 'error'
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : toast.type === 'warning'
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : "linear-gradient(135deg, #10b981, #059669)",
              backdropFilter: "blur(15px)",
              padding: "16px 30px",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              zIndex: 1001,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>
                {toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : '✅'}
              </span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Active Section Content */}
      <motion.div
        key={activeSection}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          marginTop: "50px",
          maxWidth: "1200px",
          margin: "50px auto 0",
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
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(25px) saturate(180%)",
              borderRadius: "25px",
              padding: "50px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "25px",
                background: "linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🌟 Your Growth Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontSize: "1.2rem",
                opacity: 0.9,
                marginBottom: "40px",
                lineHeight: 1.6
              }}
            >
              Track your progress, complete daily tasks, and climb the leaderboard to become a growth champion! Every step counts toward your personal development journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 8px 25px rgba(96, 165, 250, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/levels")}
                style={{
                  padding: "15px 30px",
                  borderRadius: "15px",
                  border: "none",
                  background: "linear-gradient(135deg, #60a5fa, #a855f7)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(96, 165, 250, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                🚀 View Level Roadmap
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                style={{
                  padding: "15px 30px",
                  borderRadius: "15px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                👤 View Profile
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
          }
        `}
      </style>
    </motion.div>
  );
}

export default Dashboard;
